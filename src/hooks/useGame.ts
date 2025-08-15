  import { useState, useEffect, useMemo } from "react";
  import FixedPrecision from "fixed-precision";
  import type { GameState, Upgrade } from "../types/game";

  // Evolution stages
  const stages = [
    "Basic Molecules",
    "Virus",
    "Bacteria",
    "Protozoan",
    "Simple Multicellular Organism",
    "Complex Organism",
    "Tribe / Primitive Society",
    "Advanced Civilization",
    "Industrial Era",
    "Technological Era",
    "Space Exploration",
    "Galactic Colonization",
  ];

  // Evolution requirements: required resource and minimum amount (more aggressive curve)
  const evolutionRequirements = [
    { resourceName: "Molecules", min: 1e3 },
    { resourceName: "Viruses", min: 2e4 },
    { resourceName: "Bacteria", min: 5e5 },
    { resourceName: "Protozoans", min: 2e7 },
    { resourceName: "Simple Multicellular", min: 1e9 },
    { resourceName: "Complex Organisms", min: 5e10 },
    { resourceName: "Population / Villages", min: 2e12 },
    { resourceName: "Cities / Technology", min: 1e14 },
    { resourceName: "Industries / Research", min: 5e15 },
    { resourceName: "Advanced Technology / Resources", min: 2e17 },
    { resourceName: "Colonies / Energy / Technology", min: 1e19 },
  ];

  // Name of the resource produced at each stage
  const producedResources = [
    "Molecules",
    "Viruses",
    "Bacteria",
    "Protozoans",
    "Simple Multicellular",
    "Complex Organisms",
    "Population",
    "Cities",
    "Industries",
    "Advanced Technology",
    "Colonies",
    "Galactic Energy",
  ];

  // Stage themes for visual feedback
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

  // Base upgrades per stage
  const stageUpgrades: Upgrade[][] = [
    [
      { id: "protein_synthesis", name: "Protein Synthesis", baseCost: 10, cost: new FixedPrecision(10), multiplier: 1.1, quantity: 0 },
      { id: "enzyme_catalyst", name: "Enzyme Catalyst", baseCost: 50, cost: new FixedPrecision(50), multiplier: 1.25, quantity: 0 },
      { id: "self_replication", name: "Self-Replication", baseCost: 200, cost: new FixedPrecision(200), multiplier: 1.5, quantity: 0 },
    ],
    [
      { id: "viral_capsid", name: "Viral Capsid", baseCost: 1_000, cost: new FixedPrecision(1_000), multiplier: 2, quantity: 0 },
      { id: "rna_efficiency", name: "Efficient RNA", baseCost: 3_000, cost: new FixedPrecision(3_000), multiplier: 4, quantity: 0 },
      { id: "viral_replication", name: "Viral Replication", baseCost: 10_000, cost: new FixedPrecision(10_000), multiplier: 5, quantity: 0 },
    ],
    [
      { id: "cell_wall", name: "Cell Wall", baseCost: 10_000, cost: new FixedPrecision(10_000), multiplier: 10, quantity: 0 },
      { id: "flagellum", name: "Flagellum", baseCost: 30_000, cost: new FixedPrecision(30_000), multiplier: 20, quantity: 0 },
      { id: "bacterial_colony", name: "Bacterial Colony", baseCost: 100_000, cost: new FixedPrecision(100_000), multiplier: 50, quantity: 0 },
    ],
    [
      { id: "protozoan_membrane", name: "Protozoan Membrane", baseCost: 200_000, cost: new FixedPrecision(200_000), multiplier: 60, quantity: 0 },
      { id: "cilia_movement", name: "Cilia Movement", baseCost: 500_000, cost: new FixedPrecision(500_000), multiplier: 120, quantity: 0 },
      { id: "protozoan_colony", name: "Protozoan Colony", baseCost: 1_000_000, cost: new FixedPrecision(1_000_000), multiplier: 250, quantity: 0 },
    ],
    [
      { id: "simple_multicellularity", name: "Simple Multicellularity", baseCost: 2_000_000, cost: new FixedPrecision(2_000_000), multiplier: 400, quantity: 0 },
      { id: "cell_specialization", name: "Cell Specialization", baseCost: 5_000_000, cost: new FixedPrecision(5_000_000), multiplier: 800, quantity: 0 },
      { id: "primitive_organ", name: "Primitive Organ", baseCost: 10_000_000, cost: new FixedPrecision(10_000_000), multiplier: 1_500, quantity: 0 },
    ],
    [
      { id: "complex_organism", name: "Complex Organism", baseCost: 20_000_000, cost: new FixedPrecision(20_000_000), multiplier: 2_500, quantity: 0 },
      { id: "nervous_system", name: "Nervous System", baseCost: 50_000_000, cost: new FixedPrecision(50_000_000), multiplier: 5_000, quantity: 0 },
      { id: "reproduction", name: "Sexual Reproduction", baseCost: 100_000_000, cost: new FixedPrecision(100_000_000), multiplier: 10_000, quantity: 0 },
    ],
    [
      { id: "tribe_formation", name: "Tribe Formation", baseCost: 200_000_000, cost: new FixedPrecision(200_000_000), multiplier: 20_000, quantity: 0 },
      { id: "language", name: "Language", baseCost: 500_000_000, cost: new FixedPrecision(500_000_000), multiplier: 40_000, quantity: 0 },
      { id: "tool_making", name: "Tool Making", baseCost: 1_000_000_000, cost: new FixedPrecision(1_000_000_000), multiplier: 80_000, quantity: 0 },
    ],
    [
      { id: "urbanization", name: "Urbanization", baseCost: 2_000_000_000, cost: new FixedPrecision(2_000_000_000), multiplier: 150_000, quantity: 0 },
      { id: "writing", name: "Writing", baseCost: 5_000_000_000, cost: new FixedPrecision(5_000_000_000), multiplier: 300_000, quantity: 0 },
      { id: "science", name: "Science", baseCost: 10_000_000_000, cost: new FixedPrecision(10_000_000_000), multiplier: 600_000, quantity: 0 },
    ],
    [
      { id: "factory", name: "Factory", baseCost: 20_000_000_000, cost: new FixedPrecision(20_000_000_000), multiplier: 1_200_000, quantity: 0 },
      { id: "steam_engine", name: "Steam Engine", baseCost: 50_000_000_000, cost: new FixedPrecision(50_000_000_000), multiplier: 2_500_000, quantity: 0 },
      { id: "mass_production", name: "Mass Production", baseCost: 100_000_000_000, cost: new FixedPrecision(100_000_000_000), multiplier: 5_000_000, quantity: 0 },
    ],
    [
      { id: "computer", name: "Computer", baseCost: 200_000_000_000, cost: new FixedPrecision(200_000_000_000), multiplier: 10_000_000, quantity: 0 },
      { id: "internet", name: "Internet", baseCost: 500_000_000_000, cost: new FixedPrecision(500_000_000_000), multiplier: 20_000_000, quantity: 0 },
      { id: "ai_research", name: "AI Research", baseCost: 1_000_000_000_000, cost: new FixedPrecision(1_000_000_000_000), multiplier: 40_000_000, quantity: 0 },
    ],
    [
      { id: "rocket_science", name: "Rocket Science", baseCost: 2_000_000_000_000, cost: new FixedPrecision(2_000_000_000_000), multiplier: 80_000_000, quantity: 0 },
      { id: "space_station", name: "Space Station", baseCost: 5_000_000_000_000, cost: new FixedPrecision(5_000_000_000_000), multiplier: 160_000_000, quantity: 0 },
      { id: "interstellar_probe", name: "Interstellar Probe", baseCost: 10_000_000_000_000, cost: new FixedPrecision(10_000_000_000_000), multiplier: 320_000_000, quantity: 0 },
    ],
    [
      { id: "dyson_sphere", name: "Dyson Sphere", baseCost: 10_000_000_000_000, cost: new FixedPrecision(10_000_000_000_000), multiplier: 1_000_000, quantity: 0 },
      { id: "galactic_civilization", name: "Galactic Civilization", baseCost: 50_000_000_000_000, cost: new FixedPrecision(50_000_000_000_000), multiplier: 5_000_000, quantity: 0 },
    ],
  ];

  // Missions for engagement
  const missions = [
    // Stage 0 - Basic Molecules
    { id: "m1", stage: 0, description: "Collect 500 Molecules", requirement: { resource: 500 }, reward: { energy: 100 } },
    { id: "m2", stage: 0, description: "Buy 3 Protein Syntheses", requirement: { upgrade: "protein_synthesis", quantity: 3 }, reward: { energy: 200 } },
    { id: "m3", stage: 0, description: "Buy 1 Enzyme Catalyst", requirement: { upgrade: "enzyme_catalyst", quantity: 1 }, reward: { evolutionPoints: 1 } },

    // Stage 1 - Virus
    { id: "m4", stage: 1, description: "Collect 5,000 Viruses", requirement: { resource: 5000 }, reward: { energy: 1_000 } },
    { id: "m5", stage: 1, description: "Buy 5 Viral Capsids", requirement: { upgrade: "viral_capsid", quantity: 5 }, reward: { evolutionPoints: 2 } },
    { id: "m6", stage: 1, description: "Buy 2 Efficient RNAs", requirement: { upgrade: "rna_efficiency", quantity: 2 }, reward: { energy: 2_000 } },

    // Stage 2 - Bacteria
    { id: "m7", stage: 2, description: "Reach 10,000 Bacteria", requirement: { resource: 10_000 }, reward: { energy: 5_000 } },
    { id: "m8", stage: 2, description: "Buy 3 Cell Walls", requirement: { upgrade: "cell_wall", quantity: 3 }, reward: { evolutionPoints: 2 } },
    { id: "m9", stage: 2, description: "Buy 2 Flagella", requirement: { upgrade: "flagellum", quantity: 2 }, reward: { energy: 10_000 } },

    // Stage 3 - Protozoan
    { id: "m10", stage: 3, description: "Collect 100,000 Protozoans", requirement: { resource: 100_000 }, reward: { energy: 50_000 } },
    { id: "m11", stage: 3, description: "Buy 2 Protozoan Membranes", requirement: { upgrade: "protozoan_membrane", quantity: 2 }, reward: { evolutionPoints: 3 } },
    { id: "m12", stage: 3, description: "Buy 1 Protozoan Colony", requirement: { upgrade: "protozoan_colony", quantity: 1 }, reward: { energy: 100_000 } },

    // Stage 4 - Simple Multicellular
    { id: "m13", stage: 4, description: "Reach 1,000,000 Simple Multicellular", requirement: { resource: 1_000_000 }, reward: { energy: 200_000 } },
    { id: "m14", stage: 4, description: "Buy 2 Simple Multicellularities", requirement: { upgrade: "simple_multicellularity", quantity: 2 }, reward: { evolutionPoints: 4 } },
    { id: "m15", stage: 4, description: "Buy 1 Primitive Organ", requirement: { upgrade: "primitive_organ", quantity: 1 }, reward: { energy: 500_000 } },

    // Stage 5 - Complex Organism
    { id: "m16", stage: 5, description: "Collect 10,000,000 Complex Organisms", requirement: { resource: 10_000_000 }, reward: { energy: 1_000_000 } },
    { id: "m17", stage: 5, description: "Buy 2 Complex Organisms", requirement: { upgrade: "complex_organism", quantity: 2 }, reward: { evolutionPoints: 5 } },
    { id: "m18", stage: 5, description: "Buy 1 Nervous System", requirement: { upgrade: "nervous_system", quantity: 1 }, reward: { energy: 2_000_000 } },

    // Stage 6 - Tribe / Primitive Society
    { id: "m19", stage: 6, description: "Reach 100,000,000 Population", requirement: { resource: 100_000_000 }, reward: { energy: 5_000_000 } },
    { id: "m20", stage: 6, description: "Buy 2 Tribe Formations", requirement: { upgrade: "tribe_formation", quantity: 2 }, reward: { evolutionPoints: 6 } },
    { id: "m21", stage: 6, description: "Buy 1 Language", requirement: { upgrade: "language", quantity: 1 }, reward: { energy: 10_000_000 } },

    // Stage 7 - Advanced Civilization
    { id: "m22", stage: 7, description: "Collect 1,000,000,000 Cities", requirement: { resource: 1_000_000_000 }, reward: { energy: 20_000_000 } },
    { id: "m23", stage: 7, description: "Buy 2 Urbanizations", requirement: { upgrade: "urbanization", quantity: 2 }, reward: { evolutionPoints: 7 } },
    { id: "m24", stage: 7, description: "Buy 1 Science", requirement: { upgrade: "science", quantity: 1 }, reward: { energy: 50_000_000 } },

    // Stage 8 - Industrial Era
    { id: "m25", stage: 8, description: "Reach 10,000,000,000 Industries", requirement: { resource: 10_000_000_000 }, reward: { energy: 100_000_000 } },
    { id: "m26", stage: 8, description: "Buy 2 Factories", requirement: { upgrade: "factory", quantity: 2 }, reward: { evolutionPoints: 8 } },
    { id: "m27", stage: 8, description: "Buy 1 Mass Production", requirement: { upgrade: "mass_production", quantity: 1 }, reward: { energy: 200_000_000 } },

    // Stage 9 - Technological Era
    { id: "m28", stage: 9, description: "Collect 100,000,000,000 Advanced Technology", requirement: { resource: 100_000_000_000 }, reward: { energy: 500_000_000 } },
    { id: "m29", stage: 9, description: "Buy 2 Computers", requirement: { upgrade: "computer", quantity: 2 }, reward: { evolutionPoints: 10 } },
    { id: "m30", stage: 9, description: "Buy 1 AI Research", requirement: { upgrade: "ai_research", quantity: 1 }, reward: { energy: 1_000_000_000 } },

    // Stage 10 - Space Exploration
    { id: "m31", stage: 10, description: "Reach 1,000,000,000,000 Colonies", requirement: { resource: 1_000_000_000_000 }, reward: { energy: 2_000_000_000 } },
    { id: "m32", stage: 10, description: "Buy 2 Rocket Sciences", requirement: { upgrade: "rocket_science", quantity: 2 }, reward: { evolutionPoints: 12 } },
    { id: "m33", stage: 10, description: "Buy 1 Interstellar Probe", requirement: { upgrade: "interstellar_probe", quantity: 1 }, reward: { energy: 5_000_000_000 } },

    // Stage 11 - Galactic Colonization
    { id: "m34", stage: 11, description: "Collect 10,000,000,000,000 Galactic Energy", requirement: { resource: 10_000_000_000_000 }, reward: { energy: 10_000_000_000 } },
    { id: "m35", stage: 11, description: "Buy 1 Dyson Sphere", requirement: { upgrade: "dyson_sphere", quantity: 1 }, reward: { evolutionPoints: 15 } },
    { id: "m36", stage: 11, description: "Buy 1 Galactic Civilization", requirement: { upgrade: "galactic_civilization", quantity: 1 }, reward: { energy: 50_000_000_000 } },
  ];

  export const useGame = () => {
    // Initial state
  function loadGameState(): GameState {
      try {
        const saved = localStorage.getItem("evolution-clicker-game");
        if (!saved) throw new Error("no save");
        const parsed = JSON.parse(saved);
        // Sempre força o stageName correto, mesmo se o save for antigo
        const stage = typeof parsed.stage === "number" ? parsed.stage : 0;
        // Atualiza nomes dos upgrades a partir do array stageUpgrades
        const allUpgrades: Upgrade[] = parsed.upgrades.map((u: any) => {
          // Procura upgrade pelo id em todos os stageUpgrades
          const correct = stageUpgrades.flat().find((su) => su.id === u.id);
          return {
            ...u,
            name: correct ? correct.name : u.name,
            cost: new FixedPrecision(u.cost),
          };
        });
        return {
          ...parsed,
          stage,
          stageName: stages[stage],
          resource: new FixedPrecision(parsed.resource),
          energy: new FixedPrecision(parsed.energy),
          upgrades: allUpgrades,
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

  // Save progress
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

  // Calculate global multiplier
    const getMultiplier = useMemo(() => {
      let mult = new FixedPrecision(1);
      for (const u of gameState.upgrades) {
        mult = mult.add(new FixedPrecision(u.multiplier - 1).mul(new FixedPrecision(u.quantity)));
      }
      mult = mult.add(new FixedPrecision(gameState.evolutionPoints).mul(new FixedPrecision(0.05)));
  // Prestige bonus: +5% per point
      mult = mult.mul(new FixedPrecision(1 + 0.05 * gameState.prestigePoints));
      return mult;
    }, [gameState.upgrades, gameState.evolutionPoints, gameState.prestigePoints]);

  // Auto production per second
    const autoProductionPerSecond = useMemo(() => {
      const totalAuto = gameState.upgrades.reduce((acc, u) => acc + u.quantity, 0);
      return new FixedPrecision(totalAuto)
        .mul(new FixedPrecision(1))
        .mul(getMultiplier)
        .div(new FixedPrecision(2)); // Adjusted divisor for balancing
    }, [getMultiplier, gameState.upgrades]);

  // Production per click
    const produce = () => {
      const amount = new FixedPrecision(1).mul(getMultiplier);
      setGameState((prev) => ({
        ...prev,
        resource: new FixedPrecision(prev.resource).add(amount),
        energy: new FixedPrecision(prev.energy).add(amount),
        clickCount: (prev.clickCount || 0) + 1,
      }));
    };

  // Auto production
    useEffect(() => {
      const interval = setInterval(() => {
        if (autoProductionPerSecond.gt(new FixedPrecision(0))) {
          setGameState((prev) => ({
            ...prev,
            resource: new FixedPrecision(prev.resource).add(autoProductionPerSecond),
            energy: new FixedPrecision(prev.energy).add(autoProductionPerSecond),
          }));
        }
  }, 1000); // Every second for smooth progression
      return () => clearInterval(interval);
    }, [autoProductionPerSecond]);

  // Buy upgrade
    const buyUpgrade = (upgradeId: string) => {
      setGameState((prev) => {
        const upgrade = prev.upgrades.find((u) => u.id === upgradeId);
        if (!upgrade || prev.energy.lt(upgrade.cost)) return prev;

        const newQuantity = upgrade.quantity + 1;
        const baseCostFP = new FixedPrecision(upgrade.baseCost);
  // Less aggressive cost: base 2.5 with linear increment
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

  // Evolve
  // Checks if all missions of the current era are complete
    const areEraMissionsComplete = (state: GameState) => {
      return missions.filter((m) => m.stage === state.stage).every((m) => state.completedMissions.includes(m.id));
    };

    const evolve = () => {
      setGameState((prev) => {
        if (prev.stage >= stages.length - 1) return prev;
        const req = evolutionRequirements[prev.stage];
        if (!req) return prev;
  // More aggressive resource requirement
        const dynamicMin = req.min * Math.pow(3, prev.stage + 1);
        const reqMinFP = new FixedPrecision(dynamicMin);
  // Requires all missions complete
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

  // Prestige system
    const prestige = () => {
      setGameState((prev) => {
  if (prev.stage < 5) return prev; // Requires at least stage 5 to prestige
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

  // Complete mission
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

  // Group upgrades by stage
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

  // Function to completely reset the game
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
  producedResource: producedResources[gameState.stage] || "Resource",
      autoProduction: { perSecond: autoProductionPerSecond },
      upgradesByStage,
      stageTheme: stageThemes[gameState.stage] || "primordial",
      FixedPrecision,
      clickCount: gameState.clickCount || 0,
      areEraMissionsComplete,
      evolutionRequirements,
    };
  };
