"""
retriever.py — Semantic chunk retrieval with token budget enforcement.

Responsibilities:
  1. Receive query embedding, chunks from selected files, chunk embeddings
  2. Compute cosine similarity: query embedding vs. each chunk embedding
  3. Retrieve top K chunks per file (K: 2-5, dynamically adjustable)
  4. Merge and rank retrieved chunks by relevance
  5. Enforce token budget: estimate with tiktoken, reduce if needed
  6. Return final candidate context set

Does NOT make routing decisions (that's router_service.py).
Does NOT perform chunking (that's loader.py).

Token estimation uses tiktoken for precision matching Gemini/GPT models.
"""

from typing import Any
import numpy as np
import tiktoken

from core.config import settings

# Initialize tiktoken encoder once (cached)
_tiktoken_encoder = None


def _get_tiktoken_encoder():
    """Lazy-load tiktoken encoder (expensive operation, do once)."""
    global _tiktoken_encoder
    if _tiktoken_encoder is None:
        # Use cl100k_base encoding (compatible with GPT-3.5, GPT-4, Gemini)
        _tiktoken_encoder = tiktoken.get_encoding("cl100k_base")
    return _tiktoken_encoder


def _estimate_tokens(text: str) -> int:
    """
    Precise token estimation using tiktoken.
    Matches GPT-3.5, GPT-4, and Gemini token counting.
    
    Returns:
      Number of tokens in the text.
    """
    if not text:
        return 0
    try:
        encoder = _get_tiktoken_encoder()
        tokens = encoder.encode(text)
        return len(tokens)
    except Exception as e:
        # Fallback to rough estimation if tiktoken fails
        print(f"[retriever] Warning: tiktoken error, falling back to rough estimate: {e}")
        return max(1, len(text) // 4)


def _estimate_total_tokens(chunks: list[dict[str, Any]]) -> int:
    """Estimate total token count from a list of chunks using tiktoken."""
    total = 0
    for chunk in chunks:
        total += _estimate_tokens(chunk.get("content", ""))
    return total


def retrieve_chunks(
    query_embedding: list[float],
    chunks: list[dict[str, Any]],
    chunk_embeddings: list[list[float]],
    k: int | None = None,
) -> list[dict[str, Any]]:
    """
    Retrieve top K chunks for a query using cosine similarity.

    Parameters:
      query_embedding: Query vector (precomputed)
      chunks: List of chunk dicts with content + metadata
      chunk_embeddings: Parallel list of embedding vectors
      k: Number of chunks to retrieve per file (default: settings.top_k_chunks)

    Returns:
      Ranked list of chunks by relevance with scores.
      Does NOT enforce token budget (that happens in enforce_token_budget).
    """
    if not chunks or not chunk_embeddings:
        raise ValueError("Cannot retrieve chunks from empty chunks or embeddings.")
    if len(chunks) != len(chunk_embeddings):
        raise ValueError("Chunks and embeddings must have the same length.")

    top_k = k or settings.top_k_chunks

    # Compute cosine similarity
    query_vec = np.array(query_embedding, dtype=np.float32)
    query_norm = np.linalg.norm(query_vec)

    if query_norm == 0:
        print("[retriever] Warning: query embedding has zero norm")
        return []

    query_vec = query_vec / query_norm

    similarities = []
    for i, chunk_emb in enumerate(chunk_embeddings):
        chunk_vec = np.array(chunk_emb, dtype=np.float32)
        chunk_norm = np.linalg.norm(chunk_vec)

        if chunk_norm == 0:
            continue

        chunk_vec = chunk_vec / chunk_norm
        similarity = float(np.dot(query_vec, chunk_vec))
        similarities.append((similarity, i))

    # Sort by similarity (descending)
    similarities.sort(reverse=True, key=lambda x: x[0])

    # Retrieve top K
    results: list[dict[str, Any]] = []
    for similarity, idx in similarities[:top_k]:
        chunk = chunks[idx]
        results.append({
            **chunk,
            "score": similarity,
        })

    print(f"[retriever] Retrieved {len(results)} chunks with top similarity scores.")
    return results


def retrieve_chunks_per_file(
    query_embedding: list[float],
    chunks: list[dict[str, Any]],
    chunk_embeddings: list[list[float]],
    k: int | None = None,
) -> list[dict[str, Any]]:
    """
    Retrieve top K chunks from EACH file separately, then merge.

    This ensures every selected file contributes its most relevant chunks,
    rather than one file dominating the results.

    Parameters:
      query_embedding: Query vector
      chunks: List of chunk dicts
      chunk_embeddings: Parallel list of embeddings
      k: Number of chunks per file (default: 2-5, adjusted based on file count)

    Returns:
      Merged list of chunks from all files, ranked by relevance.
    """
    if not chunks or not chunk_embeddings:
        return []

    if len(chunks) != len(chunk_embeddings):
        raise ValueError("Chunks and embeddings must have the same length.")

    # Group chunks by source file
    chunks_by_file: dict[str, list[tuple[int, dict, list]]] = {}
    for i, chunk in enumerate(chunks):
        source = chunk.get("metadata", {}).get("source", "unknown")
        if source not in chunks_by_file:
            chunks_by_file[source] = []
        chunks_by_file[source].append((i, chunk, chunk_embeddings[i]))

    # Compute similarity
    query_vec = np.array(query_embedding, dtype=np.float32)
    query_norm = np.linalg.norm(query_vec)

    if query_norm == 0:
        print("[retriever] Warning: query embedding has zero norm")
        return []

    query_vec = query_vec / query_norm

    # Retrieve top K per file
    top_k = k or settings.top_k_chunks
    # Adjust K based on number of files
    if len(chunks_by_file) > 1:
        top_k = max(2, min(5, top_k))  # Ensure 2-5 per file

    merged_results: list[dict[str, Any]] = []

    for source, file_chunks in chunks_by_file.items():
        similarities = []
        for idx, chunk, emb in file_chunks:
            chunk_vec = np.array(emb, dtype=np.float32)
            chunk_norm = np.linalg.norm(chunk_vec)

            if chunk_norm == 0:
                continue

            chunk_vec = chunk_vec / chunk_norm
            similarity = float(np.dot(query_vec, chunk_vec))
            similarities.append((similarity, idx, chunk))

        # Sort by similarity and take top K
        similarities.sort(reverse=True, key=lambda x: x[0])
        for similarity, idx, chunk in similarities[:top_k]:
            merged_results.append({
                **chunk,
                "score": similarity,
            })

    # Re-rank merged results by score
    merged_results.sort(key=lambda x: x.get("score", 0), reverse=True)

    print(
        f"[retriever] Retrieved {len(merged_results)} chunks "
        f"from {len(chunks_by_file)} file(s) ({top_k} per file)."
    )
    return merged_results


def enforce_token_budget(
    chunks: list[dict[str, Any]],
    max_tokens: int | None = None,
) -> list[dict[str, Any]]:
    """
    Enforce token budget: if total token count exceeds budget,
    remove lowest-scoring chunks until within limit.

    Parameters:
      chunks: Ranked list of chunks (by score)
      max_tokens: Maximum token count (default: settings.context_budget)

    Returns:
      Filtered list of chunks within budget, maintaining top-scored chunks first.
    """
    budget = max_tokens or settings.context_budget
    total_tokens = _estimate_total_tokens(chunks)

    print(f"[retriever] Context size: {total_tokens} tokens (budget: {budget})")
    print(f"[retriever] Token breakdown: {len(chunks)} chunks, avg {total_tokens // max(1, len(chunks)) if chunks else 0} tokens/chunk")

    if total_tokens <= budget:
        print("[retriever] Within budget, no reduction needed.")
        return chunks

    print(f"[retriever] Over budget by {total_tokens - budget} tokens, reducing...")

    # Remove chunks from end (lowest scores first) until within budget
    reduced = []
    current_tokens = 0

    for chunk in chunks:
        chunk_tokens = _estimate_tokens(chunk.get("content", ""))
        if current_tokens + chunk_tokens <= budget:
            reduced.append(chunk)
            current_tokens += chunk_tokens
        else:
            break

    print(
        f"[retriever] Reduced to {len(reduced)} chunks, "
        f"{current_tokens} tokens (removed {len(chunks) - len(reduced)})."
    )
    return reduced


def retrieve_and_budget(
    query_embedding: list[float],
    chunks: list[dict[str, Any]],
    chunk_embeddings: list[list[float]],
    k: int | None = None,
    max_tokens: int | None = None,
) -> list[dict[str, Any]]:
    """
    End-to-end retrieval pipeline:
      1. Retrieve top K chunks per file
      2. Merge and rank
      3. Enforce token budget
      4. Return final context

    Parameters:
      query_embedding: Query vector
      chunks: All chunks from selected files
      chunk_embeddings: All chunk embeddings
      k: Chunks per file (default: 2-5)
      max_tokens: Token budget (default: settings.context_budget)

    Returns:
      Final candidate context set, ranked and within budget.
    """
    # Step 1: Retrieve per file
    retrieved = retrieve_chunks_per_file(
        query_embedding,
        chunks,
        chunk_embeddings,
        k=k,
    )

    # Step 2: Enforce budget
    final_context = enforce_token_budget(retrieved, max_tokens=max_tokens)

    print(
        f"[retriever] Final context: {len(final_context)} chunks, "
        f"{_estimate_total_tokens(final_context)} tokens."
    )
    return final_context

