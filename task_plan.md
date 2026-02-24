# Timebank – B.L.A.S.T. Protocol Task Plan

## Nåværende fase: FERDIG ✅

---

## 1. Blueprint (Planning & Schema) ✅

### Kjernebeslutninger
- [x] North Star definert: "Reduser fredags-timeføring fra 30–45 min til under 5 min"
- [x] Data-skjema definert i gemini.md (projects, timeblocks, tags, settings)
- [x] Plattformvalg: PWA (Progressive Web App)
- [x] Tech-stack valgt: React + TypeScript + Vite + IndexedDB
- [x] Behavioral rules definert (maks 3 klikk, keyboard-first, 100% lokal, norsk UI)

### Gjenstående Blueprint-oppgaver
- [x] Wireframes/interaktiv prototype (Stitch-design integrert)
- [ ] Avklar åpne spørsmål fra PRD seksjon 12 (brukeravklaring – ikke kode):
  - [ ] Anonymisert eksempel på Excel-fil med prosjektkoder
  - [ ] Standard-tags (møte, support, analyse, admin, +?)
  - [ ] Fakturerbar vs. intern tid – trenger skille?
- [ ] Definere Architecture SOPs

---

## 2. Link (Setup & Tooling) ✅

- [x] Initialiser React-prosjekt med Vite + TypeScript template
- [x] Installer og konfigurer Dexie.js for IndexedDB
- [x] Sett opp PWA: service worker (Workbox) + manifest.json
- [x] Installer CSV/Excel-import: Papa Parse (CSV) + SheetJS (Excel)
- [x] Konfigurer date-fns for norsk datoformat (nb locale)

---

## 3. Architect (Build Core) ✅

### Datalag
- [x] Implementer IndexedDB-skjema med Dexie.js (projects, timeblocks, tags, settings)
- [x] CRUD-operasjoner for alle entiteter
- [x] Import-modul: parse CSV/Excel til Project-objekter

### Registrering
- [x] Rask tidsregistrering: 15/30/60 min knapper
- [x] Prosjektvelger med smart søk (kode + navn)
- [x] Kommentar og tagg-felter
- [x] Dubleringsknapp ("Gjenta siste")

### Visninger
- [x] Daglig tidslinje-visning
- [x] Redigering: endre varighet, slett, inline edit
- [x] Ukeoversikt (mandag–fredag) med total tid per prosjekt
- [x] Markering av hull i registreringen (GapIndicator)

### Eksport
- [x] Eksport til clipboard (formatert tekst)
- [x] Eksport til CSV-tabell (nedlasting, semikolon-separert)

---

## 4. Stylize (UX & Polish) ✅

- [x] Keyboard shortcuts: N (ny blokk), / (søk), Ctrl+Z/Y (undo/redo), ESC
- [x] Daglig påminnelse via Notification API
- [x] Prosjektfarger: klientbasert fargekart (samme klient → samme fargetone)
- [x] Undo/redo-system (in-memory stack, alle 3 operasjonstyper)
- [x] Minimalistisk, distraksjonfritt design
- [x] Visuell indikator for hull i registreringen
- [x] Dark mode støtte

---

## 5. Trigger (Deploy & Launch) ✅

- [x] Produksjons-build (Vite, ~127kB gzip, xlsx lazy-loaded i eget chunk)
- [x] PWA offline font-caching (Workbox runtimeCaching for Google Fonts)
- [x] Enkel brukerveiledning: onboarding-skjerm for nye brukere (ingen prosjekter)
- [x] Hosting: GitHub Actions → GitHub Pages (`/flyt/` sub-path)
- [x] Backup/restore-funksjon (JSON-eksport av alle 4 tabeller)

---

## Suksesskriterier (fra PRD)

- [x] Timeblokk legges inn med maks 3 klikk (klikk prosjekt → velg varighet → lagre)
- [x] Fredags-oppgjør tar under 5 minutter (ukeoversikt klar med ett klikk)
- [x] Alt fungerer 100% offline (IndexedDB + service worker + font caching)
- [ ] 80% av arbeidstiden registrert daglig (brukeradferd – ikke målbart i kode)
