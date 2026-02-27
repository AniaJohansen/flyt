import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { addDays } from 'date-fns';
import { WeekBar } from '@/components/week/WeekBar';
import { DayTimeline } from '@/components/timeline/DayTimeline';
import { DayBlocks } from '@/components/timeline/DayBlocks';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { ProjectList } from '@/components/projects/ProjectList';
import NewEntryModal from '@/components/NewEntryModal';
import { Onboarding } from '@/components/Onboarding';
import { AllTimeReport } from '@/components/reports/AllTimeReport';
import { useWeek } from '@/hooks/useWeek';
import { useTimeBlocks } from '@/hooks/useTimeBlocks';
import { useProjects } from '@/hooks/useProjects';
import { useTags } from '@/hooks/useTags';
import { useSettings } from '@/hooks/useSettings';
import { formatDate, formatWeekdayDate, parseDate, getWeekNumber, formatWeekRange } from '@/lib/dates';
import { formatWeekForClipboard, exportWeekToCSV } from '@/lib/export';
import { seedDemoProjects } from '@/lib/seed';
import { buildClientColorMap } from '@/lib/clientColors';
import { requestNotificationPermission, showReminder } from '@/lib/notifications';
import { nb } from '@/i18n/nb';
import { db } from '@/db';
import type { AddTimeFormData, TimeBlock } from '@/types';

type UpdatableFields = Partial<Pick<TimeBlock, 'startTime' | 'durationMinutes' | 'projectId' | 'comment' | 'tags' | 'billable'>>;

type UndoOp =
  | { type: 'added';   block: TimeBlock }
  | { type: 'deleted'; block: TimeBlock }
  | { type: 'updated'; id: string; before: UpdatableFields };

export function AppShell() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [showSettings, setShowSettings] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartTime, setModalStartTime] = useState<string | undefined>();
  const [toast, setToast] = useState('');
  const [activeNav, setActiveNav] = useState<'dashboard' | 'projects' | 'settings'>('dashboard');
  const [undoStack, setUndoStack] = useState<UndoOp[]>([]);
  const [redoStack, setRedoStack] = useState<UndoOp[]>([]);

const { weekDays, days, weekSummary, blocks: weekBlocks, projects: weekProjects } =
    useWeek(currentDate);
  const { blocks, addTimeBlock, updateTimeBlock, deleteTimeBlock } =
    useTimeBlocks(selectedDate);
  const { projects, activeProjects, addProject, updateProject, toggleActive, deleteProject } =
    useProjects();
  const { tags } = useTags();
  const { settings, updateSettings } = useSettings();

  // Stable refs for hook functions (avoid stale closures in callbacks)
  const addTimeBlockRef = useRef(addTimeBlock);
  addTimeBlockRef.current = addTimeBlock;
  const updateTimeBlockRef = useRef(updateTimeBlock);
  updateTimeBlockRef.current = updateTimeBlock;
  const deleteTimeBlockRef = useRef(deleteTimeBlock);
  deleteTimeBlockRef.current = deleteTimeBlock;
  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;

  // Compute client-based colors: same client → same hue, project type → shade variant
  const clientColors = useMemo(() => buildClientColorMap(projects), [projects]);
  const coloredProjects = useMemo(
    () => projects.map((p) => ({ ...p, color: clientColors.getColor(p.id) })),
    [projects, clientColors],
  );
  const coloredActiveProjects = useMemo(
    () => activeProjects.map((p) => ({ ...p, color: clientColors.getColor(p.id) })),
    [activeProjects, clientColors],
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const pushUndo = useCallback((op: UndoOp) => {
    setUndoStack(s => [...s, op]);
    setRedoStack([]);
  }, []);

  const handleSelectDate = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const handlePrevWeek = useCallback(() => {
    setCurrentDate((d) => addDays(d, -7));
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentDate((d) => addDays(d, 7));
  }, []);

  const handleExport = useCallback(() => {
    const text = formatWeekForClipboard(currentDate, weekBlocks, weekProjects);
    navigator.clipboard.writeText(text).then(() => {
      showToast(nb.week.exported);
    });
  }, [currentDate, weekBlocks, weekProjects]);

  const handleDownloadCSV = useCallback(() => {
    exportWeekToCSV(currentDate, weekBlocks, weekProjects);
    showToast(nb.week.downloadedCSV);
  }, [currentDate, weekBlocks, weekProjects]);

  const handleAddBlock = useCallback(
    async (data: AddTimeFormData) => {
      const block = await addTimeBlockRef.current(data);
      pushUndo({ type: 'added', block });
      showToast('Tidsblokk lagt til!');
    },
    [pushUndo],
  );


  const handleDeleteTimeBlock = useCallback(async (id: string) => {
    const block = blocksRef.current.find(b => b.id === id);
    if (block) pushUndo({ type: 'deleted', block });
    await deleteTimeBlockRef.current(id);
  }, [pushUndo]);

  const handleUpdateBlock = useCallback(async (
    id: string,
    changes: Partial<Pick<TimeBlock, 'comment' | 'durationMinutes' | 'startTime' | 'billable'>>,
  ) => {
    const block = blocksRef.current.find(b => b.id === id);
    if (block) {
      const before = Object.fromEntries(
        Object.keys(changes).map(k => [k, (block as unknown as Record<string, unknown>)[k]])
      ) as UpdatableFields;
      pushUndo({ type: 'updated', id, before });
    }
    await updateTimeBlockRef.current(id, changes);
  }, [pushUndo]);

  const handleFillGap = useCallback((startTime: string) => {
    setModalStartTime(startTime);
    setIsModalOpen(true);
  }, []);

  const handleBlockModeAdd = useCallback(async (
    projectId: string,
    durationMinutes: 15 | 30 | 60,
  ) => {
    const block = await addTimeBlockRef.current({
      projectId,
      durationMinutes,
      comment: '',
      tags: [],
      billable: true,
    });
    pushUndo({ type: 'added', block });
    showToast('Blokk lagt til!');
  }, [pushUndo]);

  const handleNavClick = (nav: 'dashboard' | 'projects' | 'settings') => {
    setActiveNav(nav);
    if (nav === 'projects') setShowProjects(true);
    if (nav === 'settings') setShowSettings(true);
  };

  const undo = useCallback(async () => {
    const op = undoStack.at(-1);
    if (!op) return;
    setUndoStack(s => s.slice(0, -1));
    if (op.type === 'added') {
      await deleteTimeBlockRef.current(op.block.id);
      setRedoStack(r => [...r, op]);
    } else if (op.type === 'deleted') {
      await db.timeBlocks.add(op.block);
      setRedoStack(r => [...r, op]);
    } else if (op.type === 'updated') {
      const current = await db.timeBlocks.get(op.id);
      if (current) {
        const after = Object.fromEntries(
          Object.keys(op.before).map(k => [k, (current as unknown as Record<string, unknown>)[k]])
        ) as UpdatableFields;
        await updateTimeBlockRef.current(op.id, op.before);
        setRedoStack(r => [...r, { type: 'updated', id: op.id, before: after }]);
      }
    }
  }, [undoStack]);

  const redo = useCallback(async () => {
    const op = redoStack.at(-1);
    if (!op) return;
    setRedoStack(r => r.slice(0, -1));
    if (op.type === 'added') {
      await db.timeBlocks.add(op.block);
      setUndoStack(s => [...s, op]);
    } else if (op.type === 'deleted') {
      await deleteTimeBlockRef.current(op.block.id);
      setUndoStack(s => [...s, op]);
    } else if (op.type === 'updated') {
      const current = await db.timeBlocks.get(op.id);
      if (current) {
        const after = Object.fromEntries(
          Object.keys(op.before).map(k => [k, (current as unknown as Record<string, unknown>)[k]])
        ) as UpdatableFields;
        await updateTimeBlockRef.current(op.id, op.before);
        setUndoStack(s => [...s, { type: 'updated', id: op.id, before: after }]);
      }
    }
  }, [redoStack]);

  // Sync theme to <html> element so Tailwind dark: variants work everywhere
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('flyt_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('flyt_theme', 'light');
    }
  }, [settings.theme]);

  // Daily reminder
  useEffect(() => {
    requestNotificationPermission();
    const interval = setInterval(() => {
      if (!settings.dailyReminderTime) return;
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (hhmm !== settings.dailyReminderTime) return;
      const today = formatDate(now);
      const lastDate = localStorage.getItem('flyt_last_reminder_date');
      if (lastDate === today) return;
      showReminder();
      localStorage.setItem('flyt_last_reminder_date', today);
    }, 60_000);
    return () => clearInterval(interval);
  }, [settings.dailyReminderTime]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

      if (e.key === 'Escape') {
        if (isModalOpen) setIsModalOpen(false);
        else if (showSettings) setShowSettings(false);
        else if (showProjects) setShowProjects(false);
        return;
      }

      if (isInput) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); return; }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setModalStartTime(undefined);
        setIsModalOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isModalOpen, showSettings, showProjects, undo, redo]);

  const selectedDateObj = parseDate(selectedDate);
  const weekNum = getWeekNumber(weekDays[0]);
  const weekRange = formatWeekRange(weekDays);


  const totalWeekHours = (weekSummary.totalMinutes / 60).toFixed(1).replace('.', ',');
  const weekProgress = Math.min(100, Math.round((weekSummary.totalMinutes / (7.5 * 5 * 60)) * 100));

  const billableWeekMinutes = weekBlocks.filter(b => b.billable !== false).reduce((s, b) => s + b.durationMinutes, 0);
  const nonBillableWeekMinutes = weekBlocks.filter(b => b.billable === false).reduce((s, b) => s + b.durationMinutes, 0);

  // Per-project totals for selected day
  const dailyProjectTotals = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of blocks) {
      map.set(b.projectId, (map.get(b.projectId) ?? 0) + b.durationMinutes);
    }
    return Array.from(map.entries())
      .map(([id, mins]) => ({ project: coloredProjects.find(p => p.id === id), mins }))
      .filter((x): x is { project: NonNullable<typeof x.project>; mins: number } => !!x.project)
      .sort((a, b) => b.mins - a.mins);
  }, [blocks, coloredProjects]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">update</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight dark:text-white">Flyt</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Timeføring</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeNav === 'dashboard'
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => handleNavClick('projects')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeNav === 'projects'
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined">work</span>
            <span>Prosjekter</span>
          </button>
          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeNav === 'settings'
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span>Innstillinger</span>
          </button>
        </nav>
        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 p-2">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate dark:text-white">Konsulent</p>
              <p className="text-xs text-slate-500 truncate">Lokal bruker</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background-light dark:bg-background-dark">
        {/* Top Header & Weekly Summary */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Min tidsbank</h2>
              <p className="text-slate-500 font-medium">Uke {weekNum} &bull; {weekRange}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReport(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <span className="material-symbols-outlined text-sm">bar_chart</span>
                Totaloversikt
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                Kopier uke
              </button>
              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Last ned CSV
              </button>
            </div>
          </div>

          <WeekBar
            weekDays={weekDays}
            days={days}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
            onExport={handleExport}
            totalMinutes={weekSummary.totalMinutes}
            weekProgress={weekProgress}
            totalWeekHours={totalWeekHours}
            showWeekends={settings.showWeekends}
          />
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Timeline Center */}
          <div className="flex-1 overflow-y-auto p-8 relative">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold dark:text-white">
                  {settings.trackingMode === 'blocks' ? 'Dagens bolker' : 'Dagens tidslinje'}{' '}
                  — <span className="font-medium text-slate-500">{formatWeekdayDate(selectedDateObj)}</span>
                </h3>
                {settings.trackingMode !== 'blocks' && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="size-2 rounded-full bg-primary"></span> Ført tid
                    <span className="size-2 rounded-full border border-slate-300 ml-4"></span> Ledig tid
                  </div>
                )}
              </div>

              {coloredProjects.length === 0 ? (
                <Onboarding
                  onOpenProjects={() => { setShowProjects(true); setActiveNav('projects'); }}
                  onSeedData={async () => { await seedDemoProjects(); showToast('Demo-prosjekter lagt til!'); }}
                />
              ) : settings.trackingMode === 'blocks' ? (
                <DayBlocks
                  blocks={blocks}
                  projects={coloredProjects}
                  onAdd={handleBlockModeAdd}
                  onDeleteBlock={handleDeleteTimeBlock}
                />
              ) : (
                <DayTimeline
                  blocks={blocks}
                  projects={coloredProjects}
                  settings={settings}
                  onDeleteBlock={handleDeleteTimeBlock}
                  onUpdateBlock={handleUpdateBlock}
                  onFillGap={handleFillGap}
                />
              )}

            </div>

            {/* Keyboard Shortcut Hint */}
            {!isModalOpen && !showSettings && !showProjects && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-slate-300 text-[11px] font-bold px-4 py-2 rounded-full flex gap-4 shadow-2xl z-50">
                <span className="flex items-center gap-1.5"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">N</kbd> Ny føring</span>
                <span className="flex items-center gap-1.5"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">Ctrl+Z</kbd> Angre</span>
                <span className="flex items-center gap-1.5"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">Ctrl+Y</kbd> Gjør om</span>
                <span className="flex items-center gap-1.5"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">ESC</kbd> Lukk</span>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <aside className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Statistikk denne uken</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Totale timer</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{totalWeekHours}t</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Fremdrift</span>
                  <span className="font-bold text-emerald-600">{weekProgress}%</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-100 dark:border-slate-700 pt-3">
                  <span className="flex items-center gap-1 text-slate-500 font-medium">
                    <span className="material-symbols-outlined text-[13px] text-emerald-500">attach_money</span>
                    Fakturerbar
                  </span>
                  <span className="font-bold text-emerald-600">
                    {(billableWeekMinutes / 60).toFixed(1).replace('.', ',')}t
                    {weekSummary.totalMinutes > 0 && (
                      <span className="text-slate-400 font-normal ml-1">
                        ({Math.round((billableWeekMinutes / weekSummary.totalMinutes) * 100)}%)
                      </span>
                    )}
                  </span>
                </div>
                {nonBillableWeekMinutes > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1 text-slate-500 font-medium">
                      <span className="material-symbols-outlined text-[13px] text-slate-400">money_off</span>
                      Ikke-fakturerbar
                    </span>
                    <span className="font-bold text-slate-500">
                      {(nonBillableWeekMinutes / 60).toFixed(1).replace('.', ',')}t
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs border-t border-slate-100 dark:border-slate-700 pt-3">
                  <span className="text-slate-900 dark:text-white font-bold">Gjenstår</span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {((37.5 * 60 - weekSummary.totalMinutes) / 60).toFixed(1).replace('.', ',')}t
                  </span>
                </div>
              </div>

              {/* Daily project breakdown */}
              {dailyProjectTotals.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Dagens prosjekter</p>
                  <div className="space-y-2">
                    {dailyProjectTotals.map(({ project, mins }) => (
                      <div key={project.id} className="flex items-center gap-2">
                        <span
                          className="size-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 flex-1 truncate">
                          {project.code}
                        </span>
                        <span className="text-xs font-bold tabular-nums text-slate-700 dark:text-slate-300">
                          {(mins / 60).toFixed(1).replace('.', ',')}t
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto bg-primary/5 rounded-xl p-4 border border-primary/10">
                <p className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">Tips</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Trykk <kbd className="px-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded">N</kbd> for ny registrering, <kbd className="px-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded">/</kbd> for å søke prosjekt.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-2xl z-[60] animate-fade-in">
          {toast}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <NewEntryModal
          onClose={() => { setIsModalOpen(false); setModalStartTime(undefined); }}
          onSubmit={handleAddBlock}
          projects={coloredActiveProjects}
          tags={tags}
          defaultDuration={settings.defaultBlockSize}
          startTime={modalStartTime}
        />
      )}

      {/* Settings */}
      <SettingsPanel
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdate={updateSettings}
        onToast={showToast}
      />

      {/* All-time report */}
      <AllTimeReport open={showReport} onClose={() => setShowReport(false)} />

      {/* Projects */}
      <ProjectList
        open={showProjects}
        onClose={() => setShowProjects(false)}
        projects={coloredProjects}
        onToggleActive={toggleActive}
        onUpdate={updateProject}
        onAdd={addProject}
        onDelete={deleteProject}
      />
    </div>
  );
}
