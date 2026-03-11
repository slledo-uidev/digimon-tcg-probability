# Digimon TCG - Calculadora de Probabilidades

> Una aplicación web desarrollada en Angular para calcular probabilidades de encontrar cartas específicas en tu mazo de Digimon Trading Card Game durante partidas en tiempo real.

[![Angular](https://img.shields.io/badge/Angular-16-red)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![SCSS](https://img.shields.io/badge/SCSS-BEM-pink)](https://sass-lang.com/)

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Uso](#uso)
- [Arquitectura](#arquitectura)
- [Ecosistema de IA](#ecosistema-de-ia)
- [Scripts de Desarrollo](#scripts-de-desarrollo)
- [Contribuir](#contribuir)

---

## ✨ Características

- **Configuración de Mazo**: Crea mazos de 50 cartas con atributos detallados (nombre, cantidad, color, tipo)
- **Seguimiento en Tiempo Real**: Marca cartas como vistas/jugadas durante la partida
- **Múltiples Métodos de Búsqueda**:
  - **Training**: Busca 2 cartas por color específico
  - **Memory**: Busca 3-4 cartas por tipo o color
  - **Buscador Específico**: Busca cartas seleccionadas manualmente
  - **Robo Plano**: Calcula probabilidad en robo normal
- **Cálculos Precisos**: Usa distribución hipergeométrica para resultados exactos
- **Persistencia Local**: Guarda tu configuración de mazo automáticamente en LocalStorage
- **Interfaz Responsive**: Diseñada para uso en tablet/dispositivos móviles durante partidas
- **Diseño Moderno**: Gradientes, animaciones y metodología BEM para estilos

---

## 🚀 Instalación

### Requisitos Previos

- Node.js 18.x o superior
- npm 9.x o superior
- Angular CLI 16

### Pasos de Instalación

```bash
# Clonar el repositorio (si aplica)
git clone [URL_DEL_REPO]

# Navegar al directorio del proyecto
cd digimon-tcg-probability

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve

# Abrir en navegador
# La aplicación estará disponible en http://localhost:4200
```

---

## 💻 Uso

### 1. Configurar tu Mazo

1. En el panel izquierdo **"Configuración del Mazo"**, agrega cartas una por una
2. Especifica:
   - Nombre de la carta
   - Cantidad (1-4 copias)
   - Color (Rojo, Azul, Amarillo, Verde, Negro, Morado, Blanco)
   - Tipo (Digimón, Tamer, Opción)
3. El mazo estándar debe tener **50 cartas exactas**

### 2. Seleccionar Método de Búsqueda

En el panel central:
1. Selecciona el tipo de búsqueda que deseas realizar
2. Configura los parámetros según el método:
   - **Training**: Selecciona un color
   - **Memory**: Selecciona categoría (color/tipo), valor y cantidad (3 o 4)
   - **Buscador Específico**: Selecciona las cartas objetivo y cantidad a buscar
   - **Robo Plano**: Selecciona cartas objetivo y cantidad a robar
3. Presiona **"Calcular Probabilidad"**

### 3. Ver Resultados

Los resultados muestran:
- **Probabilidad principal**: Grande y destacada (ej: 35.8%)
- **Barra de progreso**: Visual con colores según probabilidad
  - Verde: ≥70%
  - Naranja: ≥40%
  - Rojo: <40%
- **Desglose detallado**: Probabilidades de encontrar 0, 1, 2+ cartas
- **Información contextual**: Cartas objetivo, tamaño del mazo, método usado

### 4. Seguimiento Durante la Partida

En el panel derecho **"Seguimiento de Cartas"**:
1. **Ver contador**: Círculo grande muestra cartas restantes en el mazo
2. **Marcar cartas vistas**: Usa el botón **"-"** cuando veas/juegues una carta
3. **Restaurar cartas**: Usa el botón **"+"** si cometiste un error
4. **Deshacer**: Botón **"↶ Deshacer última acción"** disponible
5. **Ver por color**: Agrupación automática de cartas por color
6. **Historial**: Las últimas 5 remociones se muestran abajo

Las probabilidades se **actualizan automáticamente** cuando cambias el estado del mazo.

---

## 🏗️ Arquitectura

### Estructura del Proyecto

```
digimon-tcg-probability/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── deck-configuration/      # Configuración de mazo
│   │   │   ├── card-tracker/            # Seguimiento de cartas
│   │   │   ├── search-selector/         # Selector de búsqueda
│   │   │   └── probability-results/     # Visualización de resultados
│   │   ├── models/
│   │   │   ├── card.model.ts            # Modelos de cartas
│   │   │   ├── deck-state.model.ts      # Estado del mazo
│   │   │   └── search-method.model.ts   # Métodos de búsqueda
│   │   ├── services/
│   │   │   ├── probability.service.ts   # Cálculos de probabilidad
│   │   │   ├── deck-state.service.ts    # Gestión de estado
│   │   │   └── storage.service.ts       # Persistencia local
│   │   └── app.component.*              # Componente principal
│   └── styles.scss                       # Estilos globales
├── resources-ai/                         # Ecosistema de IA
│   ├── designs/                          # Mockups y diseños
│   ├── resources/                        # Documentación técnica
│   ├── reports/                          # Reportes de sesión
│   └── scripts-ai/                       # Scripts de contexto
├── Agent.md                              # Configuración para IA
└── README.md                             # Este archivo
```

### Tecnologías Utilizadas

- **Angular 16**: Framework principal
- **TypeScript**: Lenguaje de programación
- **SCSS**: Preprocesador CSS con metodología BEM
- **RxJS**: Programación reactiva para manejo de estado
- **LocalStorage**: Persistencia de datos del navegador

### Fórmula de Probabilidad

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

