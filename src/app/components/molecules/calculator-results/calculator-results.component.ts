import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalculatorResult, SearchTypeConfig } from '../../../models/calculator.model';

@Component({
  selector: 'app-calculator-results',
  templateUrl: './calculator-results.component.html',
  styleUrls: ['./calculator-results.component.scss']
})
export class CalculatorResultsComponent {
  @Input() result: CalculatorResult | null = null;
  @Input() isMobile: boolean = false;
  @Input() isFormExpanded: boolean = true;
  @Input() currentConfig!: SearchTypeConfig;

  @Output() openFormAndScroll = new EventEmitter<void>();

  onOpenForm(): void {
    this.openFormAndScroll.emit();
  }
}
