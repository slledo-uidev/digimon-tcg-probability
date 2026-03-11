import { Component, Input } from '@angular/core';
import { ProbabilityResult, SearchMethodType } from '../../models/search-method.model';

@Component({
  selector: 'app-probability-results',
  templateUrl: './probability-results.component.html',
  styleUrls: ['./probability-results.component.scss']
})
export class ProbabilityResultsComponent {
  @Input() result: ProbabilityResult | null = null;

  searchMethodType = SearchMethodType;

  getMethodName(type: SearchMethodType): string {
    switch (type) {
      case SearchMethodType.TRAINING:
        return 'Training';
      case SearchMethodType.MEMORY:
        return 'Memory';
      case SearchMethodType.SPECIFIC_SEARCH:
        return 'Búsqueda Específica';
      case SearchMethodType.PLAIN_DRAW:
        return 'Robo Plano';
      default:
        return 'Desconocido';
    }
  }

  getMethodDescription(): string {
    if (!this.result) return '';

    const params = this.result.searchMethod.parameters;
    const type = this.result.searchMethod.type;

    switch (type) {
      case SearchMethodType.TRAINING:
        return `Buscar 2 cartas de color ${params.filterValue || ''}`;
      case SearchMethodType.MEMORY:
        return `Buscar ${params.searchSize || 0} carta(s) de ${params.filterCategory}: ${params.filterValue || ''}`;
      case SearchMethodType.SPECIFIC_SEARCH:
        return `Buscar ${params.drawSize || 0} carta(s) específica(s)`;
      case SearchMethodType.PLAIN_DRAW:
        return `Robar ${params.drawSize || 0} carta(s)`;
      default:
        return '';
    }
  }

  getProgressBarWidth(probability: number): string {
    return `${Math.round(probability * 100)}%`;
  }

  getProgressBarColor(probability: number): string {
    if (probability >= 0.7) return '#27ae60';
    if (probability >= 0.4) return '#f39c12';
    return '#e74c3c';
  }
}
