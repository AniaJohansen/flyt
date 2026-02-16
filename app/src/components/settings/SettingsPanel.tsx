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
      <div className="settings-form">
        <label className="settings-field">
          <span>{nb.settings.defaultBlock}</span>
          <select
            value={settings.defaultBlockSize}
            onChange={(e) =>
              onUpdate({
                defaultBlockSize: Number(e.target.value) as 15 | 30 | 60,
              })
            }
          >
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={60}>60 min</option>
          </select>
        </label>

        <label className="settings-field">
          <span>{nb.settings.workDayStart}</span>
          <input
            type="time"
            value={settings.workDayStart}
            onChange={(e) => onUpdate({ workDayStart: e.target.value })}
          />
        </label>

        <label className="settings-field">
          <span>{nb.settings.workDayEnd}</span>
          <input
            type="time"
            value={settings.workDayEnd}
            onChange={(e) => onUpdate({ workDayEnd: e.target.value })}
          />
        </label>

        <label className="settings-field">
          <span>{nb.settings.reminderTime}</span>
          <input
            type="time"
            value={settings.dailyReminderTime}
            onChange={(e) => onUpdate({ dailyReminderTime: e.target.value })}
          />
        </label>

        <label className="settings-field">
          <span>{nb.settings.theme}</span>
          <select
            value={settings.theme}
            onChange={(e) =>
              onUpdate({ theme: e.target.value as 'light' | 'dark' })
            }
          >
            <option value="light">{nb.settings.themeLight}</option>
            <option value="dark">{nb.settings.themeDark}</option>
          </select>
        </label>
      </div>
    </Dialog>
  );
}
