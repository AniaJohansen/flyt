import type { TimeBlock as TimeBlockType, Project, Settings } from '@/types';
import { buildTimeline } from '@/lib/timeline';
import { TimeBlockComponent } from './TimeBlock';
import { GapIndicator } from './GapIndicator';
import { nb } from '@/i18n/nb';

interface DayTimelineProps {
  blocks: TimeBlockType[];
  projects: Project[];
  settings: Settings;
  onDeleteBlock: (id: string) => void;
  onUpdateBlock: (
    id: string,
    changes: Partial<Pick<TimeBlockType, 'comment' | 'durationMinutes'>>,
  ) => void;
}

export function DayTimeline({
  blocks,
  projects,
  settings,
  onDeleteBlock,
  onUpdateBlock,
}: DayTimelineProps) {
  const projectMap = new Map(projects.map((p) => [p.id, p]));
  const timeline = buildTimeline(
    blocks,
    settings.workDayStart,
    settings.workDayEnd,
  );

  if (timeline.length === 0) {
    return <div className="day-timeline-empty">{nb.timeline.empty}</div>;
  }

  return (
    <div className="day-timeline">
      {timeline.map((slot, i) => {
        if (slot.type === 'gap') {
          return (
            <GapIndicator
              key={`gap-${i}`}
              startTime={slot.startTime}
              endTime={slot.endTime}
              durationMinutes={slot.durationMinutes}
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
