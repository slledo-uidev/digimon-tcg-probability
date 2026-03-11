# Tareas Comunes - Guías Paso a Paso

## 1. Agregar un Nuevo Método de Búsqueda

### Paso 1: Actualizar el Enum
**Archivo:** `/src/app/models/search-method.model.ts`

```typescript
export enum SearchMethodType {
  TRAINING = 'training',
  MEMORY = 'memory',
  SPECIFIC_SEARCH = 'specific',
  PLAIN_DRAW = 'plain',
  NEW_METHOD = 'new_method'  // Agregar aquí
}
```

### Paso 2: Actualizar SearchParameters
Agregar parámetros específicos del nuevo método:

```typescript
export interface SearchParameters {
  // Existentes...
  
  // Para el nuevo método
  newMethodParam?: string;
  newMethodSize?: number;
}
```

### Paso 3: Implementar Cálculo en ProbabilityService
**Archivo:** `/src/app/services/probability.service.ts`

```typescript
calculateNewMethod(
  cards: CardInDeck[],
  param: string,
  size: number,
  deckSize: number
): ProbabilityResult {
  // 1. Filtrar cartas objetivo
  const targetCards = cards.filter(card => 
    // tu lógica de filtro
  );
  
  // 2. Contar total
  const totalTargetCards = targetCards.reduce(
    (sum, card) => sum + card.remaining, 0
  );
  
  // 3. Calcular probabilidad
  return this.calculateProbability(
    totalTargetCards, 
    deckSize, 
    size,
    {
      type: SearchMethodType.NEW_METHOD,
      parameters: { newMethodParam: param, newMethodSize: size }
    }
  );
}
```

### Paso 4: Agregar Case en calculate()
En el mismo archivo:

```typescript
calculate(cards, searchMethod, deckSize) {
  switch (searchMethod.type) {
    // ... casos existentes ...
    
    case SearchMethodType.NEW_METHOD:
      return this.calculateNewMethod(
        cards,
        params.newMethodParam || '',
        params.newMethodSize || 1,
        deckSize
      );
  }
}
```

### Paso 5: Actualizar UI en SearchSelectorComponent
**Archivo:** `/src/app/components/search-selector/search-selector.component.html`

Agregar radio button:
```html
<label class="search-selector__radio">
  <input 
    type="radio" 
    formControlName="method" 
    [value]="searchMethodType.NEW_METHOD"
  />
  <span>Nombre del Nuevo Método</span>
</label>
```

Agregar formulario específico:
```html
<div class="search-selector__params" 
     *ngIf="currentMethod === searchMethodType.NEW_METHOD">
  <!-- Tus inputs aquí -->
</div>
```

### Paso 6: Actualizar getMethodName() en ProbabilityResultsComponent
**Archivo:** `/src/app/components/probability-results/probability-results.component.ts`

```typescript
getMethodName(type: SearchMethodType): string {
  switch (type) {
    // ... casos existentes ...
    case SearchMethodType.NEW_METHOD:
      return 'Nombre del Nuevo Método';
  }
}
```

---

## 2. Agregar una Nueva Categoría de Carta

### Paso 1: Actualizar CardCategory Interface
**Archivo:** `/src/app/models/card.model.ts`

```typescript
export interface CardCategory {
  color?: string;
  type?: string;
  level?: number;
  cost?: number;
  newCategory?: string;  // Agregar aquí
  [key: string]: any;
}
```

### Paso 2: Actualizar Formulario en DeckConfigurationComponent
**Archivo:** `/src/app/components/deck-configuration/deck-configuration.component.ts`

```typescript
private initForm(): void {
  this.cardForm = this.fb.group({
    name: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1), Validators.max(4)]],
    color: [''],
    type: [''],
    newCategory: ['']  // Agregar aquí
  });
}

// Agregar opciones disponibles
availableNewCategory = ['Opción 1', 'Opción 2', 'Opción 3'];
```

### Paso 3: Agregar Input en HTML
**Archivo:** `/src/app/components/deck-configuration/deck-configuration.component.html`

```html
<div class="deck-configuration__form-group">
  <label class="deck-configuration__label" for="newCategory">Nueva Categoría</label>
  <select class="deck-configuration__select" id="newCategory" formControlName="newCategory">
    <option value="">Sin especificar</option>
    <option *ngFor="let option of availableNewCategory" [value]="option">
      {{ option }}
    </option>
  </select>
</div>
```

### Paso 4: Actualizar addCard() para incluir nueva categoría
```typescript
addCard(): void {
  if (this.cardForm.valid) {
    const formValue = this.cardForm.value;
    
    const newCard: Card = {
      id: this.generateCardId(),
      name: formValue.name,
      quantity: formValue.quantity,
      categories: {
        color: formValue.color || undefined,
        type: formValue.type || undefined,
        newCategory: formValue.newCategory || undefined  // Agregar
      }
    };
    
    this.deckStateService.addCard(newCard);
  }
}
```

### Paso 5: Mostrar en la Lista de Cartas
Actualizar el HTML para mostrar el nuevo tag:
```html
<span *ngIf="card.categories.newCategory" class="deck-configuration__card-tag">
  {{ card.categories.newCategory }}
</span>
```

---

## 3. Modificar Estilos Siguiendo BEM

### Estructura BEM Básica
```
.block
.block__element
.block__element--modifier
```

### Ejemplo: Agregar Nuevo Estado a un Botón

**Archivo:** `/src/app/components/ejemplo/ejemplo.component.scss`

```scss
.ejemplo {
  // Block
  
  &__button {
    // Element - estilo base del botón
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    // Modifier - variante primary
    &--primary {
      background-color: var(--color-primary);
      color: white;
    }
    
    // Modifier - variante nueva
    &--nuevo-estado {
      background-color: var(--color-warning);
      color: white;
      
      &:hover {
        background-color: var(--color-warning-dark);
      }
    }
  }
}
```

### HTML Correspondiente
```html
<button class="ejemplo__button ejemplo__button--nuevo-estado">
  Botón Nuevo
</button>
```

### Reglas BEM a Seguir
1. **NO** anidar más de 1 nivel: `.block__element`, no `.block__element__subelement`
2. **SÍ** usar modifiers para variantes: `.block__element--modifier`
3. **NO** usar tags HTML como selectores: `.button` en lugar de `button`
4. **SÍ** usar variables CSS para colores: `var(--color-primary)`
5. **NO** usar !important excepto casos extremos

---

## 4. Agregar Validación a Formularios

### Validación Síncrona Simple

**En el Component:**
```typescript
import { Validators } from '@angular/forms';

this.form = this.fb.group({
  campo: ['', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50),
    Validators.pattern(/^[a-zA-Z ]+$/)
  ]]
});
```

**En el HTML:**
```html
<input formControlName="campo" />
<div *ngIf="form.get('campo')?.invalid && form.get('campo')?.touched">
  <span *ngIf="form.get('campo')?.errors?.['required']">
    Campo requerido
  </span>
  <span *ngIf="form.get('campo')?.errors?.['minlength']">
    Mínimo 3 caracteres
  </span>
</div>
```

### Validador Personalizado

```typescript
// validators/custom.validator.ts
export function deckSizeValidator() {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value !== 50) {
      return { invalidDeckSize: { actual: value, expected: 50 } };
    }
    return null;
  };
}

// Uso
this.form = this.fb.group({
  totalCards: [0, [deckSizeValidator()]]
});
```

### Validación Asíncrona (ejemplo)

```typescript
asyncValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return this.service.checkAvailable(control.value).pipe(
      map(available => available ? null : { notAvailable: true }),
      catchError(() => of(null))
    );
  };
}
```

---

## 5. Depurar Cálculos de Probabilidad

### Paso 1: Agregar Logs
**Archivo:** `/src/app/services/probability.service.ts`

```typescript
private hypergeometric(N: number, K: number, n: number, k: number): number {
  console.log(`Cálculo: N=${N}, K=${K}, n=${n}, k=${k}`);
  
  const numerator = this.binomialCoefficient(K, k) * 
                    this.binomialCoefficient(N - K, n - k);
  const denominator = this.binomialCoefficient(N, n);
  
  const result = numerator / denominator;
  console.log(`Resultado: ${result} (${(result * 100).toFixed(2)}%)`);
  
  return result;
}
```

### Paso 2: Crear Caso de Prueba Conocido

**Ejemplo:** 4 cartas objetivo en mazo de 50, robar 5
- Esperado: ~35.8%

```typescript
// En un componente temporal o console del navegador
testCalculation() {
  const cards: CardInDeck[] = [
    {
      id: '1',
      name: 'Test Card',
      quantity: 4,
      remaining: 4,
      categories: {}
    }
  ];
  
  const result = this.probabilityService.calculatePlainDraw(
    cards,
    ['1'],
    5,
    50
  );
  
  console.log('Resultado:', result.probabilities.atLeastOne);
  console.log('Esperado: ~0.358');
}
```

### Paso 3: Verificar con Fórmula Externa

Sitios web para validar:
- https://stattrek.com/online-calculator/hypergeometric.aspx
- WolframAlpha: "hypergeometric distribution"

### Paso 4: Edge Cases a Probar

```typescript
// Caso 1: K > n (más objetivos que búsqueda)
// Debe dar probabilidad válida entre 0-1

// Caso 2: K = 0 (sin cartas objetivo)
// Debe dar P(X≥1) = 0

// Caso 3: n > N (buscar más que el mazo)
// Debe manejar el error o ajustar

// Caso 4: K = N (todo el mazo es objetivo)
// Debe dar P(X≥1) = 1
```

---

## 6. Optimizar Renders (OnPush Strategy)

### Paso 1: Cambiar Change Detection Strategy

**Archivo:** Cualquier component

```typescript
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ejemplo',
  templateUrl: './ejemplo.component.html',
  styleUrls: ['./ejemplo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush  // Agregar
})
export class EjemploComponent {
  constructor(private cdr: ChangeDetectorRef) {}
  
  // Si necesitas forzar detección manual
  forceUpdate() {
    this.cdr.markForCheck();
  }
}
```

### Paso 2: Usar Observables en Template con AsyncPipe

```typescript
// Antes (no optimal)
data: any;
ngOnInit() {
  this.service.getData().subscribe(d => this.data = d);
}

// Después (optimal con OnPush)
data$ = this.service.getData();
```

```html
<!-- Template -->
<div *ngIf="data$ | async as data">
  {{ data }}
</div>
```

### Paso 3: Hacer Inputs Inmutables

```typescript
// NO: Mutar objeto
this.myObject.property = 'new value';

// SÍ: Crear nuevo objeto
this.myObject = { ...this.myObject, property: 'new value' };

// Para arrays
this.myArray = [...this.myArray, newItem];
```

---

## 7. Agregar Animaciones

### Paso 1: Importar BrowserAnimationsModule

**Archivo:** `/src/app/app.module.ts`

```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserAnimationsModule  // Agregar
  ]
})
```

### Paso 2: Definir Animación

**En el Component:**

```typescript
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
```

### Paso 3: Usar en Template

```html
<div @fadeIn>
  Contenido animado
</div>
```

---

*Estas guías deben actualizarse cuando cambien los patrones del proyecto*
