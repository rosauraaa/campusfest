// Reporter de pruebas en español, pensado para leerse fácil en los logs de GitHub Actions.
// Node lo usa así:  node --test --test-reporter=./scripts/reporter.mjs "tests/**/*.test.js"
import { appendFileSync } from 'node:fs';
import { relative } from 'node:path';

const inGitHub = process.env.GITHUB_ACTIONS === 'true';

function where(data) {
  if (!data.file) return '';
  const file = relative(process.cwd(), data.file).replaceAll('\\', '/');
  return data.line ? `${file}:${data.line}` : file;
}

function show(value) {
  return typeof value === 'string' ? `"${value}"` : JSON.stringify(value);
}

function describeError(error) {
  const cause = error?.cause ?? error;
  const lines = [];
  const message = String(cause?.message ?? cause).split('\n')[0];
  if (!message.startsWith('Expected values')) lines.push(message);
  // assert.ok compara true/false: mostrar "Se esperaba true" no ayuda, el mensaje ya explica el problema.
  if (cause && 'expected' in cause && 'actual' in cause && cause.operator !== '==') {
    lines.push(`Se esperaba: ${show(cause.expected)}`);
    lines.push(`Se obtuvo:   ${show(cause.actual)}`);
  }
  return lines;
}

function escapeAnnotation(text) {
  return text.replaceAll('%', '%25').replaceAll('\r', '').replaceAll('\n', '%0A');
}

export default async function* reporter(source) {
  const results = { pass: [], fail: [], skip: [] };
  yield '\n🧪 Pruebas de CampusFest\n\n';

  for await (const { type, data } of source) {
    if (data?.details?.type === 'suite') continue;

    if (type === 'test:pass') {
      if (data.skip) {
        results.skip.push(data.name);
        yield `  ⏸️  ${data.name}\n      (desactivada: quita .skip para activarla)\n`;
      } else {
        results.pass.push(data.name);
        yield `  ✅ ${data.name}\n`;
      }
    }

    if (type === 'test:fail') {
      const detail = describeError(data.details?.error);
      results.fail.push({ name: data.name, detail, where: where(data) });
      yield `  ❌ ${data.name}\n`;
      for (const line of detail) yield `      → ${line}\n`;
      if (where(data)) yield `      📄 ${where(data)}\n`;

      if (inGitHub) {
        const [file, line] = where(data).split(':');
        const location = file ? `file=${file}${line ? `,line=${line}` : ''},` : '';
        yield `::error ${location}title=Prueba fallida: ${escapeAnnotation(data.name)}::${escapeAnnotation(detail.join('\n'))}\n`;
      }
    }
  }

  yield `\nResumen: ${results.pass.length} pasaron · ${results.fail.length} fallaron · ${results.skip.length} desactivadas\n`;
  yield results.fail.length === 0
    ? '✅ Todo en verde.\n\n'
    : '❌ Hay pruebas en rojo. Lee el mensaje "Se esperaba / Se obtuvo" y corrige el código en src/.\n\n';

  if (inGitHub && process.env.GITHUB_STEP_SUMMARY) {
    const rows = [
      ...results.fail.map((f) => `| ❌ | ${f.name} | ${f.detail.join('<br>')} |`),
      ...results.pass.map((name) => `| ✅ | ${name} | |`),
      ...results.skip.map((name) => `| ⏸️ | ${name} | desactivada |`),
    ];
    const summary = [
      '## 🧪 Pruebas de CampusFest',
      '',
      `**${results.pass.length}** pasaron · **${results.fail.length}** fallaron · **${results.skip.length}** desactivadas`,
      '',
      '| | Prueba | Detalle |',
      '|---|---|---|',
      ...rows,
      '',
    ].join('\n');
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  }
}
