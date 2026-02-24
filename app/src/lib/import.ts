import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import type { Project, ProjectImportRow } from '@/types';
import { getNextColor } from './colors';
import { db } from '@/db';

const COLUMN_MAP: Record<string, keyof ProjectImportRow> = {
  project_code: 'project_code',
  prosjektkode: 'project_code',
  code: 'project_code',
  kode: 'project_code',
  project_name: 'project_name',
  prosjektnavn: 'project_name',
  name: 'project_name',
  navn: 'project_name',
  client_name: 'client_name',
  kundenavn: 'client_name',
  kunde: 'client_name',
  client: 'client_name',
};

function normalizeHeaders(
  row: Record<string, string>,
): ProjectImportRow | null {
  const result: Partial<ProjectImportRow> = {};
  for (const [key, value] of Object.entries(row)) {
    const normalized = COLUMN_MAP[key.toLowerCase().trim()];
    if (normalized) {
      result[normalized] = value?.trim() ?? '';
    }
  }
  if (!result.project_code || !result.project_name) return null;
  return result as ProjectImportRow;
}

export function parseCSV(text: string): ProjectImportRow[] {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });
  return result.data
    .map(normalizeHeaders)
    .filter((r): r is ProjectImportRow => r !== null);
}

export async function parseExcel(file: File): Promise<ProjectImportRow[]> {
  const XLSX = await import('xlsx');
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);
  return rows
    .map(normalizeHeaders)
    .filter((r): r is ProjectImportRow => r !== null);
}

export async function importProjects(
  rows: ProjectImportRow[],
): Promise<{ imported: number; duplicates: number }> {
  const existingProjects = await db.projects.toArray();
  const existingCodes = new Set(existingProjects.map((p) => p.code));
  const usedColors = existingProjects.map((p) => p.color);

  let imported = 0;
  let duplicates = 0;
  const now = new Date().toISOString();

  const newProjects: Project[] = [];
  for (const row of rows) {
    if (existingCodes.has(row.project_code)) {
      duplicates++;
      continue;
    }
    existingCodes.add(row.project_code);
    const color = getNextColor([...usedColors, ...newProjects.map((p) => p.color)]);
    newProjects.push({
      id: uuidv4(),
      code: row.project_code,
      name: row.project_name,
      clientName: row.client_name || null,
      projectType: null,
      color,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    imported++;
  }

  if (newProjects.length > 0) {
    await db.projects.bulkAdd(newProjects);
  }

  return { imported, duplicates };
}
