import { nb } from '@/i18n/nb';

interface WeekDayProps {
  dayIndex: number;
  totalMinutes: number;
  isSelected: boolean;
  isToday: boolean;
  onClick: () => void;
}

export function WeekDay({
  dayIndex,
  totalMinutes,
  isSelected,
  isToday,
  onClick,
}: WeekDayProps) {
  const classes = [
    'week-day',
    isSelected && 'selected',
    isToday && 'today',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} onClick={onClick}>
      <span className="week-day-label">{nb.weekdays.short[dayIndex]}</span>
      <span className="week-day-hours">
        {totalMinutes > 0 ? nb.hoursDecimal(totalMinutes) : '–'}
      </span>
    </button>
  );
}
