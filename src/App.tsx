import { useGame } from "./hooks/useGame";
import FixedPrecision from "fixed-precision";
import { useState, useEffect } from "react";
import './App.css';
import BurgerMenu from "./components/BurgerMenu";
import ResetModal from "./components/ResetModal";
import { useTranslation } from 'react-i18next';
import i18n from './i18n';

const LANGUAGES = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'janja', label: 'Janja' }
];

function App() {
  const { t } = useTranslation();
  const {
    gameState,
    produce,
    buyUpgrade,
    evolve,
    prestige,
    completeMission,
    missions,
    producedResource,
    autoProduction,
    upgradesByStage,
    stageTheme,
    resetGame,
    areEraMissionsComplete,
    evolutionRequirements,
  } = useGame();

  // State for visual feedback
  const [clickFeedback, setClickFeedback] = useState(false);
  const [evolveFeedback, setEvolveFeedback] = useState(false);
  // Modal de reset
  const [showResetModal, setShowResetModal] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);
  // More aggressive evolution requirement and mission check
  const currentRequirement = evolutionRequirements[gameState.stage]?.min || 1e3;
  const dynamicRequirement = currentRequirement * Math.pow(3, gameState.stage + 1);
  const allEraMissionsComplete = areEraMissionsComplete(gameState);

  // Handlers with feedback
  const handleProduce = () => {
    produce();
    setClickFeedback(true);
    setTimeout(() => setClickFeedback(false), 200);
  };

  const handleEvolve = () => {
    evolve();
    setEvolveFeedback(true);
    setTimeout(() => setEvolveFeedback(false), 1000);
  };

  return (
    <div className={`min-h-screen evolutionary-bg evolutionary-bg-${stageTheme} relative transition-all duration-500`}>
      <div className="relative z-10 flex flex-col items-center p-6">
        {/* Modern Burger Menu with options */}
        <BurgerMenu
          languages={LANGUAGES}
          currentLanguage={i18n.language}
          onLanguageChange={i18n.changeLanguage}
          onRequestReset={() => setShowResetModal(true)}
          theme={theme}
          setTheme={setTheme}
        />
        <ResetModal
          open={showResetModal}
          onCancel={() => setShowResetModal(false)}
          onConfirm={() => {
            setShowResetModal(false);
            resetGame();
          }}
          theme={theme}
          title={t('resetConfirmationTitle', 'Resetar Jogo?')}
          message={t('resetConfirmation', 'Tem certeza que deseja resetar o jogo? Todo o progresso será perdido. Esta ação não pode ser desfeita.')}
          cancelLabel={t('cancel', 'Cancelar')}
          confirmLabel={t('confirm', 'Resetar')}
        />
        {/* Title */}


        <div className="main-container">
          {/* Main Panel */}
          <div className="main-panel">
            <div className="evolution-header mb-2">
              <h1 className="evolution-title app-title">
                {t('title')}
              </h1>
            </div>
            {/* Stage Banner */}
            <div className={`stage-banner stage-banner-${stageTheme} mb-2 animate-fade-in`}>
              <div className="stage-label">{t('currentEra')}</div>
              <div className="stage-name">{t(gameState.stageName)}</div>
            </div>
            {/* Stats */}
            <div className="stats-panel mb-8">
              <div className="stat-grid">
                <div className="main-stats">
                  <div className="stat-item primary-stat">
                    <div className="stat-label">{t('resource')}</div>
                    <div className="stat-value primary">{Math.floor(gameState.resource.toNumber()).toLocaleString()}</div>
                    <div className="stat-unit">{t(producedResource)}</div>
                  </div>
                  <div className="stat-item secondary-stat">
                    <div className="stat-label">{t('energy')}</div>
                    <div className="stat-value secondary">{Math.floor(gameState.energy.toNumber()).toLocaleString()}</div>
                    <div className="stat-unit">{t('units')}</div>
                  </div>
                </div>
                        {gameState.evolutionPoints > 0 && (
                          <div className="evolution-points-section">
                            <div className="stat-label">{t('evolutionPoints')}</div>
                            <div className="stat-value evolution">
                              {gameState.evolutionPoints}
                              <span className="evolution-bonus">({t('perPointBonus')})</span>
                            </div>
                          </div>
                        )}
                        {gameState.prestigePoints > 0 && (
                          <div className="prestige-points-section">
                            <div className="stat-label">{t('prestigePoints')}</div>
                            <div className="stat-value prestige">
                              {gameState.prestigePoints}
                              <span className="prestige-bonus">({t('perPointBonus')})</span>
                            </div>
                          </div>
                        )}
              </div>
              {/* Auto Production */}
              <div className="production-panel">
                <div className="production-title">{t('autoProduction')}</div>
                <div className="production-stats">
                  <div className="production-item">
                    <span className="production-rate">
                      {autoProduction.perSecond.toNumber().toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                    <span className="production-unit">{t('perSecond')}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Produce Button */}
            <button
              onClick={handleProduce}
              onKeyDown={(e) => e.key === "Enter" && handleProduce()}
              className={`main-action-btn main-action-btn-${stageTheme} mb-8 ${clickFeedback ? "animate-pulse" : ""}`}
              aria-label={t('produce') + ` ${producedResource}`}
            >
              <span>{t('produce')}</span>
              {/* <span className="click-counter-inside">&nbsp;({t('clicks')}: {gameState.clickCount?.toLocaleString() ?? 0})</span> */}
            </button>
          </div>
          {/* Upgrades Panel */}
          <div className="upgrades-panel">
            <h2 className="upgrades-title">
              {t('upgrades')}
            </h2>
            {upgradesByStage.map(({ stage, upgrades }) => (
              <div key={stage} className="upgrade-stage-block">
                <div className="upgrade-stage-title">
                  {t(stage)}
                </div>
                <div className="upgrades-grid">
                  {upgrades.map((upgrade) => (
                    <div
                      key={upgrade.id}
                      className={`upgrade-card upgrade-card-${stageTheme} ${gameState.energy.gte(upgrade.cost) ? "upgrade-affordable" : "upgrade-expensive"}`}
                    >
                      <div className="upgrade-header">
                        <div className="upgrade-name">
                          {t(upgrade.name)}
                        </div>
                        <div className="upgrade-quantity">
                          ×{upgrade.quantity}
                        </div>
                      </div>
                      <div className="upgrade-details">
                        <div className="upgrade-multiplier">
                          x{upgrade.multiplier}
                        </div>
                      </div>
                      <button
                        onClick={() => buyUpgrade(upgrade.id)}
                        onKeyDown={(e) => e.key === "Enter" && buyUpgrade(upgrade.id)}
                        disabled={gameState.energy.lt(upgrade.cost)}
                        className={`upgrade-buy-btn ${gameState.energy.gte(upgrade.cost) ? "upgrade-buy-enabled" : "upgrade-buy-disabled"}`}
                        aria-label={`Buy ${t(upgrade.name)} for ${upgrade.cost.toNumber().toLocaleString()} ${t('energy')}`}
                      >
                        <span className="upgrade-cost">{upgrade.cost.toNumber().toLocaleString()}</span> {t('energy')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Missions Panel (always visible) */}
          <div className="missions-panel">
            <h2 className="missions-title">
              {t('progressPanel')}
            </h2>
            {/* Evolve requirements feedback moved here */}
            {(!allEraMissionsComplete || gameState.resource.lt(new FixedPrecision(dynamicRequirement))) && (
              <div className="evolve-requirements-feedback mb-4">
                <span>{t('toEvolve', { amount: dynamicRequirement.toLocaleString(), resource: t(producedResource) })}</span>
                {!allEraMissionsComplete && (
                  <div className="evolve-requirements-missions">
                    {t('pendingMissions')}
                  </div>
                )}
                {gameState.resource.lt(new FixedPrecision(dynamicRequirement)) && (
                  <div className="evolve-requirements-resource">
                    {t('insufficientResource')}
                  </div>
                )}
              </div>
            )}
            {/* Evolve Button */}
            <button
              onClick={handleEvolve}
              onKeyDown={(e) => e.key === "Enter" && handleEvolve()}
              disabled={gameState.resource.lt(new FixedPrecision(dynamicRequirement)) || !allEraMissionsComplete}
              className={`evolution-btn ${gameState.resource.gte(new FixedPrecision(dynamicRequirement)) && allEraMissionsComplete ? "evolution-btn-ready" : "evolution-btn-disabled"} mb-8 ${evolveFeedback ? "animate-evolve" : ""}`}
              aria-label={t('evolveToNextEra') + ` (${dynamicRequirement.toLocaleString()} ${producedResource})`}
            >
              {t('evolveToNextEra')} ({dynamicRequirement.toLocaleString()} {t(producedResource)})
            </button>
            {/* Prestige Button */}
            {gameState.stage >= 5 && (
              <button
                onClick={prestige}
                onKeyDown={(e) => e.key === "Enter" && prestige()}
                className="prestige-btn mb-8"
                aria-label={t('prestige', { points: Math.floor(Math.log10(gameState.energy.toNumber()) / 2) })}
              >
                {t('prestige', { points: Math.floor(Math.log10(gameState.energy.toNumber()) / 2) })}
              </button>
            )}
            {/* Highlighted missions section (only appears if there are missions) */}
            {missions.length > 0 && (
              <div className="missions-highlight-panel">
                <div className="missions-highlight-title">
                  {t('missions')}
                </div>
                <div className="missions-grid">
                  {missions.map((mission) => {
                    const canComplete =
                      ("resource" in mission.requirement &&
                        typeof mission.requirement.resource === "number" &&
                        gameState.resource.gte(new FixedPrecision(mission.requirement.resource))) ||
                      ("upgrade" in mission.requirement &&
                        typeof mission.requirement.quantity === "number" &&
                        (() => {
                          const upgrade = gameState.upgrades.find((u) => u.id === mission.requirement.upgrade);
                          return !!upgrade && upgrade.quantity >= mission.requirement.quantity;
                        })());
                    const rewardText = mission.reward.energy
                      ? `${mission.reward.energy} ${t('energy')}`
                      : `${mission.reward.evolutionPoints} ${t('evolutionPoints')}`;
                    return (
                      <div
                        key={mission.id}
                        className="mission-card"
                      >
                        <div className="mission-description">
                          {t(mission.description.key, {
                            ...mission.description.values,
                            resource: mission.description.values.resource ? t(mission.description.values.resource) : undefined,
                            upgrade: mission.description.values.upgrade ? t(mission.description.values.upgrade) : undefined,
                          })}
                        </div>
                        <div className="mission-reward">
                          {t('reward', { reward: rewardText })}
                        </div>
                        <button
                          onClick={() => completeMission(mission.id)}
                          disabled={!canComplete}
                          className={`mission-btn ${canComplete ? "mission-btn-enabled" : "mission-btn-disabled"}`}
                        >
                          {t('complete')}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
