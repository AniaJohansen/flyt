# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Timebank** – Personlig timeføringshjelper for konsulenter. En PWA som lar konsulenter registrere arbeidstid i små blokker (15/30/60 min) og gir en visuell ukeoversikt for enkel fredags-timeføring.

This project follows the B.L.A.S.T. Protocol methodology:
- **Blueprint**: Planning and schema definition
- **Link**: Project setup and tooling
- **Architect**: Build core functionality
- **Stylize**: UX refinement and polish
- **Trigger**: Deployment and launch

## Architecture Principles

### Data-First Approach
**CRITICAL**: No code implementation should begin until the data schema is fully defined in [gemini.md](gemini.md). This is a hard requirement that prevents architectural debt.

### Three-Layer Architecture
1. **Layer 1 - SOPs**: Standard Operating Procedures stored in `architecture/sops/`
2. **Layer 2 - Navigation Logic**: React Router, state management, component orchestration
3. **Layer 3 - Modules**: Atomic, deterministic TypeScript modules in `src/`

All modules must be:
- Atomic (single responsibility)
- Deterministic (same input = same output)
- TypeScript-based

### Review Process
All changes must follow the SOPs defined in the architecture layer before implementation.

## Project Documents

### Core Planning Files
- [gemini.md](gemini.md) - Project Constitution: mission, data schema, behavioral rules, architecture invariants
- [task_plan.md](task_plan.md) - B.L.A.S.T. Protocol phase tracking and checklists
- [findings.md](findings.md) - Research discoveries, tech decisions, and constraints
- [progress.md](progress.md) - Action log with dates, results, and errors
- [docs/prd.md](docs/prd.md) - Original PRD (Product Requirements Document)

### Document Update Protocol
When making changes, update the relevant planning documents:
- Log all actions in [progress.md](progress.md) with date, action, result, and any errors
- Record discoveries and constraints in [findings.md](findings.md)
- Update task checklists in [task_plan.md](task_plan.md)
- Maintain schema and behavioral rules in [gemini.md](gemini.md)

## Development Workflow

1. **Before coding**: Verify data schema is defined in [gemini.md](gemini.md)
2. **During development**: Follow the three-layer architecture pattern
3. **After changes**: Update [progress.md](progress.md) with the action log entry
4. **All implementations**: Ensure adherence to defined SOPs

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Language | TypeScript (strict mode) |
| Frontend | React 19 |
| Build tool | Vite |
| Storage | IndexedDB via Dexie.js |
| PWA | vite-plugin-pwa (Workbox) |
| CSV import | Papa Parse |
| Excel import | SheetJS (xlsx) |
| Dates | date-fns (nb locale) |
| IDs | uuid |

### Key Constraints
- **No backend** – everything runs in the browser
- **No network calls** – 100% offline, local-only data
- **Norwegian UI** – all user-facing text in Norwegian, code in English
- **Keyboard-first** – all actions accessible via keyboard shortcuts

## Current Phase

The project is in the **Blueprint phase** (complete). Next step is the **Link phase** – project initialization with Vite + React + TypeScript.
