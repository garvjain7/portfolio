---
chunk_id: project_datainsights
tags: [projects, datainsights, ai, data-platform, multi-tenant, saas, rag, ollama, compute-first, data-cleaning, duckdb]
retrieval_triggers: ["DataInsights", "DataInsights.ai", "data platform project", "compute-first architecture", "AI data analysis tool", "multi-tenant SaaS", "data cleaning pipeline", "RAG chatbot project", "natural language data queries", "DataPort connectors"]
summary: "DataInsights.ai is a multi-tenant AI data analysis platform built by Garv Jain, where employees query company datasets in natural language. Its core architectural rule is that the LLM never sees raw data — only a pre-computed structured report — with a 5-step cleaning pipeline and local Ollama models throughout."
---

# DataInsights.ai

## Overview

DataInsights.ai is a multi-tenant platform where companies connect their data sources, run that data through a cleaning pipeline, and let employees query it in natural language — getting answers, summaries, and visualizations without writing SQL or knowing the underlying schema.

The defining architectural decision is that the LLM never operates on raw data rows. Every dataset goes through a cleaning pipeline and a compute-first cognitive engine that produces a structured report — statistics, distributions, relationships — and the LLM's job is to interpret and explain that report, not to generate numbers itself.

This is Garv's personal project, built around the same architectural patterns as a client version he built during his SparkIIT internship — the patterns and design decisions described here are his own.

---

## Problem and Motivation

Non-technical employees at most companies have data they need answers from but no way to query it without involving a data or engineering team. General-purpose AI chat tools can answer questions about data, but when they're given raw rows directly, accuracy becomes unreliable — the model can misread, miscount, or hallucinate over numeric data, which is exactly the kind of mistake that matters most in a business context.

DataInsights.ai's approach is to separate the two problems: data processing (cleaning, computing statistics, structuring) is handled deterministically by code, and the LLM's role is limited to natural language interaction — understanding the question, explaining the pre-computed answer, and handling conversational follow-up. The LLM is a interface layer over computed results, not a computation engine.

---

## Tech Stack and Reasons

**Node.js/Express + FastAPI** — split backend, similar pattern to other projects. Node handles core API, auth, connector management, and multi-tenant routing. FastAPI handles the AI layer — cleaning pipeline orchestration, the cognitive engine, RAG chatbot, and Ollama integration.

**PostgreSQL (self-hosted)** — relational data: users, roles (Admin and Employee), tenant/company records, connector configurations, dataset metadata.

**MongoDB — `data_reports` collection** — stores the structured report produced by the cognitive engine for each dataset. A data report's shape varies depending on the dataset's columns, types, and detected relationships — document storage fits this better than a fixed relational schema would.

**Redis** — caching and session management across tenants.

**Ollama (Llama 3.2, Mistral, Gemma)** — all LLM functionality runs on local models. No external LLM APIs — this matters because the platform handles other companies' business data, and self-hosting models avoids sending tenant data to third-party AI providers entirely.

**DuckDB** — embedded analytical SQL engine used to execute queries against cleaned datasets. DuckDB is well suited to ad-hoc analytical queries over tabular data without needing a separate database server per tenant dataset.

**FAISS** — local vector store for the RAG chatbot, used for retrieval over dataset documentation and conversational context.

---

## Architecture

The pipeline runs in stages. A company connects a data source through DataPort — the connector platform, covering file formats (CSV, Excel, JSON/REST API), databases (PostgreSQL, MySQL), and SaaS tools (Google Sheets, Airtable, Notion, HubSpot, Google Analytics 4), categorized by setup complexity from easy to advanced.

The connected data goes through a 5-step cleaning wizard — handling type detection, missing values, inconsistencies, and other data quality issues, with human checkpoints at steps where automated handling isn't reliable enough on its own.

Once cleaned, the compute-first cognitive engine processes the dataset and produces a structured data report — stored in MongoDB — containing statistics, distributions, and relationships computed deterministically from the data.

When an employee asks a question, an intent classification step determines whether the query needs the RAG chatbot (FAISS-backed, for conversational or documentation-style questions), a DuckDB SQL execution against the cleaned dataset (for specific data queries), or a combination. The LLM receives the data report and/or query results — never raw rows — and generates the natural language response, streamed back via SSE.

---

## Hardest Parts

The hardest part of DataInsights.ai is AI response quality itself — getting the model to answer correctly and usefully given that it only sees the structured report, not the underlying data. The report has to contain enough structure and detail for the LLM to answer a wide range of question types accurately, without the LLM needing to infer or estimate anything the report doesn't explicitly provide. Getting this balance right — a report detailed enough to support good answers without becoming unwieldy — required ongoing iteration as new question types were tested against it.

The second hardest part is the cleaning pipeline. Real-world data has quality issues — inconsistent types, missing values, outliers, ambiguous columns — that can't be handled by a fixed set of rules. Some of these require human judgment (is this outlier a data error or a real extreme value?) or more advanced statistical handling than simple rule-based cleaning can provide. Building a pipeline that handles the common cases automatically while surfacing the ambiguous ones for human review, rather than either over-automating (and silently making wrong decisions) or under-automating (and making every dataset require manual cleaning), was a continuous design problem.

---

## What I Would Do Differently

The structure of the data report — which is what the entire compute-first architecture depends on — evolved iteratively as new question types were tested against the AI layer. Each time a question type the report couldn't support well came up, the cleaning pipeline and cognitive engine sometimes needed revisiting to produce additional fields.

Rebuilding this project, the data report schema would be designed against a broader set of anticipated question types upfront — effectively designing backward from "what should an employee be able to ask" to "what does the report need to contain" — so the cleaning pipeline has a clearer target from the start rather than being extended reactively as gaps in the report are discovered through AI testing.

---

## What This Project Proves

DataInsights.ai demonstrates the ability to design a system around a single hard architectural constraint — the LLM never touches raw data — and carry that constraint through every layer: the cleaning pipeline, the report structure, the query routing, and the response generation. This is the same "let a clear principle guide the system" pattern that shows up in Garv's technical philosophy, applied at the scale of a full data platform.

It also demonstrates multi-tenant SaaS design (connector platform, role-based access, per-tenant data isolation), local-LLM-only AI architecture for data privacy, and building a data cleaning pipeline that balances automation with necessary human judgment.

---

## Decisions

**Why never let the LLM see raw data rows?**
LLMs are unreliable at exact computation over numeric data — they can miscount, misread, or hallucinate values, which is the worst possible failure mode for a business data tool. By making the LLM's role strictly interpretive — explaining numbers that were computed deterministically by code — the numbers themselves are always correct regardless of what the model does with them.

**Why MongoDB for the data report instead of a fixed PostgreSQL schema?**
A data report's structure depends on the dataset it describes — different column types, different detected relationships, different statistics worth surfacing. A fixed relational schema would either need to be extremely wide and mostly-null, or require a new migration for every new kind of report field. A document per dataset, with structure that can vary, fits this naturally while the relational database handles the parts that are genuinely uniform — tenants, users, roles, connector configs.

**Why local Ollama models instead of external LLM APIs?**
The platform processes other companies' business data. Sending that data — even structured reports derived from it — to a third-party LLM API introduces a data handling question for every tenant. Running models locally removes that question entirely, which matters more for a B2B data platform than the capability gap between local and hosted models.

**Why DuckDB for query execution?**
Cleaned datasets need ad-hoc analytical queries — aggregations, filters, group-bys — without provisioning a full database per tenant dataset. DuckDB runs embedded, handles analytical SQL well, and avoids the operational overhead of spinning up and managing a database server for what is often a transient or moderate-sized dataset.

**Why a 5-step wizard with human checkpoints instead of fully automated cleaning?**
Some data quality decisions — whether an outlier is an error or a real value, whether a column means what its name suggests — require context an automated pipeline doesn't have. A fully automated pipeline would either make these calls silently (risking wrong decisions baked into the report) or refuse to handle them. Human checkpoints at the points where judgment matters most keep the pipeline reliable without requiring manual cleaning for the parts that don't need it.