import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalculatorService } from '../../../services/calculator.service';
import { 
  SearchType, 
  CalculatorInput, 
  CalculatorResult,
  SEARCH_TYPE_CONFIGS,
  SearchTypeConfig
} from '../../../models/calculator.model';

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

  // Control de UI móvil
  isMobile: boolean = false;
  isFormExpanded: boolean = true;
  private mediaQuery?: MediaQueryList;

  constructor(
    private fb: FormBuilder,
    private calculatorService: CalculatorService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setupFormListeners();
    this.setupMobileDetection();
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
      // Recalcular automáticamente si ya hay un resultado (SOLO EN DESKTOP)
      if (this.result && !this.isMobile) {
        this.calculate();
      }
    });

    // Forzar recálculo cuando cambien valores si ya hay resultado (SOLO EN DESKTOP)
    ['customValue', 'totalCardsInDeck', 'type1Cards', 'type2Cards', 'overlap'].forEach(field => {
      this.calculatorForm.get(field)?.valueChanges.subscribe(() => {
        if (this.result && !this.isMobile) {
          this.calculate();
        }
      });
    });
  }

  private setupMobileDetection(): void {
    // Detectar viewport móvil (< 768px)
    this.mediaQuery = window.matchMedia('(max-width: 767px)');
    this.isMobile = this.mediaQuery.matches;
    
    // Escuchar cambios de viewport
    this.mediaQuery.addEventListener('change', (e) => {
      this.isMobile = e.matches;
      // Si cambiamos a desktop, asegurar que el form esté expandido
      if (!this.isMobile) {
        this.isFormExpanded = true;
      }
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
      
      // En mobile, colapsar form y hacer scroll a resultados
      if (this.isMobile) {
        this.isFormExpanded = false;
        setTimeout(() => this.scrollToResults(), 300);
      }
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

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Métodos para mobile: control de formulario colapsable
  toggleForm(): void {
    this.isFormExpanded = !this.isFormExpanded;
  }

  openFormAndScroll(): void {
    this.isFormExpanded = true;
    setTimeout(() => this.scrollToForm(), 300);
  }

  private scrollToResults(): void {
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private scrollToForm(): void {
    const formSection = document.getElementById('form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
