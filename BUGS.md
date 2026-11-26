# Bugs de CampusFest

Cada bug **se ve en la app** y tiene una prueba desactivada en `tests/bugs.test.js`.

**Ciclo para cada bug:** crea una rama → quita `.skip` de su prueba → abre un PR → **rojo** ❌ → corrige el código en `src/` → **verde** ✅ → merge → se publica.

> No cambies lo que la prueba espera. El marcador usa **pruebas oficiales** sobre tu sitio publicado: si “arreglas” la prueba en lugar del código, no suma puntos.

| Bug | Lo que ves en la app | Dónde buscar | Puntos |
|---|---|---|---|
| **BUG-0 · guiado** | La Batalla de minisumo dice **“-3 lugares”** y sigue dejando inscribirse | `src/js/logic.js` → `spotsLeft` | 20 |
| **BUG-1** | La **Posada de proyectos** (diciembre) aparece **antes** que los eventos de noviembre | `src/js/logic.js` → `sortByDate` | 10 |
| **BUG-2** | Buscar **robotica** no encuentra nada, pero **Robótica** sí | `src/js/logic.js` → `matchesSearch` | 10 |
| **BUG-3** | Las fechas dicen **24/10**, pero la semana es en **noviembre** | `src/js/logic.js` → `formatShortDate` | 10 |
| **BUG-4** | Los eventos sin costo dicen **“$0”** en lugar de **“Gratis”** | `src/js/logic.js` → `formatPrice` | 10 |
| **BUG-5** | La conferencia de IA dice **“1 lugares”** | `src/js/logic.js` → `spotsLabel` | 10 |
| **BUG-6** | Los eventos que ya pasaron dicen **“Faltan -3 días”** | `src/js/logic.js` → `countdownLabel` | 10 |
| **BUG-7** | La hora y el lugar de cada evento casi **no se leen** (gris muy claro) | `src/css/styles.css` → `--text-muted` | 10 |

## Pistas (por si te atoras)

<details><summary>BUG-0</summary>Un número nunca debe bajar de 0. Busca <code>Math.max</code>.</details>
<details><summary>BUG-1</summary>Se compara el texto “dd/mm”. Las fechas originales vienen como “2026-11-24”: ese formato sí se ordena bien como texto.</details>
<details><summary>BUG-2</summary>“ó” y “o” son letras distintas. Busca <code>normalize('NFD')</code> para quitar acentos.</details>
<details><summary>BUG-3</summary>En JavaScript, <code>getMonth()</code> empieza en 0 (enero = 0).</details>
<details><summary>BUG-4</summary>Si el precio es 0, regresa otra palabra.</details>
<details><summary>BUG-5</summary>Cuando queda exactamente 1, la palabra va en singular.</details>
<details><summary>BUG-6</summary>¿Qué pasa cuando <code>days</code> es negativo?</details>
<details><summary>BUG-7</summary>El texto normal necesita un contraste de al menos 4.5:1 contra el fondo blanco. Prueba un gris más oscuro y revisa el mensaje de la prueba.</details>
