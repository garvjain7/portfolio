"""
embeddings.py — Local sentence-transformer embeddings (no API calls).

Used at startup to embed all knowledge base chunks, and at query time
to embed the user's question before FAISS search.

NOTE: Embeddings use local sentence-transformers model, NOT OpenAI.
Gemini is used only for the LLM chat part.
"""

from sentence_transformers import SentenceTransformer

# Use a lightweight, fast local embedding model
# This runs locally with no API calls or credentials needed
_model = SentenceTransformer("all-MiniLM-L6-v2")


def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Embed a batch of texts using local sentence-transformers.
    Returns a list of float vectors, one per input text.
    
    No API calls or credentials needed — runs entirely locally.
    """
    if not texts:
        return []

    # Encode all texts at once (sentence-transformers handles batching internally)
    embeddings = _model.encode(texts, convert_to_numpy=True)
    
    # Convert numpy arrays to Python lists
    return [emb.tolist() for emb in embeddings]


def embed_query(query: str) -> list[float]:
    """
    Embed a single query string using local sentence-transformers.
    Returns a single float vector.
    
    No API calls or credentials needed.
    """
    embedding = _model.encode([query], convert_to_numpy=True)[0]
    return embedding.tolist()
