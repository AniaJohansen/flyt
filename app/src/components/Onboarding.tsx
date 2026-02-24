interface OnboardingProps {
  onOpenProjects: () => void;
}

const STEPS = [
  {
    icon: 'upload_file',
    title: 'Importer prosjektlisten',
    desc: 'Last opp CSV eller Excel fra tidssystemet ditt. Én gang — klar for alltid.',
  },
  {
    icon: 'timer',
    title: 'Registrer tid daglig',
    desc: 'Klikk et prosjekt og velg 15, 30 eller 60 min. Maks 2 klikk per blokk.',
  },
  {
    icon: 'content_copy',
    title: 'Kopier ukeoversikten fredag',
    desc: 'Trykk «Kopier uke» og lim inn i tidssystemet. Ferdig på under 5 minutter.',
  },
];

export function Onboarding({ onOpenProjects }: OnboardingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 max-w-2xl mx-auto">
      {/* Logo/hero */}
      <div className="size-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30 mb-6">
        <span className="material-symbols-outlined text-3xl">update</span>
      </div>
      <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2 text-center">
        Velkommen til Flyt
      </h2>
      <p className="text-slate-500 text-center mb-10 max-w-sm leading-relaxed">
        Personlig timeføring for konsulenter. Reduser fredags-oppgjøret fra 45 minutter til under 5.
      </p>

      {/* Steps */}
      <div className="w-full space-y-4 mb-10">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm"
          >
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary">{step.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">
                  Steg {i + 1}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{step.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          onClick={onOpenProjects}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary rounded-xl text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all"
        >
          <span className="material-symbols-outlined text-sm">upload_file</span>
          Importer prosjekter
        </button>
        <button
          onClick={onOpenProjects}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Legg til manuelt
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="mt-6 text-xs text-slate-400 text-center">
        Tips: Trykk <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-[10px] font-bold">N</kbd> når som helst for å registrere tid
      </p>
    </div>
  );
}
