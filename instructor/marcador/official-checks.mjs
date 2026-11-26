// Pruebas oficiales del marcador. Son las mismas reglas que tests/bugs.test.js,
// pero viven aquí para que editar las pruebas del alumno no cambie el resultado.
import assert from 'node:assert/strict';

const event = (overrides) => ({ id: 'x', title: 'Evento', venue: 'Aula', categoryLabel: 'Feria', date: '2026-11-26', capacity: 10, registered: 0, price: 0, ...overrides });

function contrast(a, b) {
  const luminance = (hex) => {
    const [r, g, b2] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b2;
  };
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

export const CHECKS = [
  {
    id: 'bug0', label: 'Cupos', points: 20,
    run: ({ spotsLeft, isFull }) => {
      const e = event({ capacity: 30, registered: 33 });
      assert.equal(spotsLeft(e), 0);
      assert.equal(isFull(e), true);
      assert.equal(spotsLeft(event({ capacity: 30, registered: 10 })), 20);
    },
  },
  {
    id: 'bug1', label: 'Orden', points: 10,
    run: ({ sortByDate }) => {
      const sorted = sortByDate([event({ id: 'c', date: '2026-12-02' }), event({ id: 'a', date: '2026-11-23' }), event({ id: 'b', date: '2026-11-27' })]);
      assert.deepEqual(sorted.map((e) => e.id), ['a', 'b', 'c']);
    },
  },
  {
    id: 'bug2', label: 'Búsqueda', points: 10,
    run: ({ matchesSearch }) => {
      const e = event({ title: 'Brazo robótico con Arduino', categoryLabel: 'Robótica' });
      assert.equal(matchesSearch(e, 'robotica'), true);
      assert.equal(matchesSearch(e, 'ROBÓTICO'), true);
      assert.equal(matchesSearch(e, 'ajedrez'), false);
    },
  },
  {
    id: 'bug3', label: 'Mes', points: 10,
    run: ({ formatShortDate }) => {
      assert.equal(formatShortDate('2026-11-24'), '24/11');
      assert.equal(formatShortDate('2026-12-02'), '02/12');
    },
  },
  {
    id: 'bug4', label: 'Gratis', points: 10,
    run: ({ formatPrice }) => {
      assert.equal(formatPrice(0), 'Gratis');
      assert.equal(formatPrice(50), '$50');
    },
  },
  {
    id: 'bug5', label: 'Singular', points: 10,
    run: ({ spotsLabel }) => {
      assert.equal(spotsLabel(event({ capacity: 120, registered: 119 })), '1 lugar');
      assert.equal(spotsLabel(event({ capacity: 20, registered: 12 })), '8 lugares');
    },
  },
  {
    id: 'bug6', label: 'Finalizado', points: 10,
    run: ({ countdownLabel }) => {
      assert.equal(countdownLabel('2026-11-23', '2026-11-26'), 'Finalizado');
      assert.equal(countdownLabel('2026-11-30', '2026-11-26'), 'Faltan 4 días');
      assert.equal(countdownLabel('2026-11-26', '2026-11-26'), 'Hoy');
    },
  },
  {
    id: 'bug7', label: 'Contraste', points: 10,
    run: (_logic, css) => {
      const muted = css.match(/--text-muted:\s*(#[0-9a-fA-F]{6})/)?.[1];
      const surface = css.match(/--surface:\s*(#[0-9a-fA-F]{6})/)?.[1];
      assert.ok(muted && surface);
      assert.ok(contrast(muted, surface) >= 4.5);
    },
  },
];
