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
    Wraps FAISS indexes for both file-level routing and chunk-level retrieval.
    Stores file metadata and chunk metadata in parallel lists so FAISS hits
    can be mapped directly back to the original items.
    """

    def __init__(self):
        self._index: faiss.IndexFlatIP | None = None
        self._chunks: list[dict[str, Any]] = []
        self._dimension: int = 0

        self._file_index: faiss.IndexFlatIP | None = None
        self._file_metadata: list[dict[str, Any]] = []
        self._file_embeddings: list[list[float]] = []
        self._file_dimension: int = 0

    def build_file_index(
        self,
        file_metadata: list[dict[str, Any]],
        embeddings: list[list[float]],
    ) -> None:
        """
        Build the FAISS index from file summaries and file metadata.
        This index is used for the first routing layer.
        """
        if not file_metadata or not embeddings:
            raise ValueError("Cannot build file index from empty metadata or embeddings.")

        self._file_metadata = file_metadata
        self._file_embeddings = embeddings
        self._file_dimension = len(embeddings[0])

        vectors = np.array(embeddings, dtype=np.float32)
        faiss.normalize_L2(vectors)

        self._file_index = faiss.IndexFlatIP(self._file_dimension)
        self._file_index.add(vectors)

        print(f"[retriever] File-level FAISS index built: {self._file_index.ntotal} files, dim={self._file_dimension}")

    def search_files(self, query_embedding: list[float], k: int | None = None) -> list[dict[str, Any]]:
        """
        Search the file-level index for the top-k most relevant files.
        Returns a list of file metadata dicts ordered by relevance.
        """
        if self._file_index is None:
            raise RuntimeError("File-level FAISS index has not been built yet. Call build_file_index() first.")

        top_k = k or settings.top_k_files

        query_vec = np.array([query_embedding], dtype=np.float32)
        faiss.normalize_L2(query_vec)

        scores, indices = self._file_index.search(query_vec, top_k)

        results: list[dict[str, Any]] = []
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1:
                continue
            file_meta = self._file_metadata[idx]
            results.append({
                **file_meta,
                "score": float(score),
            })

        return results

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

    def search_chunks(
        self,
        query_embedding: list[float],
        chunks: list[dict[str, Any]],
        embeddings: list[list[float]],
        k: int | None = None,
    ) -> list[dict[str, Any]]:
        """
        Build a temporary FAISS index for the provided chunks and search it.
        This is used for chunk retrieval inside the routed subset of files.
        """
        if not chunks or not embeddings:
            raise ValueError("Cannot search chunks with empty chunks or embeddings.")
        if len(chunks) != len(embeddings):
            raise ValueError("Chunks and embeddings must have the same length.")

        top_k = k or settings.top_k_chunks
        dimension = len(embeddings[0])

        vectors = np.array(embeddings, dtype=np.float32)
        faiss.normalize_L2(vectors)

        temp_index = faiss.IndexFlatIP(dimension)
        temp_index.add(vectors)

        query_vec = np.array([query_embedding], dtype=np.float32)
        faiss.normalize_L2(query_vec)

        scores, indices = temp_index.search(query_vec, top_k)

        results: list[dict[str, Any]] = []
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1:
                continue
            chunk = chunks[idx]
            results.append({
                **chunk,
                "score": float(score),
            })

        return results

    @property
    def is_ready(self) -> bool:
        return self._file_index is not None and self._file_index.ntotal > 0

    @property
    def file_metadata(self) -> list[dict[str, Any]]:
        return self._file_metadata

    @property
    def file_embeddings(self) -> list[list[float]]:
        return self._file_embeddings


# Module-level singleton — shared across all requests
retriever = FAISSRetriever()
