---
chunk_id: skills_deep_core
tags: [skills, technologies, depth, stack, programming, databases, backend, frontend, AI, DevOps, Python, FastAPI, PostgreSQL]
retrieval_triggers: ["Garv's skills", "what technologies does Garv know", "Garv's tech stack", "how well does Garv know", "Garv's programming languages", "backend skills", "database experience", "AI experience", "FastAPI expertise", "PostgreSQL experience", "RAG systems"]
summary: "An honest depth assessment of Garv Jain's technical skills, covering languages, backend, databases, frontend, AI, DevOps, and the gaps where he is still developing stronger practical experience."
---

# Skills — Depth Assessment

This document reflects honest depth levels, not resume-optimized claims. Three levels used throughout:
- **Production** — architectural decisions made with this, non-obvious bugs debugged, tradeoffs understood
- **Working** — built real systems with it, knows the tricky parts, can reason about it independently
- **Surface** — used in projects, understands basics, not yet at independent architectural depth

---

## Languages

**Python — Production**
Primary backend language. Used across FastAPI services, data processing scripts, RAG pipelines, LLM integration, and automation. Comfortable with async patterns, Pydantic models, SQLAlchemy ORM, and LangChain orchestration. Used in DataInsights.ai, ComplySense, portfolio RAG backend, and multiple AI microservices.

**SQL / PostgreSQL — Production**
Designed schemas from scratch across multiple production-level projects. Wrote raw parameterized queries (no ORM shortcuts where precision mattered), handled multi-tenant row-level isolation, designed 28-table normalized schemas, managed migrations with Alembic. Used in ScanVista, DataInsights.ai, CodeAlive, ComplySense. Understands indexing, constraints, joins, and schema evolution tradeoffs.

**JavaScript — Working**
Core language for all frontend and Node.js backend work. Comfortable with async/await, event-driven patterns, closures, and module systems. Used across every project with a frontend or Node backend.

**C++ — Surface to Working**
Currently used for DSA practice and competitive programming. Not applied in production projects. Algorithmic understanding is developing; not yet at competitive programming depth.

**HTML / CSS — Working**
Solid fundamentals. Builds custom UIs without frameworks when needed. CSS custom properties, layout systems, animations, and responsive design applied across portfolio and project frontends.

---

## Backend

**FastAPI — Production**
Primary Python web framework. Used for RAG microservices, AI backends, and full application backends. Knows router patterns, dependency injection, Pydantic validation, async request handling, streaming responses, and lifespan events for startup tasks like index building.

**Node.js / Express — Working**
Used as primary backend in ScanVista and DataInsights.ai. Comfortable with middleware chains, JWT auth, route organization, and raw pg queries. Not at the same depth as FastAPI/Python but has built production-level systems with it.

**Flask — Surface**
Earlier Python web framework experience. Superseded by FastAPI in all current work.

**REST API design — Working**
Consistent pattern of designing APIs before implementing them. Familiar with auth flows, token rotation, ownership checks, rate limiting concepts, and multi-tenant access control.

---

## Databases

**PostgreSQL — Production**
See Languages section. Primary database across all significant projects. Has designed schemas, written complex queries, managed migrations, and reasoned about data isolation at the architectural level.

**Redis — Working**
Used for session management, caching, pub/sub for real-time presence, and rate limiting. Applied in CodeAlive (real-time collaboration presence), ScanVista (caching layer), and DataInsights.ai (report caching with TTL). Understands key design, TTL strategies, and when Redis is and isn't the right tool.

**MongoDB — Working**
Used for document storage in CodeAlive (inline images), DataInsights.ai (data reports), and ComplySense (compliance control library). Understands document modeling, when MongoDB is appropriate vs. PostgreSQL, and the tradeoffs of schema flexibility.

**Neon / Supabase — Working**
Cloud PostgreSQL platforms used for deployment. Understands connection pooling considerations, Supabase Storage for file management, and pgvector extension for vector search.

---

## Frontend

**React — Working**
Used across all frontend projects. Comfortable with hooks, component composition, state management, context, and performance patterns. Not React internals depth, but has built complex UIs including real-time collaborative editors, 3D viewers, and multi-step form flows.

**Next.js — Working**
Used in portfolio and UIAudit. App Router, SSR/SSG patterns, API routes, and metadata management. Still developing depth relative to React baseline.

**Three.js / React Three Fiber — Working**
Built 3D product viewer in ScanVista with corrected zoom system, lighting, and camera controls. Portfolio workspace hero uses R3F. Understands the scene graph, materials, geometries, camera systems, and performance considerations for web 3D.

**AR (model-viewer) — Surface to Working**
Integrated AR product visualization in ScanVista via Google's model-viewer. Understands the integration pattern and constraints, not deep in underlying AR frameworks.

---

## AI and Machine Learning

**RAG Systems — Working**
Designed and built RAG pipelines from scratch. Understands chunking strategy, embedding models, vector similarity search, context injection, and retrieval quality. Built for portfolio backend using LangChain, FAISS, and OpenAI embeddings.

**LLM Integration (Ollama, OpenAI API) — Working**
Integrated local LLMs via Ollama (Llama 3.2, Mistral, Gemma) in DataInsights.ai and ComplySense. OpenAI API used in UIAudit and portfolio. Understands model routing, prompt design, streaming responses, and cost/privacy tradeoffs between local and external models.

**LangChain — Working**
Used for RAG orchestration. Understands the chain abstraction, document loaders, text splitters, vector stores, and retrieval chains. Intentionally uses LangChain lightly — only for what it simplifies, not as a framework dependency.

**Machine Learning — Surface (Theory stronger than practice)**
Solid theoretical understanding of core ML concepts — supervised/unsupervised learning, model evaluation, feature engineering, gradient descent. Approximately 30% practical depth. No production PyTorch experience. Limited TensorFlow exposure. Not claiming ML engineering depth — this is an honest gap.

**FAISS — Surface**
Used for in-memory vector indexing in portfolio RAG backend. Understands the index-build, similarity search pattern, and tradeoffs vs. hosted vector databases.

---

## Linux and System Administration

**Linux / RHEL — Production**
RHCSA certified. Comfortable with process management, storage configuration, user/group administration, networking, systemd services, firewall management, and security configurations in enterprise RHEL environments. This is a genuine differentiator at the undergraduate level — most developers have surface-level Linux knowledge; Garv has certification-level depth.

**OOP — Working**
Applied consistently across Python backend code. Understands class design, inheritance, encapsulation, and when OOP patterns help vs. add unnecessary complexity.

---

## DevOps and Deployment

**Render / Vercel — Working**
Primary deployment platforms. Has deployed Node.js, FastAPI, and Next.js applications. Understands environment configuration, build pipelines, and service separation.

**Docker — Surface**
Basic understanding of containerization concepts and Dockerfile structure. Limited hands-on depth. Not yet at the level of composing multi-service environments or managing container networking in production.

**Git / GitHub — Working**
Standard version control workflow. Branch management, pull requests, and collaborative development used across internship projects.

---

## DSA and Algorithms

**Data Structures and Algorithms — In Progress**
Actively practicing in C++. Currently not at competitive programming depth. Theoretical understanding from NPTEL coursework and GATE preparation is solid — practical problem-solving speed and pattern recognition are still developing. This is an honest current gap being actively worked on.