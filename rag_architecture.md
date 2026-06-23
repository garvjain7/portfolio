# Garv Jain Portfolio — RAG System Architecture
## Complete Technical Context Document

**Version:** 2.0 (Hierarchical RAG)
**Purpose:** Professional reference for any engineer or AI reading this document to understand the complete RAG system — architecture, file responsibilities, query flow, timing, and design decisions.

---

## 1. System Overview

This is a Retrieval-Augmented Generation (RAG) system powering the AI assistant on Garv Jain's portfolio website. It answers natural language questions about Garv's engineering work, projects, skills, experience, and decisions — grounded strictly in a curated knowledge base of markdown documents.

**Tech stack:**
- **Backend:** FastAPI (Python), async throughout
- **Embeddings:** OpenAI `text-embedding-3-small`
- **LLM:** OpenAI `gpt-4o` with streaming
- **Vector search:** FAISS (`IndexFlatIP`, cosine similarity via L2 normalization)
- **Chunk embedding cache:** `cachetools.TTLCache` (in-memory, TTL-based)
- **Deployment:** Render (backend), Vercel (frontend)
- **Transport:** Server-Sent Events (SSE) for streaming tokens to frontend

---

## 2. Architecture: Two-Layer Hierarchical RAG

### Problem with flat RAG

The original approach embedded all chunks from all files at startup and searched the entire FAISS index for every query. At ~20 files this is functional, but produces cross-document noise — unrelated chunks score reasonably in a global search and compete with genuinely relevant chunks for the top-k slots.

### Solution: File Routing → Chunk Retrieval

Instead of searching everything, every query passes through two stages:

```
User Query
    │
    ▼
┌─────────────────────────────────────────────┐
│  LAYER 1 — File Routing                     │
│  Input:  raw query                          │
│  Method: keyword match on retrieval_triggers│
│          + cosine similarity on file        │
│            summaries (file-level FAISS)     │
│  Output: 3–6 relevant file paths            │
│  Cost:   ~2–5ms (no OpenAI call needed)     │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│  LAYER 2 — Chunk Retrieval                  │
│  Input:  selected files only                │
│  Method: load + parse selected files        │
│          embed chunks (or use cache)        │
│          cosine similarity via FAISS        │
│  Output: top-k chunks (default: 5)          │
│  Cost:   ~300–600ms if cache miss,          │
│          ~5–10ms if cache hit               │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│  LAYER 3 — LLM Generation                  │
│  Input:  top-k chunks as context            │
│  Method: inject context into system prompt  │
│          OpenAI gpt-4o streaming            │
│  Output: streamed token response            │
│  Cost:   ~800–1200ms to first token         │
└─────────────────────────────────────────────┘
```

### Key design principle

The system first answers: **"Which files should I look at?"** — then performs vector search only inside those files. This reduces noise, improves precision, and makes retrieval decisions traceable (file routing decision is logged and auditable).

---

## 3. Complete Query Flow (Annotated)

```
1. POST /chat { message, history }
   └── routers/chat.py validates request, calls stream_answer()

2. embed_query(query)
   └── embeddings.py → OpenAI text-embedding-3-small → 1536-dim float vector
   └── ~300–500ms

3. route_files(query, query_embedding)
   └── router_service.py
   ├── Phase A: keyword matching
   │   Iterate all file metadata loaded at startup.
   │   For each file: check if any retrieval_trigger appears in lowercased query.
   │   Also check tags and summary for keyword overlap.
   │   Files with any match are added to candidate set.
   │
   ├── Phase B: file-level embedding similarity
   │   Use file-level FAISS index (built at startup from file summaries).
   │   Search for top-N files by cosine similarity to query embedding.
   │   Merge with keyword candidates, deduplicate.
   │
   ├── Phase C: threshold filtering
   │   Keep all files scoring above ROUTING_THRESHOLD (default: 0.25).
   │   Minimum: always return at least 2 files.
   │   Maximum: cap at TOP_K_FILES (default: 6) to control chunk count.
   │
   └── Output: list of file paths to search
   └── ~2–5ms

4. load_chunks_for_files(selected_file_paths)
   └── loader.py
   ├── Read and parse only the selected markdown files.
   ├── Parse YAML frontmatter, split on ## headings.
   └── Return list of chunk dicts with content + metadata.
   └── ~5–20ms

5. get_chunk_embeddings(chunks)
   └── chunk_cache.py + embeddings.py
   ├── For each chunk, generate cache key: hash(file_path + chunk_index + content)
   ├── Cache hit: return stored embedding vector (~0ms per chunk)
   ├── Cache miss: call embed_texts() for uncached chunks (~300–600ms)
   ├── Store new embeddings in TTLCache (default TTL: 3600s)
   └── Return full embedding list (mix of cached + fresh)
   └── ~5–600ms depending on cache state

6. search_chunks(query_embedding, chunk_embeddings, chunks)
   └── retriever.py
   ├── Build temporary FAISS index from chunk embeddings (in-memory, not persisted)
   ├── Normalize + search for top-k chunks (default: 5)
   └── Return ranked chunk list with scores
   └── ~1–3ms

7. _build_context(retrieved_chunks)
   └── rag_service.py
   ├── Format chunks as [Source | Section | Summary] headers + content
   └── Join with --- separators
   └── ~0ms

8. OpenAI gpt-4o streaming call
   └── SYSTEM_PROMPT.format(context=context) + history (last 6 turns) + user query
   ├── temperature: 0.4
   ├── max_tokens: 1024
   ├── stream: True
   └── Yield tokens → SSE → frontend
   └── ~800–1200ms to first token, then continuous stream

Total to first token:
  Cache miss: ~1.4–2.3s
  Cache hit:  ~1.1–1.7s  (same as original flat approach)
```

---

## 4. File Responsibilities

### `main.py`
FastAPI app entry point. Registers lifespan hook, CORS middleware, and routers. No logic. Unchanged from v1.

### `core/config.py`
Pydantic settings loaded from `.env`. Added fields:
- `top_k_files: int = 6` — max files returned by router
- `routing_threshold: float = 0.25` — minimum cosine score for file inclusion
- `chunk_cache_ttl: int = 3600` — seconds before cached chunk embeddings expire
- `min_routed_files: int = 2` — floor on file routing to prevent empty context

### `core/cors.py`
CORS middleware config. Unchanged.

### `core/startup.py`
**Changed from v1.** Now builds only the file-level index at startup:
1. `load_file_metadata()` — load frontmatter from all files without chunking bodies
2. `embed_texts(file_summaries)` — embed one summary string per file (~20 vectors)
3. `retriever.build_file_index(file_metadata, file_embeddings)` — build tiny file-level FAISS index

Does NOT chunk file bodies. Does NOT embed chunks. Both happen at query time.

### `services/loader.py`
**Split into two functions from v1:**

`load_file_metadata() → list[FileMetadata]`
- Loads frontmatter only from all markdown files at startup
- Returns: file path, chunk_id, tags, summary, retrieval_triggers
- Does NOT read or parse file body content
- Called once at startup

`load_chunks_for_files(file_paths: list[Path]) → list[Chunk]`
- Called at query time, for selected files only
- Reads file body, splits on `##` headings, returns chunk dicts
- Same chunk structure as v1 (content + metadata)

### `services/router_service.py`
**New file. The file routing layer.**

`route_files(query: str, query_embedding: list[float]) → list[Path]`

Internal logic:
1. **Keyword phase:** lowercase query → check each file's `retrieval_triggers`, `tags`, `summary` for substring matches → collect matching file paths
2. **Embedding phase:** cosine similarity between query embedding and file-level FAISS index → collect files above `routing_threshold`
3. **Merge + deduplicate:** union of keyword matches and embedding matches
4. **Floor/ceiling:** enforce `min_routed_files` (at least 2) and `top_k_files` (at most 6)
5. **Return:** sorted list of file paths

The keyword phase runs first and is deterministic — it catches exact-match cases (e.g. "ScanVista" matches `retrieval_triggers` directly) without any embedding cost. The embedding phase catches semantic matches that keywords would miss (e.g. "what does Garv build" without mentioning a specific project).

### `services/chunk_cache.py`
**New file. TTL-based chunk embedding cache.**

Uses `cachetools.TTLCache`. Cache key: `sha256(file_path + str(chunk_index) + content[:200])`. Cache value: embedding vector (list of floats).

`get_chunk_embeddings(chunks: list[Chunk]) → list[list[float]]`
- Splits chunks into cache hits and misses
- Embeds only cache misses via `embeddings.embed_texts()`
- Stores new embeddings in cache
- Returns complete embedding list in original chunk order

Cache is in-memory only — does not persist across server restarts. On cold start, first query to each file pays the embedding cost. Subsequent queries within TTL window use cached vectors.

### `services/embeddings.py`
Unchanged from v1. Batched OpenAI embedding calls, 512 texts per batch.

### `services/retriever.py`
**Extended from v1.**

Keeps all existing `FAISSRetriever` logic. Adds:

`build_file_index(file_metadata, file_embeddings)` — builds a separate small FAISS index for file-level routing. Stored as a second index on the same singleton.

`search_files(query_embedding, k) → list[FileMetadata]` — searches the file-level index. Returns file metadata dicts with scores.

`search_chunks(query_embedding, chunks, chunk_embeddings, k) → list[Chunk]` — builds a temporary per-query FAISS index from the provided chunks and embeddings, searches it, returns top-k. This temporary index is not stored — it's built and discarded per query. At the scale of 3-6 files worth of chunks (~30-60 chunks), build time is negligible.

`is_ready` property — checks both file index and at least one successful chunk search has completed.

### `services/rag_service.py`
**Modified from v1.** The system prompt is unchanged (excellent quality, no edits). The `stream_answer()` function gains one additional step between query embedding and chunk retrieval:

```python
# v1 flow
query_embedding = embed_query(query)
chunks = retriever.search(query_embedding)          # flat global search

# v2 flow
query_embedding = embed_query(query)
selected_files = route_files(query, query_embedding) # NEW: file routing
raw_chunks = load_chunks_for_files(selected_files)   # NEW: lazy loading
chunk_embeddings = get_chunk_embeddings(raw_chunks)  # NEW: cached embedding
chunks = retriever.search_chunks(query_embedding,    # chunk-level search
                                  raw_chunks,
                                  chunk_embeddings)
```

Everything after chunk retrieval (context building, system prompt assembly, OpenAI streaming, SSE delivery) is identical to v1.

### `routers/chat.py`
Unchanged from v1.

### `routers/contact.py`
Unchanged from v1.

### `models/chat.py`, `models/contact.py`
Unchanged from v1.

---

## 5. File-Level FAISS Index (Startup)

Built at startup from file summaries only:
- ~20 vectors (one per knowledge base file)
- Dimension: 1536 (text-embedding-3-small)
- Index type: IndexFlatIP with L2 normalization (cosine similarity)
- Memory: ~20 × 1536 × 4 bytes ≈ 120KB — negligible

Startup time (v2):
- `load_file_metadata()`: ~50ms (filesystem reads, no body parsing)
- `embed_texts(20 summaries)`: ~300-400ms (single OpenAI batch)
- `build_file_index()`: ~1ms
- **Total startup: ~350–450ms** (vs ~800–1200ms in v1 which embedded all chunks)

---

## 6. Chunk-Level FAISS Index (Per Query)

Built temporarily per query from selected file chunks only:
- ~30–80 chunks depending on how many files were routed (3–6 files × ~10 chunks/file)
- Same index type: IndexFlatIP with L2 normalization
- Built in memory, searched, discarded
- Build time: ~1-3ms at this scale

---

## 7. Knowledge Base Structure

```
knowledge_base/
├── identity.md
├── education.md
├── experience.md
├── certifications.md
├── skills_deep.md
├── technical_philosophy.md
├── system_design_approach.md
├── engineering_narrative.md
├── career_goals.md
├── lessons_learned.md
├── role_fit.md
├── faq.md                     ← written last, references all other files
└── projects/
    ├── project_index.md       ← routing layer for cross-project queries
    ├── scanvista.md
    ├── codealive.md
    ├── datainsights.md
    ├── complysense.md
    ├── apnaev.md
    ├── uiaudit.md
    ├── other_projects_advanced.md
    └── other_projects_basic.md
```

### Frontmatter schema (every file)

```yaml
---
chunk_id: identity_core
tags: [identity, engineering_style, thinking, approach]
retrieval_triggers: ["who is Garv", "what kind of engineer", "how does Garv think"]
summary: "Core identity and engineering profile of Garv Jain — thinking style, problem gravitation, design process, strengths, weaknesses, and motivation."
---
```

`retrieval_triggers` is the primary signal for the keyword routing phase — these must be written to match realistic natural language queries a recruiter or engineer would actually type. Quality of these triggers directly determines routing precision.

`summary` is embedded at startup for the file-level FAISS index. It must be a single dense sentence covering what the file answers, not a title.

`tags` supports secondary keyword matching — broad category labels.

### Chunk boundary rule

Every `##` heading in a file body = one retrievable chunk. The frontmatter `summary` and `tags` apply to all chunks in that file. The `section` field (the specific `##` heading text) is attached per-chunk at load time.

---

## 8. Configuration Reference

All values in `core/config.py`, loaded from `.env`:

| Setting | Default | Purpose |
|---|---|---|
| `openai_api_key` | required | OpenAI authentication |
| `openai_embedding_model` | `text-embedding-3-small` | Embedding model |
| `openai_chat_model` | `gpt-4o` | Chat completion model |
| `knowledge_base_dir` | `../knowledge_base` | KB root path |
| `top_k_chunks` | `5` | Chunks returned per query |
| `top_k_files` | `6` | Max files routed per query |
| `routing_threshold` | `0.25` | Min cosine score for file inclusion |
| `min_routed_files` | `2` | Floor on files returned by router |
| `chunk_cache_ttl` | `3600` | Chunk embedding cache TTL (seconds) |
| `frontend_url` | `http://localhost:3000` | CORS allowed origin |
| `contact_email` | `""` | Contact form delivery address |

---

## 9. Timing Summary

| Stage | Cold (cache miss) | Warm (cache hit) |
|---|---|---|
| `embed_query()` | 300–500ms | 300–500ms |
| `route_files()` | 2–5ms | 2–5ms |
| `load_chunks_for_files()` | 5–20ms | 5–20ms |
| `get_chunk_embeddings()` | 300–600ms | 5–10ms |
| `search_chunks()` | 1–3ms | 1–3ms |
| OpenAI first token | 800–1200ms | 800–1200ms |
| **Total to first token** | **~1.4–2.3s** | **~1.1–1.7s** |

Cold vs warm refers to whether the selected files' chunk embeddings are in the TTL cache. First query after server start is always cold. Repeated questions about the same files (e.g. multiple questions about ScanVista in one session) benefit from the cache from the second query onward.

---

## 10. System Prompt

The system prompt lives in `services/rag_service.py` as `SYSTEM_PROMPT`. It is a large, carefully engineered prompt (~170 lines) with the following sections:

- **Role Definition** — establishes the assistant as Garv's grounded digital representation
- **Grounding Rules** — all claims must trace to retrieved context
- **No Hallucination Rule** — explicit prohibitions on inventing details
- **Prompt Injection Protection** — handles adversarial inputs
- **Response Style Rules** — prose vs bullets, no markdown headers, no filler phrases
- **Tone Requirements** — direct, technically precise, honest about gaps
- **Multi-Project Reasoning Rules** — how to synthesize across projects
- **Uncertainty Handling** — how to flag partial coverage
- **Output Quality Standards** — reflect decisions and tradeoffs, not just tech stacks
- **Refusal Rules** — decline general engineering help, redirect to contact form
- **Final Objective** — grounding statement for the assistant's purpose
- **Retrieved Context** — the `{context}` injection point

The system prompt is compiled once at module import and reused across all requests. Only the `{context}` block changes per query.

---

## 11. Design Decisions and Tradeoffs

**Why lazy chunk loading instead of startup pre-chunking?**
Pre-chunking at startup means all file bodies are read and parsed regardless of query relevance. Lazy loading means only the 3-6 relevant files' bodies are ever parsed per query. For a knowledge base that grows over time, this keeps startup time constant.

**Why in-memory chunk embedding cache instead of persistent vector store?**
The knowledge base is small (~20 files) and static. A persistent vector store (Pinecone, Supabase pgvector) adds operational complexity and cost. An in-memory TTL cache achieves the same performance benefit for repeated queries within a session, and the startup embedding cost is low enough that a cold start on server restart is acceptable.

**Why a temporary per-query FAISS index for chunks instead of one global index with metadata filtering?**
A global chunk index with file-level filtering is simpler to implement but means all chunks are always in memory and the file routing decision doesn't actually reduce the search space — it just filters results after the fact. Building a temporary index from only the routed files' chunks means the search genuinely operates on a smaller, more relevant set. At 30-80 chunks, the build time is negligible.

**Why `routing_threshold: 0.25` as the default?**
0.25 is intentionally low. As noted in the design requirements: "extra info giving is okay, but not less." A higher threshold risks excluding relevant files. The keyword matching phase provides deterministic coverage for direct mentions; the embedding phase handles semantic matches. The threshold is a safety net, not the primary selection mechanism.

**Why keep the system prompt in `rag_service.py` rather than an external file?**
The system prompt is code — it has formatting rules, conditional logic hints, and is tightly coupled to the response behavior. Treating it as a Python constant makes it version-controlled alongside the code that uses it, editable in the same environment, and avoids file I/O on every request.

---

## 12. Adding New Knowledge Base Files

1. Create the `.md` file in the appropriate `knowledge_base/` location
2. Add YAML frontmatter with `chunk_id`, `tags`, `retrieval_triggers`, `summary`
3. Write `##` heading boundaries for chunk separation
4. Restart the backend — `startup.py` rebuilds the file-level index automatically
5. No code changes required

For `retrieval_triggers`: write 5-10 realistic natural language phrases that a recruiter or engineer might actually type to reach this file's content. Avoid generic phrases like "tell me about Garv" (too broad — matches everything).

---

## 13. Future Improvements (Not Yet Implemented)

- **Reranking layer** — after FAISS retrieval, use a cross-encoder reranker (e.g. Cohere Rerank) to rescore chunks by relevance before context injection. Improves precision at the cost of one additional API call.
- **Query intent classification** — before routing, classify the query intent (project-specific, career-related, technical-deep, general-overview) and adjust routing parameters accordingly.
- **Persistent chunk embedding store** — replace TTLCache with a lightweight SQLite-backed store so chunk embeddings survive server restarts. Eliminates cold-start latency entirely.
- **Streaming file routing** — begin streaming the LLM response as soon as the first chunk is retrieved rather than waiting for all selected files to be chunked and embedded.
- **Context deduplication** — before building the context block, check for near-duplicate chunk content across files (e.g. the same project mentioned in `project_index.md` and `scanvista.md`) and deduplicate to reduce token waste.

## Proposed New folder structure
backend/
├── main.py                    # unchanged
├── requirements.txt           # add: cachetools
├── .env
│
├── core/
│   ├── __init__.py
│   ├── config.py              # add: top_k_files, routing_threshold, cache_ttl_seconds
│   ├── cors.py                # unchanged
│   └── startup.py            # changed: only builds file-level index at startup
│
├── models/
│   ├── __init__.py
│   ├── chat.py                # unchanged
│   └── contact.py             # unchanged
│
├── routers/
│   ├── __init__.py
│   ├── chat.py                # unchanged
│   └── contact.py             # unchanged
│
└── services/
    ├── __init__.py
    ├── embeddings.py          # unchanged
    ├── loader.py              # split: load_file_metadata() + load_chunks_for_files()
    ├── router_service.py      # NEW: two-layer file routing (keyword + embedding)
    ├── retriever.py           # add: file-level index + search_chunks() with file filter
    ├── chunk_cache.py         # NEW: TTL cache for chunk embeddings per file
    └── rag_service.py         # changed: insert routing step before chunk retrieval