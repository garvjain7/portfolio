"""
loader.py — Knowledge base loading with direct recursive chunking.

Two distinct responsibilities:

load_file_metadata()      — called ONCE at startup
                            reads only frontmatter from all .md files
                            returns file-level metadata for routing
                            does NOT read or parse file bodies

load_chunks_for_files()   — called PER QUERY, for selected files only
                            reads only selected files
                            applies RecursiveCharacterTextSplitter directly
                            preserves markdown structure via separator hierarchy
                            preserves metadata on every chunk
                            returns chunk dicts ready for embedding + retrieval

Strategy:
  RecursiveCharacterTextSplitter respects markdown structure via separators:
  1. "\n\n" (paragraph breaks) — Splits at headers and blank lines
  2. "\n" (line breaks) — Preserves line-level context
  3. " " (word boundaries) — Last resort
  4. "" (character) — Never reached in practice
  
Result: Chunks split at semantic boundaries (paragraphs, headers), NOT arbitrary points.
Eliminates the 70-chunk explosion from H2 pre-splitting.
"""

from pathlib import Path
from typing import Any
import frontmatter

from core.config import settings
from langchain.text_splitter import RecursiveCharacterTextSplitter


def load_file_metadata() -> list[dict[str, Any]]:
    """
    Walk the knowledge_base directory, read ONLY frontmatter from every .md file.
    File bodies are not read here — that happens at query time in load_chunks_for_files().

    Returns a list of file-level metadata dicts used by router_service.py:
        {
            "file_path": Path,     # absolute path — used by load_chunks_for_files()
            "source":    str,      # relative path from KB root — used in chunk metadata
            "chunk_id":  str,
            "tags":      list[str],
            "summary":   str,
            "retrieval_triggers": list[str],
        }
    """
    kb_dir = settings.knowledge_base_dir
    file_metadata: list[dict[str, Any]] = []

    md_files = sorted(kb_dir.rglob("*.md"))

    for md_path in md_files:
        try:
            # frontmatter.load reads the full file but we only use post.metadata
            # For frontmatter-only reads, this is the correct approach with this library
            post = frontmatter.load(str(md_path))
        except Exception as e:
            print(f"[loader] Could not parse frontmatter in {md_path}: {e}")
            continue

        meta = post.metadata
        relative_source = str(md_path.relative_to(kb_dir))

        file_metadata.append({
            "file_path": md_path,           # absolute Path — for load_chunks_for_files
            "source": relative_source,      # relative str — for chunk metadata + logging
            "chunk_id": meta.get("chunk_id", md_path.stem),
            "tags": meta.get("tags", []),
            "summary": meta.get("summary", ""),
            "retrieval_triggers": meta.get("retrieval_triggers", []),
        })

    print(f"[loader] Loaded metadata for {len(file_metadata)} files.")
    return file_metadata


def load_chunks_for_files(file_paths: list[Path]) -> list[dict[str, Any]]:
    """
    Read and chunk only the selected files. Called at query time.

    Strategy:
      1. Load file and frontmatter
      2. Apply RecursiveCharacterTextSplitter with smart separators
      3. Preserve markdown structure via separator hierarchy
      4. Preserve metadata on every chunk

    Each chunk dict:
        {
            "content":  str,           # chunk text (respects markdown boundaries)
            "metadata": {
                "source":             str,   # relative path from KB root
                "chunk_id":           str,   # from frontmatter (file-level)
                "tags":               list,
                "summary":            str,   # file-level summary
                "retrieval_triggers": list,
                "chunk_index":        int,   # sequence within file (0, 1, 2, ...)
            }
        }
    """
    kb_dir = settings.knowledge_base_dir
    chunks: list[dict[str, Any]] = []

    # Initialize recursive splitter with smart separators
    # Respects markdown structure: splits at paragraphs first, then lines, then words
    recursive_splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", " ", ""],  # Paragraph → line → word → char
    )

    for raw_path in file_paths:
        # Resolve to absolute path — file_paths may come as relative or absolute
        md_path = Path(raw_path)
        if not md_path.is_absolute():
            md_path = kb_dir / md_path

        if not md_path.exists():
            print(f"[loader] File not found, skipping: {md_path}")
            continue

        try:
            post = frontmatter.load(str(md_path))
        except Exception as e:
            print(f"[loader] Could not parse {md_path}: {e}")
            continue

        body: str = post.content or ""
        meta = post.metadata
        relative_source = str(md_path.relative_to(kb_dir))

        # Base metadata preserved on every chunk
        base_meta = {
            "source": relative_source,
            "chunk_id": meta.get("chunk_id", md_path.stem),
            "tags": meta.get("tags", []),
            "summary": meta.get("summary", ""),
            "retrieval_triggers": meta.get("retrieval_triggers", []),
        }

        # Apply recursive chunking directly (respects markdown via separators)
        if body.strip():
            chunk_texts = recursive_splitter.split_text(body)

            for chunk_index, chunk_text in enumerate(chunk_texts):
                chunks.append({
                    "content": chunk_text,
                    "metadata": {
                        **base_meta,
                        "chunk_index": chunk_index,
                    },
                })

    print(f"[loader] Loaded {len(chunks)} chunks from {len(file_paths)} selected file(s).")
    return chunks

