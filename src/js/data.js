// Datos ficticios de la Semana de Ingeniería.
// Todas las personas, lugares y eventos son inventados para el taller.

export const WEEK = ['2026-11-23', '2026-11-24', '2026-11-25', '2026-11-26', '2026-11-27'];

export const CATEGORIES = [
  { id: 'hackathon', label: 'Hackathon', icon: 'i-hack' },
  { id: 'robotica', label: 'Robótica', icon: 'i-robo' },
  { id: 'conferencias', label: 'Conferencias', icon: 'i-conf' },
  { id: 'esports', label: 'E-sports', icon: 'i-esp' },
  { id: 'feria', label: 'Feria', icon: 'i-feria' },
];

const RAW_EVENTS = [
  { id: 'mini-hackathon', title: 'Mini hackathon: apps para el campus', category: 'hackathon', date: '2026-11-23', time: '09:00', venue: 'Laboratorio de Cómputo B', capacity: 40, registered: 31, price: 0 },
  { id: 'mario-kart', title: 'Torneo de Mario Kart', category: 'esports', date: '2026-11-23', time: '18:00', venue: 'Sala de usos múltiples', capacity: 32, registered: 32, price: 30 },
  { id: 'minisumo', title: 'Batalla de minisumo', category: 'robotica', date: '2026-11-24', time: '16:00', venue: 'Gimnasio universitario', capacity: 30, registered: 33, price: 50 },
  { id: 'git-desde-cero', title: 'Taller: Git desde cero', category: 'hackathon', date: '2026-11-25', time: '13:00', venue: 'Aula C24', capacity: 25, registered: 19, price: 0 },
  { id: 'ia-industria', title: 'IA en la industria: ¿herramienta o reemplazo?', category: 'conferencias', date: '2026-11-26', time: '12:00', venue: 'Auditorio A', capacity: 120, registered: 119, price: 0 },
  { id: 'brazo-robotico', title: 'Brazo robótico con Arduino', category: 'robotica', date: '2026-11-26', time: '15:00', venue: 'Laboratorio de Mecatrónica', capacity: 20, registered: 12, price: 120 },
  { id: 'codigo-entrega', title: 'Del código a la entrega con GitHub Actions', category: 'conferencias', date: '2026-11-26', time: '17:00', venue: 'Auditorio B', capacity: 80, registered: 41, price: 0 },
  { id: 'feria-proyectos', title: 'Feria de proyectos de ingeniería', category: 'feria', date: '2026-11-27', time: '10:00', venue: 'Explanada central', capacity: 300, registered: 140, price: 0 },
  { id: 'rocket-league', title: 'Torneo de Rocket League', category: 'esports', date: '2026-11-27', time: '18:00', venue: 'Sala de usos múltiples', capacity: 32, registered: 20, price: 80 },
  { id: 'posada-proyectos', title: 'Posada de proyectos', category: 'feria', date: '2026-12-02', time: '17:00', venue: 'Explanada central', capacity: 200, registered: 64, price: 0 },
];

export const EVENTS = RAW_EVENTS.map((event) => ({
  ...event,
  categoryLabel: CATEGORIES.find((category) => category.id === event.category).label,
}));
