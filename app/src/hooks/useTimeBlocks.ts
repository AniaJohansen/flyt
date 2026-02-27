import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/db';
import type { TimeBlock, AddTimeFormData } from '@/types';
import { addMinutesToTime } from '@/lib/dates';

export function useTimeBlocks(date: string) {
  const blocks = useLiveQuery(
    () =>
      db.timeBlocks
        .where('date')
        .equals(date)
        .sortBy('startTime'),
    [date],
  ) ?? [];

  async function addTimeBlock(data: AddTimeFormData): Promise<TimeBlock> {
    let startTime = data.startTime;
    if (!startTime) {
      const dayBlocks = await db.timeBlocks
        .where('date')
        .equals(date)
        .sortBy('startTime');

      if (dayBlocks.length > 0) {
        const lastBlock = dayBlocks[dayBlocks.length - 1];
        startTime = addMinutesToTime(
          lastBlock.startTime,
          lastBlock.durationMinutes,
        );
      } else {
        const settings = await db.settings.get('singleton');
        startTime = settings?.workDayStart ?? '08:00';
      }
    }

    const now = new Date().toISOString();
    const block: TimeBlock = {
      id: uuidv4(),
      date,
      startTime,
      durationMinutes: data.durationMinutes,
      projectId: data.projectId,
      comment: data.comment || null,
      tags: data.tags,
      billable: data.billable ?? true,
      createdAt: now,
      updatedAt: now,
    };
    await db.timeBlocks.add(block);
    return block;
  }

  async function updateTimeBlock(
    id: string,
    changes: Partial<Pick<TimeBlock, 'startTime' | 'durationMinutes' | 'projectId' | 'comment' | 'tags' | 'billable'>>,
  ): Promise<void> {
    await db.timeBlocks.update(id, {
      ...changes,
      updatedAt: new Date().toISOString(),
    });
  }

  async function deleteTimeBlock(id: string): Promise<void> {
    await db.timeBlocks.delete(id);
  }

  return { blocks, addTimeBlock, updateTimeBlock, deleteTimeBlock };
}
