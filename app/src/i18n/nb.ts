export const nb = {
  app: {
    title: 'Timebank',
    subtitle: 'Timeføringshjelper',
  },
  weekdays: {
    short: ['MAN', 'TIR', 'ONS', 'TOR', 'FRE', 'LØR', 'SØN'] as const,
    long: ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'] as const,
  },
  form: {
    addBlock: 'Legg til tidsblokk',
    project: 'Prosjekt',
    duration: 'Varighet',
    comment: 'Kommentar',
    tags: 'Tags',
    save: 'Lagre',
    cancel: 'Avbryt',
    searchProject: 'Søk prosjekt...',
    noProjects: 'Ingen prosjekter funnet',
    selectProject: 'Velg prosjekt',
    commentPlaceholder: 'Legg til kommentar...',
    repeatLast: 'Gjenta siste',
  },
  timeline: {
    gap: 'Uregistrert tid',
    empty: 'Ingen blokker registrert',
    edit: 'Rediger',
    delete: 'Slett',
    confirmDelete: 'Er du sikker på at du vil slette denne blokken?',
  },
  week: {
    weekLabel: 'Uke',
    total: 'Totalt',
    hours: 'timer',
    export: 'Kopier ukeoversikt',
    exported: 'Kopiert til utklippstavle!',
    today: 'I dag',
  },
  settings: {
    title: 'Innstillinger',
    reminder: 'Daglig påminnelse',
    reminderTime: 'Påminnelsestid',
    defaultBlock: 'Standard blokkstørrelse',
    workDayStart: 'Arbeidsdag start',
    workDayEnd: 'Arbeidsdag slutt',
    theme: 'Tema',
    themeLight: 'Lyst',
    themeDark: 'Mørkt',
    close: 'Lukk',
  },
  projects: {
    title: 'Prosjekter',
    import: 'Importer prosjekter',
    importCSV: 'Importer CSV/Excel',
    add: 'Legg til prosjekt',
    code: 'Prosjektkode',
    name: 'Prosjektnavn',
    client: 'Kundenavn',
    active: 'Aktiv',
    inactive: 'Inaktiv',
    preview: 'Forhåndsvisning',
    importCount: (n: number) => `${n} prosjekt${n === 1 ? '' : 'er'} funnet`,
    duplicates: (n: number) => `${n} duplikat${n === 1 ? '' : 'er'} hoppet over`,
    importSuccess: (n: number) => `${n} prosjekt${n === 1 ? '' : 'er'} importert`,
  },
  minutes: (m: number) => {
    if (m >= 60) {
      const h = m / 60;
      return `${h.toFixed(1).replace('.', ',')}t`;
    }
    return `${m}m`;
  },
  hoursDecimal: (m: number) => (m / 60).toFixed(1).replace('.', ','),
} as const;
