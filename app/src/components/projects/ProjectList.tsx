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
      <div className="project-list-actions">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => setShowImport((s) => !s)}
        >
          {nb.projects.importCSV}
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setAddMode((s) => !s)}
        >
          + {nb.projects.add}
        </button>
      </div>

      {showImport && (
        <ProjectImport onDone={() => setShowImport(false)} />
      )}

      {addMode && (
        <div className="project-add-form">
          <input
            placeholder={nb.projects.code}
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
          />
          <input
            placeholder={nb.projects.name}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            placeholder={nb.projects.client}
            value={newClient}
            onChange={(e) => setNewClient(e.target.value)}
          />
          <button type="button" className="btn btn-primary btn-sm" onClick={handleAdd}>
            {nb.form.save}
          </button>
        </div>
      )}

      <div className="project-list">
        {projects.map((project) => (
          <div key={project.id} className="project-list-item">
            <span
              className="project-color-dot large"
              style={{ backgroundColor: project.color }}
            />
            <div className="project-list-info">
              <span className="project-list-code">{project.code}</span>
              <span className="project-list-name">
                {project.clientName
                  ? `${project.clientName} – ${project.name}`
                  : project.name}
              </span>
            </div>
            <button
              type="button"
              className={`btn btn-ghost btn-sm ${project.isActive ? '' : 'inactive'}`}
              onClick={() => onToggleActive(project.id)}
            >
              {project.isActive ? nb.projects.active : nb.projects.inactive}
            </button>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="empty-text">{nb.form.noProjects}</p>
        )}
      </div>
    </Dialog>
  );
}
