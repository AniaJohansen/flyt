import { db } from '@/db';
import { format } from 'date-fns';

interface BackupData {
  version: number;
  exportedAt: string;
  projects: object[];
  timeBlocks: object[];
  tags: object[];
  settings: object[];
}

export async function exportData(): Promise<void> {
  const [projects, timeBlocks, tags, settings] = await Promise.all([
    db.projects.toArray(),
    db.timeBlocks.toArray(),
    db.tags.toArray(),
    db.settings.toArray(),
  ]);

  const backup: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    projects,
    timeBlocks,
    tags,
    settings,
  };

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const filename = `flyt-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importData(json: string): Promise<void> {
  let data: BackupData;
  try {
    data = JSON.parse(json) as BackupData;
  } catch {
    throw new Error('Ugyldig fil: kunne ikke lese JSON.');
  }

  if (data.version !== 1) {
    throw new Error(`Ugyldig backup-format (versjon ${data.version ?? 'ukjent'}).`);
  }

  if (!Array.isArray(data.projects) || !Array.isArray(data.timeBlocks) ||
      !Array.isArray(data.tags) || !Array.isArray(data.settings)) {
    throw new Error('Ugyldig backup: mangler påkrevde felter.');
  }

  await db.transaction('rw', [db.projects, db.timeBlocks, db.tags, db.settings], async () => {
    await db.projects.clear();
    await db.timeBlocks.clear();
    await db.tags.clear();
    await db.settings.clear();

    if (data.projects.length > 0) await db.projects.bulkAdd(data.projects as never[]);
    if (data.timeBlocks.length > 0) await db.timeBlocks.bulkAdd(data.timeBlocks as never[]);
    if (data.tags.length > 0) await db.tags.bulkAdd(data.tags as never[]);
    if (data.settings.length > 0) await db.settings.bulkAdd(data.settings as never[]);
  });
}
