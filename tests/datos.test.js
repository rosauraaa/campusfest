// Pruebas base: siempre activas. Deben pasar desde el primer día.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORIES, EVENTS, WEEK } from '../src/js/data.js';
import { daysUntil, filterEvents, weekdayName } from '../src/js/logic.js';

test('Cada evento tiene los datos completos', () => {
  for (const event of EVENTS) {
    assert.ok(event.id, 'falta el id');
    assert.ok(event.title, `falta el título en ${event.id}`);
    assert.match(event.date, /^\d{4}-\d{2}-\d{2}$/, `fecha inválida en ${event.id}`);
    assert.match(event.time, /^\d{2}:\d{2}$/, `hora inválida en ${event.id}`);
    assert.ok(event.capacity > 0, `el cupo debe ser mayor a 0 en ${event.id}`);
    assert.ok(event.price >= 0, `el precio no puede ser negativo en ${event.id}`);
  }
});

test('No hay eventos repetidos', () => {
  const ids = EVENTS.map((event) => event.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('Cada evento pertenece a una categoría existente', () => {
  const valid = CATEGORIES.map((category) => category.id);
  for (const event of EVENTS) {
    assert.ok(valid.includes(event.category), `categoría desconocida: ${event.category}`);
  }
});

test('La semana va del lunes 23 al viernes 27', () => {
  assert.deepEqual(WEEK.map(weekdayName), ['Lun', 'Mar', 'Mié', 'Jue', 'Vie']);
});

test('daysUntil cuenta los días entre dos fechas', () => {
  assert.equal(daysUntil('2026-11-27', '2026-11-26'), 1);
  assert.equal(daysUntil('2026-11-26', '2026-11-26'), 0);
});

test('El filtro por categoría muestra solo esa categoría', () => {
  const result = filterEvents(EVENTS, { category: 'robotica' });
  assert.ok(result.length > 0);
  assert.ok(result.every((event) => event.category === 'robotica'));
});
