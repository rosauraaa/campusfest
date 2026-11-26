// Corre las pruebas oficiales contra el código descargado de UN alumno.
// El servidor lo ejecuta en un proceso aparte con --permission (sin escribir disco ni lanzar procesos)
// y con límite de tiempo, porque es código ajeno.
// Uso: node --permission --allow-fs-read=... runner.mjs <carpeta-del-alumno>
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { CHECKS } from './official-checks.mjs';

const dir = process.argv[2];
const results = {};

let logic = {};
let css = '';
try {
  logic = await import(pathToFileURL(join(dir, 'logic.js')).href);
} catch (error) {
  results.loadError = `logic.js no carga: ${error.message}`;
}
try {
  css = readFileSync(join(dir, 'styles.css'), 'utf8');
} catch {
  css = '';
}

for (const check of CHECKS) {
  try {
    await check.run(logic, css);
    results[check.id] = true;
  } catch {
    results[check.id] = false;
  }
}

process.stdout.write(JSON.stringify(results));
