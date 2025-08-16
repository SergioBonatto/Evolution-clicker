import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import type { LanguageSelectorProps } from './LanguageSelector';

interface BurgerMenuProps {
  languages: LanguageSelectorProps['languages'];
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ languages, currentLanguage, onLanguageChange }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <div className="burger-menu-root">
        {/* Overlay escurecido - renderizado ANTES do painel, para garantir ordem correta */}
        {open && (
          <div
            className="burger-overlay"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            style={{ zIndex: 99 }}
          />
        )}
        {/* Painel do menu lateral */}
        <div
          className={`burger-menu-panel${open ? ' open' : ''}`}
          style={{ zIndex: 100 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="burger-menu-header">
            <button
              className="burger-menu-close"
              aria-label="Fechar menu"
              onClick={() => setOpen(false)}
            >×</button>
          </div>
          <div className="burger-menu-content">
            <h2 className="burger-menu-title">{t("configuration")}</h2>
            <LanguageSelector
              languages={languages}
              currentLanguage={currentLanguage}
              onChange={onLanguageChange}
            />
            {/* Outras opções futuras */}
          </div>
        </div>
        <button
          className={`burger-menu-btn${open ? ' open' : ''}`}
          aria-label="Abrir menu"
          onClick={() => setOpen(!open)}
        >
          <span className="burger-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </>
  );
};

export default BurgerMenu;
