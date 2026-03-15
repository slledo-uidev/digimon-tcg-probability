# Digimon TCG - Calculadora de Probabilidades

> Una aplicación web desarrollada en Angular que implementa las fórmulas exactas de la calculadora Excel de probabilidades hipergeométricas para Digimon Trading Card Game.

[![Angular](https://img.shields.io/badge/Angular-16-red)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![SCSS](https://img.shields.io/badge/SCSS-Responsive-pink)](https://sass-lang.com/)
[![Tests](https://img.shields.io/badge/Tests-25%20passed-green)](https://jasmine.github.io/)

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Uso](#uso)
- [Tipos de Búsqueda](#tipos-de-búsqueda)
- [Arquitectura](#arquitectura)
- [Testing](#testing)
- [Scripts de Desarrollo](#scripts-de-desarrollo)

---

## ✨ Características

### 🎯 Funcionalidad Principal
- **6 Tipos de Búsqueda Predefinidos**: Buscador por arquetipo, Memory Boost, Memory Boost Dual, Training, Robo Natural, y Custom
- **Cálculos Exactos**: Implementa las fórmulas del Excel usando distribución hipergeométrica
- **3 Resultados de Probabilidad**:
  - Hit Tipo 1: Probabilidad de encontrar al menos 1 carta del primer tipo
  - Hit Tipo 2: Probabilidad de encontrar al menos 1 carta del segundo tipo
  - Doble Hit: Probabilidad de encontrar al menos 1 de cada tipo (usando Inclusión-Exclusión)
- **Labels Dinámicos**: Los campos cambian su descripción según el tipo de búsqueda seleccionado
- **Validación en Tiempo Real**: Inputs validados con mensajes de error descriptivos

### 🎨 Diseño y UX
- **Responsive Mobile-First**: Funciona perfectamente en móvil, tablet y desktop
- **Sistema de Colores Semáforo**:
  - 🟢 Verde: Alta probabilidad (≥70%)
  - 🟡 Amarillo: Probabilidad media (40-70%)
  - 🔴 Rojo: Baja probabilidad (<40%)
- **Barras de Progreso Animadas**: Visualización intuitiva de porcentajes
- **Gradientes Modernos**: Header con gradiente morado, cards con sombras
- **Animaciones Suaves**: Transiciones de 0.3s, animaciones de entrada escalonadas

### 🧮 Precisión Matemática
- **Validado con Excel**: Los resultados coinciden exactamente con la calculadora oficial
- **Caso de prueba**: Buscador por arquetipo con 45 cartas, 4 tipo1, 10 tipo2
  - Hit Tipo 1: 24.88% ✅
  - Hit Tipo 2: 53.88% ✅
  - Doble Hit: 10.43% ✅

---

## 🚀 Instalación

### Requisitos Previos

- Node.js 18.x o superior
- npm 9.x o superior
- Angular CLI 16

### Pasos de Instalación

```bash
# Instalar dependencias
git clone [URL_DEL_REPO]

# Navegar al directorio del proyecto
cd digimon-tcg-probability

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Abrir en navegador
# La aplicación estará disponible en http://localhost:4200
```

---

## 💻 Uso

### Interfaz Principal

La aplicación presenta una interfaz limpia dividida en dos secciones principales:

#### 1. Panel de Inputs (Izquierda/Arriba)

**Parámetros de Entrada:**
1. **Tipo de búsqueda**: Selecciona entre 6 opciones predefinidas
2. **Valor personalizado**: Solo visible para tipo "Custom" (1-6 cartas)
3. **Total de cartas en mazo**: Cartas disponibles en tu mazo
4. **Cartas tipo 1**: Cantidad del primer tipo de carta objetivo (label dinámico)
5. **Cartas tipo 2**: Cantidad del segundo tipo (solo si aplica)

**Acciones:**
- 🧮 **Calcular Probabilidades**: Ejecuta el cálculo
- 🔄 **Resetear**: Vuelve a los valores por defecto

#### 2. Panel de Resultados (Derecha/Abajo)

**Metadata del Cálculo:**
- Cartas reveladas (automático según tipo)
- Total de combinaciones posibles
- Cartas no-objetivo

**Probabilidades:**
- **Hit Tipo 1**: Porcentaje grande + barra animada + fracción
- **Hit Tipo 2**: Solo si el tipo lo requiere
- **Doble Hit**: Probabilidad de encontrar ambos tipos

**Sistema de Colores:**
- 🟢 Verde: Alta probabilidad (≥70%)
- 🟡 Amarillo: Media probabilidad (40-70%)
- 🔴 Rojo: Baja probabilidad (<40%)

---

## 🔍 Tipos de Búsqueda

### 1. Buscador por arquetipo (3 cartas)
- **Uso**: Buscar Digimon y/o Options con X Antibody
- **Tipo 1**: Digimon con X Antibody
- **Tipo 2**: Options con X Antibody
- **Resultados**: Hit Tipo 1, Hit Tipo 2, Doble Hit

### 2. Memory Boost (4 cartas)
- **Uso**: Buscar Digimon del color de la Option
- **Tipo 1**: Digimon del color especificado
- **Resultados**: Hit Tipo 1

### 3. Memory Boost Dual (3 cartas)
- **Uso**: Variante de Memory Boost con menos cartas
- **Tipo 1**: Digimon del color especificado
- **Resultados**: Hit Tipo 1

### 4. Training (2 cartas)
- **Uso**: Buscar cartas del color del Training
- **Tipo 1**: Cartas del color especificado
- **Resultados**: Hit Tipo 1

### 5. Robo Natural (1 carta)
- **Uso**: Probabilidad de robar una carta específica
- **Tipo 1**: Cartas deseadas
- **Resultados**: Hit Tipo 1

### 6. Custom (1-6 cartas)
- **Uso**: Cálculos personalizados
- **Tipo 1**: Primer tipo de carta
- **Tipo 2**: Segundo tipo (opcional)
- **Resultados**: Hit Tipo 1, Hit Tipo 2 (si aplica), Doble Hit (si aplica)

---

## 🏗️ Arquitectura

### Estructura del Proyecto

```
digimon-tcg-probability/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── calculator/              # Componente principal
│   │   │       ├── calculator.component.ts
│   │   │       ├── calculator.component.html
│   │   │       ├── calculator.component.scss
│   │   │       └── calculator.component.spec.ts
│   │   ├── models/
│   │   │   └── calculator.model.ts       # Tipos y configuraciones
│   │   ├── services/
│   │   │   ├── calculator.service.ts     # Lógica de cálculo
│   │   │   └── calculator.service.spec.ts
│   │   ├── app.component.*               # Componente raíz
│   │   └── app.module.ts                 # Módulo principal
│   ├── styles.scss                       # Estilos globales
│   └── index.html                        # HTML principal
├── resources-ai/                         # Documentación de desarrollo
│   ├── analysis/                         # Análisis del Excel
│   ├── designs/                          # Diseños y mockups
│   ├── reports/                          # Reportes de implementación
│   └── scripts-ai/                       # Scripts de contexto
├── angular.json                          # Configuración Angular
├── package.json                          # Dependencias
└── README.md                             # Este archivo
```

### Tecnologías Utilizadas

- **Angular 16**: Framework principal
- **TypeScript 5.0**: Tipado estático
- **SCSS**: Preprocesador CSS
- **RxJS**: Programación reactiva (opcional en v1.0)
- **Jasmine + Karma**: Testing unitario

### Servicios Principales

#### CalculatorService
Implementa la lógica matemática:
```typescript
// Coeficiente binomial optimizado
binomialCoefficient(n, k): number

// Probabilidad de al menos 1 éxito
calculateHitType1(N, K1, n, totalCombinations): number
calculateHitType2(N, K2, n, totalCombinations): number

// Doble hit con Inclusión-Exclusión
calculateDoubleHit(N, K1, K2, n, totalCombinations): number

// Utilidades
formatPercentage(value, decimals): string
getColorForProbability(probability): string
calculateExpectedAttempts(probability, outOf): number
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar en modo CI (sin watch)
npm test -- --watch=false --browsers=ChromeHeadless

# Ejecutar con cobertura
npm test -- --code-coverage
```

### Cobertura de Tests

**25 tests, 100% passed**

- ✅ CalculatorService: 13 tests
  - Coeficiente binomial
  - Cálculos de probabilidad
  - Validaciones de entrada
  - Formateo de resultados
- ✅ CalculatorComponent: 5 tests
  - Inicialización
  - Validación de formulario
  - Cálculos
  - Reset
- ✅ AppComponent: 3 tests

**Caso de validación principal (Excel):**
```typescript
// Buscador por arquetipo: 45 cartas, 4 tipo1, 10 tipo2
expect(result.hitType1).toBeCloseTo(0.2488, 4);  // 24.88%
expect(result.hitType2).toBeCloseTo(0.5388, 4);  // 53.88%
expect(result.doubleHit).toBeCloseTo(0.1043, 4); // 10.43%
```

---

## 📊 Fórmulas Matemáticas

### Distribución Hipergeométrica

La aplicación usa la **distribución hipergeométrica** para calcular probabilidades exactas:

```
P(X = k) = [C(K,k) × C(N-K, n-k)] / C(N,n)
```

**Donde:**
- `N` = Total de cartas en el mazo
- `K` = Total de cartas objetivo en el mazo
- `n` = Cantidad de cartas a buscar/robar
- `k` = Cantidad exacta de cartas objetivo buscadas

**Ejemplo:**
- Mazo de 50 cartas
- 4 copias de "Agumon"
- Robar 5 cartas
- P(encontrar al menos 1 Agumon) ≈ **35.8%**

---

## 🤖 Ecosistema de IA

Este proyecto incluye un ecosistema completo para facilitar el trabajo con asistentes de IA.

### Documentos Principales

- **[Agent.md](./Agent.md)**: Configuración completa del proyecto para IA
  - Arquitectura detallada
  - Modelos de datos
  - Guidelines de desarrollo
  - Quick reference

### Carpeta `resources-ai/`

#### 📐 `/designs/`
Mockups, wireframes y guía de estilos
- Diseños de componentes individuales
- Flujos de usuario
- Paleta de colores

#### 📚 `/resources/`
Documentación técnica y referencias
- Cálculos de probabilidad con ejemplos
- Reglas de Digimon TCG
- Fórmulas matemáticas explicadas

#### 📊 `/reports/`
Reportes de sesiones de desarrollo
- [session-2026-03-11.md](./resources-ai/reports/session-2026-03-11.md): Implementación inicial completa

#### 🔧 `/scripts-ai/`
Scripts de contexto para IA
- [digimon-tcg-mechanics.md](./resources-ai/scripts-ai/digimon-tcg-mechanics.md): Mecánicas del juego
- [common-tasks.md](./resources-ai/scripts-ai/common-tasks.md): Guías paso a paso

### Uso del Ecosistema

Al trabajar con IA en este proyecto:
1. Proporciona `Agent.md` como contexto inicial
2. Referencia scripts específicos de `scripts-ai/` según la tarea
3. Documenta cambios en `reports/`
4. Actualiza documentación según sea necesario

---

## 🛠️ Scripts de Desarrollo

### Development Server
```bash
ng serve
```
Inicia servidor de desarrollo en `http://localhost:4200`

### Build
```bash
ng build
```
Compila el proyecto. Los archivos se generan en `dist/`

### Build para Producción
```bash
ng build --configuration production
```
Optimizado y minificado

### Generar Componentes
```bash
ng generate component components/component-name --skip-tests
```

### Generar Servicios
```bash
ng generate service services/service-name
```

### Linting (si configurado)
```bash
ng lint
```

---

## 📈 Roadmap / Futuras Mejoras

- [ ] Exportar/importar configuración de mazo (JSON)
- [ ] Múltiples perfiles de mazo
- [ ] Estadísticas avanzadas (expected value, variance)
- [ ] Calculadora de mulligan
- [ ] Integración con base de datos de cartas
- [ ] Versión PWA para uso offline
- [ ] Historial de cálculos
- [ ] Representación visual de cartas

---

## 🤝 Contribuir

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Sigue las convenciones del proyecto (BEM para CSS, TypeScript strict)
4. Documenta tus cambios en `resources-ai/reports/`
5. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
6. Push a la rama (`git push origin feature/AmazingFeature`)
7. Abre un Pull Request

### Convenciones de Código

- **CSS**: Metodología BEM estricta
- **TypeScript**: Strict mode habilitado
- **Commits**: Mensajes descriptivos en español o inglés
- **Componentes**: Un componente por feature, bien encapsulado

---

## 📄 Licencia

© 2026 Digimon TCG Probability Calculator

---

## 📞 Contacto & Soporte

Para reportar problemas o sugerir mejoras, por favor contacta al equipo de desarrollo.

---

## 🙏 Agradecimientos

- Comunidad de Digimon TCG
- Angular Team
- Todos los contribuidores

---

**¡Disfruta calculando las probabilidades de tu mazo de Digimon TCG!** 🎴📊

*Última actualización: 11 de Marzo 2026*

