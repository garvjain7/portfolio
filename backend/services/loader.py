"""
loader.py — Knowledge base loading with two distinct responsibilities.

load_file_metadata()      — called ONCE at startup
                            reads only frontmatter from all .md files
                            returns file-level metadata for routing
                            does NOT read or parse file bodies

load_chunks_for_files()   — called PER QUERY, for selected files only
                            reads and chunks only the files the router selected
                            returns chunk dicts ready for embedding + retrieval

The old load_documents() (chunk everything at startup) is intentionally
removed. All chunking happens at query time, on selected files only.
"""

from pathlib import Path
from typing import Any
import frontmatter
import re

from core.config import settings


def _split_by_h2(body: str) -> list[str]:
    """
    Split a markdown body on ## headings. Returns non-empty sections.
    Each section re-attaches its ## prefix so it reads as a self-contained chunk.
    """
    sections = re.split(r"(?m)^## ", body)
    result = []
    for i, section in enumerate(sections):
        text = section.strip()
        if not text:
            continue
        if i > 0:
            text = "## " + text
        result.append(text)
    return result


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

    Each chunk dict:
        {
            "content":  str,           # one ## section (or full body if no ## headings)
            "metadata": {
                "source":             str,   # relative path from KB root
                "chunk_id":           str,   # from frontmatter
                "tags":               list,
                "summary":            str,   # file-level summary
                "retrieval_triggers": list,
                "section":            str,   # the ## heading for this specific chunk
            }
        }
    """
    kb_dir = settings.knowledge_base_dir
    chunks: list[dict[str, Any]] = []

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

        base_meta = {
            "source": relative_source,
            "chunk_id": meta.get("chunk_id", md_path.stem),
            "tags": meta.get("tags", []),
            "summary": meta.get("summary", ""),
            "retrieval_triggers": meta.get("retrieval_triggers", []),
        }

        sections = _split_by_h2(body)

        if not sections:
            # No ## headings — treat whole body as one chunk
            if body.strip():
                chunks.append({
                    "content": body.strip(),
                    "metadata": {**base_meta, "section": ""},
                })
            continue

        for section_text in sections:
            first_line = section_text.splitlines()[0] if section_text else ""
            heading = first_line.lstrip("#").strip()
            chunks.append({
                "content": section_text,
                "metadata": {**base_meta, "section": heading},
            })

    print(f"[loader] Loaded {len(chunks)} chunks from {len(file_paths)} selected file(s).")
    return chunks