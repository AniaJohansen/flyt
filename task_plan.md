# Timebank – B.L.A.S.T. Protocol Task Plan

## Nåværende fase: Blueprint (Planning)

---

## 1. Blueprint (Planning & Schema)

### Kjernebeslutninger
- [x] North Star definert: "Reduser fredags-timeføring fra 30–45 min til under 5 min"
- [x] Data-skjema definert i gemini.md (projects, timeblocks, tags, settings)
- [x] Plattformvalg: PWA (Progressive Web App)
- [x] Tech-stack valgt: React + TypeScript + Vite + IndexedDB
- [x] Behavioral rules definert (maks 3 klikk, keyboard-first, 100% lokal, norsk UI)

### Gjenstående Blueprint-oppgaver
- [ ] Wireframes/interaktiv prototype
- [ ] Avklar åpne spørsmål fra PRD seksjon 12:
  - [ ] Anonymisert eksempel på Excel-fil med prosjektkoder
  - [ ] Ideelt eksportformat for ukeoversikt
  - [ ] Standard-tags (møte, support, analyse, admin, +?)
  - [ ] Eksakt starttid vs. avrunding (09:15 vs. "ca. kl. 09")
  - [ ] Fakturerbar vs. intern tid – trenger skille?
- [ ] Definere Architecture SOPs

---

## 2. Link (Setup & Tooling)

- [ ] Initialiser React-prosjekt med Vite + TypeScript template
- [ ] Installer og konfigurer Dexie.js for IndexedDB
- [ ] Sett opp PWA: service worker (Workbox) + manifest.json
- [ ] Installer CSV/Excel-import: Papa Parse (CSV) + SheetJS (Excel)
- [ ] Sett opp linting (ESLint) og formatering (Prettier)
- [ ] Konfigurer date-fns for norsk datoformat (nb locale)

---

## 3. Architect (Build Core)

### Datalag
- [ ] Implementer IndexedDB-skjema med Dexie.js (projects, timeblocks, tags, settings)
- [ ] CRUD-operasjoner for alle entiteter
- [ ] Import-modul: parse CSV/Excel til Project-objekter

### Registrering
- [ ] Rask tidsregistrering: 15/30/60 min knapper
- [ ] Prosjektvelger (søk/dropdown)
- [ ] Kommentar og tagg-felter
- [ ] Dubleringsknapp ("Gjenta siste")

### Visninger
- [ ] Daglig tidslinje-visning (visuell oversikt over dagens blokker)
- [ ] Redigering: endre varighet, slette, flytte blokker
- [ ] Ukeoversikt (mandag–fredag) med total tid per prosjekt
- [ ] Markering av hull i registreringen

### Eksport
- [ ] Eksport til clipboard (formatert tekst)
- [ ] Eksport til Excel/CSV-tabell

---

## 4. Stylize (UX & Polish)

- [ ] Keyboard shortcuts: Ctrl+N (ny blokk), Ctrl+Z/Y (undo/redo)
- [ ] Daglig påminnelse via Notification API
- [ ] Prosjektfarger (brukerdefinert eller autogenerert)
- [ ] Undo/redo-system
- [ ] Responsivt design (desktop-first, men fungerer på tablet)
- [ ] Minimalistisk, distraksjonfritt design
- [ ] Visuell indikator for hull i registreringen

---

## 5. Trigger (Deploy & Launch)

- [ ] Produksjons-build og bundle-optimalisering
- [ ] PWA-installasjon testing (Chrome, Edge)
- [ ] Enkel brukerveiledning (norsk)
- [ ] Hosting: GitHub Pages eller Netlify
- [ ] Backup/restore-funksjon (JSON-eksport av all data)

---

## Suksesskriterier (fra PRD)

- [ ] Timeblokk legges inn med maks 3 klikk
- [ ] 80% av arbeidstiden registrert daglig
- [ ] Fredags-oppgjør tar under 5 minutter
- [ ] Alt fungerer 100% offline (ingen internett kreves)
