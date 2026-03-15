import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalculatorResult, SearchTypeConfig } from '../../../models/calculator.model';
import { ChartNoAxesColumn, Info } from 'lucide-angular';

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

  readonly emptyStateIcon = ChartNoAxesColumn;
  readonly infoIcon = Info;

  @Output() openFormAndScroll = new EventEmitter<void>();

  onOpenForm(): void {
    this.openFormAndScroll.emit();
  }
}
