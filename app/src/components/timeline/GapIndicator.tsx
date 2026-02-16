import { nb } from '@/i18n/nb';

interface GapIndicatorProps {
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export function GapIndicator({
  startTime,
  endTime,
  durationMinutes,
}: GapIndicatorProps) {
  return (
    <div className="gap-indicator">
      <span className="gap-time">
        {startTime}–{endTime}
      </span>
      <span className="gap-label">
        {nb.timeline.gap} ({nb.minutes(durationMinutes)})
      </span>
    </div>
  );
}
