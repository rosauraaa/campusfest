// Revisión rápida del sitio antes de las pruebas.
//   1. Existen los archivos que la app necesita.
//   2. Ningún archivo JavaScript tiene errores de sintaxis.
//   3. Los archivos que usa index.html existen.
//   4. Todo lo que app.js importa existe en logic.js y data.js.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const inGitHub = process.env.GITHUB_ACTIONS === 'true';
const problems = [];

function fail(file, message, line) {
  problems.push({ file, message, line });
}

function jsFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return jsFiles(path);
    return /\.(m?js)$/.test(entry.name) ? [path] : [];
  });
}

// 1. Archivos obligatorios
const required = ['src/index.html', 'src/css/styles.css', 'src/js/app.js', 'src/js/logic.js', 'src/js/data.js'];
for (const file of required) {
  if (!existsSync(file)) fail(file, 'Este archivo no existe y la app lo necesita. ¿Lo borraste o lo renombraste?');
}

// 2. Sintaxis de JavaScript
for (const file of [...jsFiles('src'), ...jsFiles('scripts'), ...jsFiles('tests')]) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    const output = result.stderr.trim().split(/\r?\n/);
    const line = output[0].match(/:(\d+)$/)?.[1];
    const reason = output.find((text) => text.startsWith('SyntaxError')) ?? output.at(-1);
    const code = output[1]?.trim();
    fail(file.replaceAll('\\', '/'), `Error de sintaxis: ${reason}${code ? `  →  ${code}` : ''}`, line);
  }
}

// 3. Archivos que usa index.html
if (existsSync('src/index.html')) {
  const html = readFileSync('src/index.html', 'utf8');
  for (const [, ref] of html.matchAll(/(?:href|src)="([^"#:]+)"/g)) {
    if (!existsSync(join('src', ref))) fail('src/index.html', `index.html usa "${ref}", pero ese archivo no existe.`);
  }
}

// 4. Lo que app.js importa debe existir
if (problems.length === 0) {
  const app = readFileSync('src/js/app.js', 'utf8');
  for (const [, names, from] of app.matchAll(/import\s*\{([^}]+)\}\s*from\s*'\.\/([^']+)'/g)) {
    try {
      const module = await import(pathToFileURL(join('src/js', from)).href);
      for (const name of names.split(',').map((n) => n.trim()).filter(Boolean)) {
        if (!(name in module)) fail(`src/js/${from}`, `app.js usa "${name}", pero src/js/${from} ya no lo exporta.`);
      }
    } catch (error) {
      fail(`src/js/${from}`, `No se pudo cargar: ${error.message}`);
    }
  }
}

console.log('\n🔎 Revisión del sitio CampusFest\n');
if (problems.length === 0) {
  console.log('  ✅ Archivos completos, sin errores de sintaxis y con todas las funciones disponibles.\n');
} else {
  for (const problem of problems) {
    console.log(`  ❌ ${problem.file}${problem.line ? `:${problem.line}` : ''}\n      → ${problem.message}`);
    if (inGitHub) {
      const location = `file=${relative('.', problem.file)}${problem.line ? `,line=${problem.line}` : ''}`;
      console.log(`::error ${location},title=Revisión del sitio::${problem.message}`);
    }
  }
  console.log(`\n${problems.length} problema(s). Corrígelos antes de seguir.\n`);
  process.exit(1);
}
