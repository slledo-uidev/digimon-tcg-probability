export enum SearchMethodType {
  TRAINING = 'training',
  MEMORY = 'memory',
  SPECIFIC_SEARCH = 'specific',
  PLAIN_DRAW = 'plain'
}

export interface SearchMethod {
  type: SearchMethodType;
  parameters: SearchParameters;
}

export interface SearchParameters {
  // Para Training y Memory
  filterCategory?: string; // 'color' o 'type'
  filterValue?: string; // valor específico del filtro (ej: 'Rojo', 'Digimón')
  
  // Para Memory
  searchSize?: number; // 3 o 4
  
  // Para Specific Search
  targetCardIds?: string[]; // IDs de cartas objetivo
  
  // Para Plain Draw y Specific Search
  drawSize?: number; // cantidad de cartas a robar/buscar
}

export interface ProbabilityResult {
  searchMethod: SearchMethod;
  totalTargetCards: number;
  deckSize: number;
  probabilities: {
    atLeastOne: number;
    exact: Map<number, number>; // P(encontrar exactamente k cartas)
  };
  breakdown: ProbabilityBreakdown[];
}

export interface ProbabilityBreakdown {
  description: string;
  probability: number;
  percentage: string;
}
