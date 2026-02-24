import type { Tag } from '@/types';

interface TagSelectorProps {
  tags: Tag[];
  selected: string[];
  onToggle: (tagName: string) => void;
}

export function TagSelector({ tags, selected, onToggle }: TagSelectorProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        const isSelected = selected.includes(tag.name);
        const color = tag.color ?? '#6366f1';
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => onToggle(tag.name)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
              isSelected
                ? 'text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
            style={isSelected ? { backgroundColor: color } : undefined}
          >
            #{tag.name}
          </button>
        );
      })}
    </div>
  );
}
