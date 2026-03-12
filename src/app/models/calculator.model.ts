/**
 * Modelo de datos para la calculadora de probabilidades (estilo Excel)
 */

export enum SearchType {
  COOL_BOY = 'Cool Boy',
  MEMORY_BOOST = 'Memory Boost',
  MEMORY_BOOST_DUAL = 'Memory Boost Dual',
  TRAINING = 'Training',
  ROBO_NATURAL = 'Robo Natural',
  CUSTOM = 'Elige otro número'
}

export interface CalculatorInput {
  searchType: SearchType;
  customValue?: number; // Solo para CUSTOM (1-6)
  totalCardsInDeck: number; // B3: Total de cartas en mazo
  type1Cards: number; // B4: Cartas tipo 1
  type2Cards: number; // B5: Cartas tipo 2 (opcional)
  overlap?: number; // Cartas que cumplen AMBAS condiciones (type1 Y type2)
                    // Constraint: 0 ≤ overlap ≤ min(type1Cards, type2Cards)
}

export interface CalculatorResult {
  input: CalculatorInput;
  cardsRevealed: number; // B6: Calculado automáticamente
  totalCombinations: number; // E1: COMBIN(totalCards, cardsRevealed)
  nonTargetCards: number; // B8: totalCards - type1Cards - type2Cards
  
  // Resultados de probabilidad
  hitType1: number; // B10: Probabilidad de al menos 1 carta tipo 1
  hitType2?: number; // B11: Probabilidad de al menos 1 carta tipo 2
  doubleHit?: number; // B12: Probabilidad de al menos 1 de cada tipo
}

export interface SearchTypeConfig {
  type: SearchType;
  cardsRevealed: number;
  type1Label: string;
  type2Label?: string;
  showType2: boolean;
  description: string;
}

// Configuraciones predefinidas para cada tipo de búsqueda
export const SEARCH_TYPE_CONFIGS: Record<SearchType, SearchTypeConfig> = {
  [SearchType.COOL_BOY]: {
    type: SearchType.COOL_BOY,
    cardsRevealed: 3,
    type1Label: 'Número de cartas X Antibody Digimon restantes en Deck',
    type2Label: 'Número de Option con trait X Antibody restantes en Deck',
    showType2: true,
    description: 'Buscar Digimon y/o Options con X Antibody (3 cartas)'
  },
  [SearchType.MEMORY_BOOST]: {
    type: SearchType.MEMORY_BOOST,
    cardsRevealed: 4,
    type1Label: 'Número de Digimon del color de la Option en el Deck',
    showType2: false,
    description: 'Buscar Digimon del color especificado (4 cartas)'
  },
  [SearchType.MEMORY_BOOST_DUAL]: {
    type: SearchType.MEMORY_BOOST_DUAL,
    cardsRevealed: 3,
    type1Label: 'Número de Digimon del color de la Option en el Deck',
    showType2: false,
    description: 'Buscar Digimon del color especificado (3 cartas)'
  },
  [SearchType.TRAINING]: {
    type: SearchType.TRAINING,
    cardsRevealed: 2,
    type1Label: 'Número de cartas del color del Training',
    showType2: false,
    description: 'Buscar cartas del color del Training (2 cartas)'
  },
  [SearchType.ROBO_NATURAL]: {
    type: SearchType.ROBO_NATURAL,
    cardsRevealed: 1,
    type1Label: 'Número de cartas deseadas en el Deck',
    showType2: false,
    description: 'Probabilidad de robar una carta específica'
  },
  [SearchType.CUSTOM]: {
    type: SearchType.CUSTOM,
    cardsRevealed: 1, // Será sobrescrito por customValue
    type1Label: 'Número de cartas deseadas en el Deck',
    type2Label: 'Segundo tipo de carta (Si aplica)',
    showType2: true,
    description: 'Cálculos personalizados (1-6 cartas)'
  }
};
