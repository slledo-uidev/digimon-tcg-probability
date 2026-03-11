import { Injectable } from '@angular/core';
import { 
  CalculatorInput, 
  CalculatorResult, 
  SearchType, 
  SEARCH_TYPE_CONFIGS 
} from '../models/calculator.model';

/**
 * Servicio de cálculo de probabilidades usando distribución hipergeométrica
 * Implementa las fórmulas exactas del Excel
 */
@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  constructor() { }

  /**
   * Calcula el coeficiente binomial C(n, k) = n! / (k! * (n-k)!)
   * Optimizado para evitar overflow con números grandes
   */
  private binomialCoefficient(n: number, k: number): number {
    if (k > n || k < 0 || n < 0) return 0;
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
   * Determina cuántas cartas se revelan según el tipo de búsqueda
   * Implementa la fórmula de la celda B6 del Excel
   */
  private getCardsRevealed(input: CalculatorInput): number {
    const config = SEARCH_TYPE_CONFIGS[input.searchType];
    
    if (input.searchType === SearchType.CUSTOM && input.customValue) {
      return Math.max(1, Math.min(6, input.customValue));
    }
    
    return config.cardsRevealed;
  }

  /**
   * Calcula la probabilidad de encontrar al menos 1 carta tipo 1
   * Fórmula Excel B10: =IF(B6>0, (1 - COMBIN(B3 - B4, B6) / E1), 0)
   * 
   * P(≥1 tipo 1) = 1 - C(N-K₁, n) / C(N, n)
   * 
   * @param N - Total de cartas en mazo
   * @param K1 - Cartas tipo 1 disponibles
   * @param n - Cartas reveladas
   * @param totalCombinations - C(N, n) precalculado
   */
  private calculateHitType1(
    N: number, 
    K1: number, 
    n: number, 
    totalCombinations: number
  ): number {
    if (n <= 0 || K1 <= 0) return 0;
    if (K1 >= n) {
      // Si hay más cartas tipo 1 que las que vamos a revelar, calcular normalmente
      const missAllCombinations = this.binomialCoefficient(N - K1, n);
      return 1 - (missAllCombinations / totalCombinations);
    }
    
    // Si hay menos cartas tipo 1 que las que revelamos, pero más de 0
    const missAllCombinations = this.binomialCoefficient(N - K1, n);
    return 1 - (missAllCombinations / totalCombinations);
  }

  /**
   * Calcula la probabilidad de encontrar al menos 1 carta tipo 2
   * Fórmula Excel B11: =IF(A11 = " ", " ", IF(B6>0, (1 - COMBIN(B3 - B5, B6) / E1), 0))
   * 
   * P(≥1 tipo 2) = 1 - C(N-K₂, n) / C(N, n)
   */
  private calculateHitType2(
    N: number, 
    K2: number, 
    n: number, 
    totalCombinations: number
  ): number {
    if (n <= 0 || K2 <= 0) return 0;
    
    const missAllCombinations = this.binomialCoefficient(N - K2, n);
    return 1 - (missAllCombinations / totalCombinations);
  }

  /**
   * Calcula la probabilidad de encontrar al menos 1 de cada tipo (Doble Hit)
   * Fórmula Excel B12: =IF(A12=" ", " ", IF(B6>=2, 
   *   (1 - (COMBIN(B3-B4, B6)/E1) - (COMBIN(B3-B5, B6)/E1) + 
   *   (IF(B3-B4-B5 >= B6, COMBIN(B3-B4-B5, B6)/E1, 0))), 0))
   * 
   * Usa el Principio de Inclusión-Exclusión:
   * P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
   * P(Doble Hit) = 1 - P(miss A) - P(miss B) + P(miss both)
   */
  private calculateDoubleHit(
    N: number, 
    K1: number, 
    K2: number, 
    n: number, 
    totalCombinations: number
  ): number {
    if (n < 2 || K1 <= 0 || K2 <= 0) return 0;
    
    const missType1 = this.binomialCoefficient(N - K1, n) / totalCombinations;
    const missType2 = this.binomialCoefficient(N - K2, n) / totalCombinations;
    
    // P(miss ambos) solo si hay suficientes cartas no-objetivo
    let missBoth = 0;
    const nonTargetCards = N - K1 - K2;
    if (nonTargetCards >= n && nonTargetCards >= 0) {
      missBoth = this.binomialCoefficient(nonTargetCards, n) / totalCombinations;
    }
    
    return 1 - missType1 - missType2 + missBoth;
  }

  /**
   * Calcula todas las probabilidades según la configuración
   * Implementa la lógica completa de la calculadora Excel
   */
  calculate(input: CalculatorInput): CalculatorResult {
    // Validaciones
    if (input.totalCardsInDeck <= 0) {
      throw new Error('El total de cartas debe ser mayor a 0');
    }
    if (input.type1Cards < 0 || input.type2Cards < 0) {
      throw new Error('Las cantidades de cartas no pueden ser negativas');
    }
    if (input.type1Cards + input.type2Cards > input.totalCardsInDeck) {
      throw new Error('Las cartas objetivo no pueden superar el total del mazo');
    }

    const N = input.totalCardsInDeck;
    const K1 = input.type1Cards;
    const K2 = input.type2Cards;
    const n = this.getCardsRevealed(input);

    // Validar que no revelemos más cartas de las que hay en el mazo
    if (n > N) {
      throw new Error(`No se pueden revelar ${n} cartas de un mazo de ${N}`);
    }

    // Calcular valores base
    const totalCombinations = this.binomialCoefficient(N, n);
    const nonTargetCards = N - K1 - K2;

    // Calcular probabilidades
    const hitType1 = this.calculateHitType1(N, K1, n, totalCombinations);
    
    const config = SEARCH_TYPE_CONFIGS[input.searchType];
    const hitType2 = config.showType2 && K2 > 0 
      ? this.calculateHitType2(N, K2, n, totalCombinations) 
      : undefined;
    
    const doubleHit = config.showType2 && K1 > 0 && K2 > 0 
      ? this.calculateDoubleHit(N, K1, K2, n, totalCombinations) 
      : undefined;

    return {
      input,
      cardsRevealed: n,
      totalCombinations,
      nonTargetCards,
      hitType1,
      hitType2,
      doubleHit
    };
  }

  /**
   * Formatea un número decimal como porcentaje
   */
  formatPercentage(value: number, decimals: number = 2): string {
    return `${(value * 100).toFixed(decimals)}%`;
  }

  /**
   * Calcula cuántos intentos esperados se necesitan para un éxito
   * Útil para mostrar "~X de cada 100 intentos"
   */
  calculateExpectedAttempts(probability: number, outOf: number = 100): number {
    if (probability <= 0) return Infinity;
    if (probability >= 1) return 1;
    return Math.round(probability * outOf);
  }

  /**
   * Determina el color del resultado según la probabilidad (semáforo)
   */
  getColorForProbability(probability: number): string {
    if (probability >= 0.7) return 'high'; // Verde
    if (probability >= 0.4) return 'medium'; // Amarillo
    return 'low'; // Rojo
  }
}
