// Lógica de CampusFest: funciones puras, sin DOM.
// La app (app.js) y las pruebas (tests/) usan estas mismas funciones.

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Convierte "2026-11-24" en una fecha a mediodía para evitar problemas de zona horaria.
function toDate(dateStr) {
  return new Date(`${dateStr}T12:00:00`);
}

function pad(number) {
  return String(number).padStart(2, '0');
}

// ---------- Cupos ----------

export function spotsLeft(event) {
  return Math.max(0, event.capacity - event.registered);
}

export function isFull(event) {
  return spotsLeft(event) === 0;
}

export function spotsLabel(event) {
  if (isFull(event)) {
    return 'Cupo lleno';
  }
  return `${spotsLeft(event)} lugares`;
}

// ---------- Precio ----------

export function formatPrice(price) {
  return `$${price}`;
}

// ---------- Fechas ----------

export function formatShortDate(dateStr) {
  const date = toDate(dateStr);
  return `${pad(date.getDate())}/${pad(date.getMonth())}`;
}

export function weekdayName(dateStr) {
  return WEEKDAYS[toDate(dateStr).getDay()];
}

export function daysUntil(dateStr, todayStr) {
  return Math.round((toDate(dateStr) - toDate(todayStr)) / MS_PER_DAY);
}

export function countdownLabel(dateStr, todayStr) {
  const days = daysUntil(dateStr, todayStr);
  if (days === 0) {
    return 'Hoy';
  }
  if (days === 1) {
    return 'Mañana';
  }
  return `Faltan ${days} días`;
}

export function sortByDate(events) {
  return [...events].sort((a, b) =>
    formatShortDate(a.date).localeCompare(formatShortDate(b.date)),
  );
}

// ---------- Búsqueda y filtros ----------

export function matchesSearch(event, query) {
  const text = `${event.title} ${event.venue} ${event.categoryLabel}`.toLowerCase();
  return text.includes(query.trim().toLowerCase());
}

export function filterEvents(events, { query = '', category = 'todas', day = null, onlyMine = false, mine = [] } = {}) {
  return events.filter((event) => {
    if (category !== 'todas' && event.category !== category) return false;
    if (day && event.date !== day) return false;
    if (onlyMine && !mine.includes(event.id)) return false;
    if (query && !matchesSearch(event, query)) return false;
    return true;
  });
}
