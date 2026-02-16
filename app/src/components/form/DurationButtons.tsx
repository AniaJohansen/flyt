interface DurationButtonsProps {
  value: 15 | 30 | 60 | null;
  onChange: (duration: 15 | 30 | 60) => void;
}

const OPTIONS: { label: string; value: 15 | 30 | 60 }[] = [
  { label: '15m', value: 15 },
  { label: '30m', value: 30 },
  { label: '1t', value: 60 },
];

export function DurationButtons({ value, onChange }: DurationButtonsProps) {
  return (
    <div className="duration-buttons">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`duration-btn ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
