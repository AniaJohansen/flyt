import type { Project, TimeBlock } from '@/types';
import { nb as nbStrings } from '@/i18n/nb';
import { getWeekNumber, getWeekYear, getWeekDays, formatDate } from './dates';

interface ExportDay {
  date: string;
  dayName: string;
  blocks: TimeBlock[];
  totalMinutes: number;
}

export function formatWeekForClipboard(
  weekDate: Date,
  blocks: TimeBlock[],
  projects: Project[],
): string {
  const weekNum = getWeekNumber(weekDate);
  const year = getWeekYear(weekDate);
  const days = getWeekDays(weekDate);
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const exportDays: ExportDay[] = days.map((day, i) => {
    const dateStr = formatDate(day);
    const dayBlocks = blocks
      .filter((b) => b.date === dateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    const totalMinutes = dayBlocks.reduce(
      (sum, b) => sum + b.durationMinutes,
      0,
    );
    return {
      date: dateStr,
      dayName: nbStrings.weekdays.long[i],
      blocks: dayBlocks,
      totalMinutes,
    };
  });

  const lines: string[] = [];
  lines.push(`UKE ${weekNum}, ${year}`);
  lines.push('');

  for (const day of exportDays) {
    if (day.blocks.length === 0) continue;

    const hours = (day.totalMinutes / 60).toFixed(1).replace('.', ',');
    lines.push(
      `${day.dayName.toUpperCase()} ${day.date} (${hours} ${nbStrings.week.hours})`,
    );

    const projectTotals = new Map<
      string,
      { minutes: number; comments: string[] }
    >();
    for (const block of day.blocks) {
      const existing = projectTotals.get(block.projectId) || {
        minutes: 0,
        comments: [],
      };
      existing.minutes += block.durationMinutes;
      if (block.comment) existing.comments.push(block.comment);
      projectTotals.set(block.projectId, existing);
    }

    for (const [projectId, totals] of projectTotals) {
      const project = projectMap.get(projectId);
      if (!project) continue;
      const hours = (totals.minutes / 60).toFixed(1).replace('.', ',');
      const clientPart = project.clientName
        ? `${project.clientName} - `
        : '';
      const commentPart =
        totals.comments.length > 0
          ? ` (${totals.comments.join(', ')})`
          : '';
      lines.push(
        `- ${project.code} ${clientPart}${project.name}: ${hours}t${commentPart}`,
      );
    }
    lines.push('');
  }

  const totalMinutes = exportDays.reduce((sum, d) => sum + d.totalMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1).replace('.', ',');
  lines.push(`TOTALT UKE: ${totalHours} ${nbStrings.week.hours}`);

  return lines.join('\n');
}

// One row per project per day, semicolon-separated (Norwegian Excel default)
export function exportWeekToCSV(
  weekDate: Date,
  blocks: TimeBlock[],
  projects: Project[],
): void {
  const weekNum = getWeekNumber(weekDate);
  const year = getWeekYear(weekDate);
  const days = getWeekDays(weekDate);
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const header = 'Dato;Ukedag;Prosjektkode;Kundenavn;Prosjektnavn;Type;Timer;Kommentarer';
  const rows: string[] = [header];

  for (let i = 0; i < days.length; i++) {
    const dateStr = formatDate(days[i]);
    const dayBlocks = blocks
      .filter((b) => b.date === dateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    if (dayBlocks.length === 0) continue;

    const projectTotals = new Map<string, { minutes: number; comments: string[] }>();
    for (const block of dayBlocks) {
      const existing = projectTotals.get(block.projectId) ?? { minutes: 0, comments: [] };
      existing.minutes += block.durationMinutes;
      if (block.comment) existing.comments.push(block.comment);
      projectTotals.set(block.projectId, existing);
    }

    for (const [projectId, totals] of projectTotals) {
      const project = projectMap.get(projectId);
      if (!project) continue;
      const hoursDecimal = (totals.minutes / 60).toFixed(2).replace('.', ',');
      const comment = totals.comments.join(' / ').replace(/;/g, ',');
      rows.push([
        dateStr,
        nbStrings.weekdays.long[i],
        project.code,
        project.clientName ?? '',
        project.name,
        project.projectType ?? '',
        hoursDecimal,
        comment,
      ].join(';'));
    }
  }

  const csv = rows.join('\r\n');
  const bom = '\uFEFF'; // UTF-8 BOM for Norwegian characters in Excel
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const filename = `flyt-uke${weekNum}-${year}.csv`;
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
