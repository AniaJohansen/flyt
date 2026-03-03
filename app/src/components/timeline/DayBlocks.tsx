import { useMemo, useState } from 'react';
import type { TimeBlock, Project } from '@/types';

interface DayBlocksProps {
  blocks: TimeBlock[];
  projects: Project[];
  onAdd: (projectId: string, durationMinutes: 15 | 30 | 60) => void;
  onDeleteBlock: (id: string) => void;
  onUpdateBlock: (id: string, changes: Partial<Pick<TimeBlock, 'comment' | 'durationMinutes' | 'billable'>>) => void;
}

function fmtMins(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const whole = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem === 0 ? `${whole}t` : `${whole}t ${rem}m`;
}

function BlockRow({
  block,
  onDelete,
  onUpdate,
}: {
  block: TimeBlock;
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Pick<TimeBlock, 'comment' | 'durationMinutes' | 'billable'>>) => void;
}) {
  const [comment, setComment] = useState(block.comment ?? '');
  const [dirty, setDirty] = useState(false);

  function handleCommentChange(v: string) {
    setComment(v);
    setDirty(true);
  }

  function handleCommentBlur() {
    if (dirty) {
      onUpdate(block.id, { comment: comment || null });
      setDirty(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pl-4 md:pl-6 pr-3 py-2 border-t border-slate-100 dark:border-slate-800">
      {/* Duration pills */}
      <div className="flex gap-1 flex-shrink-0">
        {([15, 30, 60] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onUpdate(block.id, { durationMinutes: d })}
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
              block.durationMinutes === d
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {d === 60 ? '1t' : `${d}m`}
          </button>
        ))}
      </div>

      {/* Comment */}
      <input
        type="text"
        value={comment}
        onChange={(e) => handleCommentChange(e.target.value)}
        onBlur={handleCommentBlur}
        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
        placeholder="Kommentar..."
        className="flex-1 min-w-[100px] text-xs px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-primary dark:text-white placeholder:text-slate-400"
      />

      {/* Billable toggle */}
      <button
        type="button"
        onClick={() => onUpdate(block.id, { billable: !block.billable })}
        title={block.billable ? 'Fakturerbar — klikk for å endre' : 'Ikke-fakturerbar — klikk for å endre'}
        className={`flex-shrink-0 flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
          block.billable
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
        }`}
      >
        <span className="material-symbols-outlined text-[12px]">
          {block.billable ? 'attach_money' : 'money_off'}
        </span>
        {block.billable ? 'F' : 'IF'}
      </button>

      {/* Delete */}
      <button
        type="button"
        onClick={() => onDelete(block.id)}
        className="flex-shrink-0 p-1 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        title="Slett denne blokken"
      >
        <span className="material-symbols-outlined text-[16px]">delete</span>
      </button>
    </div>
  );
}

export function DayBlocks({ blocks, projects, onAdd, onDeleteBlock, onUpdateBlock }: DayBlocksProps) {
  const projectMap = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Group blocks by projectId, preserve order of first appearance
  const groups = useMemo(() => {
    const order: string[] = [];
    const byProject = new Map<string, TimeBlock[]>();
    for (const b of blocks) {
      if (!byProject.has(b.projectId)) {
        order.push(b.projectId);
        byProject.set(b.projectId, []);
      }
      byProject.get(b.projectId)!.push(b);
    }
    return order.map((pid) => ({ projectId: pid, blocks: byProject.get(pid)! }));
  }, [blocks]);

  const totalMinutes = blocks.reduce((s, b) => s + b.durationMinutes, 0);
  const billableMinutes = blocks.filter((b) => b.billable !== false).reduce((s, b) => s + b.durationMinutes, 0);
  const nonBillableMinutes = totalMinutes - billableMinutes;

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">view_agenda</span>
        <h4 className="text-lg font-bold text-slate-400 mb-2">Ingen bolker registrert</h4>
        <p className="text-sm text-slate-400">
          Trykk <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-bold">N</kbd> for å starte
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map(({ projectId, blocks: projectBlocks }) => {
        const project = projectMap.get(projectId);
        if (!project) return null;

        const projectTotal = projectBlocks.reduce((s, b) => s + b.durationMinutes, 0);
        const projectBillable = projectBlocks.filter((b) => b.billable !== false).reduce((s, b) => s + b.durationMinutes, 0);
        const projectNonBillable = projectTotal - projectBillable;
        const lastBlock = projectBlocks[projectBlocks.length - 1];
        const isExpanded = expandedId === projectId;

        return (
          <div
            key={projectId}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
          >
            {/* Project header row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 md:px-4 py-3">
              {/* Color dot */}
              <span
                className="size-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: project.color }}
              />

              {/* Project info — clickable to expand */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : projectId)}
                className="flex-1 min-w-0 text-left"
              >
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {project.code}
                  </span>
                  {project.clientName && (
                    <span className="text-xs text-slate-500 truncate">{project.clientName}</span>
                  )}
                </div>
                {project.name && (
                  <p className="text-xs text-slate-400 truncate">{project.name}</p>
                )}
              </button>

              {/* Time total */}
              <div className="text-right flex-shrink-0">
                <span className="text-sm font-black tabular-nums text-slate-900 dark:text-white">
                  {fmtMins(projectTotal)}
                </span>
                {projectNonBillable > 0 && (
                  <p className="text-[11px] text-slate-400 font-medium">
                    {fmtMins(projectBillable > 0 ? projectNonBillable : projectTotal)} IF
                  </p>
                )}
              </div>

              {/* Quick-add buttons */}
              <div className="flex gap-1 flex-shrink-0">
                {([15, 30, 60] as const).map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => onAdd(projectId, mins)}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg transition-colors"
                    title={`Legg til ${mins === 60 ? '1t' : `${mins}m`}`}
                  >
                    +{mins === 60 ? '1t' : `${mins}m`}
                  </button>
                ))}
              </div>

              {/* Expand/collapse toggle */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : projectId)}
                className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={isExpanded ? 'Skjul blokker' : `Vis og rediger ${projectBlocks.length} blokk${projectBlocks.length !== 1 ? 'er' : ''}`}
              >
                <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {/* Remove last block */}
              <button
                type="button"
                onClick={() => onDeleteBlock(lastBlock.id)}
                className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Fjern siste blokk"
              >
                <span className="material-symbols-outlined text-[18px]">remove_circle_outline</span>
              </button>
            </div>

            {/* Expanded block list */}
            {isExpanded && (
              <div className="border-t border-slate-100 dark:border-slate-800">
                <div className="px-3 md:px-4 py-1.5 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {projectBlocks.length} blokk{projectBlocks.length !== 1 ? 'er' : ''}
                  </span>
                </div>
                {projectBlocks.map((block) => (
                  <BlockRow
                    key={block.id}
                    block={block}
                    onDelete={onDeleteBlock}
                    onUpdate={onUpdateBlock}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Day total */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Totalt i dag</span>
        <div className="text-right">
          <span className="text-sm font-black tabular-nums text-slate-900 dark:text-white">
            {fmtMins(totalMinutes)}
          </span>
          {nonBillableMinutes > 0 && (
            <span className="text-xs text-slate-400 font-medium ml-2">
              ({fmtMins(billableMinutes > 0 ? nonBillableMinutes : totalMinutes)} IF)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
