import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeckStateService } from '../../services/deck-state.service';
import { Card, CardInDeck } from '../../models/card.model';
import { DeckState } from '../../models/deck-state.model';

@Component({
  selector: 'app-deck-configuration',
  templateUrl: './deck-configuration.component.html',
  styleUrls: ['./deck-configuration.component.scss']
})
export class DeckConfigurationComponent implements OnInit {
  cardForm!: FormGroup;
  deckState: DeckState | null = null;
  availableColors = ['Rojo', 'Azul', 'Amarillo', 'Verde', 'Negro', 'Morado', 'Blanco'];
  availableTypes = ['Digimón', 'Tamer', 'Opción'];

  constructor(
    private fb: FormBuilder,
    private deckStateService: DeckStateService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.deckStateService.deckState$.subscribe(state => {
      this.deckState = state;
    });
  }

  private initForm(): void {
    this.cardForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(4)]],
      color: [''],
      type: ['']
    });
  }

  addCard(): void {
    if (this.cardForm.valid) {
      const formValue = this.cardForm.value;
      
      const newCard: Card = {
        id: this.generateCardId(),
        name: formValue.name,
        quantity: formValue.quantity,
        categories: {
          color: formValue.color || undefined,
          type: formValue.type || undefined
        }
      };

      this.deckStateService.addCard(newCard);
      this.cardForm.reset({
        name: '',
        quantity: 1,
        color: '',
        type: ''
      });
    }
  }

  deleteCard(cardId: string): void {
    if (confirm('¿Estás seguro de eliminar esta carta?')) {
      this.deckStateService.deleteCard(cardId);
    }
  }

  resetDeck(): void {
    this.deckStateService.resetDeck();
  }

  clearDeck(): void {
    if (confirm('¿Estás seguro de limpiar todo el mazo?')) {
      this.deckStateService.clearDeck();
    }
  }

  private generateCardId(): string {
    return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  get totalCards(): number {
    return this.deckState?.totalCards || 0;
  }

  get isValidDeckSize(): boolean {
    const total = this.totalCards;
    return total === 50; // Tamaño estándar de mazo en Digimon TCG
  }
}
