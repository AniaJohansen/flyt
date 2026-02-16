# Project Constitution (gemini.md)

## 0. Project Overview

**Prosjekt:** Timebank – Personlig timeføringshjelper for konsulenter
**Mission (North Star):** Reduser fredags-timeføring fra 30–45 min til under 5 min ved å bygge opp en visuell "timebank" dag for dag.
**Målbruker:** IT-konsulenter som jobber med mange parallelle prosjekter (10–30 aktive) og sliter med å huske uken i etterkant.
**Plattform:** PWA (Progressive Web App)

## 1. Data Schema

### 1.1 Projects
```json
{
  "id": "string (UUID)",
  "code": "string (numerisk prosjektkode, f.eks. '12345')",
  "name": "string (f.eks. 'Kunde A - CRM-prosjekt')",
  "clientName": "string | null (valgfritt kundenavn)",
  "color": "string (hex-farge, f.eks. '#4A90E2')",
  "isActive": "boolean",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

### 1.2 TimeBlocks
```json
{
  "id": "string (UUID)",
  "date": "string (YYYY-MM-DD)",
  "startTime": "string (HH:mm)",
  "durationMinutes": "number (15 | 30 | 60)",
  "projectId": "string (referanse til project.id)",
  "comment": "string | null",
  "tags": ["string"],
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

### 1.3 Tags
```json
{
  "id": "string (UUID)",
  "name": "string (f.eks. 'møte', 'support', 'analyse', 'admin')",
  "color": "string | null (hex-farge)",
  "createdAt": "string (ISO 8601)"
}
```

### 1.4 Settings
```json
{
  "dailyReminderTime": "string (HH:mm, standard '16:00')",
  "defaultBlockSize": "number (15 | 30 | 60, standard 30)",
  "workDayStart": "string (HH:mm, standard '08:00')",
  "workDayEnd": "string (HH:mm, standard '16:00')",
  "defaultTags": ["string"],
  "theme": "string ('light' | 'dark')"
}
```

### 1.5 Export Payload (Ukeoversikt til clipboard)
```
UKE {ukenummer}, {år}

{UKEDAG} {dato} ({total timer} timer)
- {prosjektkode} {kundenavn} - {prosjektnavn}: {timer}t ({kommentarer})
...

TOTALT UKE: {sum} timer
```

### 1.6 Import Shape (CSV/Excel)
```
project_code | project_name | client_name (valgfritt)
12345        | CRM-implementering | Kunde A
67890        | Support og vedlikehold | Kunde B
```

## 2. Behavioral Rules

1. **Maks 3 klikk:** En standard timeblokk skal kunne legges inn med maksimalt 2–3 klikk/tastetrykk
2. **Keyboard-first:** Ctrl+N for ny blokk, Tab/Enter for navigering, Ctrl+Z/Ctrl+Y for undo/redo
3. **100% lokal:** All data lagres i IndexedDB. Ingen nettverkstrafikk, ingen sky, ingen API-kall
4. **Norsk UI:** Alle tekster, labels og meldinger på norsk. Engelsk i koden
5. **Visuell klarhet:** Hull i registreringen skal være tydelig synlige
6. **Daglig påminnelse:** Konfigurerbar notification (standard kl. 16:00)
7. **Ingen automatisk overvåkning:** Bruker registrerer bevisst, ingen tracking
8. **Enkel import/eksport:** CSV/Excel-import av prosjekter, clipboard-eksport av ukeoversikt
9. **Dubleringsknapp:** Raskt gjenta siste blokk-type

## 3. Architecture Invariants

- **Layer 1:** SOPs (Standard Operating Procedures) i `architecture/sops/`
- **Layer 2:** Navigation Logic – React Router, state management
- **Layer 3:** Moduler i `src/` – atomiske, deterministiske TypeScript-moduler
- **Data-First:** Ingen koding før schema er definert (denne filen)
- **Review:** Alle endringer må følge SOPs
- **Stack:** TypeScript + React + Vite + IndexedDB (via Dexie.js)
- **PWA:** Service worker + manifest for offline-first og installerbarhet
- **Ingen backend:** Alt kjører i nettleseren

## 4. Maintenance Log

| Dato | Endring |
|------|---------|
| 2026-02-16 | Initialisert B.L.A.S.T. Protocol |
| 2026-02-16 | Fylt inn fra PRD: mission, data schema, behavioral rules, architecture invariants |
| 2026-02-16 | Tilpasset arkitektur til PWA/TypeScript (fra Python-template) |
