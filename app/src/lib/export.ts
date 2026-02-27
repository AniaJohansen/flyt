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

  let grandBillableMinutes = 0;
  let grandNonBillableMinutes = 0;

  for (const day of exportDays) {
    if (day.blocks.length === 0) continue;

    const dayBillable = day.blocks
      .filter((b) => b.billable !== false)
      .reduce((s, b) => s + b.durationMinutes, 0);
    const dayNonBillable = day.blocks
      .filter((b) => b.billable === false)
      .reduce((s, b) => s + b.durationMinutes, 0);

    grandBillableMinutes += dayBillable;
    grandNonBillableMinutes += dayNonBillable;

    const totalHours = (day.totalMinutes / 60).toFixed(1).replace('.', ',');
    const ifPart = dayNonBillable > 0
      ? `, herav ${(dayNonBillable / 60).toFixed(1).replace('.', ',')}t ikke-fakturerbar`
      : '';
    lines.push(`${day.dayName.toUpperCase()} ${day.date} (${totalHours} ${nbStrings.week.hours}${ifPart})`);

    // Group by project + billable status, preserving project order
    const projectOrder: string[] = [];
    const billableTotals = new Map<string, { minutes: number; comments: string[] }>();
    const nonBillableTotals = new Map<string, { minutes: number; comments: string[] }>();

    for (const block of day.blocks) {
      if (!projectOrder.includes(block.projectId)) projectOrder.push(block.projectId);
      const map = block.billable !== false ? billableTotals : nonBillableTotals;
      const existing = map.get(block.projectId) ?? { minutes: 0, comments: [] };
      existing.minutes += block.durationMinutes;
      if (block.comment) existing.comments.push(block.comment);
      map.set(block.projectId, existing);
    }

    const renderRow = (projectId: string, totals: { minutes: number; comments: string[] }, nonBillable: boolean) => {
      const project = projectMap.get(projectId);
      if (!project) return;
      const hours = (totals.minutes / 60).toFixed(1).replace('.', ',');
      const clientPart = project.clientName ? `${project.clientName} - ` : '';
      const commentPart = totals.comments.length > 0 ? ` (${totals.comments.join(', ')})` : '';
      const ifTag = nonBillable ? '  [Ikke-fakturerbar]' : '';
      lines.push(`- ${project.code} ${clientPart}${project.name}: ${hours}t${commentPart}${ifTag}`);
    };

    // Per project: billable row first, then non-billable row immediately after
    for (const projectId of projectOrder) {
      if (billableTotals.has(projectId)) renderRow(projectId, billableTotals.get(projectId)!, false);
      if (nonBillableTotals.has(projectId)) renderRow(projectId, nonBillableTotals.get(projectId)!, true);
    }

    lines.push('');
  }

  const totalMinutes = exportDays.reduce((sum, d) => sum + d.totalMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1).replace('.', ',');
  lines.push(`TOTALT UKE: ${totalHours} ${nbStrings.week.hours}`);
  lines.push(`  Fakturerbar:        ${(grandBillableMinutes / 60).toFixed(1).replace('.', ',')}t`);
  if (grandNonBillableMinutes > 0) {
    lines.push(`  Ikke-fakturerbar:  ${(grandNonBillableMinutes / 60).toFixed(1).replace('.', ',')}t`);
  }

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

  const header = 'Dato;Ukedag;Prosjektkode;Kundenavn;Prosjektnavn;Type;Fakturerbarhet;Timer;Kommentarer';
  const rows: string[] = [header];

  for (let i = 0; i < days.length; i++) {
    const dateStr = formatDate(days[i]);
    const dayBlocks = blocks
      .filter((b) => b.date === dateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    if (dayBlocks.length === 0) continue;

    // Group by project + billable status so billable and non-billable get separate rows
    const projectTotals = new Map<string, { minutes: number; comments: string[]; billable: boolean }>();
    for (const block of dayBlocks) {
      const isBillable = block.billable !== false;
      const key = `${block.projectId}:${isBillable ? '1' : '0'}`;
      const existing = projectTotals.get(key) ?? { minutes: 0, comments: [], billable: isBillable };
      existing.minutes += block.durationMinutes;
      if (block.comment) existing.comments.push(block.comment);
      projectTotals.set(key, existing);
    }

    for (const [key, totals] of projectTotals) {
      const projectId = key.split(':')[0];
      const project = projectMap.get(projectId);
      if (!project) continue;
      const hoursDecimal = (totals.minutes / 60).toFixed(2).replace('.', ',');
      const comment = totals.comments.join(' / ').replace(/;/g, ',');
      const billableLabel = totals.billable ? 'Fakturerbar' : 'Ikke-fakturerbar';
      rows.push([
        dateStr,
        nbStrings.weekdays.long[i],
        project.code,
        project.clientName ?? '',
        project.name,
        project.projectType ?? '',
        billableLabel,
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
