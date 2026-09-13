// Scoring, sampling, and the readiness estimate.
//
// HONESTY NOTE. The real exam is criterion-referenced and its raw-to-scaled
// mapping comes from a standard-setting study Anthropic has not published. We
// cannot reproduce it. What we do here is a transparent linear approximation
// anchored so that the documented cut score lands where the documented pass
// mark sits. Every number this file produces is an estimate and the UI says so.

import type {
  Attempt,
  DomainId,
  MockResult,
  OptionLetter,
  Question,
} from './types';
import { CUT_SCORE, DOMAINS, SCALE_MAX, SCALE_MIN, TOTAL_ITEMS } from './domains';

/**
 * Raw proportion assumed to sit at the 720 cut. Anthropic does not publish it.
 * One reported data point: a Foundations taker scored 738 scaled from 44/60
 * raw (73%). That is a different exam, so treat this as a working assumption,
 * not a fact. Shown in the UI wherever a scaled score appears.
 */
export const ASSUMED_PASS_RATIO = 0.72;

/**
 * Piecewise-linear: [0, pass) maps onto [100, 720), [pass, 1] onto [720, 1000].
 * Anchoring at the cut keeps the pass/fail boundary meaningful even though the
 * curve either side of it is invented.
 */
export function toScaled(raw: number, total: number): number {
  if (total <= 0) return SCALE_MIN;
  const ratio = Math.max(0, Math.min(1, raw / total));
  if (ratio < ASSUMED_PASS_RATIO) {
    const t = ratio / ASSUMED_PASS_RATIO;
    return Math.round(SCALE_MIN + t * (CUT_SCORE - SCALE_MIN));
  }
  const t = (ratio - ASSUMED_PASS_RATIO) / (1 - ASSUMED_PASS_RATIO);
  return Math.round(CUT_SCORE + t * (SCALE_MAX - CUT_SCORE));
}

/**
 * Multi-response scoring is all-or-nothing: every correct letter and no extras.
 * The guide does not say whether the real exam gives partial credit, and
 * all-or-nothing is both the stricter assumption and the common convention, so
 * a passing practice score is not flattered by half-right answers.
 */
export function isCorrect(q: Question, picked: OptionLetter[]): boolean {
  if (picked.length !== q.keys.length) return false;
  const want = new Set(q.keys);
  return picked.every((p) => want.has(p));
}

// ------------------------------------------------------------------ sampling

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: T[], rand: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a 63-item form at the real domain weights (11/8/12/10/9/9/4).
 * Questions the user has seen least are preferred, so repeat sittings surface
 * new material before recycling old.
 */
export function buildMockForm(
  bank: Question[],
  attempts: Attempt[],
  seed = Date.now()
): Question[] {
  const rand = mulberry32(seed >>> 0);
  const seenCount = new Map<string, number>();
  for (const a of attempts) {
    seenCount.set(a.questionId, (seenCount.get(a.questionId) ?? 0) + 1);
  }

  const form: Question[] = [];
  for (const domain of DOMAINS) {
    const pool = bank.filter((q) => q.domain === domain.id);
    // Least-seen first, ties broken randomly so it is not the same order twice.
    const ordered = shuffled(pool, rand).sort(
      (a, b) => (seenCount.get(a.id) ?? 0) - (seenCount.get(b.id) ?? 0)
    );
    form.push(...ordered.slice(0, domain.itemsOnExam));
  }

  // Interleave domains so the form does not march through them in blocks.
  return shuffled(form, rand).slice(0, TOTAL_ITEMS);
}

// ------------------------------------------------------------------- grading

export function gradeMock(
  form: Question[],
  answers: Record<string, OptionLetter[]>
): Pick<MockResult, 'raw' | 'total' | 'scaled' | 'passed' | 'byDomain'> {
  const byDomain: Record<string, { correct: number; total: number }> = {};
  let raw = 0;
  for (const q of form) {
    const key = String(q.domain);
    byDomain[key] ??= { correct: 0, total: 0 };
    byDomain[key].total++;
    const picked = answers[q.id] ?? [];
    if (picked.length && isCorrect(q, picked)) {
      raw++;
      byDomain[key].correct++;
    }
  }
  const scaled = toScaled(raw, form.length);
  return { raw, total: form.length, scaled, passed: scaled >= CUT_SCORE, byDomain };
}

// ----------------------------------------------------------------- readiness

export interface DomainReadiness {
  domain: DomainId;
  /** Distinct questions attempted in this domain. */
  attempted: number;
  /** Questions available in this domain. */
  available: number;
  /** Accuracy on the most recent attempt of each distinct question. */
  accuracy: number;
  /** Weight this domain carries on the exam. */
  weight: number;
  /**
   * How much a domain drags the projected score: weight times the gap to the
   * assumed pass ratio. Higher means study this next.
   */
  drag: number;
  /** False until enough distinct questions have been tried to mean anything. */
  confident: boolean;
}

export const MIN_FOR_CONFIDENCE = 8;

/**
 * Latest attempt per question, so re-drilling a question you now get right
 * replaces the earlier miss rather than averaging with it.
 */
function latestByQuestion(attempts: Attempt[]): Map<string, Attempt> {
  const m = new Map<string, Attempt>();
  for (const a of attempts) {
    const prev = m.get(a.questionId);
    if (!prev || a.at >= prev.at) m.set(a.questionId, a);
  }
  return m;
}

export function domainReadiness(
  bank: Question[],
  attempts: Attempt[]
): DomainReadiness[] {
  const latest = latestByQuestion(attempts);
  const domainOf = new Map(bank.map((q) => [q.id, q.domain]));

  return DOMAINS.map((d) => {
    const available = bank.filter((q) => q.domain === d.id).length;
    const mine = [...latest.values()].filter((a) => domainOf.get(a.questionId) === d.id);
    const attempted = mine.length;
    const correct = mine.filter((a) => a.correct).length;
    const accuracy = attempted ? correct / attempted : 0;
    const confident = attempted >= MIN_FOR_CONFIDENCE;
    const gap = Math.max(0, ASSUMED_PASS_RATIO - accuracy);
    // An untouched domain is unknown, not strong: treat it as full drag so the
    // plan sends you there rather than letting silence read as competence.
    const drag = attempted === 0 ? d.weight : d.weight * gap;
    return { domain: d.id, attempted, available, accuracy, weight: d.weight, drag, confident };
  });
}

/**
 * Projected scaled score if the exam went like your drilling has so far:
 * per-domain accuracy weighted by the domain's share of the exam. Domains with
 * no attempts are excluded from the projection and reported separately, since
 * guessing at them would make the number a fiction.
 */
export function projectedScore(readiness: DomainReadiness[]): {
  scaled: number | null;
  coverage: number;
  untouched: DomainId[];
} {
  const touched = readiness.filter((r) => r.attempted > 0);
  const untouched = readiness.filter((r) => r.attempted === 0).map((r) => r.domain);
  const coverage = touched.reduce((s, r) => s + r.weight, 0) / 100;
  if (!touched.length) return { scaled: null, coverage: 0, untouched };

  const weightSum = touched.reduce((s, r) => s + r.weight, 0);
  const weightedAccuracy =
    touched.reduce((s, r) => s + r.accuracy * r.weight, 0) / weightSum;
  return {
    scaled: toScaled(weightedAccuracy * TOTAL_ITEMS, TOTAL_ITEMS),
    coverage,
    untouched,
  };
}

/** The single domain worth studying next, or null if nothing has been tried. */
export function nextUp(readiness: DomainReadiness[]): DomainReadiness | null {
  const ranked = [...readiness].sort((a, b) => b.drag - a.drag);
  return ranked[0] ?? null;
}

// -------------------------------------------------------------------- export

export function toMarkdownReport(
  readiness: DomainReadiness[],
  mocks: MockResult[]
): string {
  const lines: string[] = [];
  lines.push('# CCAR-P readiness');
  lines.push('');
  lines.push(`Generated ${new Date().toISOString().slice(0, 10)}.`);
  lines.push('');
  const p = projectedScore(readiness);
  lines.push(
    p.scaled === null
      ? 'No questions attempted yet.'
      : `Projected scaled score: ${p.scaled} (cut score ${CUT_SCORE}). Estimate only.`
  );
  lines.push('');
  lines.push('| Domain | Weight | Attempted | Accuracy |');
  lines.push('|---|---|---|---|');
  for (const r of readiness) {
    const d = DOMAINS.find((x) => x.id === r.domain)!;
    lines.push(
      `| ${r.domain} ${d.title} | ${r.weight}% | ${r.attempted}/${r.available} | ${
        r.attempted ? Math.round(r.accuracy * 100) + '%' : '—'
      } |`
    );
  }
  if (mocks.length) {
    lines.push('');
    lines.push('## Mock exams');
    lines.push('');
    lines.push('| Date | Raw | Scaled | Result |');
    lines.push('|---|---|---|---|');
    for (const m of mocks) {
      lines.push(
        `| ${new Date(m.finishedAt).toISOString().slice(0, 10)} | ${m.raw}/${m.total} | ${
          m.scaled
        } | ${m.passed ? 'pass' : 'fail'} |`
      );
    }
  }
  lines.push('');
  lines.push(
    '_Scaled scores are a linear approximation anchored at the published 720 cut. Anthropic does not publish its raw-to-scaled mapping._'
  );
  return lines.join('\n');
}
