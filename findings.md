# Timebank – Funn og beslutninger

## Plattformvalg

**Beslutning:** PWA (Progressive Web App)

**Begrunnelse:**
- Ingen installasjon kreves – fungerer uten admin-rettigheter på jobb-PC
- Fungerer i Chrome/Edge uten IT-godkjenning
- Kan "installeres" via nettleser for desktop-lignende opplevelse
- Eliminerer risikoen "Installasjon blokkert av IT-policy" (PRD risikotabell)
- IndexedDB gir tilstrekkelig lokal lagring for timedata
- Service worker gir full offline-støtte

**Vurderte alternativer:**
- Electron: Krever installasjon, stor bundle, overkill for en lokal app uten native behov
- Tauri: Lettere enn Electron, men fortsatt installasjon

## Tech-stack

| Komponent | Valg | Begrunnelse |
|-----------|------|-------------|
| Språk | TypeScript | Type-sikkerhet, bedre DX, ingen backend behov |
| Frontend | React | Stort økosystem, godt kjent, mange UI-biblioteker |
| Build | Vite | Rask dev-server, enkel config, god PWA-plugin |
| Lagring | IndexedDB via Dexie.js | Enkel API over IndexedDB, god ytelse, observerbar |
| CSV-import | Papa Parse | Lettvektig, robust CSV-parsing |
| Excel-import | SheetJS (xlsx) | Standard for Excel-filer i JS |
| Dato | date-fns | Lettere enn moment/dayjs, tree-shakeable, norsk locale |
| PWA | vite-plugin-pwa (Workbox) | Automatisk service worker-generering |

## PRD-funn og begrensninger

### Harde krav
- **Kun lokal lagring:** Ingen data forlater brukerens maskin
- **Ingen API-kall:** Fungerer 100% offline
- **Norsk UI:** Alle tekster på norsk, engelsk i koden
- **Ingen automatisk overvåkning:** Bruker registrerer bevisst

### Brukerscenario
- Jobber med 13–15 kunder og 31 prosjekter samtidig
- Kaotisk arbeidsdag med mye context-switching
- Bruker 30–45 min hver fredag på å rekonstruere uken
- Internt system bruker numeriske prosjektkoder (ikke navn)

### MVP-scope (inkludert)
- Rask registrering (15/30/60 min blokker)
- Daglig tidslinje med redigering
- Prosjektliste med import
- Ukeoversikt med eksport til clipboard
- Daglig påminnelse

### Eksplisitt ekskludert fra MVP
- Automatisk overvåkning
- Integrasjon med Teams/Outlook
- Automatisk eksport til internt system
- Multi-bruker/team-funksjoner
- Mobil-app
- Kalender-import
- AI-forslag

## Anbefalte biblioteker

| Bibliotek | Versjon | Bruk |
|-----------|---------|------|
| react | 19.x | UI-rammeverk |
| dexie | 4.x | IndexedDB-wrapper |
| papaparse | 5.x | CSV-parsing |
| xlsx (SheetJS) | 0.20.x | Excel-parsing |
| date-fns | 4.x | Dato-operasjoner og formatering |
| vite-plugin-pwa | 0.21.x | PWA service worker |
| uuid | 11.x | UUID-generering for entiteter |

## Åpne spørsmål (fra PRD seksjon 12)

### Prioritet 1 (må avklares)
- [x] Plattform: PWA valgt
- [ ] Anonymisert Excel-eksempel med prosjektkoder
- [ ] Ideelt eksportformat for ukeoversikt

### Prioritet 2 (bør avklares)
- [ ] Standard-tags utover møte/support/analyse/admin
- [ ] Eksakt starttid eller avrunding?
- [ ] Skille mellom fakturerbar og intern tid?
- [ ] Visuell inspirasjon fra andre apper?

### Prioritet 3 (kan vurderes senere)
- [ ] Statistikk (timer per prosjekt per måned/kvartal)
- [ ] PDF-eksport for arkivering
- [ ] Historiske uker (se tilbake i tid)
