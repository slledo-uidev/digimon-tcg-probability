# Reporte de Análisis: Calculadora Hypergeometrics Digimon TCG

**Fecha:** 11 de Marzo de 2026  
**Archivo analizado:** `Calculadora Hypergeometrics DigimonTcg.xlsx`  
**Hoja:** Calculadora

---

## 📋 Resumen Ejecutivo

La calculadora en Excel implementa cálculos de probabilidad basados en la **distribución hipergeométrica** para determinar las chances de encontrar cartas específicas durante efectos de búsqueda en Digimon TCG. El modelo permite calcular hasta 3 probabilidades simultáneas: Hit tipo 1, Hit tipo 2, y Doble Hit (ambos tipos).

---

## 🎯 Estructura de la Calculadora

### Parámetros de Entrada

La calculadora está diseñada con los siguientes campos configurables:

| Celda | Campo | Descripción | Valores |
|-------|-------|-------------|---------|
| **B1** | Tipo de búsqueda | Método de búsqueda/revelado de cartas | Dropdown: `Cool Boy`, `Memory Boost`, `Memory Boost Dual`, `Training`, `Elige otro número`, `Robo Natural` |
| **B2** | Valor personalizado | Número de cartas a revelar (solo si se elige "Elige otro número") | Dropdown: 1-6 |
| **B3** | Total de cartas en mazo | Cartas totales disponibles al momento de la búsqueda + Securities desconocidas | Valor numérico (ej: 45) |
| **B4** | Cartas tipo 1 | Número de cartas del primer tipo objetivo en el mazo | Valor numérico (ej: 4) |
| **B5** | Cartas tipo 2 | Número de cartas del segundo tipo objetivo en el mazo (opcional) | Valor numérico (ej: 10) |

### Campos Calculados Automáticamente

| Celda | Campo | Fórmula | Descripción |
|-------|-------|---------|-------------|
| **B6** | Cartas reveladas | `=IF(B1="Cool Boy", 3, IF(B1="Memory Boost", 4, IF(B1="Memory Boost Dual", 3, IF(B1="Training", 2, IF(B1="Robo Natural", 1, B2)))))` | Determina automáticamente cuántas cartas se revelan según el tipo de búsqueda |
| **E1** | Total combinaciones | `=COMBIN(B3, B6)` | Calcula C(N,n) - todas las combinaciones posibles de revelar n cartas de N totales |
| **B8** | Cartas no-objetivo | `=B3 - B4 - B5` | Resto de cartas que no son ninguno de los objetivos |

---

## 🧮 Fórmulas de Probabilidad

### 1. Hit Tipo 1 (B10)

**Fórmula Excel:**
```excel
=IF(B6>0, (1 - COMBIN(B3 - B4, B6) / E1), 0)
```

**Interpretación matemática:**
```
P(al menos 1 carta tipo 1) = 1 - C(N-K₁, n) / C(N, n)
```

Donde:
- **N** = Total de cartas en mazo (B3)
- **K₁** = Cartas tipo 1 disponibles (B4)
- **n** = Cartas reveladas (B6)
- **C(x, y)** = Combinaciones de y elementos tomados de x

**Ejemplo del archivo:**
- N = 45 cartas
- K₁ = 4 cartas tipo 1
- n = 3 cartas reveladas
- **Resultado: 24.88%** de probabilidad de encontrar al menos 1 carta tipo 1

---

### 2. Hit Tipo 2 (B11)

**Fórmula Excel:**
```excel
=IF(A11 = " ", " ", IF(B6>0, (1 - COMBIN(B3 - B5, B6) / E1), 0))
```

**Interpretación matemática:**
```
P(al menos 1 carta tipo 2) = 1 - C(N-K₂, n) / C(N, n)
```

Donde:
- **K₂** = Cartas tipo 2 disponibles (B5)

**Ejemplo del archivo:**
- N = 45 cartas
- K₂ = 10 cartas tipo 2
- n = 3 cartas reveladas
- **Resultado: 53.88%** de probabilidad de encontrar al menos 1 carta tipo 2

---

### 3. Doble Hit (B12)

**Fórmula Excel:**
```excel
=IF(A12=" ", " ", IF(B6>=2, (1 - (COMBIN(B3-B4, B6)/E1) - (COMBIN(B3-B5, B6)/E1) + (IF(B3-B4-B5 >= B6, COMBIN(B3-B4-B5, B6)/E1, 0))), 0))
```

**Interpretación matemática (Principio de Inclusión-Exclusión):**
```
P(al menos 1 tipo 1 O al menos 1 tipo 2) = 
    P(tipo 1) + P(tipo 2) - P(tipo 1 Y tipo 2)

P(Doble Hit) = 1 - [C(N-K₁,n)/C(N,n)] - [C(N-K₂,n)/C(N,n)] + [C(N-K₁-K₂,n)/C(N,n)]
```

**Ejemplo del archivo:**
- N = 45, K₁ = 4, K₂ = 10, n = 3
- **Resultado: 10.43%** de probabilidad de encontrar al menos 1 de cada tipo

---

## 🎮 Tipos de Búsqueda Implementados

La celda B1 controla el comportamiento de toda la calculadora mediante lógica condicional:

### 1. **Cool Boy** (Revela 3 cartas)
- **Etiqueta B4:** "Número de cartas X Antibody restantes en Deck" (Digimon)
- **Etiqueta B5:** "Numero de Option con trait X Antibody restantes en Deck"
- **Cartas reveladas:** 3
- **Caso de uso:** Buscar Digimon y/o Options con X Antibody

### 2. **Memory Boost** (Revela 4 cartas)
- **Etiqueta B4:** "Número de Digimon del color de la Option en el Deck"
- **Etiqueta B5:** No aplica
- **Cartas reveladas:** 4
- **Caso de uso:** Buscar Digimon del color especificado

### 3. **Memory Boost Dual** (Revela 3 cartas)
- **Etiqueta B4:** "Número de Digimon del color de la Option en el Deck"
- **Etiqueta B5:** No aplica
- **Cartas reveladas:** 3
- **Caso de uso:** Variante de Memory Boost con menos cartas reveladas

### 4. **Training** (Revela 2 cartas)
- **Etiqueta B4:** "Número de cartas del color del Training"
- **Etiqueta B5:** No aplica
- **Cartas reveladas:** 2
- **Caso de uso:** Buscar cartas del color del Training

### 5. **Robo Natural** (Revela 1 carta = Robo)
- **Etiqueta B4:** "Número de cartas deseadas en el Deck"
- **Cartas reveladas:** 1
- **Caso de uso:** Probabilidad de robar una carta específica

### 6. **Elige otro número** (Personalizado)
- **Etiqueta B4:** "Número de cartas deseadas en el Deck"
- **Etiqueta B5:** "Segundo tipo de carta (Si aplica)"
- **Cartas reveladas:** Valor de B2 (1-6)
- **Caso de uso:** Cálculos personalizados para otros efectos

---

## 🎨 Características de Diseño

### Validación de Datos
- **B1:** Lista desplegable con 6 opciones de tipo de búsqueda
- **B2:** Lista desplegable con valores 1-6 (solo activo si B1 = "Elige otro número")

### Formato Condicional
1. **Celdas B10:B12** - Escala de colores (semáforo):
   - 🔴 Rojo: Probabilidades bajas (min)
   - 🟡 Amarillo: Probabilidades medias (50%)
   - 🟢 Verde: Probabilidades altas (max)

2. **Celda B2** - Se oculta si B1 ≠ "Elige otro número"

3. **Celda B5** - Se oculta si no aplica segundo tipo de carta

### Etiquetas Dinámicas
Las celdas A4, A5, A6, A10, A11, A12 contienen fórmulas `IF()` que cambian el texto según el tipo de búsqueda seleccionado, proporcionando contexto específico para cada caso de uso.

---

## 🔍 Comparación con Nuestra Implementación

### Similitudes ✅

1. **Fórmula base idéntica:** Ambas implementaciones usan la distribución hipergeométrica
2. **Enfoque de complemento:** Calculan `1 - P(ningún éxito)` en lugar de sumar todas las probabilidades
3. **Soporte multi-tipo:** Ambas permiten calcular probabilidades para diferentes tipos de cartas
4. **Validación de entrada:** Restricciones en los valores permitidos

### Diferencias 🔄

| Aspecto | Calculadora Excel | Nuestra App Angular |
|---------|-------------------|---------------------|
| **Interfaz** | Hoja de cálculo estática | Interfaz web reactiva |
| **Tipos de búsqueda** | 6 predefinidos | 4 predefinidos (Training, Memory, Specific Search, Plain Draw) |
| **Tracking de mazo** | Manual (usuario actualiza B3) | Automático con historial de remoción de cartas |
| **Persistencia** | Archivo local | LocalStorage en navegador |
| **Múltiples cartas** | 2 tipos máximo | Sin límite (lista de cartas con cantidades) |
| **Cálculo de reveladas** | Automático según tipo | Parámetro explícito configurable |
| **Visualización** | Porcentajes con formato condicional | Gráficos de barras animados con colores |
| **Configuración de mazo** | Valores directos en celdas | Interfaz de construcción de mazo completa |

---

## 📊 Validación de Fórmulas

### Caso de Prueba del Archivo Excel

**Configuración:**
- Tipo: Cool Boy
- Total cartas (N): 45
- Digimon con X Antibody (K₁): 4
- Options con X Antibody (K₂): 10
- Cartas reveladas (n): 3

**Cálculo manual:**

```
Total combinaciones:
C(45, 3) = 45! / (3! × 42!) = 14,190

Hit Digimon:
P(≥1 Digimon) = 1 - C(41, 3) / C(45, 3)
              = 1 - 10,660 / 14,190
              = 1 - 0.7512
              = 0.2488 = 24.88% ✅

Hit Option:
P(≥1 Option) = 1 - C(35, 3) / C(45, 3)
             = 1 - 6,545 / 14,190
             = 1 - 0.4612
             = 0.5388 = 53.88% ✅

Doble Hit:
P(≥1 de cada) = 1 - 0.7512 - 0.4612 + C(31, 3) / C(45, 3)
              = 1 - 0.7512 - 0.4612 + (4,495 / 14,190)
              = 1 - 0.7512 - 0.4612 + 0.3167
              = 0.1043 = 10.43% ✅
```

**Conclusión:** Las fórmulas son matemáticamente correctas y coinciden con nuestra implementación.

---

## 💡 Recomendaciones para Mejoras Futuras

### En la App Angular:

1. **Agregar preset de tipos de búsqueda del Excel**
   - Implementar los 6 tipos predefinidos (Cool Boy, Memory Boost, etc.)
   - Cada uno con sus cartas reveladas automáticas

2. **Cálculo de Doble Hit**
   - Agregar lógica para calcular probabilidad de encontrar al menos 1 de cada tipo usando inclusión-exclusión

3. **Etiquetas contextuales**
   - Cambiar dinámicamente las etiquetas según el tipo de búsqueda (como en Excel)

4. **Validación de coherencia**
   - Verificar que B4 + B5 ≤ B3 (no más cartas objetivo que total)
   - Mostrar advertencias si la configuración es inválida

5. **Exportar a Excel**
   - Funcionalidad para exportar configuración y resultados al formato del .xlsx

### En el Excel:

1. **Agregar más tipos de búsqueda**
   - Integrate más efectos del juego

2. **Historial de cálculos**
   - Tabla de resultados previos para comparación

3. **Gráficos visuales**
   - Chart con la distribución de probabilidades para cada cantidad de hits posibles

---

## 📝 Conclusiones

La calculadora Excel es una **herramienta robusta y bien diseñada** que implementa correctamente la distribución hipergeométrica con las siguientes fortalezas:

### ✅ Fortalezas:
- Fórmulas matemáticamente correctas
- Interfaz intuitiva con validación de datos
- Etiquetas dinámicas contextuales
- Formato condicional para interpretación rápida
- Soporte para múltiples métodos de búsqueda

### ⚠️ Limitaciones:
- Requiere actualización manual del estado del mazo
- Limitado a 2 tipos de cartas simultáneos
- Sin historial de cálculos previos
- No portátil (requiere Excel instalado)

### 🎯 Valor para el Proyecto:
Este archivo Excel sirve como **referencia de validación** perfecta para nuestra aplicación Angular. Podemos usar los mismos casos de prueba para garantizar que nuestros cálculos sean precisos. Además, identifica oportunidades de mejora en nuestra app, como agregar el cálculo de "Doble Hit" y los presets de búsqueda.

---

## 📚 Referencias

- **Distribución Hipergeométrica:** [Wikipedia](https://es.wikipedia.org/wiki/Distribuci%C3%B3n_hipergeom%C3%A9trica)
- **Principio de Inclusión-Exclusión:** Usado para calcular P(A ∪ B)
- **Combinatoria:** C(n,k) = n! / (k! × (n-k)!)

---

**Reporte generado por:** GitHub Copilot  
**Herramientas utilizadas:** PowerShell, XML parsing, análisis matemático
