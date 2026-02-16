import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import type { Settings } from '@/types';

const DEFAULTS: Settings = {
  id: 'singleton',
  dailyReminderTime: '16:00',
  defaultBlockSize: 30,
  workDayStart: '08:00',
  workDayEnd: '16:00',
  defaultTags: [],
  theme: 'light',
};

export function useSettings() {
  const settings = useLiveQuery(() => db.settings.get('singleton')) ?? DEFAULTS;

  async function updateSettings(
    changes: Partial<Omit<Settings, 'id'>>,
  ): Promise<void> {
    await db.settings.update('singleton', changes);
  }

  return { settings, updateSettings };
}
