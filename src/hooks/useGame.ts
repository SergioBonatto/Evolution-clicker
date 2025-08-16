  import { useState, useEffect, useMemo } from "react";
  import FixedPrecision from "fixed-precision";
  import type { GameState, Upgrade } from "../types/game";
  import {
    stages,
    evolutionRequirements,
    producedResources,
    stageThemes,
    stageUpgrades,
    missions,
  } from "../data/evolutionData";
  import {
    areEraMissionsComplete,
    getMultiplier,
    getAutoProductionPerSecond,
    produce as produceUtil,
    buyUpgrade as buyUpgradeUtil,
    evolve as evolveUtil,
    prestige as prestigeUtil,
    completeMission as completeMissionUtil,
    getUpgradesByStage,
  } from "../utils/gameUtils";


export const useGame = () => {
  // Initial state
  function loadGameState(): GameState {
    try {
      const saved = localStorage.getItem("evolution-clicker-game");
      if (!saved) throw new Error("no save");
      const parsed = JSON.parse(saved);
      // Always force the correct stageName, even if the save is old
      const stage = typeof parsed.stage === "number" ? parsed.stage : 0;
      // Update upgrade names from the stageUpgrades array
      const allUpgrades: Upgrade[] = parsed.upgrades.map((u: any) => {
        // Find upgrade by id in all stageUpgrades
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



  // Memoized global multiplier
  const multiplier = useMemo(() => getMultiplier(gameState), [gameState]);

  // Memoized auto production per second
  const autoProductionPerSecond = useMemo(() => getAutoProductionPerSecond(gameState), [gameState]);

  // Production per click
  const produce = () => {
    setGameState((prev) => produceUtil(prev));
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
    setGameState((prev) => buyUpgradeUtil(prev, upgradeId));
  };

  // Evolve
  const evolve = () => {
    setGameState((prev) => evolveUtil(prev));
  };

  // Prestige
  const prestige = () => {
    setGameState((prev) => prestigeUtil(prev));
  };

  // Complete mission
  const completeMission = (missionId: string) => {
    setGameState((prev) => completeMissionUtil(prev, missionId));
  };

  // Group upgrades by stage
  const upgradesByStage = useMemo(() => getUpgradesByStage(gameState.upgrades), [gameState.upgrades]);


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
    multiplier,
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
