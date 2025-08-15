import FixedPrecision from "fixed-precision";

export interface GameState {
  stage: number;              // Estágio atual (0 = Proteínas, 1 = Vírus, ...)
  resource: FixedPrecision;   // Quantidade de recurso atual do estágio
  energy: FixedPrecision;     // Energia acumulada ou equivalente genérico
  upgrades: Upgrade[];        // Upgrades disponíveis/comprados
  evolutionPoints: number;    // Pontos permanentes ganhos ao resetar de estágio
  stageName: string;          // Nome do estágio atual
  prestigePoints: number;     // Pontos de prestígio acumulados
  completedMissions: string[]; // Missões concluídas
}

export interface Upgrade {
  id: string;
  name: string;
  baseCost: number;
  cost: FixedPrecision;
  multiplier: number; // Multiplicador de ganho por recurso
  quantity: number;   // Quantidade comprada
}

export interface Mission {
  id: string;
  stage: number;
  description: string;
  requirement: { resource: number } | { upgrade: string; quantity: number };
  reward: { energy?: number; evolutionPoints?: number };
}
