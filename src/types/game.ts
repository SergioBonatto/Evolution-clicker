import FixedPrecision from "fixed-precision";

export interface GameState {
  stage: number;              // Current stage (0 = Proteins, 1 = Virus, ...)
  resource: FixedPrecision;   // Current resource amount for the stage
  energy: FixedPrecision;     // Accumulated energy or generic equivalent
  upgrades: Upgrade[];        // Available/purchased upgrades
  evolutionPoints: number;    // Permanent points earned when resetting stage
  stageName: string;          // Name of the current stage
  prestigePoints: number;     // Accumulated prestige points
  completedMissions: string[]; // Completed missions
  clickCount: number;         // User click counter
}

export interface Upgrade {
  id: string;
  name: string;
  baseCost: number;
  cost: FixedPrecision;
  multiplier: number; // Resource gain multiplier
  quantity: number;   // Amount purchased
}

export interface Mission {
  id: string;
  stage: number;
  description: string;
  requirement: { resource: number } | { upgrade: string; quantity: number };
  reward: { energy?: number; evolutionPoints?: number };
}
