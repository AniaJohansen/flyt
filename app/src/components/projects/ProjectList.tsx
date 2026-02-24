import { useState, useCallback, useMemo } from 'react';
import type { Project, ProjectType } from '@/types';
import { Dialog } from '@/components/shared/Dialog';
import { ProjectImport } from './ProjectImport';
import { buildClientColorMap } from '@/lib/clientColors';
import { nb } from '@/i18n/nb';

const PROJECT_TYPES: ProjectType[] = ['Fastpris', 'T&M', 'Lisens'];
const TYPE_ORDER: Record<string, number> = { Fastpris: 0, 'T&M': 1, Lisens: 2 };

interface ProjectListProps {
  open: boolean;
  onClose: () => void;
  projects: Project[];
  onToggleActive: (id: string) => void;
  onUpdate: (
    id: string,
    changes: Partial<Pick<Project, 'name' | 'clientName' | 'projectType' | 'color' | 'isActive'>>,
  ) => void;
  onAdd: (data: { code: string; name: string; clientName?: string; projectType?: ProjectType }) => void;
  onDelete: (id: string) => void;
}

export function ProjectList({
  open,
  onClose,
  projects,
  onToggleActive,
  onUpdate,
  onAdd,
  onDelete,
}: ProjectListProps) {
  const [showImport, setShowImport] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newType, setNewType] = useState<ProjectType | ''>('');
  const [showInactive, setShowInactive] = useState(false);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editClient, setEditClient] = useState('');
  const [editType, setEditType] = useState<ProjectType | ''>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Split active / inactive
  const activeProjects = useMemo(() => projects.filter((p) => p.isActive), [projects]);
  const inactiveProjects = useMemo(() => projects.filter((p) => !p.isActive), [projects]);

  const sortProjects = (list: Project[]) =>
    [...list].sort((a, b) => {
      const clientA = a.clientName ?? '';
      const clientB = b.clientName ?? '';
      const clientCmp = clientA.localeCompare(clientB, 'nb');
      if (clientCmp !== 0) return clientCmp;
      const typeA = TYPE_ORDER[a.projectType ?? ''] ?? 99;
      const typeB = TYPE_ORDER[b.projectType ?? ''] ?? 99;
      if (typeA !== typeB) return typeA - typeB;
      return a.code.localeCompare(b.code, 'nb');
    });

  const sortedActive = useMemo(() => sortProjects(activeProjects), [activeProjects]);
  const sortedInactive = useMemo(() => sortProjects(inactiveProjects), [inactiveProjects]);

  // Fixed width for code column based on longest code
  const codeWidth = useMemo(() => {
    const longest = projects.reduce((max, p) => Math.max(max, p.code.length), 0);
    return `${Math.max(longest * 0.65, 4)}rem`;
  }, [projects]);

  const canAdd = newCode.trim() !== '' && newClient.trim() !== '' && newType !== '';

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({
      code: newCode.trim(),
      name: newCode.trim(),
      clientName: newClient.trim(),
      projectType: newType as ProjectType,
    });
    setNewCode('');
    setNewClient('');
    setNewType('');
    setAddMode(false);
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setEditClient(project.clientName ?? '');
    setEditType(project.projectType ?? '');
    setConfirmDeleteId(null);
  };

  const saveEdit = () => {
    if (!editingId) return;
    onUpdate(editingId, {
      clientName: editClient || null,
      projectType: editType || null,
    });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setConfirmDeleteId(null);
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      onDelete(id);
      setEditingId(null);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  const handleClose = useCallback(() => {
    if (addMode && canAdd) {
      handleAdd();
    }
    if (editingId) {
      saveEdit();
    }
    setAddMode(false);
    onClose();
  }, [addMode, canAdd, editingId, onClose]);

  const colorMap = useMemo(() => buildClientColorMap(projects), [projects]);

  const renderProjectRow = (project: Project, inactive = false) => {
    return (
      <div key={project.id}>
        <div
          className={`flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 transition-shadow group border-l-[3px] ${
            inactive
              ? 'opacity-50 italic bg-slate-50 dark:bg-slate-800/50'
              : 'bg-white dark:bg-slate-800 hover:shadow-sm'
          }`}
          style={{ borderLeftColor: inactive ? '#94a3b8' : project.color }}
        >
          <span
            className="size-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: inactive ? '#94a3b8' : project.color }}
          />
          <span
            className={`text-xs font-black px-2 py-0.5 rounded text-center flex-shrink-0 ${
              inactive ? 'text-slate-400 bg-slate-100 dark:bg-slate-700' : ''
            }`}
            style={inactive ? { minWidth: codeWidth } : {
              minWidth: codeWidth,
              color: project.color,
              backgroundColor: `${project.color}15`,
            }}
          >
            {project.code}
          </span>
          <span className={`text-sm flex-1 truncate ${
            inactive
              ? 'font-normal text-slate-400'
              : 'font-medium dark:text-white'
          }`}>
            {project.clientName || ''}
          </span>
          {project.projectType && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                inactive ? 'text-slate-400 bg-slate-100 dark:bg-slate-700' : ''
              }`}
              style={inactive ? {} : {
                color: project.color,
                backgroundColor: `${project.color}15`,
              }}
            >
              {project.projectType}
            </span>
          )}
          <button
            type="button"
            onClick={() => startEdit(project)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 transition-colors opacity-0 group-hover:opacity-100"
            title="Rediger"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
        </div>

        {/* Inline edit form */}
        {editingId === project.id && (
          <div className="mt-1 ml-10 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
            <input
              placeholder={nb.projects.client}
              value={editClient}
              onChange={(e) => setEditClient(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white"
              autoFocus
            />
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Type prosjekt</label>
              <div className="flex gap-2">
                {PROJECT_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEditType(editType === t ? '' : t)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                      editType === t
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-slate-200 dark:border-slate-600 hover:border-primary hover:text-primary text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {/* Active/inactive toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { onToggleActive(project.id); setEditingId(null); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  project.isActive
                    ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                    : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {project.isActive ? 'visibility_off' : 'visibility'}
                </span>
                {project.isActive ? 'Deaktiver' : 'Aktiver'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={saveEdit}
                className="px-4 py-1.5 bg-primary rounded-lg text-xs font-bold text-white hover:bg-primary/90 transition-colors"
              >
                {nb.form.save}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-1.5 text-slate-500 text-xs font-bold"
              >
                Avbryt
              </button>
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => handleDelete(project.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  confirmDeleteId === project.id
                    ? 'bg-red-500 text-white'
                    : 'text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {confirmDeleteId === project.id ? 'warning' : 'delete'}
                </span>
                {confirmDeleteId === project.id ? 'Bekreft sletting' : 'Slett'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} title={nb.projects.title}>
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
            autoFocus
          />
          <input
            placeholder={nb.projects.client}
            value={newClient}
            onChange={(e) => setNewClient(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white"
          />
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Type prosjekt</label>
            <div className="flex gap-2">
              {PROJECT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewType(newType === t ? '' : t)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                    newType === t
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 dark:border-slate-600 hover:border-primary hover:text-primary text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              canAdd
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            {nb.form.save}
          </button>
        </div>
      )}

      {/* Active projects */}
      <div className="space-y-1">
        {(() => {
          let lastClient: string | null | undefined = undefined;
          return sortedActive.map((project) => {
            const showClientHeader = project.clientName !== lastClient;
            lastClient = project.clientName;
            const clientHue = project.clientName
              ? colorMap.getClientHue(project.clientName)
              : null;
            return (
              <div key={project.id}>
                {showClientHeader && (
                  <div className="mt-3 mb-1 px-1">
                    <span
                      className="text-[11px] font-black uppercase tracking-widest"
                      style={{
                        color: clientHue !== null
                          ? `hsl(${clientHue}, 65%, 52%)`
                          : '#94a3b8',
                      }}
                    >
                      {project.clientName || 'Uten kunde'}
                    </span>
                  </div>
                )}
                {renderProjectRow(project)}
              </div>
            );
          });
        })()}
        {projects.length === 0 && (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">work</span>
            <p className="text-sm text-slate-400">{nb.form.noProjects}</p>
          </div>
        )}
      </div>

      {/* Inactive projects toggle */}
      {inactiveProjects.length > 0 && (
        <div className="mt-4 border-t border-slate-100 dark:border-slate-700 pt-3">
          <button
            type="button"
            onClick={() => setShowInactive((s) => !s)}
            className="flex items-center gap-2 w-full text-left text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors py-1"
          >
            <span className="material-symbols-outlined text-sm">
              {showInactive ? 'expand_less' : 'expand_more'}
            </span>
            {showInactive
              ? 'Skjul inaktive prosjekter'
              : `Vis ${inactiveProjects.length} inaktive prosjekt${inactiveProjects.length === 1 ? '' : 'er'}`}
          </button>
          {showInactive && (
            <div className="space-y-1 mt-2">
              {sortedInactive.map((project) => renderProjectRow(project, true))}
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}
