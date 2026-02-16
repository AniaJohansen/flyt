import { v4 as uuidv4 } from 'uuid';
import { db } from './index';
import type { Tag, Settings } from '@/types';

const DEFAULT_TAGS: Omit<Tag, 'id' | 'createdAt'>[] = [
  { name: 'Møte', color: '#4A90E2' },
  { name: 'Support', color: '#E2844A' },
  { name: 'Analyse', color: '#7B4AE2' },
  { name: 'Admin', color: '#4AE2A0' },
];

const DEFAULT_SETTINGS: Settings = {
  id: 'singleton',
  dailyReminderTime: '16:00',
  defaultBlockSize: 30,
  workDayStart: '08:00',
  workDayEnd: '16:00',
  defaultTags: [],
  theme: 'light',
};

export async function seedDatabase(): Promise<void> {
  const tagCount = await db.tags.count();
  if (tagCount === 0) {
    const now = new Date().toISOString();
    const tags: Tag[] = DEFAULT_TAGS.map((t) => ({
      ...t,
      id: uuidv4(),
      createdAt: now,
    }));
    await db.tags.bulkAdd(tags);
  }

  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.add(DEFAULT_SETTINGS);
  }
}
