"""
startup.py — Builds the FAISS vector index on server startup.

Called once via FastAPI's lifespan context manager in main.py.
Execution order:
  loader.py    → read & chunk all knowledge_base markdown files
  embeddings.py → embed all file summaries via local sentence-transformers
  retriever.py  → build FAISS index and store as module-level singleton
"""

from services.loader import load_file_metadata
from services.embeddings import embed_texts
from services.retriever import retriever


async def build_rag_index() -> None:
    """
    Load knowledge base file metadata, embed file summaries, and build the
    file-level FAISS index used for query routing.
    """
    print("[startup] Loading knowledge base file metadata...")
    file_metadata = load_file_metadata()

    if not file_metadata:
        print("[startup] WARNING: No file metadata loaded from knowledge base. RAG will not function.")
        return

    print(f"[startup] Embedding {len(file_metadata)} file summaries via local sentence-transformers...")
    summaries = [meta.get("summary", "") for meta in file_metadata]
    embeddings = embed_texts(summaries)

    print("[startup] Building file-level FAISS index...")
    retriever.build_file_index(file_metadata, embeddings)

    print(f"[startup] RAG file routing index ready — {len(file_metadata)} files indexed.")
