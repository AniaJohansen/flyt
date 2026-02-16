import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react';
import type { Project, Tag, AddTimeFormData } from '@/types';
import { parseSmartInput, searchProjects } from '@/lib/smartInput';
import { DurationButtons } from './DurationButtons';
import { TagSelector } from './TagSelector';
import { nb } from '@/i18n/nb';

interface SmartInputProps {
  projects: Project[];
  tags: Tag[];
  defaultDuration: 15 | 30 | 60;
  onSubmit: (data: AddTimeFormData) => void;
  lastBlock?: { projectId: string; tags: string[] } | null;
}

export function SmartInput({
  projects,
  tags,
  defaultDuration,
  onSubmit,
  lastBlock,
}: SmartInputProps) {
  const [text, setText] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [duration, setDuration] = useState<15 | 30 | 60>(defaultDuration);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownIndex, setDropdownIndex] = useState(0);
  const [showFallback, setShowFallback] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const selectProject = useCallback(
    (project: Project) => {
      setSelectedProject(project);
      setShowDropdown(false);
      // Remove the /query from text and keep the rest
      const rest = text.replace(/^\/\S*\s*/, '');
      setText(rest);
      inputRef.current?.focus();
    },
    [text],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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

    if (e.key === 'Enter' && selectedProject) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!selectedProject) return;

    onSubmit({
      projectId: selectedProject.id,
      durationMinutes: duration,
      comment: parsed.comment,
      tags: selectedTags,
    });

    setText('');
    setSelectedProject(null);
    setSelectedTags([]);
    setDuration(defaultDuration);
    inputRef.current?.focus();
  };

  const handleRepeatLast = () => {
    if (!lastBlock) return;
    onSubmit({
      projectId: lastBlock.projectId,
      durationMinutes: duration,
      comment: '',
      tags: lastBlock.tags,
    });
  };

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName],
    );
  };

  const canSubmit = selectedProject !== null;

  return (
    <div className="smart-input">
      <div className="smart-input-main">
        {selectedProject && (
          <span
            className="selected-project-chip"
            style={{ backgroundColor: selectedProject.color }}
          >
            {selectedProject.clientName
              ? `${selectedProject.clientName} – ${selectedProject.name}`
              : selectedProject.name}
            <button
              type="button"
              className="chip-remove"
              onClick={() => setSelectedProject(null)}
            >
              &times;
            </button>
          </span>
        )}
        <input
          ref={inputRef}
          type="text"
          className="smart-input-field"
          placeholder={
            selectedProject
              ? '30m kommentar her... (Enter for å lagre)'
              : '/prosjektnavn 30m kommentar...'
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        {showDropdown && (
          <div className="smart-dropdown">
            {matchedProjects.map((project, i) => (
              <button
                key={project.id}
                type="button"
                className={`smart-dropdown-item ${i === dropdownIndex ? 'active' : ''}`}
                onClick={() => selectProject(project)}
              >
                <span
                  className="project-color-dot"
                  style={{ backgroundColor: project.color }}
                />
                <span className="project-code">{project.code}</span>
                <span className="project-name">
                  {project.clientName
                    ? `${project.clientName} – ${project.name}`
                    : project.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="smart-input-actions">
        <DurationButtons value={duration} onChange={setDuration} />

        <div className="smart-input-right">
          {lastBlock && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleRepeatLast}
              title={nb.form.repeatLast}
            >
              ↻
            </button>
          )}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setShowFallback((s) => !s)}
            title="Vis tags"
          >
            #
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {nb.form.save}
          </button>
        </div>
      </div>

      {showFallback && (
        <div className="smart-input-fallback">
          <TagSelector tags={tags} selected={selectedTags} onToggle={toggleTag} />
        </div>
      )}

      {canSubmit && parsed.comment && (
        <div className="smart-input-preview">
          <span
            className="preview-dot"
            style={{ backgroundColor: selectedProject.color }}
          />
          <span>{nb.minutes(duration)}</span>
          <span className="preview-sep">·</span>
          <span>{parsed.comment}</span>
          {selectedTags.length > 0 && (
            <>
              <span className="preview-sep">·</span>
              <span className="preview-tags">
                {selectedTags.map((t) => `#${t}`).join(' ')}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
