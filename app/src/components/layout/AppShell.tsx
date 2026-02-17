import { useState, useCallback, useEffect, useRef } from 'react';
import { addDays } from 'date-fns';
import { WeekBar } from '@/components/week/WeekBar';
import { DayTimeline } from '@/components/timeline/DayTimeline';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { ProjectList } from '@/components/projects/ProjectList';
import NewEntryModal from '@/components/NewEntryModal';
import { useWeek } from '@/hooks/useWeek';
import { useTimeBlocks } from '@/hooks/useTimeBlocks';
import { useProjects } from '@/hooks/useProjects';
import { useTags } from '@/hooks/useTags';
import { useSettings } from '@/hooks/useSettings';
import { formatDate, formatWeekdayDate, parseDate, getWeekNumber, formatWeekRange } from '@/lib/dates';
import { formatWeekForClipboard } from '@/lib/export';
import { searchProjects } from '@/lib/smartInput';
import { nb } from '@/i18n/nb';
import type { AddTimeFormData } from '@/types';

export function AppShell() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [showSettings, setShowSettings] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartTime, setModalStartTime] = useState<string | undefined>();
  const [toast, setToast] = useState('');
  const [activeNav, setActiveNav] = useState<'dashboard' | 'projects' | 'settings'>('dashboard');

  // Quick entry state
  const [quickDuration, setQuickDuration] = useState<15 | 30 | 60>(30);
  const [quickSearch, setQuickSearch] = useState('');
  const quickSearchRef = useRef<HTMLInputElement>(null);

  const { weekDays, days, weekSummary, blocks: weekBlocks, projects: weekProjects } =
    useWeek(currentDate);
  const { blocks, addTimeBlock, updateTimeBlock, deleteTimeBlock } =
    useTimeBlocks(selectedDate);
  const { projects, activeProjects, addProject, updateProject, toggleActive } =
    useProjects();
  const { tags } = useTags();
  const { settings, updateSettings } = useSettings();

  const lastBlock = blocks.length > 0 ? blocks[blocks.length - 1] : null;

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

  const handleAddBlock = useCallback(
    async (data: AddTimeFormData) => {
      await addTimeBlock(data);
      showToast('Tidsblokk lagt til!');
    },
    [addTimeBlock],
  );

  const handleQuickAdd = useCallback(
    async (projectId: string) => {
      await addTimeBlock({
        projectId,
        durationMinutes: quickDuration,
        comment: '',
        tags: [],
      });
      showToast('Tidsblokk lagt til!');
    },
    [addTimeBlock, quickDuration],
  );

  const handleRepeatLast = useCallback(() => {
    if (!lastBlock) return;
    addTimeBlock({
      projectId: lastBlock.projectId,
      durationMinutes: lastBlock.durationMinutes,
      comment: '',
      tags: lastBlock.tags,
    }).then(() => showToast('Siste blokk gjentatt!'));
  }, [lastBlock, addTimeBlock]);

  const handleFillGap = useCallback((startTime: string) => {
    setModalStartTime(startTime);
    setIsModalOpen(true);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleNavClick = (nav: 'dashboard' | 'projects' | 'settings') => {
    setActiveNav(nav);
    if (nav === 'projects') setShowProjects(true);
    if (nav === 'settings') setShowSettings(true);
  };

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

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setModalStartTime(undefined);
        setIsModalOpen(true);
      } else if (e.key === '/') {
        e.preventDefault();
        quickSearchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isModalOpen, showSettings, showProjects]);

  const selectedDateObj = parseDate(selectedDate);
  const weekNum = getWeekNumber(weekDays[0]);
  const weekRange = formatWeekRange(weekDays);

  // Recent projects: last 3 unique from blocks
  const recentProjectIds: string[] = [];
  for (let i = blocks.length - 1; i >= 0 && recentProjectIds.length < 3; i--) {
    if (!recentProjectIds.includes(blocks[i].projectId)) {
      recentProjectIds.push(blocks[i].projectId);
    }
  }
  // Fallback to weekly blocks if no daily blocks
  if (recentProjectIds.length === 0) {
    for (let i = weekBlocks.length - 1; i >= 0 && recentProjectIds.length < 3; i--) {
      if (!recentProjectIds.includes(weekBlocks[i].projectId)) {
        recentProjectIds.push(weekBlocks[i].projectId);
      }
    }
  }
  const recentProjects = recentProjectIds
    .map((id) => projects.find((p) => p.id === id))
    .filter(Boolean);

  const quickResults = quickSearch
    ? searchProjects(quickSearch, activeProjects)
    : [];

  const totalWeekHours = (weekSummary.totalMinutes / 60).toFixed(1).replace('.', ',');
  const weekProgress = Math.min(100, Math.round((weekSummary.totalMinutes / (7.5 * 5 * 60)) * 100));

  return (
    <div className={`flex h-screen overflow-hidden ${settings.theme === 'dark' ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">update</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight dark:text-white">Timebank</h1>
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
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                Kopier uke
              </button>
              <button
                onClick={() => { setModalStartTime(undefined); setIsModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Ny føring
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
          />
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Timeline Center */}
          <div className="flex-1 overflow-y-auto p-8 relative">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold dark:text-white">
                  Dagens tidslinje — <span className="font-medium text-slate-500">{formatWeekdayDate(selectedDateObj)}</span>
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="size-2 rounded-full bg-primary"></span> Ført tid
                  <span className="size-2 rounded-full border border-slate-300 ml-4"></span> Ledig tid
                </div>
              </div>

              <DayTimeline
                blocks={blocks}
                projects={projects}
                settings={settings}
                onDeleteBlock={deleteTimeBlock}
                onUpdateBlock={updateTimeBlock}
                onFillGap={handleFillGap}
              />
            </div>

            {/* Keyboard Shortcut Hint */}
            {!isModalOpen && !showSettings && !showProjects && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-slate-300 text-[11px] font-bold px-4 py-2 rounded-full flex gap-4 shadow-2xl z-50">
                <span className="flex items-center gap-1.5"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">N</kbd> Ny føring</span>
                <span className="flex items-center gap-1.5"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">/</kbd> Søk prosjekt</span>
                <span className="flex items-center gap-1.5"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">ESC</kbd> Lukk</span>
              </div>
            )}
          </div>

          {/* Right Action Panel */}
          <aside className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Hurtiginnføring</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Varighet</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([15, 30, 60] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setQuickDuration(d)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all active:scale-95 ${
                          quickDuration === d
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-slate-200 dark:border-slate-600 hover:border-primary hover:text-primary dark:text-slate-300'
                        }`}
                      >
                        {d === 60 ? '1t' : `${d}m`}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Velg Prosjekt</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                    <input
                      ref={quickSearchRef}
                      className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white outline-none"
                      placeholder="Søk kode eller navn..."
                      type="text"
                      value={quickSearch}
                      onChange={(e) => setQuickSearch(e.target.value)}
                    />
                  </div>
                  {quickSearch && quickResults.length > 0 && (
                    <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                      {quickResults.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => { handleQuickAdd(p.id); setQuickSearch(''); }}
                          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                        >
                          <div
                            className="size-8 flex-shrink-0 rounded flex items-center justify-center text-white text-[10px] font-black"
                            style={{ backgroundColor: p.color }}
                          >
                            {p.code.slice(-3)}
                          </div>
                          <div className="text-left overflow-hidden">
                            <p className="text-xs font-bold truncate dark:text-white">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium tracking-tight">{p.code}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Siste prosjekter</label>
                  <div className="space-y-2">
                    {recentProjects.map((p) => p && (
                      <button
                        key={p.id}
                        onClick={() => handleQuickAdd(p.id)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div
                          className="size-8 flex-shrink-0 rounded flex items-center justify-center text-[10px] font-black transition-colors"
                          style={{ backgroundColor: `${p.color}20`, color: p.color }}
                        >
                          {p.code.slice(-3)}
                        </div>
                        <div className="text-left overflow-hidden">
                          <p className="text-xs font-bold truncate dark:text-white">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium tracking-tight">{p.code}</p>
                        </div>
                      </button>
                    ))}
                    {recentProjects.length === 0 && activeProjects.slice(0, 3).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleQuickAdd(p.id)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div
                          className="size-8 flex-shrink-0 rounded flex items-center justify-center text-[10px] font-black"
                          style={{ backgroundColor: `${p.color}20`, color: p.color }}
                        >
                          {p.code.slice(-3)}
                        </div>
                        <div className="text-left overflow-hidden">
                          <p className="text-xs font-bold truncate dark:text-white">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium tracking-tight">{p.code}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {lastBlock && (
                  <button
                    onClick={handleRepeatLast}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">replay</span>
                    Gjenta siste
                  </button>
                )}
              </div>
            </div>
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
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Blokker i dag</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{blocks.length}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-100 dark:border-slate-700 pt-3">
                  <span className="text-slate-900 dark:text-white font-bold">Gjenstår</span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {((37.5 * 60 - weekSummary.totalMinutes) / 60).toFixed(1).replace('.', ',')}t
                  </span>
                </div>
              </div>
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
          projects={activeProjects}
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
      />

      {/* Projects */}
      <ProjectList
        open={showProjects}
        onClose={() => setShowProjects(false)}
        projects={projects}
        onToggleActive={toggleActive}
        onUpdate={updateProject}
        onAdd={addProject}
      />
    </div>
  );
}
