import type { Tag } from '@/types';

interface TagSelectorProps {
  tags: Tag[];
  selected: string[];
  onToggle: (tagName: string) => void;
}

export function TagSelector({ tags, selected, onToggle }: TagSelectorProps) {
  return (
    <div className="tag-selector">
      {tags.map((tag) => (
        <button
          key={tag.id}
          type="button"
          className={`tag-chip ${selected.includes(tag.name) ? 'active' : ''}`}
          style={
            selected.includes(tag.name) && tag.color
              ? { backgroundColor: tag.color, color: '#fff' }
              : undefined
          }
          onClick={() => onToggle(tag.name)}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}
