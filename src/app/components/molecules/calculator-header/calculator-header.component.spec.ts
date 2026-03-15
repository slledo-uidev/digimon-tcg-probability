import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorHeaderComponent } from './calculator-header.component';
import { LucideAngularModule, Moon, Sun } from 'lucide-angular';

describe('CalculatorHeaderComponent', () => {
  let component: CalculatorHeaderComponent;
  let fixture: ComponentFixture<CalculatorHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorHeaderComponent ],
      imports: [
        LucideAngularModule.pick({
          Sun,
          Moon
        })
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
