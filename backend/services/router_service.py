"""
router_service.py — File routing layer for hierarchical RAG.

Given a user query and its embedding, decides which knowledge base files
are relevant BEFORE any chunking or chunk-level vector search happens.

Responsibilities:
  1. Normalize the query
  2. Extract important keywords and phrases
  3. Apply synonym expansion
  4. Generate lightweight intent signals
  5. Score files using triggers, tags, summary similarity, embedding similarity, and intent boosts
  6. Select the top N most relevant files

Output: List of file paths only (no chunking, no embedding lookup)

Public function: route_files()
Called once per query from rag_service.py, before load_chunks_for_files().
"""

from pathlib import Path
from typing import Any
import re

import numpy as np

from core.config import settings

# ---------------------------------------------------------------------------
# Stopwords excluded from keyword matching (too generic to be useful)
# ---------------------------------------------------------------------------
_STOPWORDS = {
    "the", "and", "for", "with", "that", "this", "from", "about", "what",
    "which", "have", "been", "does", "into", "more", "when", "where", "how",
    "also", "each", "their", "there", "these", "them", "than", "then",
    "some", "such", "only", "most", "over", "after", "before", "between",
    "garv", "jain", "is", "a", "in", "to", "of", "as", "on", "at", "by",
}

# Simple synonym expansion mapping
_SYNONYM_MAP = {
    "skill": ["skills", "competency", "competencies", "proficiency", "expertise"],
    "experience": ["background", "history", "career"],
    "project": ["work", "portfolio", "achievement"],
    "education": ["degree", "university", "college", "training"],
    "certification": ["certified", "credential", "credentials"],
    "goal": ["objective", "aim", "aspiration"],
    "philosophy": ["approach", "methodology", "principle", "mindset"],
    "role": ["position", "job", "title"],
}

# Intent signals map — queries matching these boost specific knowledge areas
_INTENT_SIGNALS = {
    "identity": ["who", "background", "about", "me", "profile", "summary"],
    "education": ["degree", "university", "college", "education", "academic", "school"],
    "experience": ["experience", "worked", "job", "position", "role", "worked at"],
    "projects": ["project", "work", "built", "created", "developed", "portfolio"],
    "certifications": ["certification", "certified", "credential", "badge"],
    "skills": ["skill", "proficiency", "expertise", "competency", "technical", "language"],
    "technical_philosophy": ["philosophy", "approach", "principle", "mindset", "think", "believe"],
    "career_goals": ["goal", "future", "interested", "want", "aspiration", "career"],
    "role_fit": ["suitable", "fit", "match", "relevant", "role", "position"],
}

# Project-related tags — if any selected file has one of these, force-include project_index
_PROJECT_TAGS = {"projects", "project"}
_PROJECT_INDEX_FILENAME = "project_index.md"


def _normalize_text(text: str) -> str:
    """Lowercase, remove non-alphanumeric characters, and collapse whitespace."""
    return " ".join(re.sub(r"[^a-z0-9\s]", " ", text.lower()).split())


def _tokenize(text: str) -> list[str]:
    """Tokenize text into words, filtering stopwords."""
    return [word for word in _normalize_text(text).split() if len(word) > 1 and word not in _STOPWORDS]


def _token_overlap(query_tokens: set[str], phrase_tokens: list[str]) -> float:
    """Compute Jaccard-like overlap between query tokens and phrase tokens."""
    if not phrase_tokens:
        return 0.0
    return len(query_tokens.intersection(phrase_tokens)) / len(set(phrase_tokens))


def _expand_keywords(keywords: list[str]) -> set[str]:
    """Expand keywords using synonym map."""
    expanded = set(keywords)
    for keyword in keywords:
        if keyword in _SYNONYM_MAP:
            expanded.update(_SYNONYM_MAP[keyword])
    return expanded


def _generate_intent_signals(query_tokens: set[str]) -> dict[str, float]:
    """
    Generate intent signals that may indicate relevance to specific knowledge areas.
    Returns a dict mapping intent area to a boost score (0.0 to 1.0).
    A query may activate multiple signals simultaneously.
    """
    signals = {}
    for intent_area, trigger_phrases in _INTENT_SIGNALS.items():
        max_boost = 0.0
        for phrase in trigger_phrases:
            phrase_tokens = _tokenize(phrase)
            if phrase_tokens:
                overlap = _token_overlap(query_tokens, phrase_tokens)
                if overlap > max_boost:
                    max_boost = overlap
        if max_boost > 0.0:
            signals[intent_area] = max_boost
    return signals


def route_files(
    query: str,
    query_embedding: list[float],
    file_metadata: list[dict[str, Any]],
    file_embeddings: list[list[float]],
) -> list[Path]:
    """
    Route a user query to the most relevant knowledge base files.

    Combines six scoring signals:
      1. Trigger phrase matches (exact and fuzzy)
      2. Tag matches (exact and fuzzy)
      3. Summary keyword similarity
      4. Query embedding similarity to file summary embeddings
      5. Intent signal boosts (e.g., role fit, career goals, skills)
      6. Synonym-expanded keyword matches

    Returns an ordered list of file Paths (highest relevance first).
    Typical range: 2-6 files, default controlled by settings.
    """
    # -----------------------------------------------------------------------
    # STEP 1 — Query processing
    # -----------------------------------------------------------------------
    query_normalized = _normalize_text(query)
    query_tokens = set(_tokenize(query))
    expanded_keywords = _expand_keywords(list(query_tokens))
    intent_signals = _generate_intent_signals(query_tokens)

    print(f"[router] Processing query: '{query}'")
    print(f"[router] Extracted tokens: {query_tokens}")
    print(f"[router] Intent signals: {intent_signals}")

    scores: dict[str, float] = {}

    # -----------------------------------------------------------------------
    # STEP 2 — File scoring using metadata and intent signals
    # -----------------------------------------------------------------------
    for file_meta in file_metadata:
        file_path = str(file_meta["file_path"])
        score = 0.0

        # SIGNAL 1: Retrieval trigger matches
        for trigger in file_meta.get("retrieval_triggers", []):
            trigger_norm = _normalize_text(trigger)
            trigger_tokens = _tokenize(trigger)

            if trigger_norm and trigger_norm in query_normalized:
                score += 1.0
                break

            overlap = _token_overlap(query_tokens, trigger_tokens)
            if overlap >= 0.67:
                score += 0.8
                break
            if overlap >= 0.4:
                score += 0.4
                break

        # SIGNAL 2: Tag matches
        for tag in file_meta.get("tags", []):
            tag_norm = _normalize_text(str(tag))
            if not tag_norm or tag_norm in _STOPWORDS:
                continue

            if tag_norm in query_normalized:
                score += 0.5
                break

            if _token_overlap(query_tokens, _tokenize(tag_norm)) >= 0.75:
                score += 0.4
                break

        # SIGNAL 3: Summary keyword similarity
        summary_tokens = [
            w for w in _tokenize(str(file_meta.get("summary", "")))
            if len(w) > 4 and w not in _STOPWORDS
        ]
        if summary_tokens:
            overlap = len(query_tokens.intersection(summary_tokens))
            score += min(0.15 * overlap, 0.6)

        # SIGNAL 4: Intent signal boosts based on file tags/triggers
        file_tags_lower = {str(t).lower() for t in file_meta.get("tags", [])}
        for intent_area, signal_strength in intent_signals.items():
            if intent_area in file_tags_lower or intent_area.replace("_", " ") in str(file_meta.get("summary", "")).lower():
                score += signal_strength * 0.3  # Boost multiplier

        # SIGNAL 5: Synonym-expanded keyword matching
        for keyword in expanded_keywords:
            for trigger in file_meta.get("retrieval_triggers", []):
                if keyword in _normalize_text(trigger):
                    score += 0.2
                    break

        if score > 0.0:
            scores[file_path] = score

    # -----------------------------------------------------------------------
    # STEP 3 — Embedding similarity scoring
    # -----------------------------------------------------------------------
    if file_embeddings and query_embedding:
        query_vec = np.array(query_embedding, dtype=np.float32)
        query_norm = np.linalg.norm(query_vec)

        if query_norm > 0:
            query_vec = query_vec / query_norm

            for file_meta, file_emb in zip(file_metadata, file_embeddings):
                file_path = str(file_meta["file_path"])
                emb_vec = np.array(file_emb, dtype=np.float32)
                emb_norm = np.linalg.norm(emb_vec)
                if emb_norm == 0:
                    continue

                emb_vec = emb_vec / emb_norm
                similarity = float(np.dot(query_vec, emb_vec))
                if similarity >= settings.routing_threshold:
                    scores[file_path] = scores.get(file_path, 0.0) + (similarity * 0.5)  # 50% weight for embeddings

    # -----------------------------------------------------------------------
    # STEP 4 — Fallback to top embeddings if no metadata matches
    # -----------------------------------------------------------------------
    if not scores and file_embeddings and query_embedding:
        query_vec = np.array(query_embedding, dtype=np.float32)
        query_norm = np.linalg.norm(query_vec)

        if query_norm > 0:
            query_vec = query_vec / query_norm
            similarity_pairs = []

            for file_meta, file_emb in zip(file_metadata, file_embeddings):
                emb_vec = np.array(file_emb, dtype=np.float32)
                emb_norm = np.linalg.norm(emb_vec)
                if emb_norm == 0:
                    continue

                emb_vec = emb_vec / emb_norm
                similarity_pairs.append(
                    (float(np.dot(query_vec, emb_vec)), str(file_meta["file_path"]))
                )

            for similarity, file_path in sorted(similarity_pairs, reverse=True)[: settings.top_k_files]:
                scores[file_path] = similarity

    # -----------------------------------------------------------------------
    # STEP 5 — Select top N files
    # -----------------------------------------------------------------------
    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    selected = [Path(fp) for fp, _ in ranked[: settings.top_k_files]]

    # Ensure minimum file count
    if len(selected) < settings.min_routed_files:
        all_files = [Path(fm["file_path"]) for fm in file_metadata]
        for file_path in all_files:
            if file_path not in selected:
                selected.append(file_path)
            if len(selected) >= settings.min_routed_files:
                break

    # -----------------------------------------------------------------------
    # STEP 6 — Project index fallback
    # -----------------------------------------------------------------------
    selected_paths_set = {fp for fp in selected}
    has_project_file = False

    for fp in selected:
        for file_meta in file_metadata:
            if Path(file_meta["file_path"]) == fp:
                if {t.lower() for t in file_meta.get("tags", [])} & _PROJECT_TAGS:
                    has_project_file = True
                break

    if has_project_file:
        for file_meta in file_metadata:
            if Path(file_meta["file_path"]).name == _PROJECT_INDEX_FILENAME:
                project_index_path = Path(file_meta["file_path"])
                if project_index_path not in selected_paths_set:
                    selected.append(project_index_path)
                break

    print(
        f"[router] Selected {len(selected)} file(s): "
        + ", ".join(fp.name for fp in selected)
    )

    return selected
