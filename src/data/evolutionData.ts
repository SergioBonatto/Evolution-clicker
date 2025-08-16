// Dados estáticos do jogo: estágios, requisitos, upgrades, missões, temas, etc.
import FixedPrecision from "fixed-precision";
import type { Upgrade } from "../types/game";

export const stages = [
  "stage.basicMolecules",
  "stage.virus",
  "stage.bacteria",
  "stage.protozoan",
  "stage.simpleMulticellular",
  "stage.complexOrganism",
  "stage.tribe",
  "stage.advancedCivilization",
  "stage.industrialEra",
  "stage.technologicalEra",
  "stage.spaceExploration",
  "stage.galacticColonization",
];

export const evolutionRequirements = [
  { resourceName: "resource.molecules", min: 1e3 },
  { resourceName: "resource.viruses", min: 2e4 },
  { resourceName: "resource.bacteria", min: 5e5 },
  { resourceName: "resource.protozoans", min: 2e7 },
  { resourceName: "resource.simpleMulticellular", min: 1e9 },
  { resourceName: "resource.complexOrganisms", min: 5e10 },
  { resourceName: "resource.population", min: 2e12 },
  { resourceName: "resource.cities", min: 1e14 },
  { resourceName: "resource.industries", min: 5e15 },
  { resourceName: "resource.advancedTechnology", min: 2e17 },
  { resourceName: "resource.colonies", min: 1e19 },
];

export const producedResources = [
  "resource.molecules",
  "resource.viruses",
  "resource.bacteria",
  "resource.protozoans",
  "resource.simpleMulticellular",
  "resource.complexOrganisms",
  "resource.population",
  "resource.cities",
  "resource.industries",
  "resource.advancedTechnology",
  "resource.colonies",
  "resource.galacticEnergy",
];

export const stageThemes = [
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

export const stageUpgrades: Upgrade[][] = [
  [
    { id: "protein_synthesis", name: "upgrade.proteinSynthesis", baseCost: 10, cost: new FixedPrecision(10), multiplier: 1.1, quantity: 0 },
    { id: "enzyme_catalyst", name: "upgrade.enzymeCatalyst", baseCost: 50, cost: new FixedPrecision(50), multiplier: 1.25, quantity: 0 },
    { id: "self_replication", name: "upgrade.selfReplication", baseCost: 200, cost: new FixedPrecision(200), multiplier: 1.5, quantity: 0 },
  ],
  [
    { id: "viral_capsid", name: "upgrade.viralCapsid", baseCost: 1_000, cost: new FixedPrecision(1_000), multiplier: 2, quantity: 0 },
    { id: "rna_efficiency", name: "upgrade.rnaEfficiency", baseCost: 3_000, cost: new FixedPrecision(3_000), multiplier: 4, quantity: 0 },
    { id: "viral_replication", name: "upgrade.viralReplication", baseCost: 10_000, cost: new FixedPrecision(10_000), multiplier: 5, quantity: 0 },
  ],
  [
    { id: "cell_wall", name: "upgrade.cellWall", baseCost: 10_000, cost: new FixedPrecision(10_000), multiplier: 10, quantity: 0 },
    { id: "flagellum", name: "upgrade.flagellum", baseCost: 30_000, cost: new FixedPrecision(30_000), multiplier: 20, quantity: 0 },
    { id: "bacterial_colony", name: "upgrade.bacterialColony", baseCost: 100_000, cost: new FixedPrecision(100_000), multiplier: 50, quantity: 0 },
  ],
  [
    { id: "protozoan_membrane", name: "upgrade.protozoanMembrane", baseCost: 200_000, cost: new FixedPrecision(200_000), multiplier: 60, quantity: 0 },
    { id: "cilia_movement", name: "upgrade.ciliaMovement", baseCost: 500_000, cost: new FixedPrecision(500_000), multiplier: 120, quantity: 0 },
    { id: "protozoan_colony", name: "upgrade.protozoanColony", baseCost: 1_000_000, cost: new FixedPrecision(1_000_000), multiplier: 250, quantity: 0 },
  ],
  [
    { id: "simple_multicellularity", name: "upgrade.simpleMulticellularity", baseCost: 2_000_000, cost: new FixedPrecision(2_000_000), multiplier: 400, quantity: 0 },
    { id: "cell_specialization", name: "upgrade.cellSpecialization", baseCost: 5_000_000, cost: new FixedPrecision(5_000_000), multiplier: 800, quantity: 0 },
    { id: "primitive_organ", name: "upgrade.primitiveOrgan", baseCost: 10_000_000, cost: new FixedPrecision(10_000_000), multiplier: 1_500, quantity: 0 },
  ],
  [
    { id: "complex_organism", name: "upgrade.complexOrganism", baseCost: 20_000_000, cost: new FixedPrecision(20_000_000), multiplier: 2_500, quantity: 0 },
    { id: "nervous_system", name: "upgrade.nervousSystem", baseCost: 50_000_000, cost: new FixedPrecision(50_000_000), multiplier: 5_000, quantity: 0 },
    { id: "reproduction", name: "upgrade.reproduction", baseCost: 100_000_000, cost: new FixedPrecision(100_000_000), multiplier: 10_000, quantity: 0 },
  ],
  [
    { id: "tribe_formation", name: "upgrade.tribeFormation", baseCost: 200_000_000, cost: new FixedPrecision(200_000_000), multiplier: 20_000, quantity: 0 },
    { id: "language", name: "upgrade.language", baseCost: 500_000_000, cost: new FixedPrecision(500_000_000), multiplier: 40_000, quantity: 0 },
    { id: "tool_making", name: "upgrade.toolMaking", baseCost: 1_000_000_000, cost: new FixedPrecision(1_000_000_000), multiplier: 80_000, quantity: 0 },
  ],
  [
    { id: "urbanization", name: "upgrade.urbanization", baseCost: 2_000_000_000, cost: new FixedPrecision(2_000_000_000), multiplier: 150_000, quantity: 0 },
    { id: "writing", name: "upgrade.writing", baseCost: 5_000_000_000, cost: new FixedPrecision(5_000_000_000), multiplier: 300_000, quantity: 0 },
    { id: "science", name: "upgrade.science", baseCost: 10_000_000_000, cost: new FixedPrecision(10_000_000_000), multiplier: 600_000, quantity: 0 },
  ],
  [
    { id: "factory", name: "upgrade.factory", baseCost: 20_000_000_000, cost: new FixedPrecision(20_000_000_000), multiplier: 1_200_000, quantity: 0 },
    { id: "steam_engine", name: "upgrade.steamEngine", baseCost: 50_000_000_000, cost: new FixedPrecision(50_000_000_000), multiplier: 2_500_000, quantity: 0 },
    { id: "mass_production", name: "upgrade.massProduction", baseCost: 100_000_000_000, cost: new FixedPrecision(100_000_000_000), multiplier: 5_000_000, quantity: 0 },
  ],
  [
    { id: "computer", name: "upgrade.computer", baseCost: 200_000_000_000, cost: new FixedPrecision(200_000_000_000), multiplier: 10_000_000, quantity: 0 },
    { id: "internet", name: "upgrade.internet", baseCost: 500_000_000_000, cost: new FixedPrecision(500_000_000_000), multiplier: 20_000_000, quantity: 0 },
    { id: "ai_research", name: "upgrade.aiResearch", baseCost: 1_000_000_000_000, cost: new FixedPrecision(1_000_000_000_000), multiplier: 40_000_000, quantity: 0 },
  ],
  [
    { id: "rocket_science", name: "upgrade.rocketScience", baseCost: 2_000_000_000_000, cost: new FixedPrecision(2_000_000_000_000), multiplier: 80_000_000, quantity: 0 },
    { id: "space_station", name: "upgrade.spaceStation", baseCost: 5_000_000_000_000, cost: new FixedPrecision(5_000_000_000_000), multiplier: 160_000_000, quantity: 0 },
    { id: "interstellar_probe", name: "upgrade.interstellarProbe", baseCost: 10_000_000_000_000, cost: new FixedPrecision(10_000_000_000_000), multiplier: 320_000_000, quantity: 0 },
  ],
  [
    { id: "dyson_sphere", name: "upgrade.dysonSphere", baseCost: 10_000_000_000_000, cost: new FixedPrecision(10_000_000_000_000), multiplier: 1_000_000, quantity: 0 },
    { id: "galactic_civilization", name: "upgrade.galacticCivilization", baseCost: 50_000_000_000_000, cost: new FixedPrecision(50_000_000_000_000), multiplier: 5_000_000, quantity: 0 },
  ],
];

export const missions = [
  // Stage 0 - Basic Molecules
  { id: "m1", stage: 0, description: { key: "mission.collectResource", values: { amount: 500, resource: "resource.molecules" } }, requirement: { resource: 500 }, reward: { energy: 100 } },
  { id: "m2", stage: 0, description: { key: "mission.buyUpgrade", values: { amount: 3, upgrade: "upgrade.proteinSynthesis" } }, requirement: { upgrade: "protein_synthesis", quantity: 3 }, reward: { energy: 200 } },
  { id: "m3", stage: 0, description: { key: "mission.buyUpgrade", values: { amount: 1, upgrade: "upgrade.enzymeCatalyst" } }, requirement: { upgrade: "enzyme_catalyst", quantity: 1 }, reward: { evolutionPoints: 1 } },

  // Stage 1 - Virus
  { id: "m4", stage: 1, description: { key: "mission.collectResource", values: { amount: 5000, resource: "resource.viruses" } }, requirement: { resource: 5000 }, reward: { energy: 1_000 } },
  { id: "m5", stage: 1, description: { key: "mission.buyUpgrade", values: { amount: 5, upgrade: "upgrade.viralCapsid" } }, requirement: { upgrade: "viral_capsid", quantity: 5 }, reward: { evolutionPoints: 2 } },
  { id: "m6", stage: 1, description: { key: "mission.buyUpgrade", values: { amount: 2, upgrade: "upgrade.rnaEfficiency" } }, requirement: { upgrade: "rna_efficiency", quantity: 2 }, reward: { energy: 2_000 } },

  // Stage 2 - Bacteria
  { id: "m7", stage: 2, description: { key: "mission.reachResource", values: { amount: 10_000, resource: "resource.bacteria" } }, requirement: { resource: 10_000 }, reward: { energy: 5_000 } },
  { id: "m8", stage: 2, description: { key: "mission.buyUpgrade", values: { amount: 3, upgrade: "upgrade.cellWall" } }, requirement: { upgrade: "cell_wall", quantity: 3 }, reward: { evolutionPoints: 2 } },
  { id: "m9", stage: 2, description: { key: "mission.buyUpgrade", values: { amount: 2, upgrade: "upgrade.flagellum" } }, requirement: { upgrade: "flagellum", quantity: 2 }, reward: { energy: 10_000 } },

  // Stage 3 - Protozoan
  { id: "m10", stage: 3, description: { key: "mission.collectResource", values: { amount: 100_000, resource: "resource.protozoans" } }, requirement: { resource: 100_000 }, reward: { energy: 50_000 } },
  { id: "m11", stage: 3, description: { key: "mission.buyUpgrade", values: { amount: 2, upgrade: "upgrade.protozoanMembrane" } }, requirement: { upgrade: "protozoan_membrane", quantity: 2 }, reward: { evolutionPoints: 3 } },
  { id: "m12", stage: 3, description: { key: "mission.buyUpgrade", values: { amount: 1, upgrade: "upgrade.protozoanColony" } }, requirement: { upgrade: "protozoan_colony", quantity: 1 }, reward: { energy: 100_000 } },

  // Stage 4 - Simple Multicellular
  { id: "m13", stage: 4, description: { key: "mission.reachResource", values: { amount: 1_000_000, resource: "resource.simpleMulticellular" } }, requirement: { resource: 1_000_000 }, reward: { energy: 200_000 } },
  { id: "m14", stage: 4, description: { key: "mission.buyUpgrade", values: { amount: 2, upgrade: "upgrade.simpleMulticellularity" } }, requirement: { upgrade: "simple_multicellularity", quantity: 2 }, reward: { evolutionPoints: 4 } },
  { id: "m15", stage: 4, description: { key: "mission.buyUpgrade", values: { amount: 1, upgrade: "upgrade.primitiveOrgan" } }, requirement: { upgrade: "primitive_organ", quantity: 1 }, reward: { energy: 500_000 } },

  // Stage 5 - Complex Organism
  { id: "m16", stage: 5, description: { key: "mission.collectResource", values: { amount: 10_000_000, resource: "resource.complexOrganisms" } }, requirement: { resource: 10_000_000 }, reward: { energy: 1_000_000 } },
  { id: "m17", stage: 5, description: { key: "mission.buyUpgrade", values: { amount: 2, upgrade: "upgrade.complexOrganism" } }, requirement: { upgrade: "complex_organism", quantity: 2 }, reward: { evolutionPoints: 5 } },
  { id: "m18", stage: 5, description: { key: "mission.buyUpgrade", values: { amount: 1, upgrade: "upgrade.nervousSystem" } }, requirement: { upgrade: "nervous_system", quantity: 1 }, reward: { energy: 2_000_000 } },

  // Stage 6 - Tribe / Primitive Society
  { id: "m19", stage: 6, description: { key: "mission.reachResource", values: { amount: 100_000_000, resource: "resource.population" } }, requirement: { resource: 100_000_000 }, reward: { energy: 5_000_000 } },
  { id: "m20", stage: 6, description: { key: "mission.buyUpgrade", values: { amount: 2, upgrade: "upgrade.tribeFormation" } }, requirement: { upgrade: "tribe_formation", quantity: 2 }, reward: { evolutionPoints: 6 } },
  { id: "m21", stage: 6, description: { key: "mission.buyUpgrade", values: { amount: 1, upgrade: "upgrade.language" } }, requirement: { upgrade: "language", quantity: 1 }, reward: { energy: 10_000_000 } },

  // Stage 7 - Advanced Civilization
  { id: "m22", stage: 7, description: { key: "mission.collectResource", values: { amount: 1_000_000_000, resource: "resource.cities" } }, requirement: { resource: 1_000_000_000 }, reward: { energy: 20_000_000 } },
  { id: "m23", stage: 7, description: { key: "mission.buyUpgrade", values: { amount: 2, upgrade: "upgrade.urbanization" } }, requirement: { upgrade: "urbanization", quantity: 2 }, reward: { evolutionPoints: 7 } },
  { id: "m24", stage: 7, description: { key: "mission.buyUpgrade", values: { amount: 1, upgrade: "upgrade.science" } }, requirement: { upgrade: "science", quantity: 1 }, reward: { energy: 50_000_000 } },

  // Stage 8 - Industrial Era
  { id: "m25", stage: 8, description: { key: "mission.reachResource", values: { amount: 10_000_000_000, resource: "resource.industries" } }, requirement: { resource: 10_000_000_000 }, reward: { energy: 100_000_000 } },
  { id: "m26", stage: 8, description: { key: "mission.buyUpgrade", values: { amount: 2, upgrade: "upgrade.factory" } }, requirement: { upgrade: "factory", quantity: 2 }, reward: { evolutionPoints: 8 } },
  { id: "m27", stage: 8, description: { key: "mission.buyUpgrade", values: { amount: 1, upgrade: "upgrade.massProduction" } }, requirement: { upgrade: "mass_production", quantity: 1 }, reward: { energy: 200_000_000 } },

  // Stage 9 - Technological Era
  { id: "m28", stage: 9, description: { key: "mission.collectResource", values: { amount: 100_000_000_000, resource: "resource.advancedTechnology" } }, requirement: { resource: 100_000_000_000 }, reward: { energy: 500_000_000 } },
  { id: "m29", stage: 9, description: { key: "mission.buyUpgrade", values: { amount: 2, upgrade: "upgrade.computer" } }, requirement: { upgrade: "computer", quantity: 2 }, reward: { evolutionPoints: 10 } },
  { id: "m30", stage: 9, description: { key: "mission.buyUpgrade", values: { amount: 1, upgrade: "upgrade.aiResearch" } }, requirement: { upgrade: "ai_research", quantity: 1 }, reward: { energy: 1_000_000_000 } },

  // Stage 10 - Space Exploration
  { id: "m31", stage: 10, description: { key: "mission.reachResource", values: { amount: 1_000_000_000_000, resource: "resource.colonies" } }, requirement: { resource: 1_000_000_000_000 }, reward: { energy: 2_000_000_000 } },
  { id: "m32", stage: 10, description: { key: "mission.buyUpgrade", values: { amount: 2, upgrade: "upgrade.rocketScience" } }, requirement: { upgrade: "rocket_science", quantity: 2 }, reward: { evolutionPoints: 12 } },
  { id: "m33", stage: 10, description: { key: "mission.buyUpgrade", values: { amount: 1, upgrade: "upgrade.interstellarProbe" } }, requirement: { upgrade: "interstellar_probe", quantity: 1 }, reward: { energy: 5_000_000_000 } },

  // Stage 11 - Galactic Colonization
  { id: "m34", stage: 11, description: { key: "mission.collectResource", values: { amount: 10_000_000_000_000, resource: "resource.galacticEnergy" } }, requirement: { resource: 10_000_000_000_000 }, reward: { energy: 10_000_000_000 } },
  { id: "m35", stage: 11, description: { key: "mission.buyUpgrade", values: { amount: 1, upgrade: "upgrade.dysonSphere" } }, requirement: { upgrade: "dyson_sphere", quantity: 1 }, reward: { evolutionPoints: 15 } },
  { id: "m36", stage: 11, description: { key: "mission.buyUpgrade", values: { amount: 1, upgrade: "upgrade.galacticCivilization" } }, requirement: { upgrade: "galactic_civilization", quantity: 1 }, reward: { energy: 50_000_000_000 } },
];
