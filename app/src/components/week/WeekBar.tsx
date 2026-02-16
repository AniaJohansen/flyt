import type { DaySummary } from '@/types';
import { formatDate, getWeekNumber } from '@/lib/dates';
import { WeekDay } from './WeekDay';
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
}

export function WeekBar({
  weekDays,
  days,
  selectedDate,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
  onExport,
  totalMinutes,
}: WeekBarProps) {
  const today = formatDate(new Date());
  const weekNum = getWeekNumber(weekDays[0]);

  return (
    <div className="week-bar">
      <div className="week-bar-nav">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onPrevWeek}>
          ‹
        </button>
        <span className="week-bar-label">
          {nb.week.weekLabel} {weekNum}
        </span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onNextWeek}>
          ›
        </button>
      </div>

      <div className="week-days">
        {weekDays.map((day, i) => {
          const dateStr = formatDate(day);
          return (
            <WeekDay
              key={dateStr}
              dayIndex={i}
              totalMinutes={days[i]?.totalMinutes ?? 0}
              isSelected={dateStr === selectedDate}
              isToday={dateStr === today}
              onClick={() => onSelectDate(dateStr)}
            />
          );
        })}
      </div>

      <div className="week-bar-footer">
        <span className="week-total">
          {nb.week.total}: {nb.hoursDecimal(totalMinutes)} {nb.week.hours}
        </span>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onExport}
          title={nb.week.export}
        >
          📋 {nb.week.export}
        </button>
      </div>
    </div>
  );
}
