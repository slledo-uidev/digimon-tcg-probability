import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DeckConfigurationComponent } from './components/deck-configuration/deck-configuration.component';
import { CardTrackerComponent } from './components/card-tracker/card-tracker.component';
import { SearchSelectorComponent } from './components/search-selector/search-selector.component';
import { ProbabilityResultsComponent } from './components/probability-results/probability-results.component';

@NgModule({
  declarations: [
    AppComponent,
    DeckConfigurationComponent,
    CardTrackerComponent,
    SearchSelectorComponent,
    ProbabilityResultsComponent
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
