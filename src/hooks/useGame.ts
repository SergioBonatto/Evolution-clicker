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
  // Requisitos de evolução: recurso necessário e quantidade mínima (curva mais agressiva)
  const evolutionRequirements = [
    { resourceName: "Moléculas", min: 1e3 },
    { resourceName: "Vírus", min: 2e4 },
    { resourceName: "Bactérias", min: 5e5 },
    { resourceName: "Protozoários", min: 2e7 },
    { resourceName: "Multicelulares simples", min: 1e9 },
    { resourceName: "Organismos complexos", min: 5e10 },
    { resourceName: "População / aldeias", min: 2e12 },
    { resourceName: "Cidades / tecnologia", min: 1e14 },
    { resourceName: "Indústrias / pesquisa", min: 5e15 },
    { resourceName: "Tecnologia avançada / recursos", min: 2e17 },
    { resourceName: "Colônias / energia / tecnologia", min: 1e19 },
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
    [
      { id: "protozoan_membrane", name: "Membrana Protozoária", baseCost: 200_000, cost: new FixedPrecision(200_000), multiplier: 60, quantity: 0 },
      { id: "cilia_movement", name: "Movimento por Cílios", baseCost: 500_000, cost: new FixedPrecision(500_000), multiplier: 120, quantity: 0 },
      { id: "protozoan_colony", name: "Colônia de Protozoários", baseCost: 1_000_000, cost: new FixedPrecision(1_000_000), multiplier: 250, quantity: 0 },
    ],
    [
      { id: "simple_multicellularity", name: "Multicelularidade Simples", baseCost: 2_000_000, cost: new FixedPrecision(2_000_000), multiplier: 400, quantity: 0 },
      { id: "cell_specialization", name: "Especialização Celular", baseCost: 5_000_000, cost: new FixedPrecision(5_000_000), multiplier: 800, quantity: 0 },
      { id: "primitive_organ", name: "Órgão Primitivo", baseCost: 10_000_000, cost: new FixedPrecision(10_000_000), multiplier: 1_500, quantity: 0 },
    ],
    [
      { id: "complex_organism", name: "Organismo Complexo", baseCost: 20_000_000, cost: new FixedPrecision(20_000_000), multiplier: 2_500, quantity: 0 },
      { id: "nervous_system", name: "Sistema Nervoso", baseCost: 50_000_000, cost: new FixedPrecision(50_000_000), multiplier: 5_000, quantity: 0 },
      { id: "reproduction", name: "Reprodução Sexual", baseCost: 100_000_000, cost: new FixedPrecision(100_000_000), multiplier: 10_000, quantity: 0 },
    ],
    [
      { id: "tribe_formation", name: "Formação de Tribos", baseCost: 200_000_000, cost: new FixedPrecision(200_000_000), multiplier: 20_000, quantity: 0 },
      { id: "language", name: "Linguagem", baseCost: 500_000_000, cost: new FixedPrecision(500_000_000), multiplier: 40_000, quantity: 0 },
      { id: "tool_making", name: "Fabricação de Ferramentas", baseCost: 1_000_000_000, cost: new FixedPrecision(1_000_000_000), multiplier: 80_000, quantity: 0 },
    ],
    [
      { id: "urbanization", name: "Urbanização", baseCost: 2_000_000_000, cost: new FixedPrecision(2_000_000_000), multiplier: 150_000, quantity: 0 },
      { id: "writing", name: "Escrita", baseCost: 5_000_000_000, cost: new FixedPrecision(5_000_000_000), multiplier: 300_000, quantity: 0 },
      { id: "science", name: "Ciência", baseCost: 10_000_000_000, cost: new FixedPrecision(10_000_000_000), multiplier: 600_000, quantity: 0 },
    ],
    [
      { id: "factory", name: "Fábrica", baseCost: 20_000_000_000, cost: new FixedPrecision(20_000_000_000), multiplier: 1_200_000, quantity: 0 },
      { id: "steam_engine", name: "Máquina a Vapor", baseCost: 50_000_000_000, cost: new FixedPrecision(50_000_000_000), multiplier: 2_500_000, quantity: 0 },
      { id: "mass_production", name: "Produção em Massa", baseCost: 100_000_000_000, cost: new FixedPrecision(100_000_000_000), multiplier: 5_000_000, quantity: 0 },
    ],
    [
      { id: "computer", name: "Computador", baseCost: 200_000_000_000, cost: new FixedPrecision(200_000_000_000), multiplier: 10_000_000, quantity: 0 },
      { id: "internet", name: "Internet", baseCost: 500_000_000_000, cost: new FixedPrecision(500_000_000_000), multiplier: 20_000_000, quantity: 0 },
      { id: "ai_research", name: "Pesquisa em IA", baseCost: 1_000_000_000_000, cost: new FixedPrecision(1_000_000_000_000), multiplier: 40_000_000, quantity: 0 },
    ],
    [
      { id: "rocket_science", name: "Ciência de Foguetes", baseCost: 2_000_000_000_000, cost: new FixedPrecision(2_000_000_000_000), multiplier: 80_000_000, quantity: 0 },
      { id: "space_station", name: "Estação Espacial", baseCost: 5_000_000_000_000, cost: new FixedPrecision(5_000_000_000_000), multiplier: 160_000_000, quantity: 0 },
      { id: "interstellar_probe", name: "Sonda Interestelar", baseCost: 10_000_000_000_000, cost: new FixedPrecision(10_000_000_000_000), multiplier: 320_000_000, quantity: 0 },
    ],
    [
      { id: "dyson_sphere", name: "Esfera de Dyson", baseCost: 10_000_000_000_000, cost: new FixedPrecision(10_000_000_000_000), multiplier: 1_000_000, quantity: 0 },
      { id: "galactic_civilization", name: "Civilização Galáctica", baseCost: 50_000_000_000_000, cost: new FixedPrecision(50_000_000_000_000), multiplier: 5_000_000, quantity: 0 },
    ],
  ];

  // Missões para engajamento
  const missions = [
    // Estágio 0 - Moléculas básicas
    { id: "m1", stage: 0, description: "Coletar 500 Moléculas", requirement: { resource: 500 }, reward: { energy: 100 } },
    { id: "m2", stage: 0, description: "Comprar 3 Sínteses de Proteínas", requirement: { upgrade: "protein_synthesis", quantity: 3 }, reward: { energy: 200 } },
    { id: "m3", stage: 0, description: "Comprar 1 Catalisador Enzimático", requirement: { upgrade: "enzyme_catalyst", quantity: 1 }, reward: { evolutionPoints: 1 } },

    // Estágio 1 - Vírus
    { id: "m4", stage: 1, description: "Coletar 5.000 Vírus", requirement: { resource: 5000 }, reward: { energy: 1_000 } },
    { id: "m5", stage: 1, description: "Comprar 5 Capsídeos Virais", requirement: { upgrade: "viral_capsid", quantity: 5 }, reward: { evolutionPoints: 2 } },
    { id: "m6", stage: 1, description: "Comprar 2 RNAs Eficientes", requirement: { upgrade: "rna_efficiency", quantity: 2 }, reward: { energy: 2_000 } },

    // Estágio 2 - Bactéria
    { id: "m7", stage: 2, description: "Atingir 10.000 Bactérias", requirement: { resource: 10_000 }, reward: { energy: 5_000 } },
    { id: "m8", stage: 2, description: "Comprar 3 Paredes Celulares", requirement: { upgrade: "cell_wall", quantity: 3 }, reward: { evolutionPoints: 2 } },
    { id: "m9", stage: 2, description: "Comprar 2 Flagelos", requirement: { upgrade: "flagellum", quantity: 2 }, reward: { energy: 10_000 } },

    // Estágio 3 - Protozoário
    { id: "m10", stage: 3, description: "Coletar 100.000 Protozoários", requirement: { resource: 100_000 }, reward: { energy: 50_000 } },
    { id: "m11", stage: 3, description: "Comprar 2 Membranas Protozoárias", requirement: { upgrade: "protozoan_membrane", quantity: 2 }, reward: { evolutionPoints: 3 } },
    { id: "m12", stage: 3, description: "Comprar 1 Colônia de Protozoários", requirement: { upgrade: "protozoan_colony", quantity: 1 }, reward: { energy: 100_000 } },

    // Estágio 4 - Multicelulares simples
    { id: "m13", stage: 4, description: "Atingir 1.000.000 Multicelulares simples", requirement: { resource: 1_000_000 }, reward: { energy: 200_000 } },
    { id: "m14", stage: 4, description: "Comprar 2 Multicelularidades Simples", requirement: { upgrade: "simple_multicellularity", quantity: 2 }, reward: { evolutionPoints: 4 } },
    { id: "m15", stage: 4, description: "Comprar 1 Órgão Primitivo", requirement: { upgrade: "primitive_organ", quantity: 1 }, reward: { energy: 500_000 } },

    // Estágio 5 - Organismo complexo
    { id: "m16", stage: 5, description: "Coletar 10.000.000 Organismos complexos", requirement: { resource: 10_000_000 }, reward: { energy: 1_000_000 } },
    { id: "m17", stage: 5, description: "Comprar 2 Organismos Complexos", requirement: { upgrade: "complex_organism", quantity: 2 }, reward: { evolutionPoints: 5 } },
    { id: "m18", stage: 5, description: "Comprar 1 Sistema Nervoso", requirement: { upgrade: "nervous_system", quantity: 1 }, reward: { energy: 2_000_000 } },

    // Estágio 6 - Tribo / sociedade primitiva
    { id: "m19", stage: 6, description: "Atingir 100.000.000 de População", requirement: { resource: 100_000_000 }, reward: { energy: 5_000_000 } },
    { id: "m20", stage: 6, description: "Comprar 2 Formaçãos de Tribos", requirement: { upgrade: "tribe_formation", quantity: 2 }, reward: { evolutionPoints: 6 } },
    { id: "m21", stage: 6, description: "Comprar 1 Linguagem", requirement: { upgrade: "language", quantity: 1 }, reward: { energy: 10_000_000 } },

    // Estágio 7 - Civilização avançada
    { id: "m22", stage: 7, description: "Coletar 1.000.000.000 Cidades", requirement: { resource: 1_000_000_000 }, reward: { energy: 20_000_000 } },
    { id: "m23", stage: 7, description: "Comprar 2 Urbanizações", requirement: { upgrade: "urbanization", quantity: 2 }, reward: { evolutionPoints: 7 } },
    { id: "m24", stage: 7, description: "Comprar 1 Ciência", requirement: { upgrade: "science", quantity: 1 }, reward: { energy: 50_000_000 } },

    // Estágio 8 - Era industrial
    { id: "m25", stage: 8, description: "Atingir 10.000.000.000 Indústrias", requirement: { resource: 10_000_000_000 }, reward: { energy: 100_000_000 } },
    { id: "m26", stage: 8, description: "Comprar 2 Fábricas", requirement: { upgrade: "factory", quantity: 2 }, reward: { evolutionPoints: 8 } },
    { id: "m27", stage: 8, description: "Comprar 1 Produção em Massa", requirement: { upgrade: "mass_production", quantity: 1 }, reward: { energy: 200_000_000 } },

    // Estágio 9 - Era tecnológica
    { id: "m28", stage: 9, description: "Coletar 100.000.000.000 Tecnologia Avançada", requirement: { resource: 100_000_000_000 }, reward: { energy: 500_000_000 } },
    { id: "m29", stage: 9, description: "Comprar 2 Computadores", requirement: { upgrade: "computer", quantity: 2 }, reward: { evolutionPoints: 10 } },
    { id: "m30", stage: 9, description: "Comprar 1 Pesquisa em IA", requirement: { upgrade: "ai_research", quantity: 1 }, reward: { energy: 1_000_000_000 } },

    // Estágio 10 - Exploração espacial
    { id: "m31", stage: 10, description: "Atingir 1.000.000.000.000 Colônias", requirement: { resource: 1_000_000_000_000 }, reward: { energy: 2_000_000_000 } },
    { id: "m32", stage: 10, description: "Comprar 2 Ciências de Foguetes", requirement: { upgrade: "rocket_science", quantity: 2 }, reward: { evolutionPoints: 12 } },
    { id: "m33", stage: 10, description: "Comprar 1 Sonda Interestelar", requirement: { upgrade: "interstellar_probe", quantity: 1 }, reward: { energy: 5_000_000_000 } },

    // Estágio 11 - Colonização galáctica
    { id: "m34", stage: 11, description: "Coletar 10.000.000.000.000 Energia Galáctica", requirement: { resource: 10_000_000_000_000 }, reward: { energy: 10_000_000_000 } },
    { id: "m35", stage: 11, description: "Comprar 1 Esfera de Dyson", requirement: { upgrade: "dyson_sphere", quantity: 1 }, reward: { evolutionPoints: 15 } },
    { id: "m36", stage: 11, description: "Comprar 1 Civilização Galáctica", requirement: { upgrade: "galactic_civilization", quantity: 1 }, reward: { energy: 50_000_000_000 } },
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
          clickCount: parsed.clickCount || 0,
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
          clickCount: 0,
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
        clickCount: gameState.clickCount || 0,
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
        clickCount: (prev.clickCount || 0) + 1,
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
    // Checa se todas as missões da era atual estão completas
    const areEraMissionsComplete = (state: GameState) => {
      return missions.filter((m) => m.stage === state.stage).every((m) => state.completedMissions.includes(m.id));
    };

    const evolve = () => {
      setGameState((prev) => {
        if (prev.stage >= stages.length - 1) return prev;
        const req = evolutionRequirements[prev.stage];
        if (!req) return prev;
        // Requisito de recurso mais agressivo
        const dynamicMin = req.min * Math.pow(3, prev.stage + 1);
        const reqMinFP = new FixedPrecision(dynamicMin);
        // Exige missões completas
        if (!areEraMissionsComplete(prev)) return prev;
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
          clickCount: 0,
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

    // Função para resetar o jogo completamente
    const resetGame = () => {
      localStorage.removeItem("evolution-clicker-game");
      setGameState({
        stage: 0,
        stageName: stages[0],
        resource: new FixedPrecision(0),
        energy: new FixedPrecision(0),
        upgrades: stageUpgrades[0].map((u) => ({ ...u })),
        evolutionPoints: 0,
        prestigePoints: 0,
        completedMissions: [],
        clickCount: 0,
      });
    };

    return {
      gameState,
      produce,
      buyUpgrade,
      evolve,
      prestige,
      completeMission,
      resetGame,
      missions: missions.filter((m) => m.stage <= gameState.stage && !gameState.completedMissions.includes(m.id)),
      producedResource: producedResources[gameState.stage] || "Recurso",
      autoProduction: { perSecond: autoProductionPerSecond },
      upgradesByStage,
      stageTheme: stageThemes[gameState.stage] || "primordial",
      FixedPrecision,
      clickCount: gameState.clickCount || 0,
      areEraMissionsComplete,
      evolutionRequirements,
    };
  };
