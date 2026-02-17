import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import type { Project, Tag, AddTimeFormData } from '@/types';
import { parseSmartInput, searchProjects } from '@/lib/smartInput';

interface NewEntryModalProps {
  onClose: () => void;
  onSubmit: (data: AddTimeFormData) => void;
  projects: Project[];
  tags: Tag[];
  defaultDuration: 15 | 30 | 60;
  startTime?: string;
}

const NewEntryModal: React.FC<NewEntryModalProps> = ({
  onClose,
  onSubmit,
  projects,
  tags,
  defaultDuration,
  startTime,
}) => {
  const [text, setText] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [duration, setDuration] = useState<15 | 30 | 60>(defaultDuration);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownIndex, setDropdownIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const parsed = parseSmartInput(text, projects, tags);
  const isProjectSearch = text.startsWith('/');
  const matchedProjects = isProjectSearch
    ? searchProjects(parsed.projectQuery ?? '', projects)
    : [];

  useEffect(() => {
    setShowDropdown(isProjectSearch && !selectedProject && matchedProjects.length > 0);
    setDropdownIndex(0);
  }, [text, isProjectSearch, selectedProject, matchedProjects.length]);

  useEffect(() => {
    if (parsed.durationMinutes) setDuration(parsed.durationMinutes);
  }, [parsed.durationMinutes]);

  useEffect(() => {
    if (parsed.tags.length > 0) setSelectedTags(parsed.tags);
  }, [parsed.tags.join(',')]);

  const selectProject = (project: Project) => {
    setSelectedProject(project);
    setShowDropdown(false);
    const rest = text.replace(/^\/\S*\s*/, '');
    setText(rest);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showDropdown) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setDropdownIndex((i) => Math.min(i + 1, matchedProjects.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setDropdownIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (matchedProjects[dropdownIndex]) {
          selectProject(matchedProjects[dropdownIndex]);
        }
      } else if (e.key === 'Escape') {
        setShowDropdown(false);
      }
      return;
    }

    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSubmit = () => {
    if (!selectedProject) return;
    onSubmit({
      projectId: selectedProject.id,
      durationMinutes: duration,
      comment: parsed.comment || text.trim(),
      tags: selectedTags,
      startTime,
    });
    onClose();
  };

  const canSubmit = selectedProject !== null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-[520px] rounded-xl shadow-2xl overflow-hidden border border-white/20">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Ny føring</h2>
            <p className="text-sm text-slate-500">
              {startTime ? `Fyll gap fra ${startTime}` : 'Registrer tid på et prosjekt'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Selected project chip */}
          {selectedProject && (
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: selectedProject.color }}
              >
                {selectedProject.code} — {selectedProject.name}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="hover:opacity-70"
                >
                  &times;
                </button>
              </span>
            </div>
          )}

          {/* Smart Input Area */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              autoFocus
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary focus:ring-0 rounded-xl text-lg font-medium text-slate-900 dark:text-white placeholder:text-slate-400 resize-none min-h-[120px] shadow-inner transition-all outline-none"
              placeholder={selectedProject ? 'Hva har du gjort?' : '/prosjektnavn Hva har du gjort?'}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {/* Project dropdown */}
            {showDropdown && (
              <div className="absolute left-4 top-16 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-600 overflow-hidden z-10 max-h-48 overflow-y-auto">
                {matchedProjects.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => selectProject(p)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                      i === dropdownIndex ? 'bg-primary/5' : ''
                    }`}
                  >
                    <span
                      className="size-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-xs font-black text-slate-500">{p.code}</span>
                    <span className="text-sm font-medium dark:text-white truncate">
                      {p.clientName ? `${p.clientName} – ${p.name}` : p.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Live Interpretation Preview */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              Tolkning i sanntid
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase">Prosjekt</span>
                <span className={`text-sm font-bold ${selectedProject ? 'text-primary' : 'italic text-slate-400'}`}>
                  {selectedProject ? selectedProject.code : 'Venter...'}
                </span>
              </div>
              <div className="w-px h-8 bg-slate-100 dark:bg-slate-700"></div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase">Tid</span>
                <span className="text-sm font-bold dark:text-white">
                  {duration === 60 ? '1t' : `${duration}m`}
                </span>
              </div>
              <div className="w-px h-8 bg-slate-100 dark:bg-slate-700"></div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase">Beskrivelse</span>
                <span className="text-sm font-medium text-slate-500">
                  {parsed.comment || 'Skriv tekst...'}
                </span>
              </div>
              {selectedTags.length > 0 && (
                <>
                  <div className="w-px h-8 bg-slate-100 dark:bg-slate-700"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase">Tags</span>
                    <span className="text-sm font-medium text-primary">
                      {selectedTags.map(t => `#${t}`).join(' ')}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Select Duration */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Hurtigvalg tid</label>
            <div className="flex gap-2">
              {([15, 30, 60] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    duration === d
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white'
                  }`}
                >
                  {d === 60 ? '1t' : `${d}m`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            Avbryt
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-8 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Lagre
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewEntryModal;
