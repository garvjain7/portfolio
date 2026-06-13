---
chunk_id: project_scanvista
tags: [projects, scanvista, three.js, react, node.js, postgresql, ar, ai, qr, 3d, product-visualization]
retrieval_triggers: ["ScanVista", "QR to 3D", "product visualization", "AR project", "Three.js project", "Garv's best project", "3D viewer", "model viewer"]
summary: "ScanVista is a QR-to-3D product visualization platform built by Garv Jain as technical lead. Scanning a QR code launches a full 3D product viewer in the browser with AR support, bulk import, analytics, and an AI product intelligence layer."
---

# ScanVista

## Overview

ScanVista is a platform where scanning a product's QR code launches a full 3D visualization experience in the browser. Businesses can upload GLB 3D models for their products, generate QR codes, and let customers view, rotate, zoom, and place products in AR directly from their phone — no app install required.

Built as technical lead at SparkIIT internship. Two-person team. Garv owns the full architecture and implementation.

**Status:** Deployed on render and vercel. Stack locked, features complete.

---

## Problem and Motivation

Physical retail and e-commerce both suffer from the same problem: customers cannot properly evaluate a product before purchase from a flat image. 3D visualization and AR have existed as solutions for years but remained inaccessible to small and medium businesses because they required custom app development or expensive platforms.

ScanVista's premise is that a QR code is already on most physical products. Using it as the entry point to a 3D experience removes the friction entirely — no app, no separate link, no special hardware. Scan, see the product in 3D, place it in your space via AR.

---

## Tech Stack and Reasons

**React + Vite** — frontend, fast dev build, familiar ecosystem for the team.

**Three.js + React Three Fiber** — 3D product viewer. R3F chosen over plain Three.js for component-based scene management and easier integration with React state. The 38/62 split layout (controls left, canvas right) is driven by the canvas needing dominant screen space for the 3D experience.

**@google/model-viewer** — AR visualization on mobile. Chosen specifically because it handles the WebXR/ARCore/ARKit complexity internally. AR is used only for the viewer experience — model-viewer handles the AR layer, R3F handles the interactive 3D viewer.

**Node.js + Express** — primary backend. Raw pg library with parameterized SQL — no ORM. Chosen for direct query control and explicit ownership checks without abstraction overhead.

**PostgreSQL on Neon** — primary database. Multi-tenant schema with project-level isolation. QR codes generated and stored immediately on product creation.

**Supabase Storage** — GLB model and asset storage. Chosen for S3-compatible API, generous free tier, and built-in CDN for model delivery.

**Redis** — caching layer for product and project data. Reduces database hits on the viewer path which is the highest-traffic route.

**Python FastAPI — AI microservice** — separate service handling product intelligence. Kept separate from the Node backend intentionally — AI workloads have different scaling and dependency requirements than the core API.

---

## Architecture

The system splits into three layers:

**Core platform** — Node.js/Express handles auth, product management, project management, QR generation, and analytics. All queries are raw parameterized SQL with ownership checks embedded in the query itself rather than checked in application logic after fetching.

**Viewer** — React Three Fiber canvas renders the 3D model with lighting, camera controls, and zoom. model-viewer handles AR separately. The viewer is the public-facing surface — it loads from a QR scan without requiring authentication.

**AI microservice** — FastAPI service providing three capabilities: product recommendations based on category and attributes, product explanation generation for viewer display, and AR spatial narration guiding users through the AR experience. The microservice is called from the Node backend — the frontend never calls it directly.

Auth uses JWT with httpOnly refresh token rotation. Projects contain products. Products have models, QR codes, analytics, and AI-generated content. Bulk import handles CSV/Excel with two-gate validation — format validation first, business logic validation second — and chunked database insertion at 10 rows per chunk to avoid large transaction locks.

---

## Hardest Parts

**Three.js zoom system** — the initial zoom implementation used the default OrbitControls zoom which zooms toward the camera position rather than the model center. On non-centered models this caused the camera to drift away from the object entirely. Required implementing a custom zoom-to-target function that calculates the model's bounding box center and zooms toward that point regardless of camera position.

**Bulk import pipeline** — the two-gate validation requirement meant building a stateful import session: parse the file, validate format, show errors, allow correction, validate business logic against the database (duplicate detection, project ownership), then insert in chunks. Managing this as a clean state machine without leaking partial state between gates required careful design of the import session lifecycle.

**GLB model delivery performance** — large GLB files over Supabase Storage caused slow initial load on the viewer. Addressed through Redis caching of model metadata and pre-signed URLs, and lazy loading of model components within the R3F scene.

---

## What I Would Do Differently

The AI microservice boundary is the main thing. During development the microservice was added after the core platform was largely built, which meant some AI-related data — product attributes used for recommendations — was structured primarily for the core platform rather than for what the AI service actually needed. The result is that the microservice does more data transformation than it should.

Rebuilding today, the AI service's data requirements would be defined before the product schema is finalized, so the data structures serve both layers cleanly from the start rather than the AI layer adapting to what already existed.

The Three.js zoom issue was discovered late and required touching code that had already stabilized. Camera behavior should be validated against edge cases — non-centered models, extreme aspect ratios — earlier in development rather than after the viewer is otherwise complete.

---

## Engineering Growth
ScanVista reinforced several lessons.
The first was the importance of defining service boundaries before AI functionality is introduced. The second was validating edge cases early for user-facing interaction systems such as camera controls. The third was recognizing that infrastructure and data models should be designed around actual consumer requirements rather than assumptions about future usage.
Many of these lessons later influenced architectural decisions in DataInsights.ai and other projects.

---

## Current Status

Deployed on render and vercel. Completed features: full auth system, product and project management, 3D viewer with corrected zoom, AR via model-viewer, bulk CSV/Excel import with two-gate validation, QR code generation, analytics (7-card product analytics + separate project analytics page), AI product intelligence (recommendations, explanations, AR narration), incomplete products page for attaching GLB models post-import.

---

## What This Project Proves

ScanVista demonstrates Garv's ability to own a complete production system end to end — architecture, backend, 3D frontend, AI integration, and deployment — as technical lead on a real product with a real use case. It is not a tutorial project or a learning exercise. It is a product with a defined market, a complete feature set, and a deployment timeline.

Specifically it demonstrates: Three.js/R3F depth beyond basic scene setup, multi-tenant PostgreSQL schema design, Redis caching strategy on high-traffic routes, AI microservice architecture, and the ability to manage a two-person team while remaining the primary implementer.

---

## Decisions

**Why not a single backend (Node + Python together)?**
AI workloads — model loading, inference, embedding generation — have different memory and CPU profiles than API request handling. Keeping them in separate processes means the AI service can be scaled, restarted, or replaced independently without affecting the core API. It also keeps Python dependencies out of the Node environment entirely.

**Why raw pg over an ORM in Node?**
Ownership checks in ScanVista need to be embedded in queries — a product fetch should only return results the authenticated user owns, enforced at the SQL level. ORMs make this harder to guarantee without careful configuration. Raw parameterized SQL makes the ownership condition explicit and auditable in every query.

**Why model-viewer for AR instead of building on WebXR directly?**
WebXR device API differences between ARCore (Android) and ARKit (iOS) require significant platform-specific handling. model-viewer abstracts this entirely and is maintained by Google. For AR that is a viewer feature rather than a core product capability, this tradeoff is straightforward — use the maintained abstraction, invest effort in the 3D experience instead.

**Why chunked insertion at 10 rows for bulk import?**
Large single transactions on Neon's serverless PostgreSQL can hit connection timeout limits under load. 10-row chunks keep each transaction short, allow partial success reporting per chunk, and make retry logic granular. The tradeoff is more round trips — acceptable at import scale where throughput matters less than reliability.

**Why project_id from route param only, never from request body?**
Prevents a class of insecure direct object reference vulnerabilities where a user could submit a product to a project they do not own by manipulating the request body. The route param is validated against the authenticated user's project ownership before any operation proceeds.