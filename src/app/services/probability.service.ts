import { Injectable } from '@angular/core';
import { SearchMethod, SearchMethodType, ProbabilityResult, ProbabilityBreakdown } from '../models/search-method.model';
import { CardInDeck } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class ProbabilityService {

  constructor() { }

  /**
   * Calcula el factorial de un número
   */
  private factorial(n: number): number {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  /**
   * Calcula el coeficiente binomial C(n, k) = n! / (k! * (n-k)!)
   */
  private binomialCoefficient(n: number, k: number): number {
    if (k > n || k < 0) return 0;
    if (k === 0 || k === n) return 1;
    
    // Optimización: C(n, k) = C(n, n-k), usamos el menor
    k = Math.min(k, n - k);
    
    let result = 1;
    for (let i = 0; i < k; i++) {
      result *= (n - i);
      result /= (i + 1);
    }
    return result;
  }

  /**
   * Calcula la probabilidad usando distribución hipergeométrica
   * P(X = k) = C(K, k) * C(N-K, n-k) / C(N, n)
   * 
   * @param N - Total de cartas en el mazo
   * @param K - Total de cartas objetivo en el mazo
   * @param n - Cantidad de cartas a buscar/robar
   * @param k - Cantidad exacta de cartas objetivo a encontrar
   */
  private hypergeometric(N: number, K: number, n: number, k: number): number {
    if (n > N || K > N || k > K || k > n) return 0;
    
    const numerator = this.binomialCoefficient(K, k) * this.binomialCoefficient(N - K, n - k);
    const denominator = this.binomialCoefficient(N, n);
    
    return numerator / denominator;
  }

  /**
   * Calcula la probabilidad de encontrar al menos 1 carta objetivo
   */
  private probabilityAtLeastOne(N: number, K: number, n: number): number {
    // P(X >= 1) = 1 - P(X = 0)
    return 1 - this.hypergeometric(N, K, n, 0);
  }

  /**
   * Calcula probabilidades para Training (busca 2 cartas por color)
   */
  calculateTraining(
    cards: CardInDeck[],
    filterCategory: string,
    filterValue: string,
    deckSize: number
  ): ProbabilityResult {
    const targetCards = cards.filter(card => 
      card.categories[filterCategory] === filterValue && card.remaining > 0
    );
    
    const totalTargetCards = targetCards.reduce((sum, card) => sum + card.remaining, 0);
    const searchSize = 2;

    return this.calculateProbability(totalTargetCards, deckSize, searchSize, {
      type: SearchMethodType.TRAINING,
      parameters: { filterCategory, filterValue }
    });
  }

  /**
   * Calcula probabilidades para Memory (busca 3 o 4 cartas por tipo)
   */
  calculateMemory(
    cards: CardInDeck[],
    filterCategory: string,
    filterValue: string,
    searchSize: number,
    deckSize: number
  ): ProbabilityResult {
    const targetCards = cards.filter(card => 
      card.categories[filterCategory] === filterValue && card.remaining > 0
    );
    
    const totalTargetCards = targetCards.reduce((sum, card) => sum + card.remaining, 0);

    return this.calculateProbability(totalTargetCards, deckSize, searchSize, {
      type: SearchMethodType.MEMORY,
      parameters: { filterCategory, filterValue, searchSize }
    });
  }

  /**
   * Calcula probabilidades para búsqueda específica (cartas seleccionadas específicamente)
   */
  calculateSpecificSearch(
    cards: CardInDeck[],
    targetCardIds: string[],
    searchSize: number,
    deckSize: number
  ): ProbabilityResult {
    const targetCards = cards.filter(card => 
      targetCardIds.includes(card.id) && card.remaining > 0
    );
    
    const totalTargetCards = targetCards.reduce((sum, card) => sum + card.remaining, 0);

    return this.calculateProbability(totalTargetCards, deckSize, searchSize, {
      type: SearchMethodType.SPECIFIC_SEARCH,
      parameters: { targetCardIds, drawSize: searchSize }
    });
  }

  /**
   * Calcula probabilidades para robo plano (robo normal de cartas)
   */
  calculatePlainDraw(
    cards: CardInDeck[],
    targetCardIds: string[],
    drawSize: number,
    deckSize: number
  ): ProbabilityResult {
    const targetCards = cards.filter(card => 
      targetCardIds.includes(card.id) && card.remaining > 0
    );
    
    const totalTargetCards = targetCards.reduce((sum, card) => sum + card.remaining, 0);

    return this.calculateProbability(totalTargetCards, deckSize, drawSize, {
      type: SearchMethodType.PLAIN_DRAW,
      parameters: { targetCardIds, drawSize }
    });
  }

  /**
   * Calcula todas las probabilidades para un conjunto de parámetros dado
   */
  private calculateProbability(
    totalTargetCards: number,
    deckSize: number,
    searchSize: number,
    searchMethod: SearchMethod
  ): ProbabilityResult {
    const atLeastOne = this.probabilityAtLeastOne(deckSize, totalTargetCards, searchSize);
    
    // Calcular probabilidades exactas para cada cantidad posible
    const exactProbabilities = new Map<number, number>();
    const maxPossible = Math.min(totalTargetCards, searchSize);
    
    for (let k = 0; k <= maxPossible; k++) {
      const prob = this.hypergeometric(deckSize, totalTargetCards, searchSize, k);
      exactProbabilities.set(k, prob);
    }

    // Crear breakdown para visualización
    const breakdown: ProbabilityBreakdown[] = [];
    
    // Probabilidad de al menos 1
    breakdown.push({
      description: 'Al menos 1 carta',
      probability: atLeastOne,
      percentage: (atLeastOne * 100).toFixed(2) + '%'
    });

    // Probabilidades exactas relevantes (0, 1, 2+)
    const probZero = exactProbabilities.get(0) || 0;
    breakdown.push({
      description: 'Ninguna carta',
      probability: probZero,
      percentage: (probZero * 100).toFixed(2) + '%'
    });

    const probOne = exactProbabilities.get(1) || 0;
    breakdown.push({
      description: 'Exactamente 1 carta',
      probability: probOne,
      percentage: (probOne * 100).toFixed(2) + '%'
    });

    if (maxPossible >= 2) {
      let probTwoOrMore = 0;
      for (let k = 2; k <= maxPossible; k++) {
        probTwoOrMore += exactProbabilities.get(k) || 0;
      }
      breakdown.push({
        description: '2 o más cartas',
        probability: probTwoOrMore,
        percentage: (probTwoOrMore * 100).toFixed(2) + '%'
      });
    }

    return {
      searchMethod,
      totalTargetCards,
      deckSize,
      probabilities: {
        atLeastOne,
        exact: exactProbabilities
      },
      breakdown
    };
  }

  /**
   * Método genérico para calcular probabilidades basado en el tipo de búsqueda
   */
  calculate(
    cards: CardInDeck[],
    searchMethod: SearchMethod,
    deckSize: number
  ): ProbabilityResult {
    const params = searchMethod.parameters;

    switch (searchMethod.type) {
      case SearchMethodType.TRAINING:
        return this.calculateTraining(
          cards,
          params.filterCategory || 'color',
          params.filterValue || '',
          deckSize
        );

      case SearchMethodType.MEMORY:
        return this.calculateMemory(
          cards,
          params.filterCategory || 'type',
          params.filterValue || '',
          params.searchSize || 3,
          deckSize
        );

      case SearchMethodType.SPECIFIC_SEARCH:
        return this.calculateSpecificSearch(
          cards,
          params.targetCardIds || [],
          params.drawSize || 1,
          deckSize
        );

      case SearchMethodType.PLAIN_DRAW:
        return this.calculatePlainDraw(
          cards,
          params.targetCardIds || [],
          params.drawSize || 1,
          deckSize
        );

      default:
        throw new Error('Método de búsqueda no soportado');
    }
  }
}
