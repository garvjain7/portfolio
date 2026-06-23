"""
chunk_cache.py — TTL-based in-memory cache for chunk embeddings.

Prevents redundant local embedding calls for chunks that were recently
embedded (uses sentence-transformers, NOT OpenAI). Cache survives across
multiple queries within the TTL window but is lost on server restart
(acceptable tradeoff for a portfolio-scale system).

Single public function: get_chunk_embeddings()
Called from rag_service.py after load_chunks_for_files().
"""

from hashlib import sha256
from typing import Any

from cachetools import TTLCache

from core.config import settings
from services.embeddings import embed_texts


# ---------------------------------------------------------------------------
# Module-level cache singleton
# maxsize=1024 covers ~50 files × ~20 chunks each with room to spare.
# TTL comes from config (default: 3600s = 1 hour).
# ---------------------------------------------------------------------------
_cache: TTLCache[str, list[float]] = TTLCache(
    maxsize=1024,
    ttl=settings.chunk_cache_ttl,
)


def _cache_key(source: str, chunk_index: int, content: str) -> str:
    """
    Stable cache key for a chunk.
    Uses source path + position + first 200 chars of content.
    First 200 chars is enough to detect content changes without
    hashing the full chunk on every call.
    """
    fingerprint = f"{source}|{chunk_index}|{content[:200]}"
    return sha256(fingerprint.encode("utf-8")).hexdigest()


def get_chunk_embeddings(chunks: list[dict[str, Any]]) -> list[list[float]]:
    """
    Return embeddings for a list of chunks, using cache where available.

    For each chunk:
      - Cache hit  → return stored embedding (~0ms)
      - Cache miss → collect for batch embedding, store result in cache

    Batch embeds all cache misses in a single OpenAI API call.
    Returns embeddings in the same order as the input chunks list.
    """
    if not chunks:
        return []

    result: list[list[float]] = [[] for _ in chunks]
    miss_texts: list[str] = []
    miss_indices: list[int] = []
    miss_keys: list[str] = []

    # Pass 1 — split into hits and misses
    for i, chunk in enumerate(chunks):
        source = str(chunk["metadata"].get("source", ""))
        content = str(chunk.get("content", ""))
        key = _cache_key(source, i, content)

        if key in _cache:
            result[i] = _cache[key]
        else:
            miss_texts.append(content)
            miss_indices.append(i)
            miss_keys.append(key)

    # Pass 2 — batch embed all misses, store in cache
    if miss_texts:
        print(f"[chunk_cache] Cache miss: embedding {len(miss_texts)} chunks "
              f"({len(chunks) - len(miss_texts)} hits)")
        new_embeddings = embed_texts(miss_texts)
        for key, idx, embedding in zip(miss_keys, miss_indices, new_embeddings):
            _cache[key] = embedding
            result[idx] = embedding
    else:
        print(f"[chunk_cache] Full cache hit: {len(chunks)} chunks served from cache")

    return result