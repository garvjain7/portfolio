---
chunk_id: other_projects_advanced
tags: [projects, experimental-systems, ai-applications, backend-systems, machine-learning, distributed-systems, computer-vision, fastapi, python, system-design-experiments]
retrieval_triggers: ["advanced projects Garv", "experimental AI systems", "distributed systems experiments", "ScamShield tool", "SimonSays AI vision game", "typing sentiment analysis system", "keylogger research system", "LinkedUp terminal LinkedIn project"]
summary: "Compressed inventory of experimental and advanced engineering systems spanning AI applications, distributed systems experiments, computer vision games, behavioral analytics, and backend prototypes."
---

# Advanced Engineering Systems Inventory

This file contains compressed representations of experimental and supporting systems built to explore AI applications, system design tradeoffs, computer vision interaction models, and distributed backend behaviors. These are not core deep-dive projects, but represent breadth of engineering capability across multiple domains.

---

## Python Input Behavior Reconstruction System

### One-line identity
Keyboard event logging and reconstruction system for analyzing user typing behavior across sessions and application contexts.

### Core system idea
Captures low-level keyboard events and reconstructs meaningful typed input by interpreting editing actions like backspace, delete, shift usage, and context switching. Groups events into structured sessions tied to active application windows, enabling behavioral analysis over time instead of raw key streams.

### Tech stack
Python, system event hooks, FastAPI, HTML/CSS/JS dashboard layer, OS-level input libraries

### Key engineering decisions
- Session-based grouping instead of raw event storage to improve analytical structure  
- Reconstruction logic built to simulate actual typed output rather than raw keystroke logs  
- Application/window context tagging to separate multi-task behavior streams  
- Centralized encrypted logging pipeline for structured storage and retrieval  

### Why it matters
Demonstrates low-level event processing, behavioral reconstruction logic, and multi-session data modeling under system constraints.

---

## Typing-Based Sentiment and Behavior Analysis System

### One-line identity
Real-time typing behavior analysis system that predicts user emotional/intent state using pre-trained ML models and rule-generated datasets.

### Core system idea
A browser-based frontend captures typing dynamics and behavioral signals during input. These signals are processed through a pre-trained API-driven ML model trained on synthetic and rule-generated datasets. The system outputs a prediction with reasoning and displays it in a gamified UI experience.

### Tech stack
Python, FastAPI, JavaScript, HTML/CSS, ML API models, custom training pipeline

### Key engineering decisions
- Hybrid dataset approach using rule-generated + trained data to simulate behavioral diversity  
- API-based inference separation for decoupled frontend interaction  
- Feature extraction done in real-time at browser level for low latency feedback  
- Gamified UI layer used to reduce cognitive friction and improve engagement  

### Why it matters
Shows ability to design real-time behavioral ML systems and integrate frontend signal capture with backend inference pipelines.

---

## ScamShield — Internship / Fraud Detection Assistant

### One-line identity
AI-assisted scam detection system for analyzing internship/job authenticity using OCR, web search, and ML-based scoring.

### Core system idea
ScamShield extracts textual content from job or internship postings using OCR, then enriches this data through web search signals (reviews, company presence, reputation signals). A scoring engine combines ML classification with rule-based heuristics to determine risk level and explain reasoning to the user.

### Tech stack
Python, FastAPI, OCR libraries (Tesseract/EasyOCR style), web scraping tools, HTML/CSS/JS frontend

### Key engineering decisions
- Hybrid evaluation model combining ML prediction with deterministic rule-based scoring  
- OCR-first pipeline to handle image-based scam postings  
- Web enrichment layer used to validate external reputation signals  
- Explanation-first output design instead of binary classification  

### Why it matters
Demonstrates applied ML + OSINT-style data fusion for real-world trust and safety systems.

---

## SimonSays AI Vision Game System

### One-line identity
Real-time computer vision game engine where AI-generated instructions are validated through live camera-based user interaction.

### Core system idea
The system generates Simon Says style instructions dynamically. A webcam-based OpenCV engine continuously monitors user actions and validates compliance with instructions in real time. Game state is paused or resumed based on detected user visibility and movement clarity.

### Tech stack
Python, OpenCV, FastAPI, JavaScript frontend, real-time video processing

### Key engineering decisions
- Frame-by-frame processing for real-time interaction validation  
- AI-driven instruction generation instead of static rule set  
- Game state pause/resume logic based on visibility confidence  
- Lightweight vision pipeline optimized for continuous webcam feed  

### Why it matters
Shows real-time computer vision integration with interactive game logic and AI-driven instruction systems.

---

## Distributed Shard Counter Experiment

### One-line identity
High-concurrency distributed counter system designed to evaluate performance of sharded write architectures under heavy load.

### Core system idea
Instead of maintaining a single counter for high-frequency events (likes/views), the system distributes increments across multiple dynamically created shards. These shards are periodically aggregated into a final value, reducing contention on a single database write path. The system was stress-tested under simulated high concurrency (50k–500k operations).

### Tech stack
Python, PostgreSQL, load simulation scripts, backend aggregation logic

### Key engineering decisions
- Sharded write model instead of single counter to eliminate write bottlenecks  
- Dynamic shard creation to balance load distribution automatically  
- Periodic aggregation instead of real-time atomic updates  
- Load simulation used for empirical validation instead of theoretical assumption  

### Why it matters
Demonstrates distributed systems thinking applied to high-frequency write optimization and database contention reduction.

---

## LinkedUp — Terminal-Based Professional Network Model

### One-line identity
Object-oriented terminal simulation of a LinkedIn-style professional networking system.

### Core system idea
A CLI-based application modeling core professional networking features such as profiles, connections, and interactions using object-oriented design principles. Built to simulate platform logic without frontend complexity, focusing on system structure and relationship modeling.

### Tech stack
Python, OOP design patterns, terminal interface logic

### Key engineering decisions
- Terminal-first design to isolate backend logic from UI complexity  
- OOP modeling of users, connections, and interactions  
- Minimal interface approach to focus on system behavior over presentation  
- Modular structure to simulate scalable social graph logic  

### Why it matters
Demonstrates object modeling, system abstraction, and backend logic design without UI dependency.

---