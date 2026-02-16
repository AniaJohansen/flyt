import type { InputHTMLAttributes } from 'react';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function SearchInput({ label, className = '', ...props }: SearchInputProps) {
  return (
    <div className={`search-input-wrapper ${className}`}>
      {label && <label className="search-label">{label}</label>}
      <input type="text" className="search-input" {...props} />
    </div>
  );
}
