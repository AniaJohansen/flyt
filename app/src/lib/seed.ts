import { v4 as uuidv4 } from 'uuid';
import { db } from '@/db';

const DEMO_PROJECTS = [
  { code: 'ACME-WEB', name: 'Nettside 2025', clientName: 'ACME AS', projectType: 'Fastpris' as const, color: '#4A90E2' },
  { code: 'ACME-INT', name: 'IT-integrasjon', clientName: 'ACME AS', projectType: 'T&M' as const, color: '#2E70C2' },
  { code: 'GLOB-CRM', name: 'CRM-utvikling', clientName: 'Globex Corp', projectType: 'T&M' as const, color: '#E2844A' },
  { code: 'GLOB-LIS', name: 'Lisensavtale', clientName: 'Globex Corp', projectType: 'Lisens' as const, color: '#C2642A' },
  { code: 'INT', name: 'Interne møter', clientName: null, projectType: null, color: '#94a3b8' },
  { code: 'KURS', name: 'Kompetanseutvikling', clientName: null, projectType: null, color: '#7B4AE2' },
];

export async function seedDemoProjects(): Promise<void> {
  const now = new Date().toISOString();
  for (const d of DEMO_PROJECTS) {
    await db.projects.add({
      id: uuidv4(),
      code: d.code,
      name: d.name,
      clientName: d.clientName,
      projectType: d.projectType,
      color: d.color,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }
}
