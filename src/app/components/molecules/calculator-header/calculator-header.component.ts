import { Component, Input } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-calculator-header',
  templateUrl: './calculator-header.component.html',
  styleUrls: ['./calculator-header.component.scss']
})
export class CalculatorHeaderComponent {
  @Input() title: string = 'Calculadora de Probabilidades - Digimon TCG';
  @Input() description: string = 'Calcula las probabilidades de revelar cartas específicas en tu mazo de Digimon TCG';
  
  isDarkMode$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.currentTheme$.pipe(
      map(theme => theme === 'dark')
    );
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
