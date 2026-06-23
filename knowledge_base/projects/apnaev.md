---
chunk_id: project_apnaev
tags: [projects, apnaev, leaflet, maps, geospatial, ev, solo-project, internship, STPI]
retrieval_triggers: ["ApnaEV", "EV charging station app", "charging station finder", "Jaipur EV app", "Leaflet map project", "location-based app", "geospatial app", "electric vehicle app", "STPI internship project"]
summary: "ApnaEV is an EV charging station discovery platform for Jaipur, built solo by Garv Jain during his first STPI internship. It combines Leaflet mapping, geospatial routing, and a dark utilitarian UI for electric vehicle users."
---

# ApnaEV

## Overview

ApnaEV is an electric vehicle charging station discovery platform built for Jaipur. It helps users locate nearby charging stations, view station details, and get route-related information to plan EV travel with more confidence. The interface is built around an interactive map — station markers, search and filtering, a slide-in details drawer, and a route info strip.

Built solo over 45 days during Garv's first STPI internship — his first complete end-to-end product, from problem framing through a working deployed interface, without a team.

---

## Problem and Motivation

Range anxiety — uncertainty about whether charging infrastructure will be available when needed — is a real barrier to EV adoption, and it's worsened when the infrastructure that does exist isn't easy to find or evaluate. For a city like Jaipur, charging stations exist but information about their location, availability, and accessibility isn't presented in a way that helps someone actually plan a trip around them.

ApnaEV's goal was to make that information accessible through a single map-based interface — see what's around you, get details on a specific station, and understand routes well enough to plan a charging stop rather than discovering one is needed mid-trip.

---

## Tech Stack and Reasons

**HTML, CSS, JavaScript** — built without a frontend framework. For a 45-day solo project with a map-centric UI, a framework's component overhead wasn't necessary — the interface is driven primarily by map state and a handful of UI panels.

**Leaflet** — the mapping library. Chosen over commercial mapping APIs (Google Maps, Mapbox) because it's open-source, has no API key or billing requirement, and is lightweight enough for a project with no infrastructure budget. Leaflet handles the map rendering and marker layers; everything else — station data, search, drawer UI — is custom.

**CSS custom properties** — used to drive the dark utilitarian theme consistently across the interface, making it straightforward to adjust the visual system without rewriting component styles individually.

**Backend** — a lightweight API serving station data, search, and route-related information to the frontend, with station data integrated from external sources rather than hardcoded.

---

## Architecture

The interface centers on the Leaflet map, with EV station locations rendered as markers. A step-locking flow guides users through the core task — selecting a starting point, viewing nearby or route-relevant stations, and getting station details — one step at a time rather than presenting every control simultaneously, with visual states and toast notifications indicating progress.

Selecting a station opens a slide-in drawer with station details, while a floating route info strip surfaces route-relevant information without requiring navigation away from the map. The map remains the persistent context throughout — details and controls layer on top of it rather than replacing it.

---

## Hardest Parts

The hardest part of ApnaEV wasn't implementation — Leaflet's API for markers, layers, and popups is straightforward. The hard part was conceptual: understanding how location-aware applications represent geography well enough to provide route-related information, not just station pins on a map.

This pushed Garv into territory beyond the visible feature — exploring how mapping systems represent road networks, how routing engines model connectivity between points, and what's actually involved in going from "here are some markers" to "here's a sensible route between them." ApnaEV's scope didn't require building a routing engine, but understanding how one would work was necessary to make sensible decisions about what route information to surface and how.

---

## What I Would Do Differently

As the first complete solo project, ApnaEV's data model — how station information and route data were structured — evolved alongside the UI rather than being planned upfront. This worked for a 45-day scope, but later projects benefited from defining data structures before UI work began, specifically because ApnaEV showed what happens when UI decisions implicitly shape data structure rather than the other way around.

Rebuilding it, the station and route data model would be defined first, independent of how the map UI presents it — making the data layer reusable if the UI changed, rather than the two being tightly coupled.

---

## What This Project Proves

ApnaEV demonstrates the ability to take a real-world problem — EV charging visibility — and ship a complete, usable product solo within a fixed timeline, covering frontend, backend, external data integration, and UI design without team support.

It also marks a turning point in how Garv approaches projects: the point where a feature-focused build (show stations on a map) led naturally into systems-level questions (how do location-aware applications represent and reason about geography) — a pattern that became consistent across his later projects.

---

## Decisions

**Why Leaflet over Google Maps or Mapbox?**
Both alternatives require API keys and have usage-based billing, which doesn't fit a solo internship project with no budget. Leaflet is open-source, free, and sufficiently capable for marker-based station display and basic interaction — the project didn't need the more advanced features (traffic data, street view) that commercial APIs offer.

**Why a step-locking flow instead of presenting all controls at once?**
EV route planning involves several pieces of information — starting point, nearby stations, route details — that build on each other. Presenting all of this simultaneously on a map-based interface would be visually cluttered. Locking the flow to one step at a time, with clear visual state and toast feedback, keeps the interface usable on what is fundamentally a small-screen, map-dominant layout.

**Why a slide-in drawer for station details rather than a separate page?**
The map is the primary context — losing it when viewing station details would mean re-orienting every time a user goes back. A drawer keeps the map visible and interactive while details are shown alongside it, which matters specifically for location-based interfaces where spatial context is the point.

**Why a dark utilitarian visual design?**
The interface is something people would realistically check while traveling or outdoors — a dark UI reduces glare and is easier to read in varied lighting, and a utilitarian visual language fits a tool meant for quick reference rather than a leisure browsing experience.