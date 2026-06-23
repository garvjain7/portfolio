"""
router_service.py — File routing layer for hierarchical RAG.

Given a user query and its embedding, decides which knowledge base files
are relevant BEFORE any chunking or chunk-level vector search happens.

Single public function: route_files()
Called once per query from rag_service.py, before load_chunks_for_files().
"""

from pathlib import Path
from typing import Any
import re

import numpy as np

from core.config import settings

# ---------------------------------------------------------------------------
# Stopwords excluded from summary keyword matching (too generic to be useful)
# ---------------------------------------------------------------------------
_STOPWORDS = {
    "the", "and", "for", "with", "that", "this", "from", "about", "what",
    "which", "have", "been", "does", "into", "more", "when", "where", "how",
    "also", "each", "their", "there", "these", "them", "than", "then",
    "some", "such", "only", "most", "over", "after", "before", "between",
    "garv", "jain",
}

# Project-related tags — if any selected file has one of these, force-include project_index
_PROJECT_TAGS = {"projects", "project"}
_PROJECT_INDEX_FILENAME = "project_index.md"


def _normalize_text(text: str) -> str:
    """Lowercase, remove non-alphanumeric characters, and collapse whitespace."""
    return " ".join(re.sub(r"[^a-z0-9\s]", " ", text.lower()).split())


def _tokenize(text: str) -> list[str]:
    return [word for word in _normalize_text(text).split() if len(word) > 1]


def _token_overlap(query_tokens: set[str], phrase_tokens: list[str]) -> float:
    if not phrase_tokens:
        return 0.0
    return len(query_tokens.intersection(phrase_tokens)) / len(set(phrase_tokens))


def route_files(
    query: str,
    query_embedding: list[float],
    file_metadata: list[dict[str, Any]],
    file_embeddings: list[list[float]],
) -> list[Path]:
    """
    Decide which knowledge base files are relevant to the user query.

    The router combines three signals:
      1. Trigger and keyword-based token overlap scoring
      2. Semantic file-summary embedding similarity
      3. A project-index fallback rule for project-related queries

    Returns an ordered list of file Paths (highest relevance first).
    """
    query_normalized = _normalize_text(query)
    query_tokens = set(_tokenize(query))
    scores: dict[str, float] = {}

    # -----------------------------------------------------------------------
    # STEP 1 — Keyword scoring
    # -----------------------------------------------------------------------
    for file_meta in file_metadata:
        file_path = str(file_meta["file_path"])
        score = 0.0

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

        summary_tokens = [
            w for w in _tokenize(str(file_meta.get("summary", "")))
            if len(w) > 4 and w not in _STOPWORDS
        ]
        if summary_tokens:
            overlap = len(query_tokens.intersection(summary_tokens))
            score += min(0.15 * overlap, 0.6)

        if score > 0.0:
            scores[file_path] = score

    # -----------------------------------------------------------------------
    # STEP 2 — Embedding similarity scoring
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
                    scores[file_path] = scores.get(file_path, 0.0) + similarity

    # -----------------------------------------------------------------------
    # Fallback to top embeddings if nothing matched
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

    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    selected = [Path(fp) for fp, _ in ranked[: settings.top_k_files]]

    if len(selected) < settings.min_routed_files:
        all_files = [Path(fm["file_path"]) for fm in file_metadata]
        for file_path in all_files:
            if file_path not in selected:
                selected.append(file_path)
            if len(selected) >= settings.min_routed_files:
                break

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
        f"[router] Query routed to {len(selected)} file(s): "
        + ", ".join(fp.name for fp in selected)
    )

    return selected
