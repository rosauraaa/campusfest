// Servidor local sin dependencias para ver CampusFest.
// Uso:  node scripts/serve.mjs            -> sirve src/ en http://localhost:5173
//       node scripts/serve.mjs --dist     -> sirve dist/ (después de npm run build)
//       node scripts/serve.mjs --lan      -> también visible en la red local (plan B del taller)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { networkInterfaces } from 'node:os';
import { extname, join, normalize, resolve } from 'node:path';

const args = process.argv.slice(2);
const root = resolve(args.includes('--dist') ? 'dist' : 'src');
const host = args.includes('--lan') ? '0.0.0.0' : '127.0.0.1';
const port = Number(process.env.PORT ?? 5173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    let filePath = normalize(join(root, decodeURIComponent(url.pathname)));
    if (!filePath.startsWith(root)) {
      response.writeHead(403).end('Prohibido');
      return;
    }
    if ((await stat(filePath).catch(() => null))?.isDirectory()) {
      filePath = join(filePath, 'index.html');
    }
    const body = await readFile(filePath);
    response.writeHead(200, { 'Content-Type': TYPES[extname(filePath)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('No encontrado');
  }
});

server.listen(port, host, () => {
  console.log(`\nCampusFest sirviendo ${root}`);
  console.log(`  Local:  http://localhost:${port}/?hoy=2026-11-26`);
  if (host === '0.0.0.0') {
    for (const list of Object.values(networkInterfaces())) {
      for (const net of list ?? []) {
        if (net.family === 'IPv4' && !net.internal) console.log(`  Red:    http://${net.address}:${port}/?hoy=2026-11-26`);
      }
    }
  }
  console.log('\nCtrl+C para detener.\n');
});
