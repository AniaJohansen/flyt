import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import type { Project } from '@/types';

interface ProjectBreakdown {
  project: Project;
  billableMinutes: number;
  nonBillableMinutes: number;
}

interface ClientGroup {
  clientName: string;
  projects: ProjectBreakdown[];
  totalMinutes: number;
  billableMinutes: number;
  nonBillableMinutes: number;
}

interface AllTimeReportProps {
  open: boolean;
  onClose: () => void;
}

function fmt(minutes: number): string {
  if (minutes === 0) return '0t';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}t`;
  if (h === 0) return `${m}m`;
  return `${h}t ${m}m`;
}


export function AllTimeReport({ open, onClose }: AllTimeReportProps) {
  const allBlocks = useLiveQuery(() => db.timeBlocks.toArray(), []) ?? [];
  const allProjects = useLiveQuery(() => db.projects.toArray(), []) ?? [];

  const projectMap = useMemo(
    () => new Map(allProjects.map((p) => [p.id, p])),
    [allProjects],
  );

  const { clientGroups, grandTotal, grandBillable, grandNonBillable } = useMemo(() => {
    // Accumulate minutes per project split by billable flag
    const projectData = new Map<string, { billable: number; nonBillable: number }>();
    for (const block of allBlocks) {
      const entry = projectData.get(block.projectId) ?? { billable: 0, nonBillable: 0 };
      if (block.billable !== false) {
        entry.billable += block.durationMinutes;
      } else {
        entry.nonBillable += block.durationMinutes;
      }
      projectData.set(block.projectId, entry);
    }

    // Group breakdowns by client key
    const clientMap = new Map<string, ProjectBreakdown[]>();
    for (const [projectId, data] of projectData) {
      const project = projectMap.get(projectId);
      if (!project) continue;
      const key = project.clientName ?? '\x00internt'; // \x00 sorts last
      const list = clientMap.get(key) ?? [];
      list.push({ project, billableMinutes: data.billable, nonBillableMinutes: data.nonBillable });
      clientMap.set(key, list);
    }

    // Sort clients: named clients alphabetically, then internal (null) last
    const sorted = Array.from(clientMap.entries()).sort(([a], [b]) => {
      if (a.startsWith('\x00') && !b.startsWith('\x00')) return 1;
      if (!a.startsWith('\x00') && b.startsWith('\x00')) return -1;
      return a.localeCompare(b, 'nb');
    });

    let grandTotal = 0;
    let grandBillable = 0;
    let grandNonBillable = 0;

    const clientGroups: ClientGroup[] = sorted.map(([key, projects]) => {
      const sortedProjects = [...projects].sort(
        (a, b) => (b.billableMinutes + b.nonBillableMinutes) - (a.billableMinutes + a.nonBillableMinutes),
      );
      const total = projects.reduce((s, p) => s + p.billableMinutes + p.nonBillableMinutes, 0);
      const billable = projects.reduce((s, p) => s + p.billableMinutes, 0);
      const nonBillable = projects.reduce((s, p) => s + p.nonBillableMinutes, 0);
      grandTotal += total;
      grandBillable += billable;
      grandNonBillable += nonBillable;

      const clientName = key.startsWith('\x00')
        ? (projects[0]?.project.clientName ?? 'Internt')
        : key;

      return {
        clientName,
        projects: sortedProjects,
        totalMinutes: total,
        billableMinutes: billable,
        nonBillableMinutes: nonBillable,
      };
    });

    return { clientGroups, grandTotal, grandBillable, grandNonBillable };
  }, [allBlocks, projectMap]);

  if (!open) return null;

  const billablePct = grandTotal > 0 ? Math.round((grandBillable / grandTotal) * 100) : 0;
  const nonBillablePct = grandTotal > 0 ? 100 - billablePct : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 backdrop-blur-md md:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-slate-900 w-full md:max-w-2xl max-h-[92dvh] md:max-h-[88vh] rounded-t-2xl md:rounded-xl shadow-2xl border-0 md:border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white">Totaloversikt</h2>
            <p className="text-xs md:text-sm text-slate-500">All registrert tid, summert per kunde og prosjekt</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Summary strip */}
        <div className="px-4 md:px-6 py-3 md:py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 md:gap-6 flex-shrink-0 flex-wrap">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Totalt</p>
            <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{fmt(grandTotal)}</p>
          </div>
          <div className="w-px self-stretch bg-slate-200 dark:bg-slate-700" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Fakturerbar</p>
            <p className="text-xl md:text-2xl font-black text-emerald-600">
              {fmt(grandBillable)}
              <span className="text-xs md:text-sm font-normal text-slate-400 ml-1">({billablePct}%)</span>
            </p>
          </div>
          {grandNonBillable > 0 && (
            <>
              <div className="w-px self-stretch bg-slate-200 dark:bg-slate-700" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Ikke-fakturerbar</p>
                <p className="text-xl md:text-2xl font-black text-slate-500">
                  {fmt(grandNonBillable)}
                  <span className="text-xs md:text-sm font-normal text-slate-400 ml-1">({nonBillablePct}%)</span>
                </p>
              </div>
            </>
          )}
          {/* Grand total bar */}
          {grandTotal > 0 && (
            <div className="flex-1 ml-2">
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${billablePct}%` }}
                />
                {grandNonBillable > 0 && (
                  <div
                    className="h-full bg-slate-400 dark:bg-slate-500 transition-all duration-500"
                    style={{ width: `${nonBillablePct}%` }}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Client groups */}
        <div className="overflow-y-auto flex-1 p-4 md:p-6 space-y-6 md:space-y-7">
          {clientGroups.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">bar_chart</span>
              <p className="text-slate-400 font-medium">Ingen tid registrert ennå</p>
            </div>
          )}

          {clientGroups.map((client) => (
            <div key={client.clientName}>
              {/* Client heading */}
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {client.clientName}
                </h3>
                <div className="flex items-center gap-3 text-xs">
                  {client.nonBillableMinutes > 0 && client.billableMinutes > 0 ? (
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {fmt(client.billableMinutes)}{' '}
                      <span className="text-slate-400 font-normal">({fmt(client.nonBillableMinutes)} IF)</span>
                    </span>
                  ) : client.nonBillableMinutes > 0 ? (
                    <span className="font-bold text-slate-400">{fmt(client.totalMinutes)} IF</span>
                  ) : (
                    <span className="font-bold text-slate-700 dark:text-slate-300">{fmt(client.totalMinutes)}</span>
                  )}
                </div>
              </div>

              {/* Project rows */}
              <div className="space-y-2.5">
                {client.projects.map(({ project, billableMinutes, nonBillableMinutes }) => {
                  const total = billableMinutes + nonBillableMinutes;
                  const hasNonBillable = nonBillableMinutes > 0;
                  const hasBillable = billableMinutes > 0;

                  return (
                    <div key={project.id} className="flex items-center gap-2 md:gap-3">
                      {/* Code + type */}
                      <div className="flex-shrink-0 w-28 md:w-44">
                        <span
                          className="text-[11px] font-black px-2 py-0.5 rounded inline-block"
                          style={{ color: project.color, backgroundColor: `${project.color}18` }}
                          title={project.name}
                        >
                          {project.code}
                        </span>
                        {project.projectType && (
                          <span className="block text-[10px] text-slate-400 font-medium mt-0.5 px-0.5">
                            {project.projectType}
                          </span>
                        )}
                      </div>

                      {/* Stacked bar */}
                      <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden flex">
                        {hasBillable && (
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${grandTotal > 0 ? (billableMinutes / grandTotal) * 100 : 0}%`,
                              minWidth: '2px',
                              backgroundColor: project.color,
                              opacity: 0.8,
                            }}
                          />
                        )}
                        {hasNonBillable && (
                          <div
                            className="h-full bg-slate-300 dark:bg-slate-600 transition-all duration-500"
                            style={{
                              width: `${grandTotal > 0 ? (nonBillableMinutes / grandTotal) * 100 : 0}%`,
                              minWidth: '2px',
                            }}
                          />
                        )}
                      </div>

                      {/* Time summary */}
                      <div className="w-24 md:w-36 flex-shrink-0 text-right">
                        {hasBillable && hasNonBillable ? (
                          <span className="text-sm font-bold tabular-nums dark:text-white">
                            {fmt(billableMinutes)}{' '}
                            <span className="text-slate-400 font-normal">({fmt(nonBillableMinutes)} IF)</span>
                          </span>
                        ) : hasNonBillable ? (
                          <span className="text-sm font-bold tabular-nums text-slate-400">{fmt(total)} IF</span>
                        ) : (
                          <span className="text-sm font-bold tabular-nums dark:text-white">{fmt(total)}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Client subtotal divider (only when multiple projects) */}
              {client.projects.length > 1 && (
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 md:gap-3">
                  <div className="w-28 md:w-44 flex-shrink-0" />
                  <div className="flex-1 text-[11px] font-medium text-slate-400">
                    {client.nonBillableMinutes > 0 ? (
                      <span>
                        <span className="text-emerald-600 font-bold">{fmt(client.billableMinutes)}</span>
                        {' fakturerbar '}
                        <span className="text-slate-400">({fmt(client.nonBillableMinutes)} IF)</span>
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold">{fmt(client.billableMinutes)} fakturerbar</span>
                    )}
                  </div>
                  <div className="w-24 md:w-36 flex-shrink-0" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
