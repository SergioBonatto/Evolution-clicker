import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import type { LanguageSelectorProps } from './LanguageSelector';

interface BurgerMenuProps {
  languages: LanguageSelectorProps['languages'];
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  onRequestReset: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}


const BurgerMenu: React.FC<BurgerMenuProps> = ({ languages, currentLanguage, onLanguageChange, onRequestReset, theme, setTheme }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  // Alterna tema
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  return (
    <div className="burger-menu-root">
      {open && (
        <div
          className="burger-overlay"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
        />
      )}
      {/* Painel do menu lateral */}
      <div
        className={`burger-menu-panel${open ? ' open' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="burger-menu-header">
          <button
            className="burger-menu-close"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
            type="button"
          >×</button>
        </div>
        <div className="burger-menu-content">
          <h2 className="burger-menu-title">{t("configuration")}</h2>
          <LanguageSelector
            languages={languages}
            currentLanguage={currentLanguage}
            onChange={onLanguageChange}
          />
          {/* Alternância de tema estilizada */}
          <div className="theme-toggle-container mb-4">
            <button
              className="theme-toggle-btn w-full"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')}
              title={theme === 'dark' ? t('lightMode') : t('darkMode')}
              type="button"
            >
              <span className="theme-toggle-icon" aria-hidden="true">
                {theme === 'dark' ? (
                  // Ícone de sol
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="5" fill="currentColor" />
                    <g stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="2" x2="12" y2="4" />
                      <line x1="12" y1="20" x2="12" y2="22" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="2" y1="12" x2="4" y2="12" />
                      <line x1="20" y1="12" x2="22" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </g>
                  </svg>
                ) : (
                  // Ícone de lua
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="currentColor" />
                  </svg>
                )}
              </span>
              <span className="theme-toggle-label">
                {theme === 'dark' ? t('lightMode', 'Modo Claro') : t('darkMode', 'Modo Escuro')}
              </span>
            </button>
          </div>
          {/* Reset Button */}
          <button
            onClick={onRequestReset}
            className="reset-btn w-full mb-2"
            aria-label="Reset the game (erases all progress)"
            type="button"
          >
            {t('resetGame', 'Resetar Jogo')}
          </button>
        </div>
      </div>
      <button
        className={`burger-menu-btn${open ? ' open' : ''}`}
        aria-label="Abrir menu"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className="burger-icon">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>
  );
};

export default BurgerMenu;
