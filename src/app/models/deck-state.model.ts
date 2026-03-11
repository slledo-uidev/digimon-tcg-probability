import { CardInDeck } from './card.model';

export interface DeckState {
  cards: CardInDeck[];
  totalCards: number;
  cardsRemaining: number;
  removedCards: CardRemovalHistory[];
}

export interface CardRemovalHistory {
  cardId: string;
  cardName: string;
  quantity: number;
  timestamp: Date;
}

export interface DeckConfiguration {
  name: string;
  cards: CardInDeck[];
  deckSize: number;
}
