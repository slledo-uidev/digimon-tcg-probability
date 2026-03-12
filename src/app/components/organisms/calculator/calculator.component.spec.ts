import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CalculatorComponent } from './calculator.component';
import { CalculatorService } from '../../../services/calculator.service';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;
  let calculatorService: CalculatorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [ CalculatorService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    calculatorService = TestBed.inject(CalculatorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.calculatorForm.get('searchType')?.value).toBeTruthy();
    expect(component.calculatorForm.get('totalCardsInDeck')?.value).toBe(45);
    expect(component.calculatorForm.get('type1Cards')?.value).toBe(4);
  });

  it('should calculate result when form is valid', () => {
    component.calculatorForm.patchValue({
      searchType: 'Cool Boy',
      totalCardsInDeck: 45,
      type1Cards: 4,
      type2Cards: 10
    });

    component.calculate();

    expect(component.result).toBeTruthy();
    expect(component.result?.hitType1).toBeGreaterThan(0);
  });

  it('should not calculate when form is invalid', () => {
    component.calculatorForm.patchValue({
      totalCardsInDeck: -1 // Invalid value
    });

    component.calculate();

    expect(component.result).toBeNull();
  });

  it('should reset form and result', () => {
    component.result = {} as any;
    component.reset();

    expect(component.result).toBeNull();
    expect(component.calculatorForm.get('searchType')?.value).toBeTruthy();
  });
});
