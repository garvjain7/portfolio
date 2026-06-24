"""
chunk_cache.py — TTL-based in-memory cache for chunk embeddings.

Strategy:
  - Cache key is stable: (source, chunk_id, chunk_index, content_hash)
  - Not based on array position (which changes across queries)
  - Embeddings persist across queries within the TTL window
  - Cache survives multiple queries but is lost on server restart
  - Acceptable tradeoff for a portfolio-scale system

Public function: get_chunk_embeddings(chunks) → embeddings
Called from rag_service.py after load_chunks_for_files().
Returns embeddings in the same order as input chunks.
"""

from hashlib import sha256
from typing import Any

from cachetools import TTLCache

from core.config import settings
from services.embeddings import embed_texts


# ---------------------------------------------------------------------------
# Module-level cache singleton
# maxsize: Covers ~60 files × ~30 chunks each with room to spare
# TTL: Comes from config (default: 3600s = 1 hour)
# ---------------------------------------------------------------------------
_cache: TTLCache[str, list[float]] = TTLCache(
    maxsize=2048,
    ttl=settings.chunk_cache_ttl,
)


def _compute_content_hash(content: str) -> str:
    """Compute SHA256 hash of chunk content for stable fingerprinting."""
    return sha256(content.encode("utf-8")).hexdigest()[:16]


def _cache_key(source: str, chunk_id: str, chunk_index: int, content_hash: str) -> str:
    """
    Stable cache key for a chunk based on metadata, not array position.
    
    Components:
      - source: relative path (e.g., 'experience.md')
      - chunk_id: file-level identifier (e.g., 'experience')
      - chunk_index: sequence within file (0, 1, 2, ...)
      - content_hash: SHA256[:16] of chunk content
    
    This ensures the same chunk has the same key across queries,
    even if it appears at different positions in the retrieval result.
    """
    fingerprint = f"{source}|{chunk_id}|{chunk_index}|{content_hash}"
    return sha256(fingerprint.encode("utf-8")).hexdigest()


def get_chunk_embeddings(chunks: list[dict[str, Any]]) -> list[list[float]]:
    """
    Return embeddings for a list of chunks, using cache where available.

    For each chunk:
      - Cache hit  → return stored embedding (~0ms)
      - Cache miss → collect for batch embedding, store result in cache

    Batch embeds all cache misses with the local sentence-transformer model.
    Returns embeddings in the same order as the input chunks list.

    Parameters:
      chunks: List of chunk dicts with content and metadata

    Returns:
      List of embedding vectors, parallel to input chunks.
    """
    if not chunks:
        return []

    result: list[list[float]] = [[] for _ in chunks]
    miss_texts: list[str] = []
    miss_indices: list[int] = []
    miss_keys: list[str] = []

    # -----------------------------------------------------------------------
    # PASS 1 — Identify cache hits and misses
    # -----------------------------------------------------------------------
    for i, chunk in enumerate(chunks):
        # Extract metadata
        metadata = chunk.get("metadata", {})
        source = str(metadata.get("source", ""))
        chunk_id = str(metadata.get("chunk_id", ""))
        chunk_index = int(metadata.get("chunk_index", i))
        content = str(chunk.get("content", ""))

        # Compute stable cache key
        content_hash = _compute_content_hash(content)
        key = _cache_key(source, chunk_id, chunk_index, content_hash)

        if key in _cache:
            # Cache hit
            result[i] = _cache[key]
        else:
            # Cache miss — collect for batch embedding
            miss_texts.append(content)
            miss_indices.append(i)
            miss_keys.append(key)

    # -----------------------------------------------------------------------
    # PASS 2 — Batch embed all misses, store in cache
    # -----------------------------------------------------------------------
    if miss_texts:
        hits = len(chunks) - len(miss_texts)
        print(
            f"[chunk_cache] Cache: {hits} hits, {len(miss_texts)} misses "
            f"({100 * hits / len(chunks):.0f}% hit rate). Embedding misses..."
        )
        try:
            new_embeddings = embed_texts(miss_texts)
            for key, idx, embedding in zip(miss_keys, miss_indices, new_embeddings):
                _cache[key] = embedding
                result[idx] = embedding
            print(f"[chunk_cache] Embedded {len(miss_texts)} chunks, cached.")
        except Exception as e:
            print(f"[chunk_cache] Error embedding chunks: {e}")
            raise
    else:
        print(f"[chunk_cache] Full cache hit: {len(chunks)} chunks served from cache")

    return result


def clear_cache() -> None:
    """Manually clear the embedding cache (for testing/debugging)."""
    global _cache
    _cache.clear()
    print("[chunk_cache] Cache cleared")


def cache_stats() -> dict[str, Any]:
    """Return cache statistics."""
    return {
        "size": len(_cache),
        "max_size": _cache.maxsize,
        "ttl": _cache.ttl,
    }
