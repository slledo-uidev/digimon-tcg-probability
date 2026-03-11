import { Injectable } from '@angular/core';
import { DeckConfiguration } from '../models/deck-state.model';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly DECK_CONFIG_KEY = 'digimon_tcg_deck_config';

  constructor() { }

  /**
   * Guarda la configuración del mazo en localStorage
   */
  saveDeckConfiguration(config: DeckConfiguration): void {
    try {
      const jsonString = JSON.stringify(config);
      localStorage.setItem(this.DECK_CONFIG_KEY, jsonString);
    } catch (error) {
      console.error('Error saving deck configuration:', error);
    }
  }

  /**
   * Carga la configuración del mazo desde localStorage
   */
  loadDeckConfiguration(): DeckConfiguration | null {
    try {
      const jsonString = localStorage.getItem(this.DECK_CONFIG_KEY);
      if (!jsonString) {
        return null;
      }
      return JSON.parse(jsonString) as DeckConfiguration;
    } catch (error) {
      console.error('Error loading deck configuration:', error);
      return null;
    }
  }

  /**
   * Elimina la configuración del mazo guardada
   */
  clearDeckConfiguration(): void {
    try {
      localStorage.removeItem(this.DECK_CONFIG_KEY);
    } catch (error) {
      console.error('Error clearing deck configuration:', error);
    }
  }

  /**
   * Verifica si hay una configuración guardada
   */
  hasSavedConfiguration(): boolean {
    return localStorage.getItem(this.DECK_CONFIG_KEY) !== null;
  }
}
