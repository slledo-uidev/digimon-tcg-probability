import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorResultsComponent } from './calculator-results.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChartNoAxesColumn, Info, LucideAngularModule } from 'lucide-angular';

describe('CalculatorResultsComponent', () => {
  let component: CalculatorResultsComponent;
  let fixture: ComponentFixture<CalculatorResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorResultsComponent ],
      imports: [
        LucideAngularModule.pick({
          ChartNoAxesColumn,
          Info
        })
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
