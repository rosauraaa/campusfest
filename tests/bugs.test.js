// Pruebas de los bugs de CampusFest.
//
// Cada bug tiene una prueba desactivada con test.skip.
//   1. Quita ".skip" de la prueba de tu bug.
//   2. Haz commit: el check "1 · Validar" se pondrá en ROJO (el bug existe).
//   3. Corrige el código en src/ hasta que el check se ponga en VERDE.
//
// No cambies lo que espera la prueba: corrige el código.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  countdownLabel,
  formatPrice,
  formatShortDate,
  isFull,
  matchesSearch,
  sortByDate,
  spotsLabel,
  spotsLeft,
} from '../src/js/logic.js';

const event = (overrides) => ({ id: 'x', title: 'Evento', venue: 'Aula', categoryLabel: 'Feria', date: '2026-11-26', capacity: 10, registered: 0, price: 0, ...overrides });

test.skip('[BUG-0 · guiado] Los cupos nunca son negativos y un evento sobrevendido está lleno', () => {
  const sobrevendido = event({ capacity: 30, registered: 33 });
  assert.equal(spotsLeft(sobrevendido), 0, 'spotsLeft no debe regresar números negativos');
  assert.equal(isFull(sobrevendido), true, 'un evento con más inscritos que cupo debe estar lleno');
});

test.skip('[BUG-1] Los eventos se ordenan por fecha real (noviembre antes que diciembre)', () => {
  const ordenados = sortByDate([
    event({ id: 'posada', date: '2026-12-02' }),
    event({ id: 'hackathon', date: '2026-11-23' }),
    event({ id: 'feria', date: '2026-11-27' }),
  ]);
  assert.deepEqual(ordenados.map((e) => e.id), ['hackathon', 'feria', 'posada']);
});

test.skip('[BUG-2] La búsqueda ignora acentos y mayúsculas', () => {
  const brazo = event({ title: 'Brazo robótico con Arduino', categoryLabel: 'Robótica' });
  assert.equal(matchesSearch(brazo, 'robotica'), true, '"robotica" debe encontrar "Robótica"');
  assert.equal(matchesSearch(brazo, 'ROBÓTICO'), true, '"ROBÓTICO" debe encontrar "robótico"');
});

test.skip('[BUG-3] La fecha corta muestra el mes correcto', () => {
  assert.equal(formatShortDate('2026-11-24'), '24/11');
  assert.equal(formatShortDate('2026-12-02'), '02/12');
});

test.skip('[BUG-4] Un evento sin costo dice "Gratis"', () => {
  assert.equal(formatPrice(0), 'Gratis');
  assert.equal(formatPrice(50), '$50');
});

test.skip('[BUG-5] "1 lugar" en singular', () => {
  assert.equal(spotsLabel(event({ capacity: 120, registered: 119 })), '1 lugar');
  assert.equal(spotsLabel(event({ capacity: 20, registered: 12 })), '8 lugares');
});

test.skip('[BUG-6] Un evento que ya pasó dice "Finalizado"', () => {
  assert.equal(countdownLabel('2026-11-23', '2026-11-26'), 'Finalizado');
  assert.equal(countdownLabel('2026-11-30', '2026-11-26'), 'Faltan 4 días');
});

test.skip('[BUG-7] El texto secundario se puede leer (contraste mínimo 4.5:1)', () => {
  const css = readFileSync(new URL('../src/css/styles.css', import.meta.url), 'utf8');
  const muted = css.match(/--text-muted:\s*(#[0-9a-fA-F]{6})/)?.[1];
  const surface = css.match(/--surface:\s*(#[0-9a-fA-F]{6})/)?.[1];
  assert.ok(muted && surface, 'no encontré --text-muted o --surface en styles.css');
  const ratio = contrast(muted, surface);
  assert.ok(ratio >= 4.5, `el contraste de --text-muted es ${ratio.toFixed(2)}:1; necesita al menos 4.5:1`);
});

// Contraste WCAG entre dos colores hex.
function contrast(a, b) {
  const luminance = (hex) => {
    const [r, g, b2] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b2;
  };
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}
