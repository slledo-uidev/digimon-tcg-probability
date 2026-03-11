import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DeckState, CardRemovalHistory, DeckConfiguration } from '../models/deck-state.model';
import { Card, CardInDeck } from '../models/card.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class DeckStateService {
  private initialDeckState: DeckState = {
    cards: [],
    totalCards: 0,
    cardsRemaining: 0,
    removedCards: []
  };

  private deckStateSubject = new BehaviorSubject<DeckState>(this.initialDeckState);
  public deckState$: Observable<DeckState> = this.deckStateSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadFromStorage();
  }

  /**
   * Carga la configuración desde localStorage si existe
   */
  private loadFromStorage(): void {
    const savedConfig = this.storageService.loadDeckConfiguration();
    if (savedConfig && savedConfig.cards.length > 0) {
      this.initializeDeck(savedConfig.cards);
    }
  }

  /**
   * Guarda la configuración actual en localStorage
   */
  private saveToStorage(): void {
    const currentState = this.getCurrentDeckState();
    if (currentState.cards.length > 0) {
      const config: DeckConfiguration = {
        name: 'Default Deck',
        cards: currentState.cards,
        deckSize: currentState.totalCards
      };
      this.storageService.saveDeckConfiguration(config);
    }
  }

  /**
   * Obtiene el estado actual del mazo
   */
  getCurrentDeckState(): DeckState {
    return this.deckStateSubject.value;
  }

  /**
   * Inicializa el mazo con una lista de cartas
   */
  initializeDeck(cards: Card[]): void {
    const cardsInDeck: CardInDeck[] = cards.map(card => ({
      ...card,
      remaining: card.quantity
    }));

    const totalCards = cards.reduce((sum, card) => sum + card.quantity, 0);

    const newState: DeckState = {
      cards: cardsInDeck,
      totalCards,
      cardsRemaining: totalCards,
      removedCards: []
    };

    this.deckStateSubject.next(newState);
    this.saveToStorage();
  }

  /**
   * Agrega una carta al mazo
   */
  addCard(card: Card): void {
    const currentState = this.getCurrentDeckState();
    const existingCardIndex = currentState.cards.findIndex(c => c.id === card.id);

    let updatedCards: CardInDeck[];
    
    if (existingCardIndex >= 0) {
      // Carta ya existe, actualizar cantidad
      updatedCards = [...currentState.cards];
      updatedCards[existingCardIndex] = {
        ...updatedCards[existingCardIndex],
        quantity: updatedCards[existingCardIndex].quantity + card.quantity,
        remaining: updatedCards[existingCardIndex].remaining + card.quantity
      };
    } else {
      // Nueva carta
      const newCardInDeck: CardInDeck = {
        ...card,
        remaining: card.quantity
      };
      updatedCards = [...currentState.cards, newCardInDeck];
    }

    const totalCards = updatedCards.reduce((sum, c) => sum + c.quantity, 0);
    const cardsRemaining = updatedCards.reduce((sum, c) => sum + c.remaining, 0);

    this.deckStateSubject.next({
      ...currentState,
      cards: updatedCards,
      totalCards,
      cardsRemaining
    });
    this.saveToStorage();
  }

  /**
   * Actualiza una carta existente en el mazo
   */
  updateCard(cardId: string, updates: Partial<Card>): void {
    const currentState = this.getCurrentDeckState();
    const cardIndex = currentState.cards.findIndex(c => c.id === cardId);

    if (cardIndex === -1) return;

    const updatedCards = [...currentState.cards];
    const oldCard = updatedCards[cardIndex];
    
    updatedCards[cardIndex] = {
      ...oldCard,
      ...updates,
      id: cardId, // Mantener el ID original
      remaining: Math.min(updates.quantity || oldCard.quantity, oldCard.remaining)
    };

    const totalCards = updatedCards.reduce((sum, c) => sum + c.quantity, 0);
    const cardsRemaining = updatedCards.reduce((sum, c) => sum + c.remaining, 0);

    this.deckStateSubject.next({
      ...currentState,
      cards: updatedCards,
      totalCards,
      cardsRemaining
    });
    this.saveToStorage();
  }
  deleteCard(cardId: string): void {
    const currentState = this.getCurrentDeckState();
    const updatedCards = currentState.cards.filter(c => c.id !== cardId);

    const totalCards = updatedCards.reduce((sum, c) => sum + c.quantity, 0);
    const cardsRemaining = updatedCards.reduce((sum, c) => sum + c.remaining, 0);

    this.deckStateSubject.next({
      ...currentState,
      cards: updatedCards,
      totalCards,
      cardsRemaining
    });
    this.saveToStorage();
  }
  removeCards(cardId: string, quantity: number): void {
    const currentState = this.getCurrentDeckState();
    const cardIndex = currentState.cards.findIndex(c => c.id === cardId);

    if (cardIndex === -1) return;

    const card = currentState.cards[cardIndex];
    const actualRemoval = Math.min(quantity, card.remaining);

    if (actualRemoval === 0) return;

    const updatedCards = [...currentState.cards];
    updatedCards[cardIndex] = {
      ...card,
      remaining: card.remaining - actualRemoval
    };

    const removalRecord: CardRemovalHistory = {
      cardId: card.id,
      cardName: card.name,
      quantity: actualRemoval,
      timestamp: new Date()
    };

    const cardsRemaining = updatedCards.reduce((sum, c) => sum + c.remaining, 0);

    this.deckStateSubject.next({
      ...currentState,
      cards: updatedCards,
      cardsRemaining,
      removedCards: [...currentState.removedCards, removalRecord]
    });
  }

  /**
   * Restaura cartas al mazo
   */
  restoreCards(cardId: string, quantity: number): void {
    const currentState = this.getCurrentDeckState();
    const cardIndex = currentState.cards.findIndex(c => c.id === cardId);

    if (cardIndex === -1) return;

    const card = currentState.cards[cardIndex];
    const actualRestoration = Math.min(quantity, card.quantity - card.remaining);

    if (actualRestoration === 0) return;

    const updatedCards = [...currentState.cards];
    updatedCards[cardIndex] = {
      ...card,
      remaining: card.remaining + actualRestoration
    };

    const cardsRemaining = updatedCards.reduce((sum, c) => sum + c.remaining, 0);

    this.deckStateSubject.next({
      ...currentState,
      cards: updatedCards,
      cardsRemaining
    });
  }

  /**
   * Deshace la última remoción de cartas
   */
  undoLastRemoval(): void {
    const currentState = this.getCurrentDeckState();
    
    if (currentState.removedCards.length === 0) return;

    const lastRemoval = currentState.removedCards[currentState.removedCards.length - 1];
    this.restoreCards(lastRemoval.cardId, lastRemoval.quantity);

    // Remover el registro de remoción
    const updatedRemovedCards = currentState.removedCards.slice(0, -1);
    
    this.deckStateSubject.next({
      ...this.getCurrentDeckState(),
      removedCards: updatedRemovedCards
    });
  }

  /**
   * Resetea el mazo a su estado inicial (todas las cartas disponibles)
   */
  resetDeck(): void {
    const currentState = this.getCurrentDeckState();
    
    const resetCards = currentState.cards.map(card => ({
      ...card,
      remaining: card.quantity
    }));

    this.deckStateSubject.next({
      cards: resetCards,
      totalCards: currentState.totalCards,
      cardsRemaining: currentState.totalCards,
      removedCards: []
    });
  }

  /**
   * Limpia completamente el mazo
   */
  clearDeck(): void {
    this.deckStateSubject.next(this.initialDeckState);
    this.storageService.clearDeckConfiguration();
  }

  /**
   * Obtiene el tamaño actual del mazo (cartas restantes)
   */
  getCurrentDeckSize(): number {
    return this.getCurrentDeckState().cardsRemaining;
  }

  /**
   * Obtiene todas las cartas con cantidad restante mayor a 0
   */
  getAvailableCards(): CardInDeck[] {
    return this.getCurrentDeckState().cards.filter(card => card.remaining > 0);
  }

  /**
   * Obtiene cartas por categoría
   */
  getCardsByCategory(category: string, value: string): CardInDeck[] {
    return this.getCurrentDeckState().cards.filter(
      card => card.categories[category] === value && card.remaining > 0
    );
  }
}
