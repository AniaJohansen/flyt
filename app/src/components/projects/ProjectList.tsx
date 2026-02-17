import { useState } from 'react';
import type { Project } from '@/types';
import { Dialog } from '@/components/shared/Dialog';
import { ProjectImport } from './ProjectImport';
import { nb } from '@/i18n/nb';

interface ProjectListProps {
  open: boolean;
  onClose: () => void;
  projects: Project[];
  onToggleActive: (id: string) => void;
  onUpdate: (
    id: string,
    changes: Partial<Pick<Project, 'name' | 'clientName' | 'color' | 'isActive'>>,
  ) => void;
  onAdd: (data: { code: string; name: string; clientName?: string }) => void;
}

export function ProjectList({
  open,
  onClose,
  projects,
  onToggleActive,
  onUpdate: _onUpdate,
  onAdd,
}: ProjectListProps) {
  const [showImport, setShowImport] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newClient, setNewClient] = useState('');

  const handleAdd = () => {
    if (!newCode || !newName) return;
    onAdd({ code: newCode, name: newName, clientName: newClient || undefined });
    setNewCode('');
    setNewName('');
    setNewClient('');
    setAddMode(false);
  };

  return (
    <Dialog open={open} onClose={onClose} title={nb.projects.title}>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setShowImport((s) => !s)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">upload_file</span>
          {nb.projects.importCSV}
        </button>
        <button
          type="button"
          onClick={() => setAddMode((s) => !s)}
          className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg text-sm font-bold text-white hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {nb.projects.add}
        </button>
      </div>

      {showImport && (
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
          <ProjectImport onDone={() => setShowImport(false)} />
        </div>
      )}

      {addMode && (
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 space-y-3">
          <input
            placeholder={nb.projects.code}
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white"
          />
          <input
            placeholder={nb.projects.name}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white"
          />
          <input
            placeholder={nb.projects.client}
            value={newClient}
            onChange={(e) => setNewClient(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 bg-primary rounded-lg text-sm font-bold text-white hover:bg-primary/90 transition-colors"
          >
            {nb.form.save}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-sm transition-shadow"
          >
            <span
              className="size-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: project.color }}
            />
            <span className="text-xs font-black text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
              {project.code}
            </span>
            <span className="text-sm font-medium flex-1 truncate dark:text-white">
              {project.clientName
                ? `${project.clientName} – ${project.name}`
                : project.name}
            </span>
            <button
              type="button"
              onClick={() => onToggleActive(project.id)}
              className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                project.isActive
                  ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {project.isActive ? nb.projects.active : nb.projects.inactive}
            </button>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">work</span>
            <p className="text-sm text-slate-400">{nb.form.noProjects}</p>
          </div>
        )}
      </div>
    </Dialog>
  );
}
