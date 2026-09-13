#!/usr/bin/env node
// Merges stem rewrites into src/data/exam/stem-overrides.ts.
//
//   node scripts/apply-stem-rewrites.mjs <dir-of-out-*.json> [--check]
//
// Stems are rewritten to match Anthropic's published sample items: a 35-50 word
// scenario naming an actor and a constraint, ending in a superlative ask. The
// options, keys and rationales are never touched, so the correct answer is
// unchanged; only the framing moves.
//
// The output is a separate committed file rather than an edit to questions.ts,
// which is generated from the vault. That way re-running the extractor never
// discards this work.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..');

const args = process.argv.slice(2);
const CHECK = args.includes('--check');
const DIR = args.find((a) => !a.startsWith('--'));
if (!DIR || !existsSync(DIR)) {
  console.error('Usage: node scripts/apply-stem-rewrites.mjs <dir> [--check]');
  process.exit(1);
}

// ------------------------------------------------------------- the bank
const qsrc = readFileSync(join(REPO, 'src/data/exam/questions.ts'), 'utf8');
const QUESTIONS = JSON.parse(qsrc.slice(qsrc.indexOf('= [') + 2, qsrc.lastIndexOf(']') + 1));
const byId = new Map(QUESTIONS.map((q) => [q.id, q]));

// --------------------------------------------------------- collect rewrites
const rewrites = {};
const sources = {};
for (const f of readdirSync(DIR).sort()) {
  if (!/^out-.*\.json$/.test(f)) continue;
  let obj;
  try {
    obj = JSON.parse(readFileSync(join(DIR, f), 'utf8'));
  } catch (e) {
    console.error(`  ${f}: not valid JSON - ${e.message}`);
    process.exitCode = 1;
    continue;
  }
  let n = 0;
  for (const [id, stem] of Object.entries(obj)) {
    if (rewrites[id]) {
      console.error(`  duplicate rewrite for ${id} (${sources[id]} and ${f})`);
      process.exitCode = 1;
      continue;
    }
    rewrites[id] = String(stem).replace(/\s+/g, ' ').trim();
    sources[id] = f;
    n++;
  }
  console.log(`  ${f.padEnd(16)} ${n} rewrites`);
}

// ------------------------------------------------------------- validation
const words = (s) => s.trim().split(/\s+/).length;
// What counts as a valid ask. The three official samples all use a superlative
// ("best reduces risk", "most directly addresses", "most likely first place"),
// but superlatives take many forms: "earliest", "highest-value", "matters most".
// "Which two statements are correct?" is also a standard certification form and
// is the natural shape for a select-two item about independent facts, so it
// counts too. Forcing "best" into those would read worse, not more faithful.
const SUPERLATIVE = new RegExp(
  [
    'best', 'most\\b', 'most\\s+\\w+', 'greatest', 'strongest', 'earliest', 'highest',
    'lowest', 'first', 'largest', 'smallest', 'safest', 'cheapest',
    'which statement', 'which statements', 'which two statements',
    'which explanation', 'which account', 'which description', 'which assessment',
    'which criticism', 'which flaw', 'which change', 'which approach',
    'what should the architect', 'which action', 'which response',
  ].join('|'),
  'i'
);

const problems = [];
const warnings = [];

for (const [id, stem] of Object.entries(rewrites)) {
  const q = byId.get(id);
  if (!q) {
    problems.push(`${id}: no such question in the bank`);
    continue;
  }
  const w = words(stem);
  if (w < 28 || w > 62) warnings.push(`${id}: ${w} words (target 35-50)`);
  if (!/[?]\s*$/.test(stem)) problems.push(`${id}: does not end in a question mark`);
  if (!SUPERLATIVE.test(stem)) warnings.push(`${id}: no superlative in the ask`);
  if (/\(select\s+\w+\.?\)/i.test(stem)) problems.push(`${id}: stem contains "(Select N.)"`);

  // The answer must not be handed over in the scenario.
  for (const k of q.keys) {
    const opt = q.options['ABCDE'.indexOf(k)];
    if (!opt) continue;
    const distinctive = opt
      .replace(/`/g, '')
      .split(/\s+/)
      .filter((t) => t.length > 7 && /^[a-z_]+$/i.test(t));
    const leaked = distinctive.filter((t) => stem.toLowerCase().includes(t.toLowerCase()));
    if (leaked.length >= 3) warnings.push(`${id}: may leak the key (${leaked.slice(0, 3).join(', ')})`);
  }

  // Multi-response stems should invite two.
  if (q.selectCount > 1 && !/\btwo\b/i.test(stem)) {
    warnings.push(`${id}: selectCount ${q.selectCount} but the ask does not say "two"`);
  }
}

const total = Object.keys(rewrites).length;
console.log(`\n${total} rewrites across ${QUESTIONS.length} questions.`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings.slice(0, 40)) console.log(`  - ${w}`);
  if (warnings.length > 40) console.log(`  ...and ${warnings.length - 40} more`);
}
if (problems.length) {
  console.error(`\n${problems.length} blocking problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error('Nothing written.');
  process.exit(1);
}

// ------------------------------------------------------------ coverage report
const conforms = (s) => words(s) >= 30 && SUPERLATIVE.test(s);
let ok = 0;
for (const q of QUESTIONS) {
  const stem = rewrites[q.id] ?? q.stem;
  if (conforms(stem)) ok++;
}
console.log(
  `\nMatching the official shape after merge: ${ok}/${QUESTIONS.length} (${Math.round(
    (ok / QUESTIONS.length) * 100
  )}%)`
);

if (CHECK) {
  console.log('\n--check: validated, nothing written.');
  process.exit(0);
}

// ------------------------------------------------------------------- emit
const sorted = Object.keys(rewrites).sort();
const body = sorted.map((id) => `  ${JSON.stringify(id)}: ${JSON.stringify(rewrites[id])},`).join('\n');
writeFileSync(
  join(REPO, 'src/data/exam/stem-overrides.ts'),
  `// Stem rewrites, keyed by question id.
//
// GENERATED by scripts/apply-stem-rewrites.mjs. Committed on purpose: nothing
// regenerates this from the vault, so it survives re-running the extractor.
//
// Each stem is reframed to match Anthropic's published sample items - a short
// scenario naming an actor and a constraint, ending in a superlative ask.
// Options, keys and rationales are untouched, so answers are unchanged.
//
// ${total} rewrites, applied ${new Date().toISOString().slice(0, 10)}.

export const STEM_OVERRIDES: Record<string, string> = {
${body}
};
`
);
console.log(`\nWrote ${total} overrides to src/data/exam/stem-overrides.ts`);
