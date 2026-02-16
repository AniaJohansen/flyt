# PRD: Timebank – Personlig timeføringshjelper for konsulenter

**Versjon:** 1.0
**Forfatter:** Claude (basert på input fra Ania)
**Dato:** 16. februar 2026

---

## 1. Sammendrag

Timebank er en enkel, personlig desktop-applikasjon som lar konsulenter registrere arbeidstid i små blokker (15, 30 eller 60 minutter) gjennom arbeidsdagen. Appen gir en visuell ukeoversikt som gjør fredags-timeføringen enkel og rask. Data lagres kun lokalt på brukerens maskin – ingen sky, ingen integrasjoner, ingen deling.

**Målbruker:** IT-konsulenter som jobber med mange parallelle prosjekter (10–30 aktive) og som sliter med å huske hva de gjorde i løpet av uken.

**Kjerneverdien:** Gjør fredags-timeføringen fra 30–45 minutter til under 5 minutter ved å bygge opp en visuell "timebank" dag for dag.

---

## 2. Problemstilling

### Dagens situasjon
- Bruker jobber på 13–15 kunder og 31 prosjekter samtidig
- Arbeidsdagen er kaotisk med mange små oppgaver, context-switching og avbrudd
- Må bruke 30–45 minutter hver fredag for å rekonstruere uken ved å:
  - Sjekke Outlook-kalender
  - Gå gjennom Teams-chatter
  - Se gjennom sendte e-poster
  - Lese egne notater
  - Fylle inn huller basert på antagelser
- Internt timeføringssystem bruker numeriske prosjektkoder (ikke navn), som gjør det vanskelig å huske hvilke prosjekter man jobbet på

### Konsekvenser
- Tidstap og stress hver fredag
- Redusert nøyaktighet i timeføring (spesielt for små oppgaver)
- Kognitivt krevende å skulle huske hele uken i etterkant

---

## 3. Mål

### Produktmål
1. **Redusere fredags-timeføring fra 30–45 min til maksimalt 5 minutter**
2. **Øke nøyaktigheten** i timeføring ved å registrere i sanntid i stedet for å rekonstruere
3. **Gi en visuell ukeoversikt** som gjør det enkelt å se hva man har gjort

### Suksesskriterier
- Bruker kan legge inn en timeblokk med maksimalt 2–3 klikk
- 80% av arbeidstiden er registrert daglig
- Fredags-oppgjør tar under 5 minutter
- Bruker opplever prosessen som "fryd" i stedet for friksjon

---

## 4. Scope (MVP)

### Inkludert i MVP

**Rask tidsregistrering**
- Velg varighet: 15 min, 30 min, 60 min (knapper)
- Velg prosjekt: fra din egen liste (søk/dropdown)
- Valgfri kommentar eller tagg (f.eks. "møte", "support", "analyse")
- Dubleringsknapp for å raskt legge til flere blokker av samme type

**Daglig oversikt**
- Visuell tidslinje for dagens registrerte blokker
- Enkel redigering: dra, endre varighet, slette, slå sammen
- Daglig påminnelse (konfigurerbar tid, f.eks. kl. 16:00)

**Prosjektliste**
- Enkel import av Excel/CSV med prosjektnavn og prosjektkode
- Bruker kan også legge til prosjekter manuelt
- Rask søk/filtrering ved registrering

**Ukeoversikt**
- Mandag–fredag kalendervisning
- Visuell oppsummering: prosjekt, timer, kommentarer
- Lett å se hull i registreringen
- Eksporter til clipboard eller printer-friendly format for manuell overføring

**Teknisk**
- Desktop-app (Windows/Mac) eller PWA
- Kun lokal lagring (ingen sky, ingen API)
- Norsk språk som standard
- Keyboard-shortcuts for power users

### Ikke inkludert i MVP

- Automatisk overvåkning (bruker vil ikke ha dette)
- Integrasjon med Teams, Outlook eller interne systemer
- Automatisk eksport til internt system (data må ikke deles)
- Multi-bruker eller team-funksjoner
- Mobil-app (kan komme senere)
- Kalender-import
- AI-forslag eller prediktiv registrering

---

## 5. Brukerhistorier

**Som konsulent** ønsker jeg å legge inn en 15-minutters blokk raskt mens jeg husker det, **slik at** jeg ikke glemmer små støtteoppgaver.

**Som konsulent** ønsker jeg å se prosjektnavnet (ikke bare koden) når jeg registrerer tid, **slik at** jeg slipper å sjekke Excel hver gang.

**Som konsulent** ønsker jeg en visuell ukeoversikt, **slik at** jeg raskt kan se hva jeg jobbet med mandag–fredag og fylle ut i det interne systemet.

**Som konsulent** ønsker jeg å kunne tagge eller kommentere blokker, **slik at** jeg husker hva jeg faktisk gjorde (f.eks. "møte med kunde X" eller "bugfix").

**Som konsulent** ønsker jeg en daglig påminnelse, **slik at** jeg ikke glemmer å fylle ut dagens timer før jeg logger av.

---

## 6. UX/UI-krav

### Layout
```
+-----------------------------------------------------+
|  Timebank                          [Innstillinger]  |
+-----------------------------------------------------+
|  Uke 7, 2026                  Mandag 10. februar    |
|  +----+----+----+----+----+                         |
|  | MA | TI | ON | TO | FR |  <- Ukeoversikt         |
|  | 7t | 8t | 6t | 7t | .. |                         |
|  +----+----+----+----+----+                         |
+-----------------------------------------------------+
|  DAGENS REGISTRERING                                |
|  08:00 #### Prosjekt A (1t) - Mote med kunde       |
|  09:00 #### Prosjekt B (30m) - Support             |
|  09:30 ....                                         |
|  10:00 #### Prosjekt A (2t) - Koding               |
|  12:00 .... [Lunch]                                 |
|  13:00 #### Prosjekt C (30m) - Teams-chat          |
|  ...                                                |
+-----------------------------------------------------+
|  LEGG TIL TID                                       |
|  [15m] [30m] [1t]    [Dubler siste]                |
|  Prosjekt: [Sok eller velg...]                     |
|  Kommentar: [_____________________________]         |
|  Tagg: [Mote] [Support] [Analyse] [Admin] [+Ny]   |
|                              [LEGG TIL] [Ctrl+N]   |
+-----------------------------------------------------+
```

### Designprinsipper
- **Rask registrering:** Maksimalt 2–3 klikk for en standard blokk
- **Keyboard-first:** Ctrl+N for ny blokk, Tab/Enter for navigering
- **Visuell klarhet:** Lett å se hull i registreringen
- **Undo/redo:** Ctrl+Z/Ctrl+Y fungerer
- **Norsk språk:** Alle tekster på norsk

### Farger og visuelt
- Ulike farger per prosjekt (brukerdefinert eller autogenerert)
- Tydelig markering av dagens fokus
- Minimalistisk design uten distraksjoner

---

## 7. Data og lagring

### Datastruktur (forenklet)
```json
{
  "projects": [
    {
      "id": "proj_001",
      "code": "12345",
      "name": "Kunde A - CRM-prosjekt",
      "color": "#4A90E2"
    }
  ],
  "timeblocks": [
    {
      "id": "tb_001",
      "date": "2026-02-10",
      "start_time": "08:00",
      "duration_minutes": 60,
      "project_id": "proj_001",
      "comment": "Mote med kunde",
      "tags": ["mote", "kunde"]
    }
  ],
  "settings": {
    "daily_reminder_time": "16:00",
    "default_block_size": 30
  }
}
```

### Lagring
- **Lokal database:** SQLite eller JSON-fil på brukerens maskin
- **Ingen sky-sync:** Data forlater aldri brukerens datamaskin
- **Backup:** Bruker kan eksportere alt til JSON/CSV manuelt
- **Import:** Excel/CSV med kolonner: `project_code`, `project_name` (valgfritt: `client_name`)

### Eksport (ukeoversikt)
**Format 1: Clipboard (tabell)**
```
Uke 7, 2026

Mandag 10. februar
- Prosjekt A (12345): 3,5t - Mote med kunde, koding
- Prosjekt B (67890): 1,0t - Support
- Prosjekt C (11223): 0,5t - Teams-chat
TOTALT: 7,5t

Tirsdag 11. februar
...
```

**Format 2: Excel-export**
Tabell med kolonner: Dag | Prosjektkode | Prosjektnavn | Timer | Kommentar

---

## 8. Teknisk forslag

### Arkitektur
**Valgt:** PWA (Progressive Web App)
- **Frontend:** React + TypeScript
- **Lagring:** IndexedDB (via Dexie.js)
- **Build:** Vite
- **Språk:** Norsk UI, engelsk i koden

### Sikkerhet
- All data lagres lokalt
- Ingen nettverkstrafikk (unntatt ved manuell import/eksport)
- Bruker kan enkelt slette all data

---

## 9. Roadmap

### Uke 0–2: Avklaring og design
- Svar på åpne spørsmål (se seksjon 12)
- Lag wireframes og interaktiv prototype
- Test prototype med Ania i 2 dager

### Uke 2–6: MVP-utvikling
- Bygg rask registrering (15/30/60 min blokker)
- Implementer daglig oversikt og redigering
- Lag ukeoversikt med eksport til clipboard
- Prosjektimport fra Excel

### Uke 6–8: Testing og raffinering
- Brukertest med Ania i 2 uker (reell bruk)
- Finjuster UX basert på tilbakemelding
- Bug-fixing og performance

### Uke 8–10: Lansering
- Pakke app for distribusjon (PWA)
- Lage enkel brukerveiledning
- Evaluere om kolleger også vil bruke appen

---

## 10. Acceptance Criteria (MVP)

**Må kunne:**
1. Legge inn en timeblokk (15/30/60 min) med maksimalt 3 klikk
2. Se dagens registrerte blokker i en visuell tidslinje
3. Redigere, slette eller dublere blokker enkelt
4. Importere prosjektliste fra Excel/CSV
5. Få daglig påminnelse om å registrere timer
6. Se en ukeoversikt (mandag–fredag) med total tid per prosjekt
7. Kopiere ukeoversikten til clipboard i lesbart format
8. Alt fungerer uten internett (100% lokal app)

**Nice-to-have (kan komme i v1.1):**
- Keyboard shortcuts (Ctrl+N for ny blokk, etc.)
- Prosjektfarger/ikoner for raskere gjenkjenning
- "Smartfyll" for vanlige møtetider (f.eks. 09:00–10:00)
- Statistikk: "hvilke prosjekter brukte jeg mest tid på i Q1?"

---

## 11. Risikoer og avbøtning

| Risiko | Sannsynlighet | Konsekvens | Tiltak |
|--------|---------------|------------|--------|
| Bruker glemmer å registrere daglig | Middels | Høy | Daglig påminnelse + visuell indikator på "hull" |
| App føles tungvint å bruke | Lav | Høy | Iterativ testing med ekte bruk; keyboard shortcuts |
| Internt system endrer format | Lav | Middels | Fleksibel eksport-editor; bruker kan tilpasse |
| Installasjon blokkert av IT-policy | Middels | Høy | Bygg som PWA (ingen installasjon nødvendig) |
| Data går tapt ved PC-bytte | Lav | Middels | Enkel backup/restore-funksjon |

---

## 12. Åpne spørsmål (før utvikling)

### Må avklares (prioritet 1)
1. **Plattform:** PWA (avklart)
2. **Prosjektliste:** Kan du dele et anonymisert eksempel på Excel-filen med prosjektkoder?
3. **Eksportformat:** Hvordan ser ideell ukeoversikt ut for deg? (Del gjerne et håndskrevet eksempel)
4. **Installasjon:** Har bedriften restriksjoner på å installere apper? (Viktig for valg av teknologi)

### Bør avklares (prioritet 2)
5. **Kommentarer og tags:** Hvilke standard-tags ønsker du? (f.eks. "møte", "support", "analyse", "admin")
6. **Tidspunkt:** Trenger du å registrere eksakt starttid (f.eks. 09:15), eller holder det med "ca. kl. 09"?
7. **Fakturerbar vs intern tid:** Trenger du å skille mellom ulike typer timer?
8. **Visuell stil:** Er det noen apper du liker designet på? (For inspirasjon)

### Kan vurderes senere (prioritet 3)
9. Ønsker du statistikk (f.eks. "hvor mange timer på Prosjekt A i januar")?
10. Skal appen kunne eksportere til PDF/print for arkivering?
11. Ønsker du mulighet til å se historiske uker (f.eks. "se uke 5")?

---

## 13. Neste steg

### For deg (Ania)
1. Svar på spørsmålene i seksjon 12 (prioritet 1 og 2)
2. Send et eksempel på Excel-fil med prosjekter (anonymisert)
3. Skisser gjerne hvordan ideell ukeoversikt skal se ut (kan være håndskrevet foto)

### For meg (Claude)
1. Lage interaktive wireframes basert på dine svar
2. Foreslå konkret tech-stack (Electron vs PWA)
3. Lage en clickable prototype du kan teste i 2 dager
4. Starte utvikling av MVP

---

## 14. Appendiks: Eksempeldata

### Import (Excel/CSV)
```
project_code | project_name              | client_name
12345        | CRM-implementering        | Kunde A
67890        | Support og vedlikehold    | Kunde B
11223        | Dataanalyse Q1            | Kunde C
```

### Ukeoversikt (eksempel clipboard-format)
```
UKE 7, 2026

MANDAG 10. FEBRUAR (7,5 timer)
- 12345 Kunde A - CRM: 3,5t (Mote, koding)
- 67890 Kunde B - Support: 1,0t (Teams support)
- 11223 Kunde C - Analyse: 0,5t (Statusmote)
- Intern tid: 2,5t (e-post, admin)

TIRSDAG 11. FEBRUAR (8 timer)
- 12345 Kunde A - CRM: 5,0t (Testing, deployment)
- 67890 Kunde B - Support: 1,5t (Bug-fixing)
- 44556 Kunde D - Nytt prosjekt: 1,5t (Planlegging)

...

TOTALT UKE: 37,5 timer
```
