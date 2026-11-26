// A tiny static server for app/ (Node 22, standard library only), so the
// site can be run locally without a build step: `node serve.ts` serves
// app/ on http://localhost:8080 (`--port <n>` for another port). It sends
// the MIME types a browser needs, refuses any path outside app/, and
// otherwise does nothing clever: this is a development convenience, not a
// web server for the internet.
import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('./app', import.meta.url)));

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

function pickPort() {
  const args = process.argv.slice(2);
  const at = args.indexOf('--port');
  const wanted = at === -1 ? 8080 : Number(args[at + 1]);
  return Number.isInteger(wanted) && wanted > 0 && wanted < 65536 ? wanted : 8080;
}

// Resolve a request path to a file under app/, or null when it escapes.
function resolveFile(requestPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(requestPath);
  } catch {
    return null;
  }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = resolve(join(root, normalize(pathname)));
  if (file !== root && !file.startsWith(root + sep)) return null;
  try {
    if (!statSync(file).isFile()) return null;
  } catch {
    return null;
  }
  return file;
}

const port = pickPort();

createServer((request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');
  const file = resolveFile(url.pathname);
  if (!file) {
    response.writeHead(404).end('not found');
    return;
  }
  const size = statSync(file).size;
  response.writeHead(200, {
    'content-type': MIME_TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
    'content-length': size,
    'cache-control': 'no-store',
  });
  createReadStream(file).pipe(response);
}).listen(port, '127.0.0.1', () => {
  console.log(`app/ is on http://localhost:${port}`);
});
