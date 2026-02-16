import { useState } from 'react';
import type { TimeBlock as TimeBlockType, Project } from '@/types';
import { nb } from '@/i18n/nb';

interface TimeBlockProps {
  block: TimeBlockType;
  project: Project | undefined;
  onDelete: (id: string) => void;
  onUpdate: (
    id: string,
    changes: Partial<Pick<TimeBlockType, 'comment' | 'durationMinutes'>>,
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

  const handleSaveComment = () => {
    onUpdate(block.id, { comment: editComment || null });
    setEditing(false);
  };

  return (
    <div
      className="time-block"
      style={{ borderLeftColor: project?.color ?? '#888' }}
    >
      <div className="time-block-header">
        <span className="time-block-time">
          {block.startTime}–
          {addMinutes(block.startTime, block.durationMinutes)}
        </span>
        <span className="time-block-duration">
          {nb.minutes(block.durationMinutes)}
        </span>
      </div>

      <div className="time-block-project">
        <span
          className="project-color-dot"
          style={{ backgroundColor: project?.color ?? '#888' }}
        />
        {project
          ? project.clientName
            ? `${project.clientName} – ${project.name}`
            : project.name
          : 'Ukjent prosjekt'}
      </div>

      {editing ? (
        <div className="time-block-edit">
          <input
            type="text"
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveComment();
              if (e.key === 'Escape') setEditing(false);
            }}
            autoFocus
          />
        </div>
      ) : (
        block.comment && (
          <div className="time-block-comment">{block.comment}</div>
        )
      )}

      {block.tags.length > 0 && (
        <div className="time-block-tags">
          {block.tags.map((tag) => (
            <span key={tag} className="tag-chip small">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="time-block-actions">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setEditing(!editing)}
        >
          {nb.timeline.edit}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-danger-text"
          onClick={() => {
            if (confirm(nb.timeline.confirmDelete)) {
              onDelete(block.id);
            }
          }}
        >
          {nb.timeline.delete}
        </button>
      </div>
    </div>
  );
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
