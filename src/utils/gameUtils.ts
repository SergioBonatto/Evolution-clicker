// Pure utility functions for game logic
import type { GameState, Upgrade } from "../types/game";
import { missions, stages, evolutionRequirements, stageUpgrades } from "../data/evolutionData";
import FixedPrecision from "fixed-precision";

export function areEraMissionsComplete(state: GameState): boolean {
  return missions.filter((m) => m.stage === state.stage).every((m) => state.completedMissions.includes(m.id));
}

// Calculate global multiplier
export function getMultiplier(state: GameState): FixedPrecision {
  let mult = new FixedPrecision(1);
  for (const u of state.upgrades) {
    mult = mult.add(new FixedPrecision(u.multiplier - 1).mul(new FixedPrecision(u.quantity)));
  }
  // Bônus de pontos de evolução (mantido)
  mult = mult.add(new FixedPrecision(state.evolutionPoints).mul(new FixedPrecision(0.05)));
  // Bônus de prestígio: fórmula levemente exponencial, máximo 25% por ponto
  const prestigeBonus = Math.min(0.05 * Math.pow(state.prestigePoints, 1.2), 0.25 * state.prestigePoints);
  mult = mult.mul(new FixedPrecision(1 + prestigeBonus));
  return mult;
}

// Automatic production per second
export function getAutoProductionPerSecond(state: GameState): FixedPrecision {
  const totalAuto = state.upgrades.reduce((acc, u) => acc + u.quantity, 0);
  return new FixedPrecision(totalAuto)
    .mul(new FixedPrecision(1))
    .mul(getMultiplier(state))
    .div(new FixedPrecision(2));
}

// Production per click
export function produce(state: GameState): GameState {
  // O botão de produzir gera uma vez extra por ponto de prestígio
  const clickCount = 1 + (state.prestigePoints || 0);
  const amount = new FixedPrecision(1).mul(getMultiplier(state)).mul(new FixedPrecision(clickCount));
  return {
    ...state,
    resource: new FixedPrecision(state.resource).add(amount),
    energy: new FixedPrecision(state.energy).add(amount),
    clickCount: (state.clickCount || 0) + clickCount,
  };
}

// Buy upgrade
export function buyUpgrade(state: GameState, upgradeId: string): GameState {
  const upgrade = state.upgrades.find((u) => u.id === upgradeId);
  if (!upgrade || state.energy.lt(upgrade.cost)) return state;

  const newQuantity = upgrade.quantity + 1;
  const baseCostFP = new FixedPrecision(upgrade.baseCost);
  const factor = Math.pow(2.5, newQuantity) * (1 + 0.1 * newQuantity);
  const newCost = baseCostFP.mul(new FixedPrecision(factor));

  const newUpgrades = state.upgrades.map((u) =>
    u.id === upgradeId ? { ...u, quantity: newQuantity, cost: newCost } : u
  );

  return {
    ...state,
    energy: state.energy.sub(upgrade.cost),
    upgrades: newUpgrades,
  };
}

// Evolve
export function evolve(state: GameState): GameState {
  if (state.stage >= stages.length - 1) return state;
  const req = evolutionRequirements[state.stage];
  if (!req) return state;
  const dynamicMin = req.min * Math.pow(3, state.stage + 1);
  const reqMinFP = new FixedPrecision(dynamicMin);
  if (!areEraMissionsComplete(state)) return state;
  if (new FixedPrecision(state.resource).lt(reqMinFP)) return state;

  const pointsGained = Math.floor(Math.log10(new FixedPrecision(state.resource).toNumber()) * (1 + state.prestigePoints * 0.1));
  const nextStage = state.stage + 1;

  const currentUpgrades = [...state.upgrades];
  const nextEraUpgrades = stageUpgrades[nextStage]?.map((newU) => {
    const existing = currentUpgrades.find((u) => u.id === newU.id);
    return existing ? { ...newU, quantity: existing.quantity, cost: existing.cost } : { ...newU };
  }) || [];

  const allUpgradesMap = new Map();
  for (const u of currentUpgrades.concat(nextEraUpgrades)) {
    allUpgradesMap.set(u.id, { ...u });
  }
  const allUpgrades = Array.from(allUpgradesMap.values());

  return {
    ...state,
    stage: nextStage,
    stageName: stages[nextStage],
    resource: new FixedPrecision(0),
    energy: new FixedPrecision(state.energy),
    upgrades: allUpgrades,
    evolutionPoints: state.evolutionPoints + pointsGained,
  };
}

// Prestige
export function prestige(state: GameState): GameState {
  if (state.stage < 5) return state;
  const prestigePointsGained = Math.floor(Math.log10(state.energy.toNumber()) / 2);

  // Calcular produção automática total atual
  const totalAuto = state.upgrades.reduce((acc, u) => acc + u.quantity, 0);
  const autoToKeep = Math.floor(totalAuto * 0.01); // 10% arredondado para baixo

  // Gerar upgrades iniciais com 10% da produção automática
  const baseUpgrades = stageUpgrades[0].map((u, idx) => {
    // Distribuir autoToKeep proporcionalmente entre upgrades automáticos
    // Aqui, para simplificar, damos tudo para o primeiro upgrade automático
    if (idx === 0 && autoToKeep > 0) {
      return { ...u, quantity: autoToKeep };
    }
    return { ...u, quantity: 0 };
  });

  return {
    stage: 0,
    stageName: stages[0],
    resource: new FixedPrecision(0),
    energy: new FixedPrecision(0),
    upgrades: baseUpgrades,
    evolutionPoints: state.evolutionPoints,
    prestigePoints: state.prestigePoints + prestigePointsGained,
    completedMissions: state.completedMissions,
    clickCount: 0,
  };
}

// Complete mission
export function completeMission(state: GameState, missionId: string): GameState {
  if (state.completedMissions.includes(missionId)) return state;
  const mission = missions.find((m) => m.id === missionId && m.stage <= state.stage);
  if (!mission) return state;

  let canComplete = false;
  if ("resource" in mission.requirement && typeof mission.requirement.resource === "number") {
    canComplete = state.resource.gte(new FixedPrecision(mission.requirement.resource));
  } else if ("upgrade" in mission.requirement) {
    const upgrade = state.upgrades.find((u) => u.id === mission.requirement.upgrade);
    canComplete = !!upgrade && upgrade.quantity >= mission.requirement.quantity;
  }
  if (!canComplete) return state;

  const newState = { ...state, completedMissions: [...state.completedMissions, missionId] };
  if (mission.reward.energy) {
    newState.energy = newState.energy.add(new FixedPrecision(mission.reward.energy));
  }
  if (mission.reward.evolutionPoints) {
    newState.evolutionPoints += mission.reward.evolutionPoints;
  }
  return newState;
}

// Group upgrades by stage
export function getUpgradesByStage(upgrades: Upgrade[]): { stage: string; upgrades: Upgrade[] }[] {
  const result: { stage: string; upgrades: Upgrade[] }[] = [];
  stages.forEach((stage, idx) => {
    const stageUps = upgrades.filter((u) =>
      stageUpgrades[idx]?.some((baseU) => baseU.id === u.id)
    );
    if (stageUps.length > 0) {
      result.push({ stage, upgrades: stageUps });
    }
  });
  return result;
}
