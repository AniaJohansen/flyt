import type { Settings } from '@/types';
import { Dialog } from '@/components/shared/Dialog';
import { nb } from '@/i18n/nb';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdate: (changes: Partial<Omit<Settings, 'id'>>) => void;
}

export function SettingsPanel({
  open,
  onClose,
  settings,
  onUpdate,
}: SettingsPanelProps) {
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
      </div>
    </Dialog>
  );
}
