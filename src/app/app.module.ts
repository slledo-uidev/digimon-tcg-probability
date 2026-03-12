import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CalculatorComponent } from './components/organisms/calculator/calculator.component';
import { CalculatorHeaderComponent } from './components/molecules/calculator-header/calculator-header.component';
import { CalculatorFormComponent } from './components/molecules/calculator-form/calculator-form.component';
import { CalculatorResultsComponent } from './components/molecules/calculator-results/calculator-results.component';
import { ResultCardComponent } from './components/molecules/result-card/result-card.component';

@NgModule({
  declarations: [
    AppComponent,
    CalculatorComponent,
    CalculatorHeaderComponent,
    CalculatorFormComponent,
    CalculatorResultsComponent,
    ResultCardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
