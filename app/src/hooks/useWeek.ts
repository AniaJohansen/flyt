import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import type { TimeBlock, DaySummary, ProjectTotal, WeekSummary } from '@/types';
import { getWeekDays, formatDate, getWeekNumber, getWeekYear } from '@/lib/dates';

function buildDaySummary(
  date: string,
  blocks: TimeBlock[],
  projects: Map<string, { code: string; name: string; clientName: string | null }>,
): DaySummary {
  const dayBlocks = blocks.filter((b) => b.date === date);
  const totalMinutes = dayBlocks.reduce((s, b) => s + b.durationMinutes, 0);

  const projectMap = new Map<string, { minutes: number; comments: string[] }>();
  for (const block of dayBlocks) {
    const existing = projectMap.get(block.projectId) ?? {
      minutes: 0,
      comments: [],
    };
    existing.minutes += block.durationMinutes;
    if (block.comment) existing.comments.push(block.comment);
    projectMap.set(block.projectId, existing);
  }

  const projectTotals: ProjectTotal[] = [];
  for (const [projectId, data] of projectMap) {
    const project = projects.get(projectId);
    projectTotals.push({
      projectId,
      projectCode: project?.code ?? '',
      projectName: project?.name ?? '',
      clientName: project?.clientName ?? null,
      totalMinutes: data.minutes,
      comments: data.comments,
    });
  }

  return { date, totalMinutes, blocks: dayBlocks, projectTotals };
}

export function useWeek(currentDate: Date) {
  const weekDays = getWeekDays(currentDate);
  const dates = weekDays.map(formatDate);

  const blocks = useLiveQuery(
    () =>
      db.timeBlocks
        .where('date')
        .anyOf(dates)
        .toArray(),
    [dates.join(',')],
  ) ?? [];

  const projects = useLiveQuery(() => db.projects.toArray()) ?? [];

  const projectMap = new Map(
    projects.map((p) => [
      p.id,
      { code: p.code, name: p.name, clientName: p.clientName },
    ]),
  );

  const days: DaySummary[] = dates.map((date) =>
    buildDaySummary(date, blocks, projectMap),
  );

  const weekSummary: WeekSummary = {
    weekNumber: getWeekNumber(currentDate),
    year: getWeekYear(currentDate),
    days,
    totalMinutes: days.reduce((s, d) => s + d.totalMinutes, 0),
  };

  return { weekDays, days, weekSummary, blocks, projects };
}
