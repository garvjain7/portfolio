from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=Path(__file__).parent.parent / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # OpenAI
    openai_api_key: str
    openai_chat_model: str = "gpt-4o"
    # Note: Embeddings now use local sentence-transformers (no OpenAI API needed)

    # RAG
    knowledge_base_dir: Path = Path(__file__).parent.parent.parent / "knowledge_base"
    top_k_chunks: int = 5
    top_k_files: int = 6
    routing_threshold: float = 0.25
    min_routed_files: int = 2
    chunk_cache_ttl: int = 3600

    # CORS
    frontend_url: str = "http://localhost:3000"

    # Contact
    contact_email: str = ""


settings = Settings()
