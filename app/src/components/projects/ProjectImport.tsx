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
    <div className="project-import">
      <input
        ref={fileRef}
        type="file"
        accept=".csv,.xlsx,.xls,.txt"
        onChange={handleFile}
      />
      {message && <p className="import-message">{message}</p>}
      {rows.length > 0 && (
        <>
          <div className="import-preview">
            <h4>{nb.projects.preview}</h4>
            <table className="import-table">
              <thead>
                <tr>
                  <th>{nb.projects.code}</th>
                  <th>{nb.projects.name}</th>
                  <th>{nb.projects.client}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.project_code}</td>
                    <td>{row.project_name}</td>
                    <td>{row.client_name ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleImport}
          >
            {nb.projects.import} ({rows.length})
          </button>
        </>
      )}
    </div>
  );
}
