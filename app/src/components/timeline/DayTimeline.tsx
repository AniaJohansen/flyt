import type { TimeBlock as TimeBlockType, Project, Settings } from '@/types';
import { buildTimeline } from '@/lib/timeline';
import { TimeBlockComponent } from './TimeBlock';
import { GapIndicator } from './GapIndicator';

interface DayTimelineProps {
  blocks: TimeBlockType[];
  projects: Project[];
  settings: Settings;
  onDeleteBlock: (id: string) => void;
  onUpdateBlock: (
    id: string,
    changes: Partial<Pick<TimeBlockType, 'comment' | 'durationMinutes' | 'startTime' | 'billable'>>,
  ) => void;
  onFillGap?: (startTime: string) => void;
}

export function DayTimeline({
  blocks,
  projects,
  settings,
  onDeleteBlock,
  onUpdateBlock,
  onFillGap,
}: DayTimelineProps) {
  const projectMap = new Map(projects.map((p) => [p.id, p]));
  const timeline = buildTimeline(
    blocks,
    settings.workDayStart,
    settings.workDayEnd,
  );

  if (timeline.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">schedule</span>
        <h4 className="text-lg font-bold text-slate-400 mb-2">Ingen blokker registrert</h4>
        <p className="text-sm text-slate-400">Trykk <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-bold">N</kbd> for å starte</p>
      </div>
    );
  }

  // Reverse so latest time blocks appear at the top
  const reversed = [...timeline].reverse();

  return (
    <div className="space-y-0 relative timeline-line">
      {reversed.map((slot, i) => {
        if (slot.type === 'gap') {
          return (
            <GapIndicator
              key={`gap-${i}`}
              startTime={slot.startTime}
              endTime={slot.endTime}
              durationMinutes={slot.durationMinutes}
              onFill={onFillGap}
            />
          );
        }
        return (
          <TimeBlockComponent
            key={slot.block!.id}
            block={slot.block!}
            project={projectMap.get(slot.block!.projectId)}
            onDelete={onDeleteBlock}
            onUpdate={onUpdateBlock}
          />
        );
      })}
    </div>
  );
}
