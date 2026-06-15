"""
loader.py — Reads all markdown files from the knowledge_base directory,
parses YAML frontmatter, and chunks each document by ## headings.
Each chunk is a dict with 'content' and 'metadata' keys.
"""

from pathlib import Path
from typing import Any
import frontmatter
import re

from core.config import settings


def _split_by_h2(body: str) -> list[str]:
    """Split a markdown body on ## headings. Returns non-empty sections."""
    sections = re.split(r"(?m)^## ", body)
    result = []
    for i, section in enumerate(sections):
        text = section.strip()
        if not text:
            continue
        # Re-attach the ## prefix for all sections except the first
        # (the first section is the content before any ## heading)
        if i > 0:
            text = "## " + text
        result.append(text)
    return result


def load_documents() -> list[dict[str, Any]]:
    """
    Walk the knowledge_base directory recursively, parse every .md file,
    and return a flat list of chunks.

    Each chunk dict:
        {
            "content":  str,           # the chunk text (one ## section or preamble)
            "metadata": {
                "source":      str,    # relative path from knowledge_base root
                "chunk_id":    str,    # from frontmatter, e.g. "identity_core"
                "tags":        list,   # from frontmatter
                "summary":     str,    # from frontmatter one-liner
                "section":     str,    # the ## heading that starts this chunk
                "retrieval_triggers": list,
            }
        }
    """
    kb_dir = settings.knowledge_base_dir
    chunks: list[dict[str, Any]] = []

    md_files = sorted(kb_dir.rglob("*.md"))

    for md_path in md_files:
        try:
            post = frontmatter.load(str(md_path))
        except Exception as e:
            print(f"[loader] Could not parse {md_path}: {e}")
            continue

        body: str = post.content or ""
        meta = post.metadata  # dict from YAML frontmatter

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
            # Whole file as one chunk if no ## headings found
            if body.strip():
                chunks.append({
                    "content": body.strip(),
                    "metadata": {**base_meta, "section": ""},
                })
            continue

        for section_text in sections:
            # Extract the heading line as section label
            first_line = section_text.splitlines()[0] if section_text else ""
            heading = first_line.lstrip("#").strip()

            chunks.append({
                "content": section_text,
                "metadata": {**base_meta, "section": heading},
            })

    print(f"[loader] Loaded {len(chunks)} chunks from {len(md_files)} files.")
    return chunks
