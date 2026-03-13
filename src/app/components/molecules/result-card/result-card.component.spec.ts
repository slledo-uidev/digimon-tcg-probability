import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultCardComponent } from './result-card.component';
import { CalculatorService } from '../../../services/calculator.service';

describe('ResultCardComponent', () => {
  let component: ResultCardComponent;
  let fixture: ComponentFixture<ResultCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultCardComponent ],
      providers: [ CalculatorService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultCardComponent);
    component = fixture.componentInstance;
    component.probability = 0.75;
    component.title = 'Test Card';
    component.badge = 'Test Badge';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
