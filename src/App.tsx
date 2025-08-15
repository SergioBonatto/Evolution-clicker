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
  } = useGame();

  // Estado para feedback visual
  const [clickFeedback, setClickFeedback] = useState(false);
  const [evolveFeedback, setEvolveFeedback] = useState(false);

  // Requisitos de evolução
  const evolutionRequirements = [
    { min: 1e3 },
    { min: 1e4 },
    { min: 1e5 },
    { min: 1e6 },
    { min: 1e7 },
    { min: 1e8 },
    { min: 1e9 },
    { min: 1e11 },
    { min: 1e13 },
    { min: 1e15 },
    { min: 1e17 },
  ];
  const currentRequirement = evolutionRequirements[gameState.stage]?.min || 1e3;
  const dynamicRequirement = currentRequirement * Math.pow(2.5, gameState.stage);

  // Manipuladores com feedback
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
        {/* Título */}
        <div className="evolution-header mb-8">
          <h1 className="evolution-title" style={{ fontSize: "2.2rem", fontWeight: 700, color: "#222", textShadow: "none", paddingTop: "3rem", letterSpacing: 0 }}>
            Evolution Clicker
          </h1>
        </div>

        {/* Banner do Estágio */}
        <div className={`stage-banner stage-banner-${stageTheme} mb-6 animate-fade-in`}>
          <div className="stage-label">Era Atual</div>
          <div className="stage-name">{gameState.stageName}</div>
        </div>

        <div className="main-container flex flex-col md:flex-row gap-6">
          {/* Painel Principal */}
          <div className="main-panel">
            {/* Estatísticas */}
            <div className="stats-panel mb-8" style={{ background: "#fafafa", border: "1px solid #eee", borderRadius: 16, padding: "1.5rem" }}>
              <div className="stat-grid">
                <div className="main-stats">
                  <div className="stat-item primary-stat">
                    <div className="stat-label">Recurso</div>
                    <div className="stat-value primary">{Math.floor(gameState.resource.toNumber()).toLocaleString()}</div>
                    <div className="stat-unit">{producedResource}</div>
                  </div>
                  <div className="stat-item secondary-stat">
                    <div className="stat-label">Energia</div>
                    <div className="stat-value secondary">{Math.floor(gameState.energy.toNumber()).toLocaleString()}</div>
                    <div className="stat-unit">Unidades</div>
                  </div>
                </div>
                <div className="evolution-points-section">
                  <div className="stat-label">Pontos de Evolução</div>
                  <div className="stat-value evolution">{gameState.evolutionPoints}</div>
                </div>
                <div className="prestige-points-section">
                  <div className="stat-label">Pontos de Prestígio</div>
                  <div className="stat-value prestige">{gameState.prestigePoints}</div>
                </div>
              </div>

              {/* Produção Automática */}
              <div className="production-panel">
                <div className="production-title">Produção Automática</div>
                <div className="production-stats">
                  <div className="production-item">
                    <span className="production-rate">
                      {autoProduction.perSecond.toNumber().toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                    <span className="production-unit">por segundo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de Produção */}
            <button
              onClick={handleProduce}
              onKeyDown={(e) => e.key === "Enter" && handleProduce()}
              className={`main-action-btn main-action-btn-${stageTheme} mb-8 ${clickFeedback ? "animate-pulse" : ""}`}
              aria-label={`Produzir ${producedResource} para aumentar recursos`}
              style={{ fontSize: "1.1rem", fontWeight: 600, borderRadius: 8, padding: "1rem 2rem", background: "#222", color: "#fff" }}
            >
              Produzir
            </button>

            {/* Botão de Evolução */}
            <button
              onClick={handleEvolve}
              onKeyDown={(e) => e.key === "Enter" && handleEvolve()}
              disabled={gameState.resource.lt(new FixedPrecision(dynamicRequirement))}
              className={`evolution-btn ${gameState.resource.gte(new FixedPrecision(dynamicRequirement)) ? "evolution-btn-ready" : "evolution-btn-disabled"} mb-8 ${evolveFeedback ? "animate-evolve" : ""}`}
              aria-label={`Evoluir para próxima era (requer ${dynamicRequirement.toLocaleString()} ${producedResource})`}
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 8,
                background: gameState.resource.gte(new FixedPrecision(dynamicRequirement)) ? "#059669" : "#bbb",
                color: "#fff",
                border: "none",
                padding: "0.75rem 1.5rem",
              }}
            >
              Evoluir para próxima era ({dynamicRequirement.toLocaleString()} {producedResource})
            </button>

            {/* Botão de Prestígio */}
            {gameState.stage >= 5 && (
              <button
                onClick={prestige}
                onKeyDown={(e) => e.key === "Enter" && prestige()}
                className="prestige-btn mb-8"
                aria-label="Reiniciar progresso para ganhar pontos de prestígio"
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 8,
                  background: "#d97706",
                  color: "#fff",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                }}
              >
                Prestígio (Ganhar {Math.floor(Math.log10(gameState.energy.toNumber()) / 2)} pontos)
              </button>
            )}

            {/* Missões */}
            {missions.length > 0 && (
              <div className="missions-panel" style={{ background: "#fafafa", border: "1px solid #eee", borderRadius: 16, padding: "1.5rem", marginBottom: 24 }}>
                <h2 className="missions-title" style={{ fontWeight: 600, fontSize: "1.2rem", color: "#222", marginBottom: 16 }}>
                  Missões
                </h2>
                <div className="missions-grid" style={{ display: "grid", gap: "1rem" }}>
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
                        style={{ border: "1px solid #eee", borderRadius: 8, padding: "1rem", background: "#fff" }}
                      >
                        <div className="mission-description" style={{ fontSize: "1rem", color: "#222" }}>
                          {mission.description}
                        </div>
                        <div className="mission-reward" style={{ fontSize: "0.95rem", color: "#059669" }}>
                          Recompensa: {mission.reward.energy ? `${mission.reward.energy} energia` : `${mission.reward.evolutionPoints} pontos de evolução`}
                        </div>
                        <button
                          onClick={() => completeMission(mission.id)}
                          disabled={!canComplete}
                          className={`mission-btn ${canComplete ? "mission-btn-enabled" : "mission-btn-disabled"}`}
                          style={{
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            borderRadius: 8,
                            background: canComplete ? "#059669" : "#bbb",
                            color: "#fff",
                            border: "none",
                            padding: "0.5rem 1rem",
                            marginTop: 8,
                          }}
                        >
                          Completar
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Painel de Upgrades */}
          <div className="upgrades-panel" style={{ background: "#fff", border: "1px solid #eee", borderRadius: 16, padding: "1.5rem", marginTop: 24 }}>
            <h2 className="upgrades-title" style={{ fontWeight: 600, fontSize: "1.2rem", color: "#222", marginBottom: 16 }}>
              Upgrades
            </h2>
            {upgradesByStage.map(({ stage, upgrades }) => (
              <div key={stage} style={{ marginBottom: "2rem" }}>
                <div className="upgrade-stage-title" style={{ fontWeight: 600, fontSize: "1.05rem", color: "#059669", marginBottom: 8 }}>
                  {stage}
                </div>
                <div className="upgrades-grid" style={{ display: "grid", gap: "1rem" }}>
                  {upgrades.map((upgrade) => (
                    <div
                      key={upgrade.id}
                      className={`upgrade-card upgrade-card-${stageTheme} ${gameState.energy.gte(upgrade.cost) ? "upgrade-affordable" : "upgrade-expensive"}`}
                      style={{ borderRadius: 8, border: "1px solid #eee", background: "#fafafa", padding: "1rem" }}
                    >
                      <div className="upgrade-header" style={{ marginBottom: 8 }}>
                        <div className="upgrade-name" style={{ fontWeight: 500, fontSize: "1rem", color: "#222" }}>
                          {upgrade.name}
                        </div>
                        <div className="upgrade-quantity" style={{ fontSize: "0.95rem", color: "#888" }}>
                          ×{upgrade.quantity}
                        </div>
                      </div>
                      <div className="upgrade-details" style={{ fontSize: "0.92rem", color: "#666", marginBottom: 8 }}>
                        <div className="upgrade-multiplier" style={{ fontWeight: 500, color: "#059669" }}>
                          x{upgrade.multiplier}
                        </div>
                      </div>
                      <button
                        onClick={() => buyUpgrade(upgrade.id)}
                        onKeyDown={(e) => e.key === "Enter" && buyUpgrade(upgrade.id)}
                        disabled={gameState.energy.lt(upgrade.cost)}
                        className={`upgrade-buy-btn ${gameState.energy.gte(upgrade.cost) ? "upgrade-buy-enabled" : "upgrade-buy-disabled"}`}
                        aria-label={`Comprar ${upgrade.name} por ${upgrade.cost.toNumber().toLocaleString()} energia`}
                        style={{
                          fontWeight: 600,
                          fontSize: "1rem",
                          borderRadius: 8,
                          background: gameState.energy.gte(upgrade.cost) ? "#059669" : "#bbb",
                          color: "#fff",
                          border: "none",
                          padding: "0.5rem 1rem",
                        }}
                      >
                        <span className="upgrade-cost">{upgrade.cost.toNumber().toLocaleString()}</span> energia
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
