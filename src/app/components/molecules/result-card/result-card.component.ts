import { Component, Input } from '@angular/core';
import { CalculatorService } from '../../../services/calculator.service';

@Component({
  selector: 'app-result-card',
  templateUrl: './result-card.component.html',
  styleUrls: ['./result-card.component.scss']
})
export class ResultCardComponent {
  @Input() probability!: number;
  @Input() title!: string;
  @Input() badge!: string;
  @Input() isPrimary: boolean = false;
  
  constructor(private calculatorService: CalculatorService) {}

  get colorClass(): string {
    return this.calculatorService.getColorForProbability(this.probability);
  }

  get formattedPercentage(): string {
    return this.calculatorService.formatPercentage(this.probability);
  }

  get expectedAttempts(): number {
    return this.calculatorService.calculateExpectedAttempts(this.probability);
  }

  get percentageWidth(): number {
    return this.probability * 100;
  }
}
