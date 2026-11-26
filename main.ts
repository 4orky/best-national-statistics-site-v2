// Japan in Numbers — the entrypoint for the best-national-statistics-site
// bounty (Node 22, standard library only).
//
// The site itself is the static files in app/ beside this file: open
// app/index.html in a browser (ES modules and CSS, no build step, no
// network requests at all) and it runs. This program is only the handoff:
// it copies app/ and screenshots/ into the output directory and writes
// /output/dossier.json, the summary the judge reads — the screenshots,
// the files and bytes of the first load, and the source — using the
// vendored make.fun library. Leave vendor/makefun-frontend.ts alone:
// the scorer requires dossier.json to be byte for byte what its own
// copy of that library writes.
//
// Run it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The scorer's own caps (reference/gate.json). Only text_max_bytes
// changes the bytes; the rest refuse an entry the scorer would refuse:
// more than 4 screenshots, or one over 256 KiB; more than 993 files and
// directories in app/, or 16 MiB of app files — app/ counts beside the
// output's own 1000-entry cap, its screenshots/ and dossier.json.
const DOSSIER_OPTIONS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copySiteFiles() {
  mkdirSync(outDir, { recursive: true });
  cpSync(join(here, 'app'), join(outDir, 'app'), { recursive: true });
  mkdirSync(join(outDir, 'screenshots'), { recursive: true });
  if (existsSync(join(here, 'screenshots'))) {
    cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
  }
}

function writeDossier() {
  const dossier = buildDossier(outDir, DOSSIER_OPTIONS);
  writeFileSync(join(outDir, 'dossier.json'), dossier);
}

copySiteFiles();
writeDossier();
