---
chunk_id: project_uiaudit
tags: [projects, uiaudit, ai-agent, playwright, ui-evaluation, nielsen-heuristics, fastapi, postgresql, browser-automation, vision-models, experimental-agent]
retrieval_triggers: ["UIAudit", "UI audit agent", "website usability testing AI", "Nielsen heuristic evaluator", "agent-based UI analysis", "browser automation UI evaluation", "Garv UI audit project"]
summary: "UIAudit is an experimental agent-based system that evaluates public websites using browser automation and AI reasoning against Nielsen’s 10 usability heuristics, generating structured scores, insights, and improvement suggestions."
---

# UIAudit

## Overview

UIAudit is an experimental agent-based system that evaluates the usability of public websites by automatically opening them in a browser environment, observing their UI through screenshots, DOM structure, and HTML source, and analyzing them against Nielsen’s 10 usability heuristics.

The system is designed as a reasoning agent rather than a static analyzer — it does not simply extract features from a page, but actively decides how to observe and interpret a website before generating structured usability insights, scores, and improvement suggestions.

The project is built as a research-driven prototype exploring how far LLM-based agents can reliably perform UI/UX evaluation without hallucination or over-interpretation.

---

## Problem and Motivation

Traditional UI/UX testing is either manual (expert-driven heuristic evaluation) or rule-based automation that lacks semantic understanding of design intent. Both approaches fail to scale or generalize across diverse modern web interfaces.

UIAudit explores a third direction: an AI agent that can independently visit a website, observe its structure visually and structurally, and reason about usability using established heuristics.

The core motivation is to answer a deeper question:

*Can an AI system reliably perform structured UX evaluation without human bias, while still grounding every judgment in observable UI evidence?*

This becomes especially challenging because LLMs tend to hallucinate UI elements or over-generalize from incomplete observations.

---

## Tech Stack and Reasons

**HTML / CSS / JavaScript** — frontend interface for submitting URLs and viewing audit results. Kept minimal to focus on agent output rather than UI complexity.

**FastAPI (Python)** — backend core handling agent orchestration, API requests, and response streaming. Chosen for its simplicity and strong async support.

**PostgreSQL** — persistent storage for audit sessions, scores, heuristic breakdowns, and generated reports. Enables historical comparison of UI audits across versions of a site.

**Browser Automation Layer (agent-driven)** — headless browser controlled by the agent to load pages, capture screenshots, extract DOM structure, and retrieve HTML source when needed. This layer acts as the agent’s “eyes and hands.”

**LLM-based reasoning engine** — used to interpret collected UI evidence and map it to Nielsen heuristics, ensuring structured evaluation instead of free-form commentary.

---

## Architecture

UIAudit is structured as an iterative agent pipeline rather than a single-pass inference system.

**Input Layer**
- User submits a public website URL through the chatbot or UI interface.
- URL is validated to ensure it is accessible and not a local/private resource.

**Observation Layer (Browser Agent)**
- The agent launches a headless browser session.
- It navigates to the URL and collects:
  - Full-page screenshots
  - DOM tree structure
  - Raw HTML source (when accessible)
- These observations form the grounding dataset for reasoning.

**Agent Decision Layer**
- The agent evaluates whether current observations are sufficient.
- It can decide to:
  - Re-render or re-capture screenshots
  - Inspect specific DOM regions
  - Revisit page states if dynamic content is detected

This decision-making process is the most critical part of the system, as it determines whether the evaluation remains grounded or drifts into hallucinated assumptions.

**Evaluation Layer**
- Observations are mapped against Nielsen’s 10 usability heuristics:
  - Visibility of system status
  - Match between system and real world
  - User control and freedom
  - Consistency and standards
  - Error prevention
  - Recognition rather than recall
  - Flexibility and efficiency of use
  - Aesthetic and minimalist design
  - Help users recognize, diagnose, and recover from errors
  - Help and documentation

Each heuristic is individually scored and justified using observed evidence.

**Output Layer**
- Structured audit report generated with:
  - Per-heuristic scores
  - Detected usability issues
  - Improvement suggestions
- Response is streamed back via chatbot interface and rendered in UI
- Results are stored in PostgreSQL for historical tracking and comparison

---

## Hardest Parts

The most difficult aspect of UIAudit is not browser automation or UI parsing — it is the agent’s decision-making process.

The system must decide:
- what to observe next
- when enough evidence has been collected
- how to avoid over-interpreting incomplete UI signals
- how to prevent hallucination when UI elements are partially visible or dynamically rendered

Unlike deterministic systems, the agent must continuously balance exploration and reasoning. A wrong decision early in the observation loop can lead to entirely incorrect usability conclusions.

Ensuring that the model stays grounded in screenshots and DOM evidence, rather than inferred assumptions about the website, is the central research challenge of the project.

---

## What I Would Do Differently

The current design treats the agent as a single reasoning loop controlling observation and evaluation. In practice, this leads to tight coupling between perception and reasoning.

If rebuilt, the system would benefit from a clearer separation between:
- observation engine (pure data extraction from browser)
- reasoning engine (heuristic evaluation layer)
- validation layer (hallucination checks against DOM/screenshot grounding)

This separation would make the system more stable and reduce the risk of overconfident or ungrounded UI interpretations.

---

## What This Project Proves

UIAudit demonstrates the feasibility of building agentic systems that can perform structured UX evaluation using only visual and structural web data.

It shows ability in:
- designing browser-driven AI agents
- grounding LLM reasoning in real UI evidence
- applying formal UX frameworks (Nielsen heuristics) programmatically
- building multi-layer evaluation pipelines using Python and FastAPI
- handling one of the core challenges in agent systems: hallucination control through observation constraints

---

## Decisions

**Why use an agent-based loop instead of a single-pass LLM evaluation?**
A single-pass model would require compressing the entire webpage into one context window, leading to loss of structural detail and higher hallucination risk. The agent loop allows incremental observation and controlled evidence gathering, which improves grounding and reduces incorrect UI assumptions.

**Why Nielsen’s 10 heuristics as the evaluation framework?**
Nielsen heuristics provide a well-established, research-backed structure for usability evaluation. Using them ensures the system’s output is aligned with industry-standard UX evaluation practices rather than arbitrary scoring criteria.

**Why store results in PostgreSQL instead of ephemeral reports?**
UI audits are inherently comparative over time. Persisting results allows tracking UI improvements, regressions, and version-based comparisons of websites, which is critical for meaningful usability analysis beyond one-time evaluation.

**Why separate browser observation from LLM reasoning?**
Direct coupling of browser extraction and reasoning increases hallucination risk. Separating observation (screenshots/DOM/HTML) from reasoning ensures the model always operates on explicit evidence rather than inferred UI structure.

**Why is agent decision-making the hardest component?**
Because the system must dynamically decide what additional information is needed to form a valid judgment. Unlike static pipelines, this introduces uncertainty in control flow, where incorrect decisions early in the observation stage can cascade into incorrect usability evaluation results.  