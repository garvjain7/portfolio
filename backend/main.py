"""
main.py — FastAPI application entry point.

Responsibilities:
  - Create the FastAPI app instance
  - Register the lifespan hook (builds FAISS index at startup)
  - Apply CORS middleware
  - Mount all routers
  - Expose a health check endpoint
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI

from core.cors import add_cors
from core.startup import build_rag_index
from routers import chat, contact


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan context manager.
    Code before yield runs on startup; code after yield runs on shutdown.
    """
    await build_rag_index()
    yield
    # Shutdown cleanup (nothing needed for in-memory FAISS)


app = FastAPI(
    title="Garv Jain — Portfolio API",
    description="RAG-powered AI assistant backend for Garv Jain's portfolio.",
    version="1.0.0",
    lifespan=lifespan,
)

# Attach CORS middleware
add_cors(app)

# Mount routers
app.include_router(chat.router)
app.include_router(contact.router)


@app.get("/health", tags=["health"])
async def health():
    """Simple liveness check — confirms the server is running and index is ready."""
    from services.retriever import retriever
    return {
        "status": "ok",
        "index_ready": retriever.is_ready,
    }
