import { useState, useEffect, useMemo } from "react";
import FixedPrecision from "fixed-precision";
import type { GameState, Upgrade } from "../types/game";

// Estágios da evolução
const stages = [
  "Moléculas básicas",
  "Vírus",
  "Bactéria",
  "Protozoário",
  "Organismo multicelular simples",
  "Organismo complexo",
  "Tribo / sociedade primitiva",
  "Civilização avançada",
  "Era industrial",
  "Era tecnológica",
  "Exploração espacial",
  "Colonização galáctica",
];

// Requisitos de evolução: recurso necessário e quantidade mínima
const evolutionRequirements = [
  { resourceName: "Moléculas", min: 1e3 },
  { resourceName: "Vírus", min: 1e4 },
  { resourceName: "Bactérias", min: 1e5 },
  { resourceName: "Protozoários", min: 1e6 },
  { resourceName: "Multicelulares simples", min: 1e7 },
  { resourceName: "Organismos complexos", min: 1e8 },
  { resourceName: "População / aldeias", min: 1e9 },
  { resourceName: "Cidades / tecnologia", min: 1e11 },
  { resourceName: "Indústrias / pesquisa", min: 1e13 },
  { resourceName: "Tecnologia avançada / recursos", min: 1e15 },
  { resourceName: "Colônias / energia / tecnologia", min: 1e17 },
];

// Nome do recurso produzido em cada estágio
const producedResources = [
  "Moléculas",
  "Vírus",
  "Bactérias",
  "Protozoários",
  "Multicelulares simples",
  "Organismos complexos",
  "População",
  "Cidades",
  "Indústrias",
  "Tecnologia avançada",
  "Colônias",
  "Energia Galáctica",
];

// Temas por estágio para feedback visual
const stageThemes = [
  "primordial",
  "viral",
  "bacterial",
  "protozoan",
  "multicellular",
  "complex",
  "tribal",
  "advanced",
  "industrial",
  "tech",
  "space",
  "galactic",
];

// Upgrades base por estágio
const stageUpgrades: Upgrade[][] = [
  [
    { id: "protein_synthesis", name: "Síntese de Proteínas", baseCost: 10, cost: new FixedPrecision(10), multiplier: 1.1, quantity: 0 },
    { id: "enzyme_catalyst", name: "Catalisador Enzimático", baseCost: 50, cost: new FixedPrecision(50), multiplier: 1.25, quantity: 0 },
    { id: "self_replication", name: "Auto-replicação", baseCost: 200, cost: new FixedPrecision(200), multiplier: 1.5, quantity: 0 },
  ],
  [
    { id: "viral_capsid", name: "Capsídeo Viral", baseCost: 1_000, cost: new FixedPrecision(1_000), multiplier: 2, quantity: 0 },
    { id: "rna_efficiency", name: "RNA Eficiente", baseCost: 3_000, cost: new FixedPrecision(3_000), multiplier: 4, quantity: 0 },
    { id: "viral_replication", name: "Replicação Viral", baseCost: 10_000, cost: new FixedPrecision(10_000), multiplier: 5, quantity: 0 },
  ],
  [
    { id: "cell_wall", name: "Parede Celular", baseCost: 10_000, cost: new FixedPrecision(10_000), multiplier: 10, quantity: 0 },
    { id: "flagellum", name: "Flagelo", baseCost: 30_000, cost: new FixedPrecision(30_000), multiplier: 20, quantity: 0 },
    { id: "bacterial_colony", name: "Colônia Bacteriana", baseCost: 100_000, cost: new FixedPrecision(100_000), multiplier: 50, quantity: 0 },
  ],
  // ... (outros estágios mantidos iguais, com multiplicadores ajustados para balanceamento)
  [
    { id: "dyson_sphere", name: "Esfera de Dyson", baseCost: 10_000_000_000_000, cost: new FixedPrecision(10_000_000_000_000), multiplier: 1_000_000, quantity: 0 },
    { id: "galactic_civilization", name: "Civilização Galáctica", baseCost: 50_000_000_000_000, cost: new FixedPrecision(50_000_000_000_000), multiplier: 5_000_000, quantity: 0 },
  ],
];

// Missões para engajamento
const missions = [
  { id: "m1", stage: 0, description: "Coletar 500 Moléculas", requirement: { resource: 500 }, reward: { energy: 100 } },
  { id: "m2", stage: 1, description: "Comprar 5 Capsídeos Virais", requirement: { upgrade: "viral_capsid", quantity: 5 }, reward: { evolutionPoints: 2 } },
  { id: "m3", stage: 2, description: "Atingir 10,000 Bactérias", requirement: { resource: 10_000 }, reward: { energy: 5_000 } },
  // Adicionar mais missões para estágios avançados
];

export const useGame = () => {
  // Estado inicial
  function loadGameState(): GameState {
    try {
      const saved = localStorage.getItem("evolution-clicker-game");
      if (!saved) throw new Error("no save");
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        resource: new FixedPrecision(parsed.resource),
        energy: new FixedPrecision(parsed.energy),
        upgrades: parsed.upgrades.map((u: any) => ({
          ...u,
          cost: new FixedPrecision(u.cost),
        })),
        prestigePoints: parsed.prestigePoints || 0,
        completedMissions: parsed.completedMissions || [],
      };
    } catch {
      return {
        stage: 0,
        stageName: stages[0],
        resource: new FixedPrecision(0),
        energy: new FixedPrecision(0),
        upgrades: stageUpgrades[0].map((u) => ({ ...u })),
        evolutionPoints: 0,
        prestigePoints: 0,
        completedMissions: [],
      };
    }
  }

  const [gameState, setGameState] = useState<GameState>(loadGameState());

  // Salva progresso
  useEffect(() => {
    const toSave = {
      ...gameState,
      resource: gameState.resource.toString(),
      energy: gameState.energy.toString(),
      upgrades: gameState.upgrades.map((u) => ({
        ...u,
        cost: u.cost.toString(),
      })),
    };
    localStorage.setItem("evolution-clicker-game", JSON.stringify(toSave));
  }, [gameState]);

  // Calcula multiplicador global
  const getMultiplier = useMemo(() => {
    let mult = new FixedPrecision(1);
    for (const u of gameState.upgrades) {
      mult = mult.add(new FixedPrecision(u.multiplier - 1).mul(new FixedPrecision(u.quantity)));
    }
    mult = mult.add(new FixedPrecision(gameState.evolutionPoints).mul(new FixedPrecision(0.05)));
    // Bônus de prestígio: +5% por ponto
    mult = mult.mul(new FixedPrecision(1 + 0.05 * gameState.prestigePoints));
    return mult;
  }, [gameState.upgrades, gameState.evolutionPoints, gameState.prestigePoints]);

  // Produção automática por segundo
  const autoProductionPerSecond = useMemo(() => {
    const totalAuto = gameState.upgrades.reduce((acc, u) => acc + u.quantity, 0);
    return new FixedPrecision(totalAuto)
      .mul(new FixedPrecision(1))
      .mul(getMultiplier)
      .div(new FixedPrecision(2)); // Divisor ajustado para balanceamento
  }, [getMultiplier, gameState.upgrades]);

  // Produção por clique
  const produce = () => {
    const amount = new FixedPrecision(1).mul(getMultiplier);
    setGameState((prev) => ({
      ...prev,
      resource: new FixedPrecision(prev.resource).add(amount),
      energy: new FixedPrecision(prev.energy).add(amount),
    }));
  };

  // Produção automática
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoProductionPerSecond.gt(new FixedPrecision(0))) {
        setGameState((prev) => ({
          ...prev,
          resource: new FixedPrecision(prev.resource).add(autoProductionPerSecond),
          energy: new FixedPrecision(prev.energy).add(autoProductionPerSecond),
        }));
      }
    }, 1000); // A cada segundo para progressão fluida
    return () => clearInterval(interval);
  }, [autoProductionPerSecond]);

  // Comprar upgrade
  const buyUpgrade = (upgradeId: string) => {
    setGameState((prev) => {
      const upgrade = prev.upgrades.find((u) => u.id === upgradeId);
      if (!upgrade || prev.energy.lt(upgrade.cost)) return prev;

      const newQuantity = upgrade.quantity + 1;
      const baseCostFP = new FixedPrecision(upgrade.baseCost);
      // Custo menos agressivo: base 2.5 com incremento linear
      const factor = Math.pow(2.5, newQuantity) * (1 + 0.1 * newQuantity);
      const newCost = baseCostFP.mul(new FixedPrecision(factor));

      const newUpgrades = prev.upgrades.map((u) =>
        u.id === upgradeId ? { ...u, quantity: newQuantity, cost: newCost } : u
      );

      return {
        ...prev,
        energy: prev.energy.sub(upgrade.cost),
        upgrades: newUpgrades,
      };
    });
  };

  // Evoluir
  const evolve = () => {
    setGameState((prev) => {
      if (prev.stage >= stages.length - 1) return prev;
      const req = evolutionRequirements[prev.stage];
      if (!req) return prev;
      const dynamicMin = req.min * Math.pow(2.5, prev.stage); // Requisito menos agressivo
      const reqMinFP = new FixedPrecision(dynamicMin);
      if (new FixedPrecision(prev.resource).lt(reqMinFP)) return prev;

      const pointsGained = Math.floor(Math.log10(new FixedPrecision(prev.resource).toNumber()) * (1 + prev.prestigePoints * 0.1));
      const nextStage = prev.stage + 1;

      const currentUpgrades = [...prev.upgrades];
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
        ...prev,
        stage: nextStage,
        stageName: stages[nextStage],
        resource: new FixedPrecision(0),
        energy: new FixedPrecision(prev.energy),
        upgrades: allUpgrades,
        evolutionPoints: prev.evolutionPoints + pointsGained,
      };
    });
  };

  // Sistema de Prestígio
  const prestige = () => {
    setGameState((prev) => {
      if (prev.stage < 5) return prev; // Requer pelo menos estágio 5 para prestigiar
      const prestigePointsGained = Math.floor(Math.log10(prev.energy.toNumber()) / 2);
      return {
        stage: 0,
        stageName: stages[0],
        resource: new FixedPrecision(0),
        energy: new FixedPrecision(0),
        upgrades: stageUpgrades[0].map((u) => ({ ...u })),
        evolutionPoints: prev.evolutionPoints,
        prestigePoints: prev.prestigePoints + prestigePointsGained,
        completedMissions: prev.completedMissions,
      };
    });
  };

  // Completar missão
const completeMission = (missionId: string) => {
  setGameState((prev) => {
    if (prev.completedMissions.includes(missionId)) return prev;
    const mission = missions.find((m) => m.id === missionId && m.stage <= prev.stage);
    if (!mission) return prev;

    let canComplete = false;
    if ("resource" in mission.requirement && typeof mission.requirement.resource === "number") {
      canComplete = prev.resource.gte(new FixedPrecision(mission.requirement.resource));
    } else if ("upgrade" in mission.requirement) {
      const upgrade = prev.upgrades.find((u) => u.id === mission.requirement.upgrade);
      canComplete = !!upgrade && upgrade.quantity >= mission.requirement.quantity;
    }
    if (!canComplete) return prev;

    const newState = { ...prev, completedMissions: [...prev.completedMissions, missionId] };
    if (mission.reward.energy) {
      newState.energy = newState.energy.add(new FixedPrecision(mission.reward.energy));
    }
    if (mission.reward.evolutionPoints) {
      newState.evolutionPoints += mission.reward.evolutionPoints;
    }
    return newState;
  });
};

  // Agrupar upgrades por estágio
  const upgradesByStage = useMemo(() => {
    const result: { stage: string; upgrades: Upgrade[] }[] = [];
    stages.forEach((stage, idx) => {
      const stageUps = gameState.upgrades.filter((u) =>
        stageUpgrades[idx]?.some((baseU) => baseU.id === u.id)
      );
      if (stageUps.length > 0) {
        result.push({ stage, upgrades: stageUps });
      }
    });
    return result;
  }, [gameState.upgrades]);

  return {
    gameState,
    produce,
    buyUpgrade,
    evolve,
    prestige,
    completeMission,
    missions: missions.filter((m) => m.stage <= gameState.stage && !gameState.completedMissions.includes(m.id)),
    producedResource: producedResources[gameState.stage] || "Recurso",
    autoProduction: { perSecond: autoProductionPerSecond },
    upgradesByStage,
    stageTheme: stageThemes[gameState.stage] || "primordial",
    FixedPrecision,
  };
};
