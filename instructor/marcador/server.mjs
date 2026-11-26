// Marcador en vivo del taller (solo para el instructor).
//
// Uso (PowerShell):
//   Remove-Item Env:GH_TOKEN -ErrorAction SilentlyContinue   # solo en esta ventana: usa la cuenta personal
//   $env:GITHUB_TOKEN = (gh auth token)           # token de tu cuenta PERSONAL (opcional, evita límites de la API)
//   $env:MARCADOR_ISSUE = "iDiegoIbarra/campusfest#1"  # Issue donde los alumnos comentan su usuario
//   node instructor/marcador/server.mjs
//   Abre http://localhost:8080 en el proyector.
//
// Plan B sin Issue: escribe un usuario por línea en instructor/marcador/participantes.txt
// Plan B sin Pages: agrega --fuente=raw para leer el código de la rama main en lugar del sitio publicado.
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHECKS } from './official-checks.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 8080);
const TOKEN = process.env.GITHUB_TOKEN ?? '';
const ISSUE = process.env.MARCADOR_ISSUE ?? '';
const REPO_NAME = process.env.MARCADOR_REPO_NAME ?? 'campusfest';
const SOURCE = process.argv.includes('--fuente=raw') ? 'raw' : 'pages';
const REFRESH_MS = 45_000;
const API_EVERY_MS = TOKEN ? 60_000 : 10 * 60_000;
const STATE_FILE = join(HERE, 'state.json');
const WORK_DIR = join(tmpdir(), 'campusfest-marcador');

const POINTS = { deployed: 10, pr: 5, release: 5 };
const MAX = POINTS.deployed + POINTS.pr + POINTS.release + CHECKS.reduce((sum, c) => sum + c.points, 0);

const state = existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE, 'utf8')) : { players: {} };
let lastRun = null;
let lastError = null;

// ---------- Utilidades ----------

async function get(url, { api = false, timeout = 8000 } = {}) {
  const headers = { 'User-Agent': 'campusfest-marcador', 'Cache-Control': 'no-cache' };
  if (api) {
    headers.Accept = 'application/vnd.github+json';
    if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  }
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(timeout) });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response;
}

function parsePlayer(text) {
  const clean = text.trim();
  const pages = clean.match(/https?:\/\/([a-z0-9-]+)\.github\.io\/([\w.-]+)/i);
  if (pages) return { user: pages[1].toLowerCase(), repo: pages[2] };
  const slash = clean.match(/@?([a-z0-9-]{1,39})\/([\w.-]+)/i);
  if (slash) return { user: slash[1].toLowerCase(), repo: slash[2] };
  const plain = clean.match(/@?([a-z0-9-]{1,39})/i);
  return plain ? { user: plain[1].toLowerCase(), repo: REPO_NAME } : null;
}

async function loadParticipants() {
  const players = new Map();
  const file = join(HERE, 'participantes.txt');
  if (existsSync(file)) {
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const player = line.trim() && !line.startsWith('#') ? parsePlayer(line) : null;
      if (player) players.set(player.user, player);
    }
  }
  const match = ISSUE.match(/^([\w.-]+)\/([\w.-]+)#(\d+)$/);
  if (match) {
    const [, owner, repo, number] = match;
    const comments = await (await get(`https://api.github.com/repos/${owner}/${repo}/issues/${number}/comments?per_page=100`, { api: true })).json();
    for (const comment of comments) {
      const player = parsePlayer(comment.body.split(/\s/).find(Boolean) ?? '') ?? { user: comment.user.login.toLowerCase(), repo: REPO_NAME };
      if (!players.has(player.user)) players.set(player.user, player);
    }
  }
  return [...players.values()];
}

// ---------- Evaluación de un alumno ----------

function runOfficialChecks(dir) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [
      '--permission',
      `--allow-fs-read=${HERE}`,
      `--allow-fs-read=${dir}`,
      join(HERE, 'runner.mjs'),
      dir,
    ], { timeout: 5000, stdio: ['ignore', 'pipe', 'ignore'] });
    let output = '';
    child.stdout.on('data', (chunk) => { output += chunk; });
    child.on('close', () => {
      try { resolve(JSON.parse(output)); } catch { resolve({ loadError: 'Tiempo agotado o error al evaluar.' }); }
    });
  });
}

async function evaluate({ user, repo }) {
  const previous = state.players[user] ?? {};
  const result = { user, repo, url: `https://${user}.github.io/${repo}/`, checks: {}, deployed: false, pr: previous.pr ?? false, release: previous.release ?? false };
  const bust = `?t=${Date.now()}`;
  const base = SOURCE === 'raw' ? `https://raw.githubusercontent.com/${user}/${repo}/main/src/` : `${result.url}`;

  try {
    const version = await (await get(`${result.url}version.json${bust}`)).json();
    result.deployed = version.app === 'campusfest';
    result.commit = version.commit;
  } catch {
    result.deployed = false;
  }

  if (result.deployed || SOURCE === 'raw') {
    const dir = join(WORK_DIR, user);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'package.json'), '{"type":"module"}');
    try {
      for (const [remote, local] of [['js/logic.js', 'logic.js'], ['js/data.js', 'data.js'], ['css/styles.css', 'styles.css']]) {
        let text = '';
        try {
          text = await (await get(`${base}${remote}${bust}`)).text();
        } catch {
          // Un archivo faltante solo hace fallar las pruebas que lo necesitan.
        }
        writeFileSync(join(dir, local), text);
      }
      result.checks = await runOfficialChecks(dir);
    } catch (error) {
      result.checks = { loadError: error.message };
    }
  }

  const now = Date.now();
  if (!previous.apiCheckedAt || now - previous.apiCheckedAt > API_EVERY_MS) {
    try {
      const pulls = await (await get(`https://api.github.com/repos/${user}/${repo}/pulls?state=closed&per_page=30`, { api: true })).json();
      result.pr = pulls.some((pull) => pull.merged_at);
      const releases = await (await get(`https://api.github.com/repos/${user}/${repo}/releases?per_page=10`, { api: true })).json();
      result.release = releases.some((release) => release.tag_name.startsWith('respaldo-'));
      result.apiCheckedAt = now;
    } catch {
      result.apiCheckedAt = previous.apiCheckedAt;
    }
  } else {
    result.apiCheckedAt = previous.apiCheckedAt;
  }

  result.score = (result.deployed ? POINTS.deployed : 0)
    + (result.pr ? POINTS.pr : 0)
    + (result.release ? POINTS.release : 0)
    + CHECKS.reduce((sum, check) => sum + (result.checks[check.id] === true ? check.points : 0), 0);

  // Desempate: gana quien llegó primero a su puntaje actual.
  result.reachedAt = result.score > (previous.score ?? -1) ? now : previous.reachedAt ?? now;
  if (result.score < (previous.score ?? 0)) result.reachedAt = now;
  return result;
}

// ---------- Ciclo ----------

async function refresh() {
  try {
    const participants = await loadParticipants();
    const queue = [...participants];
    const workers = Array.from({ length: 5 }, async () => {
      while (queue.length) {
        const player = queue.shift();
        state.players[player.user] = await evaluate(player);
      }
    });
    await Promise.all(workers);
    for (const user of Object.keys(state.players)) {
      if (!participants.some((p) => p.user === user)) delete state.players[user];
    }
    writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
    lastError = null;
  } catch (error) {
    lastError = error.message;
    console.error('Error al actualizar:', error.message);
  }
  lastRun = new Date().toISOString();
  setTimeout(refresh, REFRESH_MS);
}

function ranking() {
  return Object.values(state.players).sort((a, b) => b.score - a.score || a.reachedAt - b.reachedAt);
}

createServer((request, response) => {
  if (request.url.startsWith('/api/marcador')) {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(JSON.stringify({ lastRun, lastError, source: SOURCE, max: MAX, checks: CHECKS.map(({ id, label, points }) => ({ id, label, points })), players: ranking() }));
    return;
  }
  const file = request.url === '/' || request.url.startsWith('/?') ? 'index.html' : null;
  const fontPath = join(HERE, '..', '..', 'src', 'fonts', 'Outfit-Variable.ttf');
  if (request.url === '/fonts/Outfit-Variable.ttf' && existsSync(fontPath)) {
    response.writeHead(200, { 'Content-Type': 'font/ttf' });
    response.end(readFileSync(fontPath));
    return;
  }
  if (!file) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(readFileSync(join(HERE, file)));
}).listen(PORT, () => {
  console.log(`\n🏁 Marcador CampusFest en http://localhost:${PORT}`);
  console.log(`   Participantes: ${ISSUE || '(sin Issue)'}${existsSync(join(HERE, 'participantes.txt')) ? ' + participantes.txt' : ''}`);
  console.log(`   Fuente del código: ${SOURCE === 'raw' ? 'rama main (plan B)' : 'sitio publicado en GitHub Pages'}`);
  console.log(`   Token de GitHub: ${TOKEN ? 'sí' : 'no (la API se consulta cada 10 min)'}\n`);
  refresh();
});
