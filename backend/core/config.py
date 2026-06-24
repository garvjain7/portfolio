from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=Path(__file__).parent.parent / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )
    # Gemini
    gemini_api_key: str
    gemini_api_base: str = "https://generativelanguage.googleapis.com/v1beta"
    gemini_chat_model: str = "gemini-2.5-flash"

    # RAG
    knowledge_base_dir: Path = Path(__file__).parent.parent.parent / "knowledge_base"
    top_k_chunks: int = 5
    top_k_files: int = 6
    routing_threshold: float = 0.25
    min_routed_files: int = 2
    chunk_cache_ttl: int = 3600
    chunk_cache_max_size: int = 2048
    chunk_size: int = 1000
    chunk_overlap: int = 200
    context_budget: int = 8000  # Max tokens for LLM context

    frontend_url: str = "http://localhost:3000"

    contact_email: str = ""

settings = Settings()