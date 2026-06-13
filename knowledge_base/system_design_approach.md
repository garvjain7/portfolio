---
chunk_id: system_design_approach_core
tags: [system design, architecture, caching, rate limiting, queues, schema, authentication, performance]
retrieval_triggers: ["Garv's system design", "how does Garv design systems", "caching decisions", "rate limiting", "job queues", "schema design process", "authentication approach", "distributed systems", "performance optimization"]
summary: "Garv Jain's practical system design approach — what he has implemented across projects, how he makes architectural decisions, and where his depth is theoretical versus applied."
---

# System Design Approach

## Honest Scope

Garv's system design knowledge comes from three sources: practical implementation in projects, reading open-source schemas and senior engineers' codebases, and structured study through resources including YouTube, documentation, and AI tools. The implementations described below are real — built and tested in actual projects. Areas that are studied but not yet applied at scale are noted honestly.

---

## Rate Limiting

**Applied across multiple projects — middleware and Redis-based.**

Rate limiting in Garv's projects is implemented at the middleware level using Redis as the backing store. Fixed window and sliding window approaches have both been used depending on the endpoint sensitivity. The pattern is consistent: intercept the request before it hits the route handler, check the Redis key for the current window, reject or allow based on threshold, increment and set TTL.

Applied in contexts including API endpoints, authentication routes (to prevent brute force), and AI query endpoints where per-user request throttling controls cost and abuse.

---

## Job Queues and Workers

**Implemented across two to three projects using Redis-backed queues.**

Garv has implemented job queue and worker patterns in multiple projects. UIAudit uses BullMQ with Redis for audit job processing — jobs are created when an audit is requested, workers process Playwright screenshot capture and Vision API calls asynchronously, and results stream back via SSE. This separates long-running work from the request cycle cleanly.

The pattern applied: job creation on request, worker pool processing from queue, retry logic for failed jobs, and result delivery via polling or streaming. Priority queuing has been used where some jobs need to jump ahead of others.

---

## Chatbot and LLM Optimization

**Applied in ScanVista and DataInsights.ai.**

Optimization work in both projects focused on several dimensions:

**Prompt engineering and injection hardening** — prompts are structured to prevent users from redirecting the model's behavior through input. System prompts establish clear boundaries, and user input is treated as data rather than instruction wherever possible.

**Response quality** — in DataInsights.ai, the compute-first architecture is itself an optimization. By ensuring the LLM receives pre-computed summaries and statistics rather than raw data rows, response quality is more predictable and hallucination risk is reduced. The model formats real numbers rather than generating them.

**Streaming** — both projects use streaming responses to improve perceived performance. FastAPI's `StreamingResponse` pushes tokens to the frontend incrementally rather than waiting for the full completion.

**Context window management** — rolling conversation history (six pairs in DataInsights.ai) keeps context relevant without exceeding token limits on longer sessions.

---

## Distributed Shard Counters — Experiment

**Independently designed and stress tested.**

Garv built a shard counter experiment to understand how high-frequency write operations — such as like and view counts on popular social media content — can be handled without creating a bottleneck on a single database row.

The test simulated 50,000 to 500,000 concurrent increments representing multiple users accessing the same content simultaneously. The approach: instead of writing every increment to one counter, writes are distributed across multiple shard counters. Counters are assigned dynamically — only created when needed. Periodic aggregation combines shard values into the final count, reducing direct database hits significantly.

Key findings from the experiment: the performance difference between a single counter and sharded counters becomes significant well before 100k operations. The assignment strategy for shards — how you decide which shard receives a given write — affects both distribution quality and aggregation cost. Database hit reduction under load was measurable and consistent across test levels.

This experiment was not part of a production project but was designed, implemented, and tested with real load rather than just studied conceptually.

---

## Schema Design Process

Garv's schema design process is informed by reading real open-source schemas, senior engineers' codebases, and applying those patterns to his own requirements. His process typically follows this sequence:

1. Identify the primary entities and their relationships
2. Define access patterns — what queries will be most frequent, what joins will be needed
3. Design around those access patterns rather than around the entities alone
4. Normalize where data integrity matters, denormalize where read performance justifies it
5. Add constraints, foreign keys, and indexes before writing application code

In practice, schemas usually go through at least one significant redesign mid-project. The 28-table ComplySense schema and the 19-table DataInsights.ai schema were both designed from scratch with multi-tenant isolation, role-based access, and audit requirements factored in from the start. Both evolved during implementation as requirements became clearer.

---

## Authentication and Security

**Consistently implemented across projects.**

Garv's authentication implementations follow a consistent pattern across projects:

- **JWT with httpOnly refresh token rotation** — access tokens are short-lived, refresh tokens are stored in httpOnly cookies to prevent XSS access, rotation on every refresh prevents token reuse after compromise
- **Ownership checks at the query level** — rather than checking ownership in application logic after fetching data, queries include ownership conditions so unauthorized data is never fetched in the first place
- **Password hashing** — bcrypt across all projects that handle passwords
- **Role-based access control** — implemented via dependency injection in FastAPI (ComplySense, nine roles) and middleware in Express (DataInsights.ai, two roles)
- **Session management** — sessions table in PostgreSQL for tracking active sessions, Redis for fast session lookup where needed

Security considerations also appear at the AI layer — prompt injection hardening in chatbot implementations and the compute-first constraint in DataInsights.ai which ensures raw organizational data never reaches an external model.

---

## System Design Knowledge — Studied but Not Yet Applied at Scale

Garv has studied the following areas with enough depth to reason about tradeoffs and explain design decisions, but has not yet applied them in full production systems:

- Consistent hashing and its role in distributed cache and database routing
- CAP theorem and its practical implications for distributed database choices
- Leader election and consensus in distributed systems
- Horizontal scaling patterns for stateful services
- Database replication and read replica routing

These are areas where his understanding is conceptual and informed, not production-validated. The distinction matters and he does not claim otherwise.