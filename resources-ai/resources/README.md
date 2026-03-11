# Resources

Materiales de referencia y documentación técnica para entender el contexto del proyecto.

## Contenido Esperado

- Cálculos de probabilidad con ejemplos
- Documentación de mecánicas de Digimon TCG
- Fórmulas matemáticas explicadas en detalle
- Casos de prueba con resultados esperados
- Referencias a reglas oficiales del juego
- Hojas de cálculo con validaciones
- Documentos de investigación

## Archivos Sugeridos

### `probability-examples.xlsx`
Excel con ejemplos de cálculos:
- Columna A: Tamaño de mazo (N)
- Columna B: Cartas objetivo (K)
- Columna C: Cartas a buscar (n)
- Columna D: Probabilidad calculada
- Comparar con resultados de la app

### `digimon-tcg-rules.pdf`
Reglas oficiales o resumen de mecánicas relevantes

### `hypergeometric-formula.md`
Explicación detallada de la fórmula:
```
P(X = k) = [C(K,k) × C(N-K, n-k)] / C(N,n)

Donde:
- N = Total de cartas en el mazo
- K = Total de cartas objetivo en el mazo
- n = Cantidad de cartas a buscar/robar
- k = Cantidad exacta de cartas objetivo buscadas
```

### `search-methods-explained.md`
Documentación de cada método de búsqueda:
- Training: Cómo funciona, cuántas cartas, restricciones
- Memory: Variantes (3 o 4 cartas), categorías
- Buscadores específicos: Ejemplos de cartas
- Robo plano: Casos de uso

## Formato Recomendado

- Excel/CSV para datos tabulares
- Markdown para documentación
- PDF para documentos oficiales
- JSON para datos estructurados

---

*Última actualización: 11 de Marzo 2026*
