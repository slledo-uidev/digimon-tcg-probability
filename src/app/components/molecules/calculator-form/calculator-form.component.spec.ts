import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CalculatorFormComponent } from './calculator-form.component';
import { SearchType } from '../../../models/calculator.model';

describe('CalculatorFormComponent', () => {
  let component: CalculatorFormComponent;
  let fixture: ComponentFixture<CalculatorFormComponent>;
  let fb: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorFormComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorFormComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    
    // Crear un FormGroup básico para las pruebas
    component.calculatorForm = fb.group({
      searchType: [SearchType.COOL_BOY],
      customValue: [3],
      totalCardsInDeck: [45],
      type1Cards: [4],
      type2Cards: [10],
      overlap: [0]
    });
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
