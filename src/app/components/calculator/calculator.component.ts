import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalculatorService } from '../../services/calculator.service';
import { 
  SearchType, 
  CalculatorInput, 
  CalculatorResult,
  SEARCH_TYPE_CONFIGS,
  SearchTypeConfig
} from '../../models/calculator.model';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  calculatorForm!: FormGroup;
  result: CalculatorResult | null = null;
  
  // Enums y configuraciones expuestos al template
  searchTypes = Object.values(SearchType);
  SearchType = SearchType;
  
  customValues = [1, 2, 3, 4, 5, 6];

  constructor(
    private fb: FormBuilder,
    private calculatorService: CalculatorService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setupFormListeners();
  }

  private initForm(): void {
    this.calculatorForm = this.fb.group({
      searchType: [SearchType.COOL_BOY, Validators.required],
      customValue: [3],
      totalCardsInDeck: [45, [Validators.required, Validators.min(1), Validators.max(100)]],
      type1Cards: [4, [Validators.required, Validators.min(0)]],
      type2Cards: [10, [Validators.min(0)]],
      overlap: [0, [Validators.min(0)]]
    });
  }

  private setupFormListeners(): void {
    // Escuchar cambios en el tipo de búsqueda
    this.calculatorForm.get('searchType')?.valueChanges.subscribe((searchType: SearchType) => {
      this.updateFormValidation(searchType);
      // Recalcular automáticamente si ya hay un resultado
      if (this.result) {
        this.calculate();
      }
    });

    // Forzar recálculo cuando cambien valores si ya hay resultado
    ['customValue', 'totalCardsInDeck', 'type1Cards', 'type2Cards', 'overlap'].forEach(field => {
      this.calculatorForm.get(field)?.valueChanges.subscribe(() => {
        if (this.result) {
          this.calculate();
        }
      });
    });
  }

  private updateFormValidation(searchType: SearchType): void {
    const config = SEARCH_TYPE_CONFIGS[searchType];
    
    // Actualizar validador de type2Cards
    const type2Control = this.calculatorForm.get('type2Cards');
    const overlapControl = this.calculatorForm.get('overlap');
    
    if (config.showType2) {
      type2Control?.setValidators([Validators.min(0)]);
      type2Control?.enable();
      overlapControl?.setValidators([Validators.min(0)]);
      overlapControl?.enable();
    } else {
      type2Control?.setValue(0);
      type2Control?.disable();
      overlapControl?.setValue(0);
      overlapControl?.disable();
    }
    type2Control?.updateValueAndValidity();
    overlapControl?.updateValueAndValidity();
  }

  calculate(): void {
    if (this.calculatorForm.invalid) {
      this.markFormGroupTouched(this.calculatorForm);
      return;
    }

    try {
      const formValue = this.calculatorForm.getRawValue();
      
      const input: CalculatorInput = {
        searchType: formValue.searchType,
        customValue: formValue.customValue,
        totalCardsInDeck: formValue.totalCardsInDeck,
        type1Cards: formValue.type1Cards,
        type2Cards: formValue.type2Cards || 0,
        overlap: formValue.overlap || 0
      };

      this.result = this.calculatorService.calculate(input);
    } catch (error: any) {
      alert('Error en el cálculo: ' + error.message);
      this.result = null;
    }
  }

  reset(): void {
    this.calculatorForm.reset({
      searchType: SearchType.COOL_BOY,
      customValue: 3,
      totalCardsInDeck: 45,
      type1Cards: 4,
      type2Cards: 10,
      overlap: 0
    });
    this.result = null;
  }

  // Métodos de utilidad para el template

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

  formatPercentage(value: number): string {
    return this.calculatorService.formatPercentage(value);
  }

  getColorClass(probability: number): string {
    return this.calculatorService.getColorForProbability(probability);
  }

  getExpectedAttempts(probability: number): number {
    return this.calculatorService.calculateExpectedAttempts(probability);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Validación visual para el template
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
}
