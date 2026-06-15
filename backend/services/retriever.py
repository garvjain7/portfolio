"""
retriever.py — Builds and queries a FAISS in-memory vector index.
The index is built once at startup and reused for every query.
"""

from typing import Any
import numpy as np
import faiss

from core.config import settings


class FAISSRetriever:
    """
    Wraps a FAISS IndexFlatIP (inner product / cosine similarity) index.
    Stores chunk metadata in a parallel list so retrieved indices
    map directly back to the original chunks.
    """

    def __init__(self):
        self._index: faiss.IndexFlatIP | None = None
        self._chunks: list[dict[str, Any]] = []
        self._dimension: int = 0

    def build(
        self,
        chunks: list[dict[str, Any]],
        embeddings: list[list[float]],
    ) -> None:
        """
        Build the FAISS index from chunks and their pre-computed embeddings.
        chunks and embeddings must be the same length and in the same order.
        """
        if not chunks or not embeddings:
            raise ValueError("Cannot build index from empty chunks or embeddings.")

        self._chunks = chunks
        self._dimension = len(embeddings[0])

        vectors = np.array(embeddings, dtype=np.float32)

        # Normalize for cosine similarity (IndexFlatIP on L2-normalized vectors
        # is equivalent to cosine similarity search)
        faiss.normalize_L2(vectors)

        self._index = faiss.IndexFlatIP(self._dimension)
        self._index.add(vectors)

        print(f"[retriever] FAISS index built: {self._index.ntotal} vectors, dim={self._dimension}")

    def search(self, query_embedding: list[float], k: int | None = None) -> list[dict[str, Any]]:
        """
        Search the index for the top-k most similar chunks.
        Returns a list of chunk dicts (content + metadata), ordered by relevance.
        """
        if self._index is None:
            raise RuntimeError("FAISS index has not been built yet. Call build() first.")

        top_k = k or settings.top_k_chunks

        query_vec = np.array([query_embedding], dtype=np.float32)
        faiss.normalize_L2(query_vec)

        scores, indices = self._index.search(query_vec, top_k)

        results: list[dict[str, Any]] = []
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1:  # FAISS returns -1 for padding when fewer results exist
                continue
            chunk = self._chunks[idx]
            results.append({
                **chunk,
                "score": float(score),
            })

        return results

    @property
    def is_ready(self) -> bool:
        return self._index is not None and self._index.ntotal > 0


# Module-level singleton — shared across all requests
retriever = FAISSRetriever()
