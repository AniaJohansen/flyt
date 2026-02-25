import { useState } from 'react';
import type { TimeBlock as TimeBlockType, Project } from '@/types';
import { nb } from '@/i18n/nb';

interface TimeBlockProps {
  block: TimeBlockType;
  project: Project | undefined;
  onDelete: (id: string) => void;
  onUpdate: (
    id: string,
    changes: Partial<Pick<TimeBlockType, 'comment' | 'durationMinutes' | 'startTime'>>,
  ) => void;
}

export function TimeBlockComponent({
  block,
  project,
  onDelete,
  onUpdate,
}: TimeBlockProps) {
  const [editing, setEditing] = useState(false);
  const [editComment, setEditComment] = useState(block.comment ?? '');
  const [editDuration, setEditDuration] = useState<15 | 30 | 60>(block.durationMinutes);
  const [editingTime, setEditingTime] = useState(false);
  const [editStartTime, setEditStartTime] = useState(block.startTime);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleOpenEdit = () => {
    setEditComment(block.comment ?? '');
    setEditDuration(block.durationMinutes);
    setEditing(true);
  };

  const handleSaveEdit = () => {
    const changes: Partial<Pick<TimeBlockType, 'comment' | 'durationMinutes'>> = {};
    if (editComment !== (block.comment ?? '')) changes.comment = editComment || null;
    if (editDuration !== block.durationMinutes) changes.durationMinutes = editDuration;
    if (Object.keys(changes).length > 0) onUpdate(block.id, changes);
    setEditing(false);
  };

  const handleSaveStartTime = () => {
    if (editStartTime && editStartTime !== block.startTime) {
      onUpdate(block.id, { startTime: editStartTime });
    }
    setEditingTime(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(block.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const endTime = addMinutes(block.startTime, block.durationMinutes);
  const color = project?.color ?? '#888';

  return (
    <div className="relative pl-14 pb-4 group">
      {/* Timeline circle — shows start time instead of icon */}
      <div
        className="absolute left-0 top-0 size-10 rounded-full flex flex-col items-center justify-center text-white ring-4 ring-white dark:ring-slate-900 z-10"
        style={{ backgroundColor: color }}
        title={`Starttid: ${block.startTime}`}
      >
        <span className="text-[9px] font-black leading-none tracking-tight tabular-nums">
          {block.startTime}
        </span>
      </div>

      {/* Vertical connector line */}
      <div
        className="absolute left-5 top-10 w-px bg-slate-200 dark:bg-slate-700"
        style={{ height: 'calc(100% - 40px)' }}
      />

      {/* Card */}
      <div
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border-l-4"
        style={{ borderLeftColor: color, backgroundColor: `${color}06` }}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-black px-2 py-0.5 rounded"
                style={{ color, backgroundColor: `${color}15` }}
              >
                {project?.code ?? '???'}
              </span>
              <h4 className="text-sm font-bold dark:text-white truncate">
                {project
                  ? project.clientName
                    ? `${project.clientName} – ${project.name}`
                    : project.name
                  : 'Ukjent prosjekt'}
              </h4>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {editingTime ? (
                <input
                  type="time"
                  value={editStartTime}
                  onChange={(e) => setEditStartTime(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveStartTime();
                    if (e.key === 'Escape') { setEditingTime(false); setEditStartTime(block.startTime); }
                  }}
                  onBlur={handleSaveStartTime}
                  className="text-xs px-2 py-0.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded focus:ring-2 focus:ring-primary outline-none dark:text-white"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => { setEditingTime(true); setEditStartTime(block.startTime); }}
                  className="cursor-pointer hover:text-primary hover:underline transition-colors"
                  title="Klikk for å endre starttid"
                >
                  {block.startTime}
                </span>
              )}
              {' '}- {endTime}
              <span className="text-slate-300 mx-1.5">&bull;</span>
              <span className="font-semibold">{nb.minutes(block.durationMinutes)}</span>
            </p>

            {/* Inline edit */}
            {editing ? (
              <div className="mt-3 space-y-2">
                {/* Duration pills */}
                <div className="flex gap-1.5">
                  {([15, 30, 60] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setEditDuration(d)}
                      className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                        editDuration === d
                          ? 'bg-primary text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {d === 60 ? '1t' : `${d}m`}
                    </button>
                  ))}
                </div>
                {/* Comment input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') setEditing(false);
                    }}
                    className="flex-1 text-sm px-3 py-1.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none dark:text-white"
                    placeholder="Legg til kommentar..."
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg"
                  >
                    Lagre
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-3 py-1.5 text-slate-500 text-xs font-bold"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            ) : (
              block.comment && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">{block.comment}</p>
              )
            )}

            {/* Tags */}
            {block.tags.length > 0 && (
              <div className="flex gap-1 mt-2">
                {block.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            <button
              onClick={handleOpenEdit}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 transition-colors"
              title={nb.timeline.edit}
            >
              <span className="material-symbols-outlined text-lg">edit</span>
            </button>
            <button
              onClick={handleDelete}
              className={`p-1.5 rounded transition-colors ${
                confirmDelete
                  ? 'bg-red-50 text-red-500 hover:bg-red-100'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400'
              }`}
              title={confirmDelete ? 'Klikk igjen for å slette' : nb.timeline.delete}
            >
              <span className="material-symbols-outlined text-lg">
                {confirmDelete ? 'warning' : 'delete'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
