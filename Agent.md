# Agent Configuration - Digimon TCG Probability Calculator

## Project Overview

**Project Name:** Digimon TCG Probability Calculator  
**Type:** Angular Web Application  
**Purpose:** Calculate probabilities of finding specific cards in Digimon TCG deck during gameplay  
**Created:** March 11, 2026  
**Tech Stack:** Angular 16, TypeScript, SCSS, RxJS

---

## Project Context

This application helps Digimon TCG players calculate the probability of drawing specific cards from their deck during gameplay. It supports real-time tracking and multiple search methods used in the Digimon TCG game.

### Core Functionality

1. **Deck Configuration**: Build and manage a 50-card deck with card attributes (name, quantity, color, type)
2. **Real-time Tracking**: Mark cards as seen/removed during gameplay
3. **Probability Calculation**: Uses hypergeometric distribution for accurate probability calculations
4. **Multiple Search Methods**:
   - **Training**: Search 2 cards by color
   - **Memory**: Search 3-4 cards by type/color
   - **Specific Search**: Search for selected cards
   - **Plain Draw**: Calculate probability on normal draw

---

## Architecture

### Component Structure

```
app/
├── components/
│   ├── deck-configuration/      # Deck builder interface
│   ├── card-tracker/            # Real-time card tracking
│   ├── search-selector/         # Search method selector
│   └── probability-results/     # Results visualization
├── models/
│   ├── card.model.ts           # Card data structures
│   ├── deck-state.model.ts     # Deck state management
│   └── search-method.model.ts  # Search method definitions
└── services/
    ├── probability.service.ts   # Probability calculations
    ├── deck-state.service.ts    # State management (RxJS)
    └── storage.service.ts       # LocalStorage persistence
```

### Key Services

#### ProbabilityService
- Implements hypergeometric distribution: `P(X=k) = [C(K,k) × C(N-K,n-k)] / C(N,n)`
- Methods for each search type (Training, Memory, Specific Search, Plain Draw)
- Returns detailed probability breakdowns

#### DeckStateService
- Manages deck state using RxJS BehaviorSubject
- Methods: `initializeDeck()`, `addCard()`, `removeCards()`, `restoreCards()`, `undoLastRemoval()`
- Auto-saves to LocalStorage on every change

#### StorageService
- Handles LocalStorage persistence
- Saves/loads deck configurations
- Automatic state preservation between sessions

---

## Data Models

### Card Model
```typescript
interface Card {
  id: string;
  name: string;
  quantity: number;
  categories: {
    color?: string;
    type?: string;
    level?: number;
    cost?: number;
    [key: string]: any;
  };
}
```

### Search Method Types
- `TRAINING`: 2 cards by color
- `MEMORY`: 3-4 cards by type/color
- `SPECIFIC_SEARCH`: Selected cards search
- `PLAIN_DRAW`: Normal draw calculation

---

## Design System

### Styling Methodology
- **BEM (Block Element Modifier)** naming convention
- SCSS with CSS variables
- Component-scoped styles

### Color Palette
```scss
--color-primary: #3498db
--color-success: #27ae60
--color-warning: #f39c12
--color-danger: #e74c3c
--color-secondary: #667eea (gradient with #764ba2)
```

### Layout
- 3-column responsive grid (desktop)
- Single column on mobile (<1200px)
- Sections: Deck Config (left), Calculator (center), Tracker (right)

---

## AI Agent Guidelines

### When Working on This Project

1. **Understand the Domain**
   - Digimon TCG has specific card search mechanics
   - Players need real-time probability during gameplay
   - Accuracy is critical - use hypergeometric distribution

2. **Code Patterns to Follow**
   - Use BEM for all CSS classes
   - Services use RxJS for reactive state
   - All state changes trigger auto-save
   - Components subscribe to state observables

3. **Testing Considerations**
   - Verify probability calculations with known values
   - Test state persistence (LocalStorage)
   - Ensure undo functionality works correctly
   - Validate form inputs (max 4 cards per name, 50 card deck)

4. **Common Tasks**
   - Adding new search methods: Update SearchMethodType enum, add to ProbabilityService
   - UI changes: Follow BEM, maintain responsive design
   - New card attributes: Update CardCategory interface
   - State changes: Always go through DeckStateService

---

## Project Structure Details

### Important Files
- `/src/app/app.component.*` - Main application shell
- `/src/app/services/probability.service.ts` - Core calculation logic
- `/src/app/services/deck-state.service.ts` - State management
- `/src/styles.scss` - Global styles and variables
- `/angular.json` - Angular configuration

### Configuration
- Angular CLI 16.2.16
- Node.js 18+
- SCSS preprocessor
- No routing (single-page app)

---

## Development Workflow

### Starting Development
```bash
cd digimon-tcg-probability
ng serve
```

### Building
```bash
ng build
```

### Adding Components
```bash
ng generate component components/component-name --skip-tests
```

### Adding Services
```bash
ng generate service services/service-name
```

---

## Future Enhancements (Potential)

- [ ] Import/export deck configurations (JSON)
- [ ] Multiple deck profiles
- [ ] Advanced statistics (expected value, variance)
- [ ] Mulligan calculations
- [ ] Card database integration
- [ ] Mobile app version
- [ ] Probability history tracking
- [ ] Visual card representation

---

## Constraints & Considerations

1. **Deck Size**: Standard Digimon TCG deck is 50 cards
2. **Card Limits**: Maximum 4 copies per card (by name)
3. **Search Methods**: Based on actual Digimon TCG game mechanics
4. **Performance**: Calculations must be instant for good UX
5. **Offline First**: Must work without internet connection
6. **Data Persistence**: LocalStorage for deck configurations

---

## Common Issues & Solutions

### Issue: Probability doesn't update after removing cards
**Solution**: Check that `removeCards()` triggers state update and `deckState$` subscription is active

### Issue: LocalStorage not persisting
**Solution**: Verify `saveToStorage()` is called after state changes in DeckStateService

### Issue: Form validation errors
**Solution**: Check ReactiveFormsModule is imported in AppModule

---

## Resources Location

- **Designs**: `/resources-ai/designs/` - UI/UX designs, mockups, wireframes
- **Resources**: `/resources-ai/resources/` - Calculation examples, Excel sheets, reference materials
- **Reports**: `/resources-ai/reports/` - Session reports and change logs
- **AI Scripts**: `/resources-ai/scripts-ai/` - Context scripts for AI understanding

---

## Contact & Maintenance

**Last Updated:** March 11, 2026  
**Angular Version:** 16.2.16  
**Developer:** Development Team

---

## Quick Reference

### Calculate Probability
```typescript
const result = probabilityService.calculate(
  deckState.cards,
  searchMethod,
  deckState.cardsRemaining
);
```

### Add Card to Deck
```typescript
const card: Card = {
  id: 'unique_id',
  name: 'Agumon',
  quantity: 4,
  categories: { color: 'Rojo', type: 'Digimón' }
};
deckStateService.addCard(card);
```

### Subscribe to State
```typescript
deckStateService.deckState$.subscribe(state => {
  console.log('Current deck size:', state.cardsRemaining);
});
```

---

*This document should be updated whenever significant changes are made to the project architecture or functionality.*
