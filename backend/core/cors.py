from fastapi.middleware.cors import CORSMiddleware
from core.config import settings


def add_cors(app) -> None:
    """Attach CORS middleware to the FastAPI app."""
    origins = [
        settings.frontend_url,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )
