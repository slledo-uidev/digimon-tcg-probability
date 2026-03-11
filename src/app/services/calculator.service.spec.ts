import { TestBed } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';
import { SearchType } from '../models/calculator.model';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalculatorService]
    });
    service = TestBed.inject(CalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('binomialCoefficient', () => {
    it('should calculate C(45, 3) correctly', () => {
      const result = (service as any).binomialCoefficient(45, 3);
      expect(result).toBe(14190);
    });

    it('should return 1 for C(n, 0)', () => {
      const result = (service as any).binomialCoefficient(45, 0);
      expect(result).toBe(1);
    });

    it('should return 0 for C(n, k) when k > n', () => {
      const result = (service as any).binomialCoefficient(5, 10);
      expect(result).toBe(0);
    });
  });

  describe('calculate', () => {
    it('should match Excel example: Cool Boy with 45 cards, 4 type1, 10 type2', () => {
      const result = service.calculate({
        searchType: SearchType.COOL_BOY,
        totalCardsInDeck: 45,
        type1Cards: 4,
        type2Cards: 10
      });

      // Expected values from Excel report
      expect(result.cardsRevealed).toBe(3);
      expect(result.totalCombinations).toBe(14190);
      
      // Hit Type 1: 24.88%
      expect(result.hitType1).toBeCloseTo(0.2488, 4);
      
      // Hit Type 2: 53.88%
      expect(result.hitType2).toBeCloseTo(0.5388, 4);
      
      // Double Hit: 10.43%
      expect(result.doubleHit).toBeCloseTo(0.1043, 4);
    });

    it('should calculate Training (2 cards revealed)', () => {
      const result = service.calculate({
        searchType: SearchType.TRAINING,
        totalCardsInDeck: 50,
        type1Cards: 8,
        type2Cards: 0
      });

      expect(result.cardsRevealed).toBe(2);
      expect(result.hitType1).toBeGreaterThan(0);
      expect(result.hitType2).toBeUndefined();
    });

    it('should calculate Memory Boost (4 cards revealed)', () => {
      const result = service.calculate({
        searchType: SearchType.MEMORY_BOOST,
        totalCardsInDeck: 50,
        type1Cards: 12,
        type2Cards: 0
      });

      expect(result.cardsRevealed).toBe(4);
      expect(result.hitType1).toBeGreaterThan(0);
    });

    it('should calculate Custom with 5 cards', () => {
      const result = service.calculate({
        searchType: SearchType.CUSTOM,
        customValue: 5,
        totalCardsInDeck: 50,
        type1Cards: 10,
        type2Cards: 0
      });

      expect(result.cardsRevealed).toBe(5);
    });

    it('should throw error for invalid deck size', () => {
      expect(() => {
        service.calculate({
          searchType: SearchType.COOL_BOY,
          totalCardsInDeck: 0,
          type1Cards: 4,
          type2Cards: 10
        });
      }).toThrow();
    });

    it('should throw error when target cards exceed deck size', () => {
      expect(() => {
        service.calculate({
          searchType: SearchType.COOL_BOY,
          totalCardsInDeck: 10,
          type1Cards: 8,
          type2Cards: 5
        });
      }).toThrow();
    });
  });

  describe('formatPercentage', () => {
    it('should format 0.2488 as 24.88%', () => {
      expect(service.formatPercentage(0.2488)).toBe('24.88%');
    });

    it('should format with custom decimals', () => {
      expect(service.formatPercentage(0.5388, 1)).toBe('53.9%');
    });
  });

  describe('getColorForProbability', () => {
    it('should return "high" for >= 70%', () => {
      expect(service.getColorForProbability(0.75)).toBe('high');
    });

    it('should return "medium" for 40-70%', () => {
      expect(service.getColorForProbability(0.5)).toBe('medium');
    });

    it('should return "low" for < 40%', () => {
      expect(service.getColorForProbability(0.2)).toBe('low');
    });
  });

  describe('calculateExpectedAttempts', () => {
    it('should calculate expected attempts for 24.88%', () => {
      expect(service.calculateExpectedAttempts(0.2488)).toBe(25);
    });

    it('should return 1 for 100% probability', () => {
      expect(service.calculateExpectedAttempts(1)).toBe(1);
    });
  });
});
