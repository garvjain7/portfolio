"""
startup.py — Builds the FAISS vector index on server startup.

Called once via FastAPI's lifespan context manager in main.py.
Execution order:
  loader.py    → read & chunk all knowledge_base markdown files
  embeddings.py → embed all chunks via OpenAI (batched)
  retriever.py  → build FAISS index and store as module-level singleton
"""

from services.loader import load_documents
from services.embeddings import embed_texts
from services.retriever import retriever


async def build_rag_index() -> None:
    """
    Load knowledge base, embed all chunks, and build the FAISS index.
    Designed to run once at server startup — subsequent queries use the
    pre-built in-memory index with no additional overhead.
    """
    print("[startup] Loading knowledge base documents...")
    chunks = load_documents()

    if not chunks:
        print("[startup] WARNING: No chunks loaded from knowledge base. RAG will not function.")
        return

    print(f"[startup] Embedding {len(chunks)} chunks via OpenAI...")
    texts = [chunk["content"] for chunk in chunks]
    embeddings = embed_texts(texts)

    print("[startup] Building FAISS index...")
    retriever.build(chunks, embeddings)

    print(f"[startup] RAG index ready — {len(chunks)} chunks indexed.")
