#!/usr/bin/env node
/**
 * pnpm size: home-page JS against the budget (CLAUDE.md, handoff §5).
 * Dependency-free; reads the output of `pnpm build`.
 *
 * - Initial JS: every chunk the prerendered home page references (script
 *   tags and the inline RSC payload), minus `noModule` polyfills, which
 *   modern browsers never download.
 * - Lazy JS: chunks reachable from those through dynamic imports (found by
 *   scanning chunk code for other chunk file names) that aren't initial.
 *
 * Sizes are gzip (zlib default level), as served by `next start`.
 * Budget above the framework baseline: ≤ 40 KB initial, ≤ 30 KB lazy.
 * Exits 1 when over budget.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const NEXT = ".next";
const HTML = join(NEXT, "server", "app", "index.html");
const CHUNKS = join(NEXT, "static", "chunks");

/** Framework baseline (React + Next runtime), measured on the P0 home page. */
const BASELINE_KB = Number(process.env.SIZE_BASELINE_KB ?? 137.6);
const BUDGET = { initial: 40, lazy: 30 };

if (!existsSync(HTML)) {
  console.error(`No build found at ${HTML}. Run \`pnpm build\` first.`);
  process.exit(1);
}

const html = readFileSync(HTML, "utf8");
const jsFiles = new Set(readdirSync(CHUNKS, { recursive: true })
  .map((f) => String(f).replaceAll("\\", "/"))
  .filter((f) => f.endsWith(".js")));

const refPattern = /static\/chunks\/([\w./-]+?\.js)/g;
const refsIn = (text) =>
  new Set([...text.matchAll(refPattern)].map((m) => m[1]).filter((f) => jsFiles.has(f)));

// noModule scripts are legacy polyfills; modern browsers skip them.
const noModule = new Set(
  [...html.matchAll(/<script[^>]*src="[^"]*static\/chunks\/([\w./-]+?\.js)"[^>]*noModule[^>]*>/gi)]
    .map((m) => m[1]),
);
const initial = new Set([...refsIn(html)].filter((f) => !noModule.has(f)));

const code = new Map();
const read = (f) => {
  if (!code.has(f)) code.set(f, readFileSync(join(CHUNKS, f), "utf8"));
  return code.get(f);
};

// Chunk names inside other chunks; Turbopack may list them without the
// `static/chunks/` prefix, so match bare file names too.
const namePatterns = [...jsFiles].map((f) => [f, f.split("/").pop()]);
function referencedFrom(f) {
  const text = read(f);
  const found = new Set(refsIn(text));
  for (const [file, base] of namePatterns) {
    if (file !== f && text.includes(base)) found.add(file);
  }
  return found;
}

const lazy = new Set();
const queue = [...initial];
const seen = new Set(queue);
while (queue.length > 0) {
  const f = queue.shift();
  for (const ref of referencedFrom(f)) {
    if (seen.has(ref) || noModule.has(ref)) continue;
    seen.add(ref);
    if (!initial.has(ref)) lazy.add(ref);
    queue.push(ref);
  }
}

const gz = (f) => gzipSync(readFileSync(join(CHUNKS, f))).length / 1024;
const rows = (set) =>
  [...set].map((f) => ({ file: f, kb: gz(f) })).sort((a, b) => b.kb - a.kb);
const sum = (list) => list.reduce((n, r) => n + r.kb, 0);
const kb = (n) => `${n.toFixed(1)} KB`;

const initialRows = rows(initial);
const lazyRows = rows(lazy);
const initialTotal = sum(initialRows);
const initialDelta = initialTotal - BASELINE_KB;
const lazyTotal = sum(lazyRows);

const table = (title, list) => {
  console.log(`\n${title}`);
  if (list.length === 0) console.log("  (none)");
  for (const r of list) console.log(`  ${kb(r.kb).padStart(9)}  ${r.file}`);
};

console.log("Home-page JS (gzip)");
table("Initial chunks", initialRows);
table("Lazy chunks", lazyRows);

const okInitial = initialDelta <= BUDGET.initial;
const okLazy = lazyTotal <= BUDGET.lazy;
const mark = (ok) => (ok ? "ok  " : "OVER");
console.log(`
Initial total      ${kb(initialTotal)}
Baseline           ${kb(BASELINE_KB)}
Initial over base  ${kb(initialDelta).padStart(8)}  / ${BUDGET.initial} KB  ${mark(okInitial)}
Lazy total         ${kb(lazyTotal).padStart(8)}  / ${BUDGET.lazy} KB  ${mark(okLazy)}
`);

if (!okInitial || !okLazy) {
  console.error("JS budget exceeded.");
  process.exit(1);
}
