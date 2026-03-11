import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeckStateService } from '../../services/deck-state.service';
import { SearchMethod, SearchMethodType } from '../../models/search-method.model';
import { DeckState } from '../../models/deck-state.model';
import { CardInDeck } from '../../models/card.model';

@Component({
  selector: 'app-search-selector',
  templateUrl: './search-selector.component.html',
  styleUrls: ['./search-selector.component.scss']
})
export class SearchSelectorComponent implements OnInit {
  @Output() searchConfigured = new EventEmitter<SearchMethod>();

  searchForm!: FormGroup;
  deckState: DeckState | null = null;
  
  searchMethodType = SearchMethodType;
  availableColors: string[] = [];
  availableTypes: string[] = [];
  availableCards: CardInDeck[] = [];
  selectedCards: string[] = [];

  constructor(
    private fb: FormBuilder,
    private deckStateService: DeckStateService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.deckStateService.deckState$.subscribe(state => {
      this.deckState = state;
      this.updateAvailableOptions();
    });
  }

  private initForm(): void {
    this.searchForm = this.fb.group({
      method: [SearchMethodType.TRAINING, Validators.required],
      filterCategory: ['color'],
      filterValue: [''],
      searchSize: [3, [Validators.min(1)]],
      drawSize: [1, [Validators.min(1)]]
    });

    this.searchForm.get('method')?.valueChanges.subscribe(() => {
      this.updateFormValidation();
    });
  }

  private updateFormValidation(): void {
    const method = this.searchForm.get('method')?.value;
    
    // Reset validations
    this.searchForm.get('filterValue')?.clearValidators();
    this.searchForm.get('searchSize')?.clearValidators();
    this.searchForm.get('drawSize')?.clearValidators();

    // Set validators based on method
    switch (method) {
      case SearchMethodType.TRAINING:
      case SearchMethodType.MEMORY:
        this.searchForm.get('filterValue')?.setValidators([Validators.required]);
        if (method === SearchMethodType.MEMORY) {
          this.searchForm.get('searchSize')?.setValidators([Validators.required, Validators.min(1)]);
        }
        break;
      case SearchMethodType.SPECIFIC_SEARCH:
      case SearchMethodType.PLAIN_DRAW:
        this.searchForm.get('drawSize')?.setValidators([Validators.required, Validators.min(1)]);
        break;
    }

    this.searchForm.get('filterValue')?.updateValueAndValidity();
    this.searchForm.get('searchSize')?.updateValueAndValidity();
    this.searchForm.get('drawSize')?.updateValueAndValidity();
  }

  private updateAvailableOptions(): void {
    if (!this.deckState) return;

    // Extract unique colors
    const colors = new Set<string>();
    const types = new Set<string>();
    
    this.deckState.cards.forEach(card => {
      if (card.categories.color && card.remaining > 0) {
        colors.add(card.categories.color);
      }
      if (card.categories.type && card.remaining > 0) {
        types.add(card.categories.type);
      }
    });

    this.availableColors = Array.from(colors).sort();
    this.availableTypes = Array.from(types).sort();
    this.availableCards = this.deckState.cards.filter(card => card.remaining > 0);
  }

  toggleCardSelection(cardId: string): void {
    const index = this.selectedCards.indexOf(cardId);
    if (index >= 0) {
      this.selectedCards.splice(index, 1);
    } else {
      this.selectedCards.push(cardId);
    }
  }

  isCardSelected(cardId: string): boolean {
    return this.selectedCards.includes(cardId);
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    const formValue = this.searchForm.value;
    const method = formValue.method;

    let searchMethod: SearchMethod;

    switch (method) {
      case SearchMethodType.TRAINING:
        searchMethod = {
          type: SearchMethodType.TRAINING,
          parameters: {
            filterCategory: 'color',
            filterValue: formValue.filterValue
          }
        };
        break;

      case SearchMethodType.MEMORY:
        searchMethod = {
          type: SearchMethodType.MEMORY,
          parameters: {
            filterCategory: formValue.filterCategory || 'type',
            filterValue: formValue.filterValue,
            searchSize: formValue.searchSize
          }
        };
        break;

      case SearchMethodType.SPECIFIC_SEARCH:
        searchMethod = {
          type: SearchMethodType.SPECIFIC_SEARCH,
          parameters: {
            targetCardIds: [...this.selectedCards],
            drawSize: formValue.drawSize
          }
        };
        break;

      case SearchMethodType.PLAIN_DRAW:
        searchMethod = {
          type: SearchMethodType.PLAIN_DRAW,
          parameters: {
            targetCardIds: [...this.selectedCards],
            drawSize: formValue.drawSize
          }
        };
        break;

      default:
        return;
    }

    this.searchConfigured.emit(searchMethod);
  }

  isFormValid(): boolean {
    const method = this.searchForm.get('method')?.value;
    
    if (!this.deckState || this.deckState.cardsRemaining === 0) {
      return false;
    }

    switch (method) {
      case SearchMethodType.TRAINING:
      case SearchMethodType.MEMORY:
        return this.searchForm.valid;
      case SearchMethodType.SPECIFIC_SEARCH:
      case SearchMethodType.PLAIN_DRAW:
        return this.searchForm.valid && this.selectedCards.length > 0;
      default:
        return false;
    }
  }

  get currentMethod(): SearchMethodType {
    return this.searchForm.get('method')?.value;
  }
}
