import { Component, OnInit } from '@angular/core';
import { ProbabilityService } from './services/probability.service';
import { DeckStateService } from './services/deck-state.service';
import { SearchMethod } from './models/search-method.model';
import { ProbabilityResult } from './models/search-method.model';
import { DeckState } from './models/deck-state.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Digimon TCG - Calculadora de Probabilidades';
  probabilityResult: ProbabilityResult | null = null;
  deckState: DeckState | null = null;

  constructor(
    private probabilityService: ProbabilityService,
    private deckStateService: DeckStateService
  ) {}

  ngOnInit(): void {
    this.deckStateService.deckState$.subscribe(state => {
      this.deckState = state;
      // Recalcular probabilidades si hay un resultado previo
      if (this.probabilityResult) {
        this.calculateProbability(this.probabilityResult.searchMethod);
      }
    });
  }

  calculateProbability(searchMethod: SearchMethod): void {
    if (!this.deckState || this.deckState.cardsRemaining === 0) {
      return;
    }

    this.probabilityResult = this.probabilityService.calculate(
      this.deckState.cards,
      searchMethod,
      this.deckState.cardsRemaining
    );
  }
}
