import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SearchType, SearchTypeConfig, SEARCH_TYPE_CONFIGS } from '../../../models/calculator.model';

@Component({
  selector: 'app-calculator-form',
  templateUrl: './calculator-form.component.html',
  styleUrls: ['./calculator-form.component.scss']
})
export class CalculatorFormComponent {
  @Input() calculatorForm!: FormGroup;
  @Input() isMobile: boolean = false;
  @Input() isFormExpanded: boolean = true;
  @Input() searchTypes: SearchType[] = [];
  @Input() customValues: number[] = [];

  @Output() calculate = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();
  @Output() toggleForm = new EventEmitter<void>();

  getCurrentConfig(): SearchTypeConfig {
    const searchType = this.calculatorForm.get('searchType')?.value as SearchType;
    return SEARCH_TYPE_CONFIGS[searchType];
  }

  isCustomType(): boolean {
    return this.calculatorForm.get('searchType')?.value === SearchType.CUSTOM;
  }

  showType2Input(): boolean {
    return this.getCurrentConfig().showType2;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.calculatorForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.calculatorForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('min')) {
      const min = field.errors?.['min'].min;
      return `El valor mínimo es ${min}`;
    }
    if (field?.hasError('max')) {
      const max = field.errors?.['max'].max;
      return `El valor máximo es ${max}`;
    }
    return '';
  }

  increment(fieldName: string): void {
    const control = this.calculatorForm.get(fieldName);
    if (!control) return;

    const currentValue = control.value || 0;
    const limits = this.getFieldLimits(fieldName);
    
    if (currentValue < limits.max) {
      control.setValue(currentValue + 1);
      control.markAsDirty();
    }
  }

  decrement(fieldName: string): void {
    const control = this.calculatorForm.get(fieldName);
    if (!control) return;

    const currentValue = control.value || 0;
    const limits = this.getFieldLimits(fieldName);
    
    if (currentValue > limits.min) {
      control.setValue(currentValue - 1);
      control.markAsDirty();
    }
  }

  isAtMax(fieldName: string): boolean {
    const control = this.calculatorForm.get(fieldName);
    if (!control) return false;

    const currentValue = control.value || 0;
    const limits = this.getFieldLimits(fieldName);
    return currentValue >= limits.max;
  }

  isAtMin(fieldName: string): boolean {
    const control = this.calculatorForm.get(fieldName);
    if (!control) return false;

    const currentValue = control.value || 0;
    const limits = this.getFieldLimits(fieldName);
    return currentValue <= limits.min;
  }

  private getFieldLimits(fieldName: string): { min: number; max: number } {
    const totalCards = this.calculatorForm.get('totalCardsInDeck')?.value || 100;
    const type1Cards = this.calculatorForm.get('type1Cards')?.value || 0;
    const type2Cards = this.calculatorForm.get('type2Cards')?.value || 0;

    switch (fieldName) {
      case 'totalCardsInDeck':
        return { min: 1, max: 100 };
      
      case 'type1Cards':
        return { min: 0, max: totalCards };
      
      case 'type2Cards':
        return { min: 0, max: totalCards };
      
      case 'overlap':
        const maxOverlap = Math.min(type1Cards, type2Cards);
        return { min: 0, max: maxOverlap };
      
      default:
        return { min: 0, max: 100 };
    }
  }

  onSubmit(): void {
    this.calculate.emit();
  }

  onReset(): void {
    this.reset.emit();
  }

  onToggle(): void {
    this.toggleForm.emit();
  }
}
