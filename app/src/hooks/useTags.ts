import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/db';
import type { Tag } from '@/types';

export function useTags() {
  const tags = useLiveQuery(() => db.tags.toArray()) ?? [];

  async function addTag(name: string, color?: string): Promise<Tag> {
    const tag: Tag = {
      id: uuidv4(),
      name,
      color: color || null,
      createdAt: new Date().toISOString(),
    };
    await db.tags.add(tag);
    return tag;
  }

  async function deleteTag(id: string): Promise<void> {
    await db.tags.delete(id);
  }

  return { tags, addTag, deleteTag };
}
