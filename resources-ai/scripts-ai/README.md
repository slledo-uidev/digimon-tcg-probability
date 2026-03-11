# AI Context Scripts

Scripts y documentos para proporcionar contexto rápido y específico a la IA en futuras sesiones.

## Propósito

Facilitar la comprensión rápida de:
- Mecánicas específicas del juego
- Fórmulas matemáticas con ejemplos
- Arquitectura del código
- Tareas comunes paso a paso
- Convenciones del proyecto
- Soluciones a problemas frecuentes

## Archivos Sugeridos

### `digimon-tcg-mechanics.md`
Explicación detallada de las mecánicas del juego que la app debe modelar:
- Estructura del mazo (50 cartas)
- Tipos de cartas (Digimón, Tamer, Opción)
- Colores disponibles
- Mecánicas de búsqueda (Training, Memory, etc.)
- Restricciones (4 copias máximo por carta)

### `probability-formulas.md`
Fórmulas matemáticas con ejemplos trabajados:
```markdown
# Distribución Hipergeométrica

## Fórmula
P(X = k) = [C(K,k) × C(N-K, n-k)] / C(N,n)

## Ejemplo
Mazo de 50 cartas, 4 copias de "Agumon", robar 5 cartas.
¿Probabilidad de encontrar al menos 1?

N = 50, K = 4, n = 5
P(X ≥ 1) = 1 - P(X = 0)
...
```

### `component-structure.md`
Explicación de cómo interactúan los componentes:
- Flujo de datos
- Servicios compartidos
- Eventos y outputs
- Estado reactivo

### `common-tasks.md`
Guías paso a paso:
- Agregar un nuevo método de búsqueda
- Agregar una nueva categoría de carta
- Modificar estilos siguiendo BEM
- Agregar validación a formularios
- Depurar cálculos de probabilidad

### `coding-conventions.md`
Convenciones específicas del proyecto:
- Nomenclatura de componentes
- Estructura de archivos
- Comentarios en código
- Commits messages
- BEM para CSS

### `troubleshooting.md`
Problemas comunes y soluciones:
- Compilación falla
- Estado no se actualiza
- LocalStorage no persiste
- Resultados incorrectos

## Formato

Preferiblemente Markdown (`.md`) para facilitar la lectura y actualización.

## Uso

Para dar contexto a la IA:
1. Copiar el contenido relevante
2. Pegarlo al inicio de la conversación
3. Hacer referencia a secciones específicas cuando sea necesario

---

*Última actualización: 11 de Marzo 2026*
