// Compila CampusFest: copia src/ a dist/ y marca la versión.
// No hay framework: "compilar" aquí es preparar exactamente lo que se publica.
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

function gitCommit() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7);
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return 'local';
  }
}

const version = process.env.GITHUB_RUN_NUMBER ? `${pkg.version}+${process.env.GITHUB_RUN_NUMBER}` : `${pkg.version}-local`;
const commit = gitCommit();
const builtAt = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City', dateStyle: 'medium', timeStyle: 'short' });

if (existsSync('dist')) rmSync('dist', { recursive: true, force: true });
cpSync('src', 'dist', { recursive: true });

const html = readFileSync('dist/index.html', 'utf8')
  .replace('{{VERSION}}', version)
  .replace('{{COMMIT}}', commit)
  .replace('{{FECHA}}', builtAt);
writeFileSync('dist/index.html', html);

// El marcador del taller lee este archivo para saber qué versión está publicada.
writeFileSync('dist/version.json', JSON.stringify({
  app: 'campusfest',
  version,
  commit,
  builtAt: new Date().toISOString(),
  repository: process.env.GITHUB_REPOSITORY ?? 'local',
}, null, 2));

console.log('\n📦 CampusFest compilado en dist/');
console.log(`   Versión: ${version}`);
console.log(`   Commit:  ${commit}`);
console.log(`   Fecha:   ${builtAt}\n`);
