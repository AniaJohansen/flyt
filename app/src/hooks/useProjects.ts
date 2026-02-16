import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/db';
import type { Project } from '@/types';
import { getNextColor } from '@/lib/colors';

export function useProjects() {
  const projects = useLiveQuery(() => db.projects.toArray()) ?? [];
  const activeProjects = useLiveQuery(
    () => db.projects.where('isActive').equals(1).toArray(),
  ) ?? [];

  async function addProject(data: {
    code: string;
    name: string;
    clientName?: string;
    color?: string;
  }): Promise<Project> {
    const existing = await db.projects.toArray();
    const now = new Date().toISOString();
    const project: Project = {
      id: uuidv4(),
      code: data.code,
      name: data.name,
      clientName: data.clientName || null,
      color: data.color || getNextColor(existing.map((p) => p.color)),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    await db.projects.add(project);
    return project;
  }

  async function updateProject(
    id: string,
    changes: Partial<Pick<Project, 'name' | 'clientName' | 'color' | 'isActive'>>,
  ): Promise<void> {
    await db.projects.update(id, { ...changes, updatedAt: new Date().toISOString() });
  }

  async function toggleActive(id: string): Promise<void> {
    const project = await db.projects.get(id);
    if (project) {
      await db.projects.update(id, {
        isActive: !project.isActive,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  return { projects, activeProjects, addProject, updateProject, toggleActive };
}
