---
chunk_id: project_codealive
tags: [projects, codealive, fastapi, postgresql, mongodb, redis, websockets, real-time, collaboration, code-editor, operational-transformation, OT]
retrieval_triggers: ["CodeAlive", "code collaboration", "real-time code editor", "collaborative editor", "Operational Transformation", "OT engine", "websocket collaboration", "sharing code snippets", "password protected snippets"]
summary: "CodeAlive is a real-time collaborative code sharing platform built by Garv Jain. It combines a custom OT engine, FastAPI backend, PostgreSQL/MongoDB storage, Redis presence, and secure sharing workflows."
---

# CodeAlive

## Overview

CodeAlive is a code snippet sharing platform — write or paste code, share it via a custom URL, optionally protect it with a password or set an expiry, and collaborate on it in real time with others. The core experience is built around CodeMirror 6 as the sole editor, with inline image embedding directly inside the code view and a real-time collaborative editing layer built on Operational Transformation.

Built and maintained by Garv independently, hosted at codealive.onrender.com.

---

## Problem and Motivation

Most code snippet tools — Pastebin-style services — treat snippets as static text dumps. CodeAlive's premise is that a snippet is often the start of a conversation: someone shares code to get help, explain a bug, or collaborate on a fix. The platform is built around that — anonymous sharing with no friction for quick use, but also real-time collaboration, inline visual context via embedded images, and access control via passwords and expiry for more deliberate sharing.

The real-time collaboration layer specifically targets the scenario where a snippet share turns into "let's fix this together right now" — without needing to switch to a different tool entirely.

---

## Tech Stack and Reasons

**FastAPI** — backend framework. Async-first, which matters for the WebSocket-heavy collaboration layer and for asyncpg's async PostgreSQL access.

**PostgreSQL with asyncpg** — primary database for snippets, users, sessions, and metadata. asyncpg chosen over a higher-level ORM for direct async query control, particularly important for the collaboration system where query latency affects real-time responsiveness.

**Redis** — used specifically for sessions and auth, and for the collaboration grace period sweeper (tracking disconnected users during real-time sessions). Deliberately scoped — not used as a general cache here.

**MongoDB Atlas** — stores inline images embedded in snippets, with LRU eviction to manage storage. Document storage fits image blobs and metadata better than relational tables, and eviction keeps storage bounded without manual cleanup.

**CodeMirror 6 (CM6)** — the sole editor, replacing an earlier textarea + Prism.js implementation. CM6's extension architecture (Compartments, StateFields, ViewPlugins) is what makes the inline image embedding and live language switching possible — neither was feasible with the textarea-based approach.

**WebSockets** — real-time collaboration transport. Custom-built rather than using a library like Socket.IO, to keep full control over the OT message protocol and connection lifecycle.

---

## Architecture

**Editor layer** — CM6 with a Compartment for language switching (swapping language support without recreating the editor instance), a StateField + Decoration combination for syntax highlighting state, and a ViewPlugin + MatchDecorator pair that detects image references in the code text and renders them as inline widgets directly in the editor view. This last piece is what makes images feel embedded in the code rather than attached separately.

**Sharing layer** — snippets get custom URLs (`/s/{code_id}`), can be created anonymously or by authenticated users, and support password protection (bcrypt-hashed) and expiry timestamps. Routing is structured as `/` for the homepage, `/editor` for the creation flow, and `/s/{code_id}` for shared snippet views, with legacy URL patterns 301-redirected to the new structure.

**Real-time collaboration layer** — a from-scratch Operational Transformation engine. When multiple users edit the same snippet simultaneously, each edit is represented as an operation (insert/delete at a position), and OT logic transforms concurrent operations against each other so all clients converge to the same document state regardless of the order operations arrive in. The system includes WebSocket connection lifecycle management, a Redis-backed grace period sweeper for handling disconnects without immediately dropping a user from a session, room locking to control session access, a cohost role for shared session control, and moderation capabilities.

**Email layer** — Render's hosting blocks outbound SMTP, so CodeAlive's backend calls a separate mail microservice over HTTPS (`mail_service_v2.py`), authenticated via an `x-api-key` header. This handles signup verification, password reset, waitlist notifications, and snippet expiry alerts.

**PII masking** — a utility layer that masks personally identifiable information in relevant contexts before it's logged or stored in places where it shouldn't persist in plain form.

---

## Hardest Parts

The hardest part of CodeAlive was not implementation — it was the conceptual design of the Operational Transformation system itself. OT requires reasoning about every pair of concurrent operations and how they transform against each other so that final document state converges correctly regardless of arrival order. Getting this transform logic right — particularly for overlapping inserts and deletes at the same or adjacent positions — required working through the OT algorithm's edge cases on paper before any of the 20-file implementation made sense.

By comparison, the inline image embedding via CM6's ViewPlugin and MatchDecorator — while it sounds complex — was mechanically straightforward once the CM6 extension model was understood. The OT design was the part that required sustained conceptual work before implementation could even begin.

---

## What I Would Do Differently

CodeAlive's editor went through a full migration — from a textarea + Prism.js implementation to CodeMirror 6. Several features, including the image strip panel and parts of the routing structure, were originally built around the textarea-based editor's constraints. When the migration to CM6 happened, those features needed rework to fit CM6's extension model properly.

Rebuilding today, the editor foundation — CM6 specifically, given what it enables for inline widgets and language switching — would be the first decision made, before building features that depend on editor behavior. Choosing the editor late meant some early work had to be redone rather than extended.

---

## What This Project Proves

CodeAlive demonstrates the ability to design and implement a non-trivial distributed systems concept — Operational Transformation — from scratch, including the WebSocket infrastructure, connection lifecycle, and conflict resolution logic around it. This is graduate-level distributed systems material implemented in a production context, not as an academic exercise.

It also demonstrates deep editor integration work (CM6 extension architecture), pragmatic infrastructure decisions under hosting constraints (the SMTP-blocked mail microservice workaround), and the ability to maintain and evolve a project through a significant architectural migration (textarea/Prism.js to CM6) without abandoning it.

---

## Decisions

**Why build OT from scratch instead of using an existing library (e.g. ShareDB, Yjs)?**
Existing CRDT/OT libraries are general-purpose and carry abstractions for cases CodeAlive doesn't need. Building the OT engine directly meant the conflict resolution logic, room management, and cohost/moderation model could be designed specifically for the snippet collaboration use case, and meant fully understanding the algorithm rather than treating it as a black box dependency.

**Why CM6 over continuing with textarea + Prism.js?**
Prism.js provides syntax highlighting but has no concept of editable, addressable regions within the document — which is required for inline image widgets and for OT to apply operations at specific positions. CM6's StateField/Decoration/ViewPlugin model provides exactly this. The migration cost was real, but the textarea approach had a structural ceiling that would have blocked both the image embedding and collaboration features.

**Why a separate mail microservice over HTTPS instead of SMTP?**
Render blocks outbound SMTP on its standard plans. Rather than changing hosting providers or paying for SMTP relay add-ons, a small separate mail service handles email delivery and is called over HTTPS with API key auth. This keeps the main backend's hosting choice independent of its email requirements.

**Why Redis scoped only to sessions/auth and the collaboration sweeper, with MongoDB for images rather than Redis caching everything?**
Redis is used where its specific properties matter — fast key expiry for sessions and the grace-period sweeper's disconnect tracking. Images are larger, persistent blobs that don't benefit from Redis's in-memory model and fit MongoDB's document storage with LRU eviction better. Each store is used for what it's actually good at rather than centralizing on one for simplicity.