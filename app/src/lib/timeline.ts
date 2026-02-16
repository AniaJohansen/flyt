import type { TimeBlock, TimelineSlot } from '@/types';
import { addMinutesToTime, timeToMinutes } from './dates';

export function buildTimeline(
  blocks: TimeBlock[],
  workDayStart: string,
  workDayEnd: string,
): TimelineSlot[] {
  const sorted = [...blocks].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  const slots: TimelineSlot[] = [];
  let cursor = workDayStart;
  const dayEndMinutes = timeToMinutes(workDayEnd);

  for (const block of sorted) {
    const blockStartMinutes = timeToMinutes(block.startTime);
    const cursorMinutes = timeToMinutes(cursor);

    if (blockStartMinutes > cursorMinutes) {
      slots.push({
        type: 'gap',
        startTime: cursor,
        endTime: block.startTime,
        durationMinutes: blockStartMinutes - cursorMinutes,
      });
    }

    const blockEnd = addMinutesToTime(block.startTime, block.durationMinutes);
    slots.push({
      type: 'block',
      startTime: block.startTime,
      endTime: blockEnd,
      durationMinutes: block.durationMinutes,
      block,
    });

    cursor = blockEnd;
  }

  const cursorMinutes = timeToMinutes(cursor);
  if (cursorMinutes < dayEndMinutes) {
    slots.push({
      type: 'gap',
      startTime: cursor,
      endTime: workDayEnd,
      durationMinutes: dayEndMinutes - cursorMinutes,
    });
  }

  return slots;
}
