import {
  startOfWeek,
  addDays,
  format,
  getISOWeek,
  getISOWeekYear,
  parseISO,
} from 'date-fns';
import { nb } from 'date-fns/locale';

export function getWeekDays(date: Date): Date[] {
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 5 }, (_, i) => addDays(monday, i));
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateDisplay(date: Date): string {
  return format(date, 'd. MMMM', { locale: nb });
}

export function formatDateShort(date: Date): string {
  return format(date, 'd. MMM', { locale: nb });
}

export function getWeekNumber(date: Date): number {
  return getISOWeek(date);
}

export function getWeekYear(date: Date): number {
  return getISOWeekYear(date);
}

export function parseDate(dateStr: string): Date {
  return parseISO(dateStr);
}

export function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const totalMinutes = h * 60 + m + minutes;
  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatWeekdayDate(date: Date): string {
  return format(date, 'EEEE d. MMMM', { locale: nb });
}
