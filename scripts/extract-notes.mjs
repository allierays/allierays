#!/usr/bin/env node
// Extracts the teaching content of each CCAR-P objective page into structured
// blocks, so the study tool can render the notes without shipping a markdown
// parser to the browser.
//
//   node scripts/extract-notes.mjs [--vault <path>] [--check]
//
// Output is one file per domain under src/data/exam/notes/, dynamically
// imported by the Study tab. The whole corpus is ~1.3 MB of markdown, so it
// must not sit in the main island chunk.

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..');
const DEFAULT_VAULT =
  '/Users/allie.jones/Sites/second-brain/Work/Projects/Claude Certified Architect - Professional';

const args = process.argv.slice(2);
const CHECK_ONLY = args.includes('--check');
const vi = args.indexOf('--vault');
const VAULT = vi >= 0 ? args[vi + 1] : DEFAULT_VAULT;

const problems = [];
const warn = (m) => problems.push(m);

// ------------------------------------------------------------ inline parsing
// Produces a small inline AST: text, code, strong, em. Links become their text
// plus a separate href, since the study view renders sources as a list anyway.
function parseInline(src) {
  const out = [];
  // [label](url) -> keep the label, drop the wrapper
  let s = src.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  // Wikilinks point inside the vault and mean nothing on the site.
  s = s.replace(/\[\[([^\]|#]+)(?:\|([^\]]+))?\]\]/g, (_, a, b) => b || a);

  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
  let last = 0;
  let m;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ t: 'text', v: s.slice(last, m.index) });
    const tok = m[0];
    if (tok.startsWith('`')) out.push({ t: 'code', v: tok.slice(1, -1) });
    else if (tok.startsWith('**')) out.push({ t: 'strong', v: tok.slice(2, -2) });
    else out.push({ t: 'em', v: tok.slice(1, -1) });
    last = m.index + tok.length;
  }
  if (last < s.length) out.push({ t: 'text', v: s.slice(last) });
  return out.filter((n) => !(n.t === 'text' && n.v === ''));
}

// ------------------------------------------------------------- block parsing
function parseBlocks(lines) {
  const blocks = [];
  let i = 0;

  const isTableSep = (l) => /^\|[\s:|-]+\|$/.test(l.trim());

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // fenced code
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const body = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) body.push(lines[i]), i++;
      i++;
      blocks.push({ t: 'code', lang, v: body.join('\n') });
      continue;
    }

    // callout: > [!tip] Title  /  > body
    if (trimmed.startsWith('>')) {
      const body = [];
      let kind = 'note';
      let title = '';
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        let l = lines[i].trim().replace(/^>\s?/, '');
        const cm = /^\[!(\w+)\]\s*(.*)$/.exec(l);
        if (cm) {
          kind = cm[1].toLowerCase();
          title = cm[2].trim();
        } else if (l) {
          body.push(l);
        }
        i++;
      }
      blocks.push({
        t: 'callout',
        kind,
        title,
        children: body.length ? [{ t: 'p', v: parseInline(body.join(' ')) }] : [],
      });
      continue;
    }

    // table
    if (trimmed.startsWith('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const cells = (l) =>
        l
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((c) => parseInline(c.trim()));
      const head = cells(lines[i]);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(cells(lines[i]));
        i++;
      }
      blocks.push({ t: 'table', head, rows });
      continue;
    }

    // list (bulleted or numbered), including simple nesting
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s/.test(line);
      const items = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        const depth = Math.floor((lines[i].length - lines[i].trimStart().length) / 2);
        const text = lines[i].trim().replace(/^([-*]|\d+\.)\s+/, '');
        items.push({ depth, v: parseInline(text) });
        i++;
      }
      blocks.push({ t: 'list', ordered, items });
      continue;
    }

    // sub-heading inside a section
    if (trimmed.startsWith('###')) {
      const level = trimmed.match(/^#+/)[0].length;
      blocks.push({ t: 'h', level, v: trimmed.replace(/^#+\s*/, '') });
      i++;
      continue;
    }

    // paragraph: consume until a blank line or a block starter
    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('|') &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !/^\s*([-*]|\d+\.)\s+/.test(lines[i])
    ) {
      para.push(lines[i].trim());
      i++;
    }
    if (para.length) blocks.push({ t: 'p', v: parseInline(para.join(' ')) });
  }

  return blocks;
}

// ---------------------------------------------------------------- page parse
function parsePage(path) {
  const raw = readFileSync(path, 'utf8');
  const file = basename(path, '.md');
  const om = /^(\d)\.(\d+)\s+(.*)$/.exec(file);
  if (!om) return null;

  const objective = `${om[1]}.${om[2]}`;
  const domain = Number(om[1]);
  const lines = raw.split('\n');

  const h1 = (lines.find((l) => l.startsWith('# ')) || '').replace(/^#\s*/, '');

  // The summary callout sits above the first H2.
  const firstH2 = lines.findIndex((l) => /^## /.test(l));
  const preamble = lines.slice(0, firstH2 < 0 ? lines.length : firstH2);
  const summaryLines = preamble.filter((l) => l.trim().startsWith('>'));
  const summary = summaryLines
    .map((l) => l.trim().replace(/^>\s?/, '').replace(/^\[!\w+\]\s*.*$/, ''))
    .filter(Boolean)
    .join(' ')
    .trim();

  // Split into H2 sections. Practice questions belong to the quiz, not the note.
  const sections = [];
  let cur = null;
  for (let i = firstH2 < 0 ? lines.length : firstH2; i < lines.length; i++) {
    const l = lines[i];
    if (/^## /.test(l)) {
      if (cur) sections.push(cur);
      cur = { title: l.replace(/^##\s*/, '').trim(), lines: [] };
    } else if (cur) {
      cur.lines.push(l);
    }
  }
  if (cur) sections.push(cur);

  const skip = /^(Practice questions)$/i;
  const out = sections
    .filter((s) => !skip.test(s.title))
    .map((s) => ({
      title: s.title,
      kind: classify(s.title),
      blocks: parseBlocks(s.lines),
    }))
    .filter((s) => s.blocks.length > 0);

  if (!out.length) warn(`${file}: no sections parsed`);

  return { objective, domain, title: om[3], h1, summary, sections: out };
}

function classify(title) {
  const t = title.toLowerCase();
  if (t.startsWith('concept')) return 'concept';
  if (t.startsWith('what you must')) return 'abilities';
  if (t.startsWith('making the decision')) return 'decide';
  if (t.startsWith('numbers')) return 'numbers';
  if (t.startsWith('how the exam')) return 'exam';
  if (t.startsWith('worked example')) return 'worked';
  if (t.startsWith('self-check')) return 'selfcheck';
  if (t.startsWith('sources')) return 'sources';
  return 'other';
}

// ------------------------------------------------------------------ pipeline
function main() {
  if (!existsSync(VAULT)) {
    console.error(`Vault not found: ${VAULT}`);
    process.exit(1);
  }

  const byDomain = new Map();
  for (const d of readdirSync(VAULT, { withFileTypes: true })) {
    if (!d.isDirectory() || !/^Domain \d/.test(d.name)) continue;
    for (const f of readdirSync(join(VAULT, d.name)).sort()) {
      if (!f.endsWith('.md')) continue;
      const page = parsePage(join(VAULT, d.name, f));
      if (!page) continue;
      if (!byDomain.has(page.domain)) byDomain.set(page.domain, []);
      byDomain.get(page.domain).push(page);
    }
  }

  let total = 0;
  let concepts = 0;
  for (const [, pages] of byDomain) {
    total += pages.length;
    for (const p of pages) concepts += p.sections.filter((s) => s.kind === 'concept').length;
  }

  console.log(`Parsed ${total} objective notes, ${concepts} concept sections.`);
  for (const d of [...byDomain.keys()].sort()) {
    const pages = byDomain.get(d);
    const kb = Math.round(JSON.stringify(pages).length / 1024);
    console.log(`  D${d}  ${String(pages.length).padStart(2)} notes  ${kb} KB`);
  }
  if (problems.length) {
    console.log(`\n${problems.length} problem(s):`);
    for (const p of problems) console.log(`  - ${p}`);
  }
  if (total !== 38) {
    console.error(`\nExpected 38 objective notes, got ${total}. Nothing written.`);
    process.exit(1);
  }
  if (CHECK_ONLY) {
    console.log('\n--check: parsed, nothing written.');
    return;
  }

  const dir = join(REPO, 'src/data/exam/notes');
  mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  for (const d of [...byDomain.keys()].sort()) {
    const pages = byDomain.get(d).sort((a, b) => a.objective.localeCompare(b.objective));
    writeFileSync(
      join(dir, `d${d}.ts`),
      `// GENERATED by scripts/extract-notes.mjs - do not edit by hand.\n` +
        `// Teaching content for domain ${d}, extracted ${stamp}.\n\n` +
        `import type { ObjectiveNote } from '../notes-types';\n\n` +
        `const NOTES: ObjectiveNote[] = ${JSON.stringify(pages, null, 1)};\n\n` +
        `export default NOTES;\n`
    );
  }
  console.log(`\nWrote ${byDomain.size} domain files to src/data/exam/notes/`);
}

main();
