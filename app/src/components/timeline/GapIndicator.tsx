import { nb } from '@/i18n/nb';

interface GapIndicatorProps {
  startTime: string;
  endTime: string;
  durationMinutes: number;
  onFill?: (startTime: string) => void;
}

export function GapIndicator({
  startTime,
  endTime,
  durationMinutes,
  onFill,
}: GapIndicatorProps) {
  return (
    <div className="relative pl-14 pb-8 group">
      {/* Timeline circle */}
      <div className="absolute left-0 top-0 size-10 rounded-full border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 ring-4 ring-white dark:ring-slate-900 z-10 group-hover:border-primary group-hover:text-primary transition-colors">
        <span className="material-symbols-outlined text-xl">add_circle</span>
      </div>

      {/* Gap card */}
      <div
        className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-5 flex items-center justify-between hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
        onClick={() => onFill?.(startTime)}
      >
        <div>
          <h4 className="text-sm font-bold text-slate-400 group-hover:text-primary transition-colors">
            {nb.timeline.gap}
          </h4>
          <p className="text-xs text-slate-400">
            {startTime} - {endTime}
            <span className="text-slate-300 mx-1">&bull;</span>
            {nb.minutes(durationMinutes)}
          </p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onFill?.(startTime); }}
          className="text-xs font-bold text-primary px-3 py-1.5 rounded bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          Fyll ut
        </button>
      </div>
    </div>
  );
}
