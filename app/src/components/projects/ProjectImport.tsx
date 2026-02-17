import { useState, useRef } from 'react';
import type { ProjectImportRow } from '@/types';
import { parseCSV, parseExcel, importProjects } from '@/lib/import';
import { nb } from '@/i18n/nb';

interface ProjectImportProps {
  onDone: () => void;
}

export function ProjectImport({ onDone }: ProjectImportProps) {
  const [rows, setRows] = useState<ProjectImportRow[]>([]);
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let parsed: ProjectImportRow[];
      if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
        const text = await file.text();
        parsed = parseCSV(text);
      } else {
        parsed = await parseExcel(file);
      }
      setRows(parsed);
      setMessage(nb.projects.importCount(parsed.length));
    } catch {
      setMessage('Feil ved lesing av fil');
    }
  };

  const handleImport = async () => {
    const result = await importProjects(rows);
    const parts: string[] = [nb.projects.importSuccess(result.imported)];
    if (result.duplicates > 0) {
      parts.push(nb.projects.duplicates(result.duplicates));
    }
    setMessage(parts.join('. '));
    setRows([]);
    if (fileRef.current) fileRef.current.value = '';
    onDone();
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept=".csv,.xlsx,.xls,.txt"
        onChange={handleFile}
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
      />
      {message && (
        <p className="text-sm font-medium text-primary">{message}</p>
      )}
      {rows.length > 0 && (
        <>
          <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-600">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700">
                  <th className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase">{nb.projects.code}</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase">{nb.projects.name}</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase">{nb.projects.client}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-t border-slate-100 dark:border-slate-700">
                    <td className="px-3 py-2 font-mono text-xs font-bold dark:text-white">{row.project_code}</td>
                    <td className="px-3 py-2 dark:text-white">{row.project_name}</td>
                    <td className="px-3 py-2 text-slate-500">{row.client_name ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={handleImport}
            className="px-4 py-2 bg-primary rounded-lg text-sm font-bold text-white hover:bg-primary/90 transition-colors"
          >
            {nb.projects.import} ({rows.length})
          </button>
        </>
      )}
    </div>
  );
}
