---
chunk_id: project_complysense
tags: [projects, complysense, grc, compliance, saas, rbac, ai, university, risk-management, DPDP, ISO, NIST]
retrieval_triggers: ["ComplySense", "GRC platform", "compliance SaaS", "university compliance", "Indian regulatory compliance", "DPDP Act", "ISO 27001", "NIST CSF", "RBAC platform", "technical lead project"]
summary: "ComplySense is an AI-enabled GRC and compliance platform for Indian universities, led technically by Garv Jain. It maps regulatory frameworks into a role-based SaaS product with AI workflows and enterprise compliance support."
---

# ComplySense

## Overview

ComplySense is an AI-enabled risk analysis and compliance platform built for Indian universities. It brings security-related and regulatory compliance work — which is normally scattered across departments, spreadsheets, and physical audit visits — onto a single platform, with role-based access for the different people involved and AI capabilities tailored to what each role actually needs day to day.

Garv is the sole technical lead on ComplySense — responsible for the overall architecture, the role-based access design, the AI capability design, and direction for the implementation team. This is his most complex professional engagement to date and is ongoing as part of his second STPI internship.

---

## Problem and Motivation

Universities in India are subject to multiple overlapping regulatory and security obligations — data protection requirements, IT security and incident reporting rules, and accreditation standards — alongside increasing exposure to international standards like ISO and NIST for research collaborations. In practice, this work is handled in a fragmented way: different departments track different requirements separately, evidence is collected manually, and much of the actual verification happens through physical audit visits rather than continuous monitoring.

ComplySense's premise is that this should be a continuous, platform-based process rather than a periodic, physical one. Different roles within a university — security staff, compliance officers, department heads, auditors, leadership — each interact with the same underlying compliance data, but through views and AI assistance suited to their specific responsibilities.

---

## Tech Stack and Reasons

**FastAPI + async SQLAlchemy ORM** — core backend, handling the relational compliance data: users, roles, departments, controls, evidence records, and audit trails. Async chosen for consistency across a system with many concurrent role-based dashboards.

**PostgreSQL** — primary relational store for structured compliance and access-control data.

**MongoDB** — used for the compliance control library, where flexibility in how a single control maps to multiple regulatory requirements is more naturally represented as documents than as rigid relational tables.

**Redis** — caching and session management across role-based dashboards.

**Ollama (local LLM only)** — every AI capability in ComplySense runs on locally hosted models. No external API calls. This is a data sovereignty requirement — university data, including security incident details, cannot leave institutional infrastructure.

**React + Vite** — frontend, with role-specific dashboards and views.

---

## Architecture

The platform is structured around three layers: a relational schema for compliance and access-control data, a document-based control library that maps the platform's supported regulatory frameworks to a shared set of controls, and a role-based access layer that determines which dashboards, pages, and AI capabilities each user sees.

Administrators have a dedicated interface for managing platform configuration and the control library directly, since regulatory frameworks change over time and the library needs to be updated without a full deployment cycle.

---

## Role-Based AI Design

The core differentiator in ComplySense is that AI assistance is designed around what each role's actual daily bottleneck is, rather than exposing one general chatbot across the platform.

For example, security staff responsible for incident response get AI assistance drafting the structured reports required under tight regulatory reporting deadlines — work that is normally a time-pressured manual drafting exercise. Compliance staff get AI-assisted triage of daily control alerts, distinguishing likely false positives from issues that need attention, plus assistance translating new regulatory text into concrete internal controls. Department-level staff, who are often not compliance specialists, get plain-language translations of technical requirements into concrete tasks, along with a pre-submission check that verifies uploaded evidence actually satisfies what's being asked before it's submitted. Auditors get AI-assisted sampling that highlights higher-risk areas to review rather than relying on purely random sampling, plus drafting support for findings based on prior audit material. Leadership and oversight roles get a conversational interface for asking natural-language questions about the institution's compliance posture instead of consuming static reports.

Each of these is scoped to a real, recurring task that role performs — the goal is that AI measurably changes how that role spends their day, not that AI is present everywhere in a shallow way.

---

## Adoption Strategy

A common failure mode for compliance platforms is that they only get used right before an audit. ComplySense is designed around daily relevance instead — each role gets a personalized summary of their priority items, generated from their own data, so the platform surfaces value without requiring users to remember to check it.

Feature priority follows the same logic: capabilities that solve acute, time-pressured problems institutions already face — like incident reporting deadlines and policy approval bottlenecks — are prioritized early, because they create daily relevance regardless of how much of the broader platform an institution has adopted yet.

---

## Hardest Parts

The hardest part of ComplySense has been designing AI capabilities that are genuinely useful per role while running entirely on local models. Local LLMs are meaningfully less capable than hosted frontier models, so each AI capability — drafting, triage, translation, conflict detection — had to be scoped to something a local model can do reliably, rather than designing capabilities around what a larger hosted model could do and hoping a local model would keep up. This shaped which AI features were prioritized and how each one was framed — narrower, well-defined tasks rather than open-ended generation.

A second difficulty was the role design itself — understanding enough about how compliance responsibilities are actually distributed across a university to map AI capability to real daily bottlenecks for each role, rather than designing a generic permission system and adding AI as an afterthought.

---

## What I Would Do Differently

The mapping between roles, their daily workflows, and the specific AI capability each one gets was developed substantially alongside implementation rather than being fully formalized ahead of it. Rebuilding this project, that mapping — which role needs what, scoped to what a local model can realistically deliver — would be the first artifact produced, with the backend schema and AI service boundaries designed around it from the start rather than evolving toward it.

---

## What This Project Proves

ComplySense demonstrates the ability to lead architecture and a team on a system that combines relational and document-based data modeling, role-based access control, and AI capability design — all under a hard constraint that AI must run entirely on local infrastructure.

It also demonstrates product thinking beyond pure implementation: designing AI assistance around what each role in a real organization actually does day to day, and prioritizing features based on which problems create immediate value versus which require broader platform adoption first.

---

## Decisions

**Why build one unified platform instead of separate tools per regulatory framework?**
Universities already deal with overlapping requirements across data protection, IT security, and accreditation standards using disconnected tools and manual processes. A single platform where the same underlying compliance data serves multiple frameworks reduces duplicated evidence collection and gives a unified view of institutional risk, rather than requiring separate audits and separate systems of record per framework.

**Why role-specific AI capabilities instead of one general assistant?**
Different roles have fundamentally different daily bottlenecks — a department head's problem is understanding what's being asked of them, while a security officer's problem is producing a structured report under a deadline. A single general assistant would be mediocre at all of these. Scoping AI to each role's actual recurring task means it changes how that role works, rather than being a generic feature nobody relies on.

**Why local-only LLMs instead of hosted APIs?**
University data — including security incident details and student-related information — cannot leave institutional infrastructure under data protection requirements. Rather than using hosted APIs with carve-outs for sensitive data, the constraint was applied to all AI features uniformly. This is a harder constraint to design around, since local models are less capable, but it removes an entire category of compliance risk for the platform itself — which matters for a compliance product specifically.

**Why prioritize daily-relevance features over building out the full control library first?**
Adoption is the biggest risk for any compliance platform — if it's only opened during audits, it provides little ongoing value. Features that address problems institutions already face on an ongoing basis, regardless of how much of the platform they've adopted, were prioritized to establish daily usage habits early.