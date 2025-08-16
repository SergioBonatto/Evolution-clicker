import React, { useState, useRef, useEffect } from 'react';

export interface LanguageSelectorProps {
  languages: { code: string; label: string }[];
  currentLanguage: string;
  onChange: (lang: string) => void;
}



const LanguageSelector: React.FC<LanguageSelectorProps> = ({ languages, currentLanguage, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = languages.find(l => l.code === currentLanguage);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div
      className="language-selector-container language-selector-dropdown-root"
      ref={ref}
    >
      <button
        className="language-selector-select language-selector-dropdown-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        type="button"
      >
        <span className="language-selector-current">
          {/* Bandeira opcional: <span className={`fi fi-${current?.code}`}></span> */}
          {current?.label || currentLanguage}
        </span>
        <span className="language-selector-arrow" aria-hidden>▼</span>
      </button>
      {open && (
        <ul
          className="language-selector-dropdown"
          role="listbox"
        >
          {languages.map(lang => (
            <li
              key={lang.code}
              role="option"
              aria-selected={currentLanguage === lang.code}
              tabIndex={-1}
              className={`language-selector-dropdown-item${currentLanguage === lang.code ? ' selected' : ''}`}
              onClick={() => {
                setOpen(false);
                if (lang.code !== currentLanguage) onChange(lang.code);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setOpen(false);
                  if (lang.code !== currentLanguage) onChange(lang.code);
                }
              }}
            >
              {/* Bandeira opcional: <span className={`fi fi-${lang.code}`}></span> */}
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;
