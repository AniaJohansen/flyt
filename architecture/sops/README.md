# Architecture SOPs – Timebank

## Oversikt

Standard Operating Procedures (SOPs) for Timebank-prosjektet. Alle endringer i kodebasen skal følge disse prosedyrene.

## SOPs (defineres i Architect-fasen)

| SOP | Beskrivelse | Status |
|-----|-------------|--------|
| SOP-001 | Datamodell-endringer (IndexedDB-migrasjoner) | Planlagt |
| SOP-002 | Ny komponent (React-komponent-opprettelse) | Planlagt |
| SOP-003 | State management (lokal state vs. IndexedDB) | Planlagt |
| SOP-004 | Testing (enhetstester, integrasjonstester) | Planlagt |
| SOP-005 | PWA-oppdateringer (service worker, cache-strategi) | Planlagt |

## Prinsipper

1. **Data-First:** Alle datamodell-endringer dokumenteres i gemini.md FØR kode skrives
2. **Atomiske moduler:** Hver modul har ett ansvar og er testbar isolert
3. **Deterministisk:** Samme input gir alltid samme output
4. **Norsk UI, engelsk kode:** Brukervendte tekster på norsk, kode og kommentarer på engelsk
