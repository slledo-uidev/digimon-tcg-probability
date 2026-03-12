import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-calculator-header',
  templateUrl: './calculator-header.component.html',
  styleUrls: ['./calculator-header.component.scss']
})
export class CalculatorHeaderComponent {
  @Input() title: string = 'Calculadora de Probabilidades Digimon TCG';
  @Input() description: string = 'Calcula las probabilidades de encontrar cartas específicas durante efectos de búsqueda usando distribución hipergeométrica';
}
