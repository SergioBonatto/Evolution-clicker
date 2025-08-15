import { useGame } from "./hooks/useGame";
import FixedPrecision from "fixed-precision";
import { useState } from "react";
import './App.css';

function App() {
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
    // resetGame,
    areEraMissionsComplete,
    evolutionRequirements,
  } = useGame();

  // State for visual feedback
  const [clickFeedback, setClickFeedback] = useState(false);
  const [evolveFeedback, setEvolveFeedback] = useState(false);

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
        {/* Title */}
        {/* Reset Button */}
        {/* <button
          onClick={resetGame}
          className="reset-btn mb-4"
          aria-label="Reset the game (erases all progress)"
          style={{
            fontSize: "0.95rem",
            fontWeight: 500,
            borderRadius: 8,
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1.2rem",
            marginBottom: 16,
          }}
        >
          Reset Game
        </button> */}


        <div className="main-container">
          {/* Painel Principal */}
          <div className="main-panel">
            <div className="evolution-header mb-2">
          <h1 className="evolution-title" style={{ fontSize: "2.2rem", fontWeight: 700, color: "#222", textShadow: "none", paddingTop: "3rem", letterSpacing: 0 }}>
            Evolution Clicker
          </h1>
        </div>
        {/* Stage Banner */}
        <div className={`stage-banner stage-banner-${stageTheme} mb-2 animate-fade-in`}>
          <div className="stage-label">Current Era</div>
          <div className="stage-name">{gameState.stageName}</div>
        </div>
            {/* Stats */}
            <div className="stats-panel mb-8">
              <div className="stat-grid">
                <div className="main-stats">
                  <div className="stat-item primary-stat">
                    <div className="stat-label">Resource</div>
                    <div className="stat-value primary">{Math.floor(gameState.resource.toNumber()).toLocaleString()}</div>
                    <div className="stat-unit">{producedResource}</div>
                  </div>
                  <div className="stat-item secondary-stat">
                    <div className="stat-label">Energy</div>
                    <div className="stat-value secondary">{Math.floor(gameState.energy.toNumber()).toLocaleString()}</div>
                    <div className="stat-unit">Units</div>
                  </div>
                </div>
                <div className="evolution-points-section">
                  <div className="stat-label">Evolution Points</div>
                  <div className="stat-value evolution">
                    {gameState.evolutionPoints}
                    <span style={{ fontSize: '0.85rem', color: '#059669', marginLeft: 6 }}>(+5% per point)</span>
                  </div>
                </div>
                <div className="prestige-points-section">
                  <div className="stat-label">Prestige Points</div>
                  <div className="stat-value prestige">
                    {gameState.prestigePoints}
                    <span style={{ fontSize: '0.85rem', color: '#059669', marginLeft: 6 }}>(+5% per point)</span>
                  </div>
                </div>
              </div>
              {/* Auto Production */}
              <div className="production-panel">
                <div className="production-title">Auto Production</div>
                <div className="production-stats">
                  <div className="production-item">
                    <span className="production-rate">
                      {autoProduction.perSecond.toNumber().toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                    <span className="production-unit">per second</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Click Counter */}
            <div className="click-counter">
              Clicks: {gameState.clickCount?.toLocaleString() ?? 0}
            </div>
            {/* Produce Button */}
            <button
              onClick={handleProduce}
              onKeyDown={(e) => e.key === "Enter" && handleProduce()}
              className={`main-action-btn main-action-btn-${stageTheme} mb-8 ${clickFeedback ? "animate-pulse" : ""}`}
              aria-label={`Produce ${producedResource} to increase resources`}
            >
              Produce
            </button>
            {/* Evolve Button */}
            <button
              onClick={handleEvolve}
              onKeyDown={(e) => e.key === "Enter" && handleEvolve()}
              disabled={gameState.resource.lt(new FixedPrecision(dynamicRequirement)) || !allEraMissionsComplete}
              className={`evolution-btn ${gameState.resource.gte(new FixedPrecision(dynamicRequirement)) && allEraMissionsComplete ? "evolution-btn-ready" : "evolution-btn-disabled"} mb-8 ${evolveFeedback ? "animate-evolve" : ""}`}
              aria-label={`Evolve to next era (requires ${dynamicRequirement.toLocaleString()} ${producedResource} and all missions complete)`}
            >
              Evolve to next era ({dynamicRequirement.toLocaleString()} {producedResource})
            </button>
            {/* Evolve requirements feedback */}
            {(!allEraMissionsComplete || gameState.resource.lt(new FixedPrecision(dynamicRequirement))) && (
              <div style={{ color: '#b91c1c', fontWeight: 500, marginBottom: 16, fontSize: '0.98rem' }}>
                <span>To evolve, complete all era missions and produce at least {dynamicRequirement.toLocaleString()} {producedResource}.</span>
                {!allEraMissionsComplete && (
                  <div style={{ color: '#b91c1c', marginTop: 4 }}>
                    Pending missions in this era.
                  </div>
                )}
                {gameState.resource.lt(new FixedPrecision(dynamicRequirement)) && (
                  <div style={{ color: '#b91c1c', marginTop: 4 }}>
                    Insufficient resource.
                  </div>
                )}
              </div>
            )}
            {/* Prestige Button */}
            {gameState.stage >= 5 && (
              <button
                onClick={prestige}
                onKeyDown={(e) => e.key === "Enter" && prestige()}
                className="prestige-btn mb-8"
                aria-label="Restart progress to earn prestige points"
              >
                Prestige (Earn {Math.floor(Math.log10(gameState.energy.toNumber()) / 2)} points)
              </button>
            )}
          </div>
          {/* Upgrades Panel */}
          <div className="upgrades-panel">
            <h2 className="upgrades-title">
              Upgrades
            </h2>
            {upgradesByStage.map(({ stage, upgrades }) => (
              <div key={stage} style={{ marginBottom: "2rem" }}>
                <div className="upgrade-stage-title" style={{ fontWeight: 600, fontSize: "1.05rem", color: "#059669", marginBottom: 8 }}>
                  {stage}
                </div>
                <div className="upgrades-grid">
                  {upgrades.map((upgrade) => (
                    <div
                      key={upgrade.id}
                      className={`upgrade-card upgrade-card-${stageTheme} ${gameState.energy.gte(upgrade.cost) ? "upgrade-affordable" : "upgrade-expensive"}`}
                    >
                      <div className="upgrade-header">
                        <div className="upgrade-name">
                          {upgrade.name}
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
                        aria-label={`Buy ${upgrade.name} for ${upgrade.cost.toNumber().toLocaleString()} energy`}
                      >
                        <span className="upgrade-cost">{upgrade.cost.toNumber().toLocaleString()}</span> energy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Missions Panel */}
          {missions.length > 0 && (
            <div className="missions-panel">
              <h2 className="missions-title">
                Missions
              </h2>
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
                  return (
                    <div
                      key={mission.id}
                      className="mission-card"
                    >
                      <div className="mission-description">
                        {mission.description}
                      </div>
                      <div className="mission-reward">
                        Reward: {mission.reward.energy ? `${mission.reward.energy} energy` : `${mission.reward.evolutionPoints} evolution points`}
                      </div>
                      <button
                        onClick={() => completeMission(mission.id)}
                        disabled={!canComplete}
                        className={`mission-btn ${canComplete ? "mission-btn-enabled" : "mission-btn-disabled"}`}
                      >
                        Complete
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
  );
}

export default App;
