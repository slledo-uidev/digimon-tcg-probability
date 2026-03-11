import { Component, OnInit } from '@angular/core';
import { DeckStateService } from '../../services/deck-state.service';
import { DeckState } from '../../models/deck-state.model';
import { CardInDeck } from '../../models/card.model';

@Component({
  selector: 'app-card-tracker',
  templateUrl: './card-tracker.component.html',
  styleUrls: ['./card-tracker.component.scss']
})
export class CardTrackerComponent implements OnInit {
  deckState: DeckState | null = null;

  constructor(private deckStateService: DeckStateService) {}

  ngOnInit(): void {
    this.deckStateService.deckState$.subscribe(state => {
      this.deckState = state;
    });
  }

  removeCard(cardId: string, quantity: number = 1): void {
    this.deckStateService.removeCards(cardId, quantity);
  }

  restoreCard(cardId: string, quantity: number = 1): void {
    this.deckStateService.restoreCards(cardId, quantity);
  }

  undoLastRemoval(): void {
    this.deckStateService.undoLastRemoval();
  }

  getCardsByCategory(): Map<string, CardInDeck[]> {
    if (!this.deckState) return new Map();

    const byColor = new Map<string, CardInDeck[]>();
    
    this.deckState.cards.forEach(card => {
      if (card.categories.color && card.remaining > 0) {
        const color = card.categories.color;
        if (!byColor.has(color)) {
          byColor.set(color, []);
        }
        byColor.get(color)!.push(card);
      }
    });

    return byColor;
  }

  getColorCount(color: string): number {
    if (!this.deckState) return 0;
    
    return this.deckState.cards
      .filter(card => card.categories.color === color && card.remaining > 0)
      .reduce((sum, card) => sum + card.remaining, 0);
  }

  get availableColors(): string[] {
    if (!this.deckState) return [];
    
    const colors = new Set<string>();
    this.deckState.cards.forEach(card => {
      if (card.categories.color && card.remaining > 0) {
        colors.add(card.categories.color);
      }
    });
    
    return Array.from(colors).sort();
  }

  get canUndo(): boolean {
    return this.deckState ? this.deckState.removedCards.length > 0 : false;
  }
}
