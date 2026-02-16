import { nb } from '@/i18n/nb';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenProjects: () => void;
}

export function Header({ onOpenSettings, onOpenProjects }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header-title">{nb.app.title}</h1>
      <div className="header-actions">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onOpenProjects}
          title={nb.projects.title}
        >
          ⚙ {nb.projects.title}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onOpenSettings}
          title={nb.settings.title}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
