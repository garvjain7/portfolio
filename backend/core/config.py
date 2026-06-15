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
    openai_embedding_model: str = "text-embedding-3-small"
    openai_chat_model: str = "gpt-4o"

    # RAG
    knowledge_base_dir: Path = Path(__file__).parent.parent.parent / "knowledge_base"
    top_k_chunks: int = 5

    # CORS
    frontend_url: str = "http://localhost:3000"

    # Contact
    contact_email: str = ""


settings = Settings()
