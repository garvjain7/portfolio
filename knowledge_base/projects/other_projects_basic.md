---
chunk_id: other_projects_basic
tags: [projects, basic, small-projects, experiments, games, browser-extension, cli-tools, web3, mini-projects]
retrieval_triggers: ["basic projects Garv", "side projects", "small projects", "web games", "browser extension", "command line tool", "web3 onboarding", "mini hackathon project"]
summary: "A concise inventory of smaller personal projects by Garv Jain, including browser experiments, games, CLI tools, web utilities, and hackathon prototypes."
---

# Smaller Projects and Experiments

These are smaller-scope builds compared to the core projects — mostly single-file or single-purpose, built to explore a specific idea, tool, or interaction model rather than as full products.

---

## Elastic Strings

### One-line identity
A single-file browser experience where hand movements in front of a webcam pluck and snap glowing virtual strings.

### Core system idea
Single HTML file using MediaPipe Hands for real-time hand tracking through the webcam. Hand positions drive neon glow "strings" rendered on canvas with Bézier-curve physics — strings stretch, snap, and trigger particle bursts and shockwave effects. Web Audio API generates sound feedback tied to string interactions.

### Tech stack
HTML, CSS, JavaScript (single file), MediaPipe Hands, Canvas, Web Audio API

### Why it matters
Real-time computer vision in the browser with no backend, custom physics/animation without a game engine, and audio-visual feedback synced to vision input.

---

## Pygame Project — Unpredictability-Driven Game

### One-line identity
A 2-level Pygame project where the core design goal is that the player can't predict what happens next.

### Core system idea
Instead of levels built around learnable patterns, each level is designed so outcomes and events break expectation — the player can't rely on memorization or anticipation, only reaction.

### Tech stack
Python, Pygame

### Why it matters
Basic game loop and level design practice, with the design constraint itself — unpredictability — as the main exercise.

---

## Solar System Simulation

### One-line identity
Physics-based 3D solar system simulation combining Pygame and OpenGL.

### Core system idea
Planetary orbits are driven by real orbital/gravitational physics calculations rather than hardcoded paths, rendered in 3D via PyOpenGL with Pygame handling the window and input loop.

### Tech stack
Python, Pygame, OpenGL (PyOpenGL)

### Why it matters
Combines basic 3D graphics rendering with physics simulation — orbital mechanics math feeding directly into a real-time render loop.

---

## System Design Study Notes

A small set (~5) of single-page HTML/CSS/JS write-ups, each working through one system design concept in depth for personal understanding — including designing a proper "delete" system (soft delete, cascades, recovery) and the system design behind CodeAlive's real-time collaboration feature. Built as study material rather than a product; not elaborated further here.

---

## AccessFlow

### One-line identity
A Microsoft Edge extension that applies accessibility overrides to any website.

### Core system idea
A content script injects CSS/DOM overrides into the active page — larger text, increased line spacing, dark mode, a dyslexia-friendly font, hiding images, and highlighting links — toggled through the extension's popup UI.

### Tech stack
JavaScript (browser extension — content script + popup)

### Why it matters
Practical browser extension development: DOM manipulation across arbitrary third-party sites, plus accessibility-focused feature design.

---

## KaraVerse

### One-line identity
A terminal CLI that shows lyrics for whatever's currently playing on Spotify, with interactive color and visual styling.

### Core system idea
Pulls the currently-playing track from the Spotify API and renders its lyrics directly in the terminal with colored, visual styling — removing the need to switch out of the editor/terminal to check what's playing.

### Tech stack
Python, Spotify API, terminal UI rendering

### Why it matters
Solves a real workflow annoyance (context-switching to check lyrics) through API integration and terminal UI design.

---

## ChainLit

### One-line identity
A web3 onboarding playground for Web2 users, built around a smart contract demo (hackathon project).

### Core system idea
A React frontend walks Web2 users through a smart contract demo as a low-stakes introduction to web3 concepts, aimed at onboarding without risking real funds — kept deliberately basic given the hackathon timeframe.

### Tech stack
React, smart contract (web3/testnet)

### Why it matters
Hands-on exposure to web3/smart contract integration from the frontend side, built under hackathon time constraints.