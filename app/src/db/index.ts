import Dexie, { type Table } from 'dexie';
import type { Project, TimeBlock, Tag, Settings } from '@/types';

export class TimebankDB extends Dexie {
  projects!: Table<Project>;
  timeBlocks!: Table<TimeBlock>;
  tags!: Table<Tag>;
  settings!: Table<Settings>;

  constructor() {
    super('timebank');
    this.version(1).stores({
      projects: 'id, code, isActive, updatedAt',
      timeBlocks: 'id, date, projectId, [date+startTime]',
      tags: 'id, name',
      settings: 'id',
    });
    this.version(2).stores({
      projects: 'id, code, isActive, updatedAt',
      timeBlocks: 'id, date, projectId, [date+startTime]',
      tags: 'id, name',
      settings: 'id',
    }).upgrade(tx =>
      tx.table('projects').toCollection().modify(p => {
        if (p.projectType === undefined) p.projectType = null;
      }),
    );
  }
}

export const db = new TimebankDB();
