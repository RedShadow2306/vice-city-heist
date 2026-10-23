---
name: devops-pipeline
description: >-
  Standardized 5-Phase DevOps and Full-Spectrum Verification System. Enforces deep research using state-of-the-art models (Gemini 4 Argon, Gemini 3.1 Pro Deep Think, Nvidia Nemotron 3.5 Super VL), architectural planning logged in TASK_LOG.md, clean engineering development, exhaustive testing through all levels without superficial shortcuts, and automatic CI/CD git delivery.
---

# 🚀 DevOps Pipeline & Full-Spectrum Verification Runbook

This skill guides the agent through end-to-end execution of any software engineering task, strictly adhering to the 5-phase DevOps standard established for high-stakes, competition-grade, and enterprise applications.

---

## 🧭 The 5-Phase Execution Workflow

### 1. Research & Discovery Phase
Whenever a user gives a requirement:
- **Clarify & Deconstruct**: Map out user requirements, explicit constraints, and implicit expectations.
- **SOTA Search**: Query for state-of-the-art models, algorithms, and design patterns:
  - DeepMind Gemini Reasoning (Gemini 4 Argon, Gemini 3.1 Pro System 2 deliberative thought).
  - NVIDIA Foundation Models (Nemotron 3.5 Super VL for agentic tools, Cosmos Reason for physical/runtime plausibility).
  - GitHub codebases and modern web design patterns (React 19, CSS variables, glassmorphism, Web Audio API, Playwright).
- **Audit Against Leaks & Inconsistencies**:
  - In games and challenges: verify prompts, hints, badges, and dialogue DO NOT reveal raw answers.
  - In APIs and backends: verify auth, sanitization, and data boundaries.

### 2. Architectural Planning & Task Logging Phase
Before writing code:
- Document the entry in `TASK_LOG.md`:
  - **Task ID**: Increment next sequential ID (e.g. `TSK-019`).
  - **User Intent**: Exact transcript or clean synthesis of user request.
  - **Research & Strategy**: Architecture, algorithms, libraries, or patterns selected.
  - **Step-by-Step Blueprint**: Exact files to create or modify.
  - **Integrity Safeguards**: Anti-regression and anti-leak constraints.
  - **Testing Strategy**: Exhaustive verification checklist.

### 3. Utmost Development & Execution Phase
- Implement cleanly with defensive programming and modular architecture.
- Zero placeholder code, zero mock functions that pretend to work.
- Decouple state management, business rules, and UI rendering.
- Maintain top-tier aesthetics, responsive typography, and tactile UI feedback.

### 4. Exhaustive Verification & Tester Phase (ANTI-SUPERFICIAL MANDATE)
> **Mandate**: Never test only Level 1 or happy paths! Always test all stages from start to finish.

- **Static Analysis & Build**:
  ```bash
  npm run build
  npm run lint
  ```
- **Automated Rule & Logic Validation**:
  ```bash
  npm run test:rules
  ```
- **Campaign & Answer Leak Audit**:
  ```bash
  node scripts/full_campaign_audit.js
  ```
- **Interactive UI Verification**:
  - Test all buttons, switches, audio toggles, modals, and intermissions.
  - Verify state transitions across 100% of levels.
  - Verify that no raw answer strings appear in unfulfilled badges or hints.

### 5. Automated Delivery & Push Phase
- Review working tree: `git status`
- Stage files: `git add .`
- Commit: `git commit -m "feat/fix: descriptive semantic commit"`
- Push: `git push origin main`
- Mark task as `COMPLETED` in `TASK_LOG.md`.

---

## 🛠️ Portable Project Replication
To apply this structure to any new project or folder:
```bash
python scripts/install_devops_profile.py /path/to/any/project
```
