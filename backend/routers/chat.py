"""
chat.py — POST /chat streaming endpoint.

Accepts a user message + optional conversation history.
Streams the RAG pipeline response back as Server-Sent Events (SSE).
The frontend reads this stream via the stream.ts utility.
"""

import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from models.chat import ChatRequest
from services.rag_service import stream_answer
from services.retriever import retriever

router = APIRouter(prefix="/chat", tags=["chat"])


async def _sse_generator(query: str, history):
    """
    Wraps the rag_service stream_answer generator into SSE format.

    SSE format:  data: <json_payload>\n\n
    Each event carries a token chunk. Final event has done=true.
    """
    try:
        async for token in stream_answer(query, history):
            payload = json.dumps({"token": token, "done": False})
            yield f"data: {payload}\n\n"

        # Send a final done signal
        yield f"data: {json.dumps({'token': '', 'done': True})}\n\n"

    except Exception as e:
        error_payload = json.dumps({"error": str(e), "done": True})
        yield f"data: {error_payload}\n\n"


@router.post("")
async def chat(request: ChatRequest):
    """
    Stream a RAG-powered answer to the user's message.

    Returns a text/event-stream response. Tokens arrive incrementally
    as SSE events. The final event has done=true to signal completion.
    """
    if not retriever.is_ready:
        raise HTTPException(
            status_code=503,
            detail="Knowledge base index is not ready. Server may still be starting up.",
        )

    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    return StreamingResponse(
        _sse_generator(request.message, request.history),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # Disable nginx buffering for SSE
        },
    )
