# Mecánicas de Digimon TCG - Contexto para IA

## Estructura del Mazo

- **Tamaño estándar:** 50 cartas exactas
- **Límite por carta:** Máximo 4 copias de cualquier carta con el mismo nombre
- **Sin sideboard:** Todo el mazo está disponible desde el inicio

## Tipos de Cartas

### 1. Digimón
- Principales cartas del juego
- Tienen nivel, color, coste de digievolución
- Se colocan en campo y pueden atacar/defender

### 2. Tamer
- Representan entrenadores
- Proporcionan efectos de apoyo
- Limitados en campo (normalmente)

### 3. Opción
- Cartas de un solo uso
- Efectos instantáneos o permanentes
- Se juegan y van al trash

## Colores Disponibles

- **Rojo:** Agresivo, enfocado en ataque
- **Azul:** Control, efectos de bloqueo
- **Amarillo:** Recuperación, efecto
- **Verde:** Crecimiento, ramp
- **Negro:** Descarte, eliminación
- **Morado:** Manipulación de trash
- **Blanco:** Defensivo, protección

## Mecánicas de Búsqueda

### Training (Entrenamiento)
**Descripción:** Buscar cartas específicas por color  
**Formato típico:** "Revela las 2 cartas superiores del mazo. Añade a tu mano las cartas [Color] entre ellas."

**Parámetros:**
- Cantidad a revisar: 2 cartas
- Filtro: Color específico
- Resultado: Las que coincidan van a mano, el resto al fondo

**Ejemplo de carta:**
"Training Rookie" - Busca 2 cartas rojas

### Memory Boost (Impulso de Memoria)
**Descripción:** Buscar cartas por tipo o característica  
**Formato típico:** "Revela las N cartas superiores del mazo. Añade 1 carta [Tipo/Característica] entre ellas a tu mano."

**Parámetros:**
- Cantidad a revisar: 3 o 4 cartas (varía según carta)
- Filtro: Tipo (Digimón/Tamer/Opción) o característica específica
- Resultado: Elegir 1 que coincida

**Ejemplo de carta:**
"Memory Boost!" - Revela 3, añade 1 Digimón
"Memory Boost! Deluxe" - Revela 4, añade 1 Tamer

### Buscadores Específicos
**Descripción:** Cartas que buscan nombres específicos o condiciones complejas  
**Formato típico:** "Busca en tu mazo 1 carta [nombre específico] o [condición], revélala y añádela a tu mano."

**Características:**
- Buscan en todo el mazo (no solo las superiores)
- Condiciones muy específicas
- Generalmente más costosos de jugar

**Ejemplo:**
"Search for Tai" - Busca específicamente la carta "Agumon"
"Rare Collection" - Busca cualquier carta Rare o superior

### Robo Normal (Draw)
**Descripción:** Robar cartas sin condición  
**Formato:** Al inicio del turno o por efectos

**Cantidad estándar:**
- Inicio de turno: 1 carta
- Mano inicial: 5 cartas
- Efectos pueden variar: +1, +2, hasta "draw X"

## Fase de Juego (para contexto de probabilidades)

### Setup
1. Barajar mazo (50 cartas)
2. Robar 5 cartas iniciales
3. Mulligan opcional (devolver todo y robar 5 nuevas)

### Durante el Juego
- Cartas en mano
- Cartas en campo (Battle Area, Breeding Area)
- Cartas en Trash (descarte)
- Cartas en Security (área de defensa)
- **Cartas restantes en mazo** ← Lo que nos interesa

## Probabilidades Relevantes

### Casos Comunes a Calcular

1. **Mano Inicial (5 cartas)**
   - "¿Probabilidad de tener al menos 1 [carta X]?"
   - "¿Probabilidad de tener 2+ [cartas de color Y]?"

2. **Después de Training**
   - Mazo = 50 - cartas en mano - cartas jugadas
   - Buscar 2 cartas de color específico
   - "¿Probabilidad de encontrar al menos 1?"

3. **Después de Memory Boost**
   - Similar pero buscar 3-4 cartas
   - Filtro por tipo en lugar de color

4. **Durante Gameplay**
   - Estado dinámico: cartas vistas/jugadas/descartadas
   - Recalcular probabilidades continuamente
   - "Me quedan X cartas en mazo, Y son objetivos, voy a robar Z"

## Información para Cálculos

### Distribución Típica de Mazos Competitivos

**Mazo Agresivo Rojo:**
- 15-20 cartas rojas (Digimón nivel bajo)
- 4-6 cartas amarillas (Digimón nivel alto)
- 8-12 Tamers
- 10-15 Opciones
- 4 copias de piezas clave

**Mazo Control Azul:**
- 20-25 cartas azules
- 10-12 Tamers azules
- 12-15 Opciones de control
- Más diversidad, menos copias múltiples

### Contexto de Timing

La aplicación debe ayudar en estas situaciones:
1. **Pre-juego:** Evaluar consistencia del mazo
2. **Durante partida:** Calcular probabilidades en tiempo real
3. **Post-juego:** Análisis de draws y mejora del mazo

## Restricciones del Juego (Relevantes para Validación)

1. **Deck Building:**
   - Exactamente 50 cartas (ni más ni menos)
   - Máximo 4 copias por nombre
   - Puede tener 0 de una carta (no obligatorio llevarla)

2. **Durante Partida:**
   - No se pueden ver cartas del mazo excepto por efectos
   - Trash es público (ambos jugadores pueden verlo)
   - Security se coloca boca abajo

3. **Mulligan:**
   - Se puede hacer una vez
   - Devuelves toda la mano
   - Robas 5 nuevas

## Términos Específicos

- **Digi-Egg:** Cartas especiales de nivel 2
- **Digivolve:** Evolucionar un Digimón
- **DP:** Digi-Power (fuerza de ataque)
- **Security:** Cartas que te protegen de perder
- **Trash:** Zona de descarte
- **Memory:** Recurso del juego (no afecta probabilidades directamente)

## Ejemplos de Preguntas que la App Debe Responder

1. "Tengo 4 copias de Agumon en un mazo de 50. ¿Probabilidad de tener al menos 1 en mano inicial (5 cartas)?"
   - Respuesta: ~35.8%

2. "Me quedan 40 cartas en mazo, 3 son Agumon. Voy a usar Training (ver 2 cartas). ¿Probabilidad de encontrar al menos 1?"
   - Respuesta: ~14.6%

3. "Mazo de 45 cartas restantes, 8 son rojas, voy a ver 3 con Memory Boost. ¿Probabilidad de encontrar exactamente 2 rojas?"
   - Respuesta: ~8.9%

## Referencias para Futuras Implementaciones

- **Pro:** Agregar calculadora de mulligan (comparar probabilidad antes/después)
- **Pro:** Simulador de manos iniciales (Monte Carlo)
- **Pro:** Sugerencias de composición de mazo
- **Pro:** Análisis de draws por turno

---

*Última actualización: 11 de Marzo 2026*
*Este documento debe actualizarse si cambian las reglas del juego*
