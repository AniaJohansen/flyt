import { useState, useCallback } from 'react';
import { addDays } from 'date-fns';
import { Header } from './Header';
import { WeekBar } from '@/components/week/WeekBar';
import { DayTimeline } from '@/components/timeline/DayTimeline';
import { SmartInput } from '@/components/form/SmartInput';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { ProjectList } from '@/components/projects/ProjectList';
import { useWeek } from '@/hooks/useWeek';
import { useTimeBlocks } from '@/hooks/useTimeBlocks';
import { useProjects } from '@/hooks/useProjects';
import { useTags } from '@/hooks/useTags';
import { useSettings } from '@/hooks/useSettings';
import { formatDate, formatWeekdayDate, parseDate } from '@/lib/dates';
import { formatWeekForClipboard } from '@/lib/export';
import { nb } from '@/i18n/nb';
import type { AddTimeFormData } from '@/types';

export function AppShell() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [showSettings, setShowSettings] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [toast, setToast] = useState('');

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
      setToast(nb.week.exported);
      setTimeout(() => setToast(''), 2000);
    });
  }, [currentDate, weekBlocks, weekProjects]);

  const handleAddBlock = useCallback(
    async (data: AddTimeFormData) => {
      await addTimeBlock(data);
    },
    [addTimeBlock],
  );

  const selectedDateObj = parseDate(selectedDate);

  return (
    <div className={`app-shell ${settings.theme}`}>
      <Header
        onOpenSettings={() => setShowSettings(true)}
        onOpenProjects={() => setShowProjects(true)}
      />

      <WeekBar
        weekDays={weekDays}
        days={days}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onExport={handleExport}
        totalMinutes={weekSummary.totalMinutes}
      />

      <div className="main-content">
        <h2 className="day-title">{formatWeekdayDate(selectedDateObj)}</h2>

        <DayTimeline
          blocks={blocks}
          projects={projects}
          settings={settings}
          onDeleteBlock={deleteTimeBlock}
          onUpdateBlock={updateTimeBlock}
        />

        <SmartInput
          projects={activeProjects}
          tags={tags}
          defaultDuration={settings.defaultBlockSize}
          onSubmit={handleAddBlock}
          lastBlock={
            lastBlock
              ? { projectId: lastBlock.projectId, tags: lastBlock.tags }
              : null
          }
        />
      </div>

      {toast && <div className="toast">{toast}</div>}

      <SettingsPanel
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdate={updateSettings}
      />

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
