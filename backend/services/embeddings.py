"""
embeddings.py — Generates OpenAI embeddings for a list of text strings.
Used at startup to embed all knowledge base chunks, and at query time
to embed the user's question before FAISS search.
"""

from openai import OpenAI
from core.config import settings

_client = OpenAI(api_key=settings.openai_api_key)


def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Embed a batch of texts using the configured OpenAI embedding model.
    Returns a list of float vectors, one per input text.

    Uses a single batched API call for efficiency.
    OpenAI text-embedding-3-small supports up to 2048 inputs per request.
    """
    if not texts:
        return []

    # OpenAI embedding API: max 2048 inputs per call
    BATCH_SIZE = 512
    all_embeddings: list[list[float]] = []

    for i in range(0, len(texts), BATCH_SIZE):
        batch = texts[i : i + BATCH_SIZE]
        response = _client.embeddings.create(
            model=settings.openai_embedding_model,
            input=batch,
        )
        batch_embeddings = [item.embedding for item in response.data]
        all_embeddings.extend(batch_embeddings)

    return all_embeddings


def embed_query(query: str) -> list[float]:
    """
    Embed a single query string. Used at request time for FAISS search.
    Returns a single float vector.
    """
    response = _client.embeddings.create(
        model=settings.openai_embedding_model,
        input=[query],
    )
    return response.data[0].embedding
