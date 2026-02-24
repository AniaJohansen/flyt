import { useRef, useState } from 'react';
import type { Settings } from '@/types';
import { Dialog } from '@/components/shared/Dialog';
import { nb } from '@/i18n/nb';
import { exportData, importData } from '@/lib/backup';
import { useTags } from '@/hooks/useTags';

const TAG_COLORS = [
  '#4A90E2', '#E2844A', '#7B4AE2', '#4AE2A0',
  '#E24A6B', '#E2C94A', '#4AE2D4', '#A0A0A0',
];

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdate: (changes: Partial<Omit<Settings, 'id'>>) => void;
  onToast: (msg: string) => void;
}

export function SettingsPanel({
  open,
  onClose,
  settings,
  onUpdate,
  onToast,
}: SettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  // Tag management state
  const { tags, addTag, deleteTag } = useTags();
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
  const [confirmDeleteTagId, setConfirmDeleteTagId] = useState<string | null>(null);

  async function handleExport() {
    try {
      await exportData();
      onToast('Backup lastet ned!');
    } catch {
      onToast('Feil ved nedlasting av backup.');
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      await importData(text);
      onToast('Data gjenopprettet!');
      onClose();
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Feil ved gjenoppretting.');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleAddTag() {
    const name = newTagName.trim();
    if (!name) return;
    await addTag(name, newTagColor);
    setNewTagName('');
    setNewTagColor(TAG_COLORS[0]);
  }

  async function handleDeleteTag(id: string) {
    if (confirmDeleteTagId === id) {
      await deleteTag(id);
      setConfirmDeleteTagId(null);
    } else {
      setConfirmDeleteTagId(id);
      setTimeout(() => setConfirmDeleteTagId(null), 3000);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={nb.settings.title}>
      <div className="space-y-5">
        <label className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{nb.settings.defaultBlock}</span>
          <select
            value={settings.defaultBlockSize}
            onChange={(e) =>
              onUpdate({ defaultBlockSize: Number(e.target.value) as 15 | 30 | 60 })
            }
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary outline-none dark:text-white"
          >
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={60}>60 min</option>
          </select>
        </label>

        <label className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{nb.settings.workDayStart}</span>
          <input
            type="time"
            value={settings.workDayStart}
            onChange={(e) => onUpdate({ workDayStart: e.target.value })}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary outline-none dark:text-white"
          />
        </label>

        <label className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{nb.settings.workDayEnd}</span>
          <input
            type="time"
            value={settings.workDayEnd}
            onChange={(e) => onUpdate({ workDayEnd: e.target.value })}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary outline-none dark:text-white"
          />
        </label>

        <label className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{nb.settings.reminderTime}</span>
          <input
            type="time"
            value={settings.dailyReminderTime}
            onChange={(e) => onUpdate({ dailyReminderTime: e.target.value })}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary outline-none dark:text-white"
          />
        </label>

        <label className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{nb.settings.theme}</span>
          <select
            value={settings.theme}
            onChange={(e) => onUpdate({ theme: e.target.value as 'light' | 'dark' })}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary outline-none dark:text-white"
          >
            <option value="light">{nb.settings.themeLight}</option>
            <option value="dark">{nb.settings.themeDark}</option>
          </select>
        </label>

        {/* Tags section */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Tags</p>

          {/* Existing tags */}
          <div className="space-y-1.5 mb-3">
            {tags.length === 0 && (
              <p className="text-xs text-slate-400 italic">Ingen tags. Legg til nedenfor.</p>
            )}
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center gap-2 group">
                <span
                  className="size-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tag.color ?? '#94a3b8' }}
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1">
                  #{tag.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteTag(tag.id)}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition-colors opacity-0 group-hover:opacity-100 ${
                    confirmDeleteTagId === tag.id
                      ? 'bg-red-500 text-white'
                      : 'text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  {confirmDeleteTagId === tag.id ? 'Bekreft' : 'Slett'}
                </button>
              </div>
            ))}
          </div>

          {/* Add new tag */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ny tag..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddTag(); }}
              className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white"
            />
            <div className="flex gap-1">
              {TAG_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewTagColor(c)}
                  className={`size-5 rounded-full flex-shrink-0 transition-transform ${
                    newTagColor === c ? 'ring-2 ring-offset-1 ring-slate-400 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddTag}
              disabled={!newTagName.trim()}
              className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg disabled:opacity-40 hover:bg-primary/90 transition-colors"
            >
              Legg til
            </button>
          </div>
        </div>

        {/* Data section */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Data</p>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Last ned backup
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">upload</span>
              {importing ? 'Laster...' : 'Gjenopprett fra fil'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
