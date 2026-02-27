import type { DaySummary } from '@/types';
import { formatDate } from '@/lib/dates';
import { nb } from '@/i18n/nb';

interface WeekBarProps {
  weekDays: Date[];
  days: DaySummary[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onExport: () => void;
  totalMinutes: number;
  weekProgress: number;
  totalWeekHours: string;
  showWeekends?: boolean;
}

export function WeekBar({
  weekDays,
  days,
  selectedDate,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
  totalMinutes: _totalMinutes,
  weekProgress,
  totalWeekHours,
  onExport: _onExport,
  showWeekends = false,
}: WeekBarProps) {
  const today = formatDate(new Date());
  const visibleDays = weekDays
    .map((day, i) => ({ day, summary: days[i], i }))
    .filter(({ i }) => showWeekends || i < 5);

  return (
    <div className="grid grid-cols-7 gap-4">
      {/* Progress Card */}
      <div className="col-span-3 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Ukentlig fremdrift</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {totalWeekHours} <span className="text-slate-400 font-medium">/ 37,5 timer</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrevWeek}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
            >
              <span className="material-symbols-outlined text-sm text-slate-500">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={onNextWeek}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
            >
              <span className="material-symbols-outlined text-sm text-slate-500">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${weekProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Daily Mini Bars */}
      <div className="col-span-4 flex justify-between gap-1.5 items-end pb-1">
        {visibleDays.map(({ day, summary, i }) => {
          const dateStr = formatDate(day);
          const dayMinutes = summary?.totalMinutes ?? 0;
          const percent = Math.min(100, Math.round((dayMinutes / (7.5 * 60)) * 100));
          const isWeekend = i >= 5;
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === today;

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelectDate(dateStr)}
              className={`flex flex-col items-center gap-1.5 flex-1 rounded-xl px-1 py-2 transition-all ${
                isSelected
                  ? 'bg-primary/10'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              } ${isWeekend && dayMinutes === 0 ? 'opacity-40' : ''}`}
            >
              <div
                className={`w-full rounded-sm relative h-20 overflow-hidden ${
                  isWeekend ? 'bg-slate-200 dark:bg-slate-700' : 'bg-primary/15'
                } ${isSelected ? 'ring-2 ring-primary ring-offset-1' : ''}`}
              >
                {(!isWeekend || dayMinutes > 0) ? (
                  <div
                    className={`absolute bottom-0 w-full transition-all duration-500 ${
                      isSelected ? 'bg-primary' : 'bg-primary/60'
                    }`}
                    style={{ height: `${percent}%` }}
                  ></div>
                ) : null}
              </div>
              <span className={`text-[10px] font-bold ${
                isSelected ? 'text-primary' : isToday ? 'text-blue-400' : 'text-slate-400'
              }`}>
                {nb.weekdays.short[i]}
              </span>
              {isSelected && dayMinutes > 0 ? (
                <span className="text-[9px] font-black text-primary tabular-nums leading-none">
                  {(dayMinutes / 60).toFixed(1).replace('.', ',')}t
                </span>
              ) : (
                <span className="text-[9px] leading-none">&nbsp;</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
