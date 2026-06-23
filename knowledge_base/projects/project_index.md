---
chunk_id: project_index
tags: [projects, overview, index, navigation, cross-project, portfolio-summary, project-list]
retrieval_triggers: ["what projects has Garv built", "list Garv's projects", "portfolio overview", "project index", "project navigation", "compare projects", "which projects use AI", "internship projects", "project summary"]
summary: "Cross-project navigation for Garv Jain's portfolio — lists his projects, groups them by technology and domain, and highlights how each connects to his internship and AI work."
---

# Project Index

Individual project files go deep on one project at a time. This file is for questions that span multiple projects: what exists across Garv's work, how projects relate by technology, how his approach to AI differs depending on context, and which internship produced which project.

---

## All Projects at a Glance

**ScanVista** — A QR-to-3D product visualization platform. Scanning a QR code launches a full 3D viewer in the browser with AR support. Built with React Three Fiber, Node/Express, PostgreSQL on Neon, Supabase Storage, Redis, and a separate FastAPI AI microservice for recommendations and AR narration. Garv is technical lead on a two-person team.

**CodeAlive** — A code snippet sharing platform with anonymous and authenticated sharing, inline image embeds, password-protected snippets, and real-time collaborative editing powered by a from-scratch Operational Transformation engine. Built with FastAPI, asyncpg, Redis, MongoDB, and CodeMirror 6.

**ComplySense** — An AI-enabled governance, risk, and compliance platform for Indian universities, with role-based AI capabilities mapped to each role's daily work. Built with FastAPI, SQLAlchemy, PostgreSQL, MongoDB (control library), Redis, local Ollama models, and React. Garv is technical lead, built during an STPI internship.

**DataInsights.ai** — A multi-tenant AI data analysis platform where employees query company datasets in natural language. The core rule: the LLM never sees raw data, only a pre-computed structured report. Built with Node/Express, FastAPI, self-hosted PostgreSQL, MongoDB, Redis, and Ollama.

**ApnaEV** — An EV charging station discovery platform for Jaipur, built around an interactive Leaflet map with a dark, utilitarian UI. Garv's first complete end-to-end solo product, built during a 45-day STPI internship.

**UIAudit** — An agentic UI/UX auditing tool that evaluates public websites against Nielsen's 10 usability heuristics using browser automation and a vision-capable AI model. Built with Next.js, Express/TypeScript, Playwright, the Claude API, BullMQ, Redis, and PostgreSQL.

**Smaller projects** — A set of experiments and learning builds: AI applications (ScamShield fraud detection, SimonSays vision-based game, typing-behavior analysis), a distributed sharded-counter experiment, a terminal LinkedIn-style network model (LinkedUp), a webcam-based interactive instrument (Elastic Strings), pygame graphics experiments, a browser accessibility extension (AccessFlow), a terminal lyrics tool (KaraVerse), a web3 onboarding hackathon project (ChainLit), and a small set of system design study notes.

---

## Depth of Coverage Across Projects

ScanVista and CodeAlive are the two projects Garv can go deepest on — architectural decisions, tradeoffs, what was hardest, and what he'd do differently are all worked out in detail for these two. If someone wants a real conversation about how Garv reasons through system design, these are the best starting points.

ComplySense and DataInsights are covered at a product/architecture level appropriate for an internship context — the AI design philosophy and role-based thinking behind each is genuinely covered, just without internal specifics like exact table or control counts.

ApnaEV is covered as a milestone project — Garv's first time taking a product from idea to a working end-to-end build solo, with the geospatial/mapping work as the technical core.

UIAudit is framed as an experimental, research-oriented build — an agent-based system with an explicit comparison angle (vision-language agent vs. static tools like Lighthouse or WAVE for usability evaluation).

The smaller projects are intentionally compressed — good for answering "has Garv worked with X" breadth questions, not for deep technical discussion.

---

## Technology Map Across Projects

**FastAPI** shows up across most of Garv's backend work: CodeAlive, ComplySense, DataInsights, ScanVista's AI microservice, and several smaller projects (ScamShield, SimonSays, the typing-behavior system).

**AI/LLM integration is context-dependent, not one-size-fits-all.** ScanVista's AI runs as a separate microservice doing recommendations, explanations, and AR narration — AI never touches the database directly. ComplySense and DataInsights are restricted to local Ollama models only, because both deal with institutional or company data where sending anything to an external API isn't acceptable. UIAudit uses the Claude API with model routing across Haiku/Sonnet/Opus for vision-based reasoning. This portfolio's own assistant uses OpenAI for a RAG pipeline over Garv's project knowledge.

**PostgreSQL + MongoDB is a recurring pairing**, but for different reasons each time: CodeAlive uses Mongo for inline images, ComplySense uses it for its control library (mapped across multiple compliance frameworks), and DataInsights uses it for a `data_reports` collection. In each case, Postgres holds the relational/transactional core and Mongo holds one specific document-shaped subset.

**Redis** appears in CodeAlive, ComplySense, DataInsights, ScanVista, and UIAudit — usually for sessions, caching, or background job queues (BullMQ in UIAudit's case).

**Real-time/collaborative systems** — CodeAlive's Operational Transformation engine, built from scratch, is the most involved real-time system Garv has built (room locking, host/cohost roles, WebSocket lifecycle management).

---

## AI Design Philosophy Across Projects

A consistent thread across Garv's projects is that AI is designed to operate within constraints specific to the problem, rather than as a generic chatbot bolted on:

- **ScanVista** treats AI as a dedicated microservice with a fixed scope — a 3-layer Product Intelligence Engine (intent classification, weighted recommendation scoring, AR spatial narration) that never has direct database access.
- **ComplySense** assigns different AI capabilities to different roles based on each role's actual workflow bottleneck (e.g. incident drafting, plain-language translation of policy, conflict detection) — constrained to local models because the data is institutional.
- **DataInsights** is compute-first: the LLM only explains or formats numbers that have already been computed deterministically, and never sees raw data rows or generates figures itself.
- **UIAudit** uses AI as an evaluator — a vision-language model reasoning about screenshots against a fixed heuristic framework, with a research framing comparing this approach to static analysis tools.
- **This portfolio** uses AI as a retrieval-grounded "digital Garv" — answering questions from a structured knowledge base of his actual work rather than general knowledge.

The common pattern: figure out exactly what the AI should and shouldn't be allowed to do for a given context, then build the system around that boundary.

---

## Internships and Project Origins

Garv's **SparkIIT internship** (remote, backend-focused) produced two things: ScanVista, where he is technical lead on a two-person team, and the foundation for DataInsights.ai — his personal version reflects the same architectural patterns as the confidential client work he did during that internship.

His **first STPI internship** (45 days, solo) produced ApnaEV — his first complete end-to-end solo product, where he learned location-based systems and geospatial/mapping fundamentals from scratch.

His **second STPI internship** is where Garv is technical lead on ComplySense, working through role-based AI design under real data-sovereignty constraints.

UIAudit, the smaller experimental projects, and this portfolio itself are independent personal projects, not tied to an internship.