import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  AT_A_GLANCE,
  DISCLAIMER,
  DOMAINS,
  DOMAIN_BY_ID,
  EXAM,
  FORMATS,
  GUIDE,
  OVERVIEW,
  RIGHT_ANSWER,
  SECTIONS,
  SHAPE,
  SOURCES,
  TELLS,
  type DomainId,
  type SectionId,
} from './content';
import {
  QUESTIONS,
  QUESTION_BY_ID,
  emptyResponse,
  isAnswered,
  isComplete,
  isCorrect,
  selectCount,
  type Question,
  type Response,
} from './questions';

// The Claude Certified Architect Professional study guide and practice
// test, embedded in the blog post of the same name.
//
// Two halves. The overview (what the exam is, the blueprint, how items are
// shaped) is short copy from ./content.ts. The practice test
// runs the 63-item bank in ./questions.ts in two modes:
//
//  - Practice: pick a domain or all of them, answer one item at a time, and
//    see the rationale for every option straight away.
//  - Mock exam: all 63 items in a shuffled order under the real 120-minute
//    clock, flag and revisit, then a score report by domain. The attempt is
//    saved in localStorage so a closed tab can be resumed.
//
// Fidelity rules the card keeps to: the item always states how many picks it
// wants and refuses extra ones; a multi or a match is scored as a whole item,
// since the guide says nothing about partial credit; the mock never shows a
// rationale until it is submitted.

const INK = '#394646';
const MUTED = '#637979';
const LINE = '#ded8ce';
const PAPER = '#FAF9F4';
const GOOD = '#2F6B4F';
const GOOD_BG = '#E4F1E8';
const BAD = '#A9452F';
const BAD_BG = '#F8E6E1';
const FLAG = '#B8730C';
const FLAG_BG = '#FBF0D9';
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const MOCK_KEY = 'ccarpMock:v1';
const MOCK_MS = EXAM.minutes * 60 * 1000;

// ───────────────────────────────────────────────────────────────── utilities

/** mulberry32: a small seeded PRNG so a mock's order is reproducible. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], seed: number): T[] {
  const a = items.slice();
  const r = rng(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmtTime(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function pct(n: number, d: number): number {
  return d === 0 ? 0 : Math.round((n / d) * 100);
}

/** Scrolls an element into view, without animation when the OS asks for reduced motion. */
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  el.scrollIntoView?.({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

/** A "Practice this domain" click from outside the quiz. The nonce lets the same domain fire twice. */
interface PracticeRequest {
  domain: DomainId;
  nonce: number;
}

function useNow(active: boolean): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [active]);
  return now;
}

/** Which section heading is nearest the top of the viewport. */
function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>(SECTIONS[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id as SectionId);
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
  return active;
}

// ───────────────────────────────────────────────────────── page furniture

/** `compact` drops the offset that clears the site header, for full screen. */
function OnThisPage({ active, compact = false }: { active: SectionId; compact?: boolean }) {
  return (
    <nav aria-label="On this page" className={`hidden md:block w-56 flex-shrink-0 sticky self-start ${compact ? 'top-2' : 'top-16'}`}>
      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9A9389]">On this page</p>
      <ol className="flex flex-col gap-0.5">
        {SECTIONS.map((s, i) => {
          const isActive = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`flex items-baseline gap-2 rounded-lg px-3 py-2 text-[13px] leading-snug no-underline transition-colors ${
                  isActive ? 'font-semibold' : 'hover:bg-[#FAF9F4]'
                }`}
                style={isActive ? { background: GUIDE.accent.bg, color: GUIDE.accent.color } : { color: INK }}
              >
                <span
                  className="text-[11px] font-bold [font-variant-numeric:tabular-nums]"
                  style={{ color: isActive ? GUIDE.accent.color : '#9A9389' }}
                >
                  {i + 1}
                </span>
                {s.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function SectionPills() {
  return (
    <nav aria-label="On this page" className="md:hidden mb-6 flex flex-wrap gap-2">
      {SECTIONS.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="inline-flex items-baseline gap-1.5 rounded-full border bg-white px-3.5 py-1.5 no-underline"
          style={{ borderColor: LINE }}
        >
          <span className="text-[12px] font-extrabold" style={{ color: GUIDE.accent.color }}>
            {i + 1}
          </span>
          <span className="text-[13px] font-semibold" style={{ color: INK }}>
            {s.label}
          </span>
        </a>
      ))}
    </nav>
  );
}

function Kicker({ children, color = GUIDE.accent.color }: { children: ReactNode; color?: string }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color }}>
      {children}
    </p>
  );
}

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-1 text-[1.75rem] md:text-[2.1rem] font-extrabold leading-[1.08] tracking-[-0.02em]" style={{ color: INK }}>
      {children}
    </h2>
  );
}

function Lede({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 max-w-[680px] text-[16px] leading-[1.6]" style={{ color: INK }}>
      {children}
    </p>
  );
}

function Card({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`rounded-2xl border bg-white ${className}`} style={{ borderColor: LINE, ...style }}>
      {children}
    </div>
  );
}

function Pill({ children, color, bg }: { children: ReactNode; color: string; bg: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-[0.02em]"
      style={{ background: bg, color }}
    >
      {children}
    </span>
  );
}

function Button({
  children,
  onClick,
  kind = 'primary',
  disabled = false,
  small = false,
}: {
  children: ReactNode;
  onClick: () => void;
  kind?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  small?: boolean;
}) {
  const base = `inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-colors ${
    small ? 'px-3.5 py-2 text-[13px]' : 'px-5 py-3 text-[14px]'
  } ${disabled ? 'cursor-not-allowed opacity-40' : ''}`;
  const style: CSSProperties =
    kind === 'primary'
      ? { background: GUIDE.accent.color, color: '#fff' }
      : kind === 'danger'
        ? { background: BAD_BG, color: BAD, border: `1px solid ${BAD}` }
        : { background: '#fff', color: INK, border: `1px solid ${LINE}` };
  return (
    <button type="button" className={base} style={style} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────── overview blocks

/** The blueprint as one stacked bar: the seven weights, in domain colors. */
/** The blueprint as one stacked bar. Every segment and legend entry jumps to that domain's card. */
function WeightBar({ onPick }: { onPick: (id: DomainId) => void }) {
  return (
    <div>
      <div className="flex h-9 w-full overflow-hidden rounded-xl" role="group" aria-label="Domain weights on the exam">
        {DOMAINS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onPick(d.id)}
            aria-label={`Domain ${d.id}, ${d.title}, ${d.weight} percent. Jump to its card.`}
            title={`${d.title}: ${d.weight}%`}
            className="flex items-center justify-center text-[12px] font-extrabold text-white transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
            style={{ width: `${d.weight}%`, background: d.accent, color: '#fff' }}
          >
            {d.weight}%
          </button>
        ))}
      </div>
      <ol className="mt-3 grid gap-x-4 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-4">
        {DOMAINS.map((d) => (
          <li key={d.id}>
            <button
              type="button"
              onClick={() => onPick(d.id)}
              className="flex items-baseline gap-2 rounded-md text-left text-[13px] hover:underline"
              style={{ color: INK }}
            >
              <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-sm" style={{ background: d.accent }} />
              <span>
                <span className="font-bold">D{d.id}</span> {d.short}
                <span style={{ color: MUTED }}> · about {d.items} items</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function AtAGlance() {
  return (
    <Card className="p-5 md:p-6">
      <Kicker>At a glance</Kicker>
      <dl className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {AT_A_GLANCE.map((f) => (
          <div key={f.label} className="grid grid-cols-[96px_minmax(0,1fr)] gap-3">
            <dt className="text-[12px] font-bold uppercase tracking-[0.08em] pt-0.5" style={{ color: MUTED }}>
              {f.label}
            </dt>
            <dd className="text-[14px] leading-snug" style={{ color: INK }}>
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

/** One card per domain. Each carries the anchor the weight bar jumps to and a button that starts practice on it. */
function DomainCards({ onPractice }: { onPractice: (id: DomainId) => void }) {
  return (
    <ol className="mt-6 grid gap-3">
      {DOMAINS.map((d) => (
        <li key={d.id} id={`domain-${d.id}`} className="scroll-mt-24">
          <Card className="flex gap-4 p-4 md:p-5">
            <span
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[15px] font-extrabold text-white"
              style={{ background: d.accent }}
            >
              {d.id}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="text-[16px] font-extrabold leading-snug" style={{ color: INK }}>
                  {d.title}
                </p>
                <p className="text-[12px] font-bold" style={{ color: MUTED }}>
                  {d.weight}% · about {d.items} of {EXAM.items} items
                </p>
              </div>
              <p className="mt-1 text-[14px] leading-relaxed" style={{ color: INK }}>
                {d.tests}
              </p>
              <button
                type="button"
                onClick={() => onPractice(d.id)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-[12.5px] font-bold transition-colors hover:border-[#35656E]"
                style={{ borderColor: LINE, color: GUIDE.accent.color }}
              >
                Practice this domain
                <span aria-hidden>→</span>
              </button>
            </div>
          </Card>
        </li>
      ))}
    </ol>
  );
}

function Shape() {
  return (
    <>
      {SHAPE.body.map((p) => (
        <Lede key={p}>{p}</Lede>
      ))}
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {FORMATS.map((f) => (
          <Card key={f.name} className="p-4">
            <p className="text-[14px] font-extrabold" style={{ color: INK }}>
              {f.name}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed" style={{ color: MUTED }}>
              {f.detail}
            </p>
          </Card>
        ))}
      </div>
      <Kicker>
        <span className="mt-8 block">The distractor patterns</span>
      </Kicker>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {TELLS.map((t) => (
          <li key={t.name} className="flex gap-3 rounded-xl px-4 py-3" style={{ background: PAPER }}>
            <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: GUIDE.accent.color }} />
            <p className="text-[13.5px] leading-snug" style={{ color: INK }}>
              <span className="font-extrabold">{t.name}.</span> <span style={{ color: MUTED }}>{t.example}</span>
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-5 rounded-2xl p-5" style={{ background: GUIDE.accent.bg }}>
        <p className="text-[16px] font-bold leading-snug" style={{ color: GUIDE.accent.color }}>
          {RIGHT_ANSWER}
        </p>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────── the question card

interface QuestionCardProps {
  q: Question;
  response: Response;
  onChange: (r: Response) => void;
  /** Practice after checking, or mock review: shows the key and rationale. */
  revealed: boolean;
  position?: { index: number; total: number };
  flagged?: boolean;
  onToggleFlag?: () => void;
}

function TypeLabel({ q }: { q: Question }) {
  const text = q.type === 'single' ? 'Select ONE' : q.type === 'multi' ? `Select ${q.select === 2 ? 'TWO' : q.select}` : 'Match each scenario';
  return <Pill color={INK} bg={PAPER}>{text}</Pill>;
}

function QuestionCard({ q, response, onChange, revealed, position, flagged, onToggleFlag }: QuestionCardProps) {
  const domain = DOMAIN_BY_ID[q.domain];
  const [refused, setRefused] = useState(false);

  const toggle = (i: number) => {
    if (revealed || q.type === 'match') return;
    if (q.type === 'single') {
      onChange([i]);
      return;
    }
    if (response.includes(i)) {
      onChange(response.filter((v) => v !== i));
    } else if (response.length < q.select) {
      onChange([...response, i]);
    } else {
      // Refuse rather than displace: that is how proctored engines behave,
      // and silently swapping an earlier pick would teach the wrong habit.
      setRefused(true);
      window.setTimeout(() => setRefused(false), 1400);
    }
  };

  return (
    <Card className="p-5 md:p-6">
      <div className="flex flex-wrap items-center gap-2">
        {position && (
          <span className="text-[12px] font-bold [font-variant-numeric:tabular-nums]" style={{ color: MUTED }}>
            {position.index + 1} / {position.total}
          </span>
        )}
        <Pill color="#fff" bg={domain.accent}>
          D{q.domain} · {domain.short}
        </Pill>
        <TypeLabel q={q} />
        {revealed && (
          <span className="text-[11px] font-bold" style={{ color: MUTED }}>
            Objective {q.objective}
          </span>
        )}
        {onToggleFlag && (
          <button
            type="button"
            onClick={onToggleFlag}
            aria-pressed={flagged}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-bold"
            style={
              flagged
                ? { background: FLAG_BG, color: FLAG, borderColor: FLAG }
                : { background: '#fff', color: MUTED, borderColor: LINE }
            }
          >
            <span aria-hidden>⚑</span> {flagged ? 'Flagged' : 'Flag'}
          </button>
        )}
      </div>

      <p className="mt-4 text-[17px] leading-[1.6]" style={{ color: INK, fontFamily: 'var(--font-body)' }}>
        {q.stem}
      </p>

      {q.type === 'match' ? (
        <MatchBody q={q} response={response} onChange={onChange} revealed={revealed} />
      ) : (
        <>
          <ul className="mt-5 grid gap-2">
            {q.options.map((o, i) => {
              const picked = response.includes(i);
              let border = LINE;
              let bg = '#fff';
              let dim = false;
              if (revealed) {
                if (o.correct) {
                  border = GOOD;
                  bg = GOOD_BG;
                } else if (picked) {
                  border = BAD;
                  bg = BAD_BG;
                } else {
                  dim = true;
                }
              } else if (picked) {
                border = GUIDE.accent.color;
                bg = GUIDE.accent.bg;
              }
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-pressed={picked}
                    disabled={revealed}
                    className="flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors"
                    style={{ borderColor: border, background: bg, opacity: dim ? 0.7 : 1, cursor: revealed ? 'default' : 'pointer' }}
                  >
                    <span
                      className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[12px] font-extrabold"
                      style={{
                        background: revealed && o.correct ? GOOD : revealed && picked ? BAD : picked ? GUIDE.accent.color : PAPER,
                        color: (revealed && (o.correct || picked)) || picked ? '#fff' : INK,
                      }}
                    >
                      {LETTERS[i]}
                    </span>
                    <span className="text-[14.5px] leading-snug" style={{ color: INK }}>
                      {o.text}
                    </span>
                  </button>
                  {revealed && (
                    <p className="mt-1.5 px-4 text-[13px] leading-relaxed" style={{ color: o.correct ? GOOD : picked ? BAD : MUTED }}>
                      <span className="font-extrabold">
                        {o.correct ? 'Correct.' : picked ? 'Your pick.' : 'Why not.'}
                      </span>{' '}
                      {o.why}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          {q.type === 'multi' && !revealed && (
            <p className="mt-3 text-[12px] font-bold" style={{ color: refused ? BAD : MUTED }}>
              {refused
                ? `This item takes ${q.select} responses. Unpick one before choosing another.`
                : `${response.length} of ${q.select} selected`}
            </p>
          )}
        </>
      )}
    </Card>
  );
}

function MatchBody({
  q,
  response,
  onChange,
  revealed,
}: {
  q: Extract<Question, { type: 'match' }>;
  response: Response;
  onChange: (r: Response) => void;
  revealed: boolean;
}) {
  const set = (row: number, value: number) => {
    const next = q.rows.map((_, i) => response[i] ?? -1);
    next[row] = value;
    onChange(next);
  };
  return (
    <div className="mt-5">
      <p className="text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
        Options (an option can be used more than once)
      </p>
      <ul className="mt-1.5 flex flex-wrap gap-2">
        {q.choices.map((c) => (
          <li key={c} className="rounded-full border px-3 py-1 text-[12.5px] font-semibold" style={{ borderColor: LINE, color: INK, background: PAPER }}>
            {c}
          </li>
        ))}
      </ul>
      <ol className="mt-4 grid gap-3">
        {q.rows.map((row, i) => {
          const value = response[i] ?? -1;
          const right = value === row.answer;
          return (
            <li key={i} className="rounded-xl border p-3.5" style={{ borderColor: revealed ? (right ? GOOD : BAD) : LINE, background: revealed ? (right ? GOOD_BG : BAD_BG) : '#fff' }}>
              <p className="text-[14px] leading-snug" style={{ color: INK }}>
                <span className="font-extrabold">{i + 1}.</span> {row.text}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <select
                  value={value}
                  disabled={revealed}
                  onChange={(e) => set(i, Number(e.target.value))}
                  aria-label={`Answer for scenario ${i + 1}`}
                  className="rounded-lg border px-3 py-2 text-[13.5px] font-semibold"
                  style={{ borderColor: LINE, background: '#fff', color: INK, fontFamily: 'inherit', maxWidth: '100%' }}
                >
                  <option value={-1}>Choose…</option>
                  {q.choices.map((c, ci) => (
                    <option key={c} value={ci}>
                      {c}
                    </option>
                  ))}
                </select>
                {revealed && (
                  <span className="text-[13px] font-bold" style={{ color: right ? GOOD : BAD }}>
                    {right ? 'Correct' : `Correct answer: ${q.choices[row.answer]}`}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {revealed && (
        <p className="mt-4 rounded-xl px-4 py-3 text-[13.5px] leading-relaxed" style={{ background: PAPER, color: INK }}>
          <span className="font-extrabold" style={{ color: GOOD }}>
            Why.
          </span>{' '}
          {q.why}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────── the quiz

interface MockState {
  version: 1;
  order: string[];
  responses: Record<string, Response>;
  flags: string[];
  index: number;
  startedAt: number;
  submittedAt: number | null;
}

interface PracticeState {
  domain: DomainId | 0;
  order: string[];
  index: number;
  response: Response;
  revealed: boolean;
  right: number;
  done: number;
}

type View = { kind: 'menu' } | { kind: 'practice' } | { kind: 'mock' } | { kind: 'results' };

function loadMock(): MockState | null {
  try {
    const raw = localStorage.getItem(MOCK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<MockState>;
    if (
      parsed.version === 1 &&
      Array.isArray(parsed.order) &&
      parsed.order.length === QUESTIONS.length &&
      parsed.order.every((id) => typeof id === 'string' && QUESTION_BY_ID[id]) &&
      typeof parsed.startedAt === 'number'
    ) {
      return {
        version: 1,
        order: parsed.order,
        responses: parsed.responses ?? {},
        flags: parsed.flags ?? [],
        index: Math.min(Math.max(parsed.index ?? 0, 0), QUESTIONS.length - 1),
        startedAt: parsed.startedAt,
        submittedAt: parsed.submittedAt ?? null,
      };
    }
  } catch {
    // Storage unavailable or unreadable: start fresh.
  }
  return null;
}

function newMock(): MockState {
  const seed = Date.now();
  return {
    version: 1,
    order: shuffle(QUESTIONS.map((q) => q.id), seed),
    responses: {},
    flags: [],
    index: 0,
    startedAt: seed,
    submittedAt: null,
  };
}

function newPractice(domain: DomainId | 0): PracticeState {
  const pool = QUESTIONS.filter((q) => domain === 0 || q.domain === domain);
  const order = shuffle(pool.map((q) => q.id), Date.now());
  return { domain, order, index: 0, response: emptyResponse(QUESTION_BY_ID[order[0]]), revealed: false, right: 0, done: 0 };
}

function Quiz({ request }: { request: PracticeRequest | null }) {
  const [view, setView] = useState<View>({ kind: 'menu' });
  const [mock, setMock] = useState<MockState | null>(() => loadMock());
  const [practice, setPractice] = useState<PracticeState | null>(null);
  const [pickDomain, setPickDomain] = useState<DomainId | 0>(0);

  const startPractice = (domain: DomainId | 0) => {
    setPickDomain(domain);
    setPractice(newPractice(domain));
    setView({ kind: 'practice' });
  };

  // A domain card or the score report asked for a practice session. A running
  // mock is left saved, so the menu still offers to resume it.
  useEffect(() => {
    if (request) startPractice(request.domain);
  }, [request]);

  // Persist the mock so a closed tab resumes where it left off.
  useEffect(() => {
    try {
      if (mock) localStorage.setItem(MOCK_KEY, JSON.stringify(mock));
      else localStorage.removeItem(MOCK_KEY);
    } catch {
      // Fine to lose: it is a convenience, not a record.
    }
  }, [mock]);

  // Resolve the view against the state it needs, so a discarded attempt or a
  // finished practice run falls back to the menu without a render-time update.
  const shown: View['kind'] =
    view.kind === 'practice' && !practice
      ? 'menu'
      : view.kind === 'mock' && (!mock || mock.submittedAt)
        ? mock?.submittedAt
          ? 'results'
          : 'menu'
        : view.kind === 'results' && !(mock && mock.submittedAt)
          ? 'menu'
          : view.kind;

  const running = shown === 'mock' && !!mock && !mock.submittedAt;
  const now = useNow(running);
  const remaining = mock ? MOCK_MS - (now - mock.startedAt) : MOCK_MS;

  // The clock runs out: submit whatever is there, as the real exam would.
  useEffect(() => {
    if (running && remaining <= 0) {
      setMock((m) => (m && !m.submittedAt ? { ...m, submittedAt: Date.now() } : m));
      setView({ kind: 'results' });
    }
  }, [running, remaining]);

  const startMock = () => {
    setMock(newMock());
    setView({ kind: 'mock' });
  };

  const submitMock = () => {
    setMock((m) => (m ? { ...m, submittedAt: Date.now() } : m));
    setView({ kind: 'results' });
  };

  const discardMock = () => {
    setMock(null);
    setView({ kind: 'menu' });
  };

  // ── menu ──
  if (shown === 'menu') {
    const answered = mock ? mock.order.filter((id) => isAnswered(QUESTION_BY_ID[id], mock.responses[id])).length : 0;
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col p-5 md:p-6">
          <Kicker>Practice</Kicker>
          <p className="mt-1 text-[20px] font-extrabold leading-tight" style={{ color: INK }}>
            One domain at a time, with the answer explained
          </p>
          <p className="mt-2 text-[14px] leading-relaxed" style={{ color: MUTED }}>
            Untimed. Check each item as you go and read why every option is right or wrong.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPickDomain(0)}
              aria-pressed={pickDomain === 0}
              className="rounded-full border px-3 py-1.5 text-[12.5px] font-bold"
              style={pickDomain === 0 ? { background: INK, color: '#fff', borderColor: INK } : { background: '#fff', color: INK, borderColor: LINE }}
            >
              All domains · {QUESTIONS.length}
            </button>
            {DOMAINS.map((d) => {
              const on = pickDomain === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setPickDomain(d.id)}
                  aria-pressed={on}
                  className="rounded-full border px-3 py-1.5 text-[12.5px] font-bold"
                  style={on ? { background: d.accent, color: '#fff', borderColor: d.accent } : { background: '#fff', color: INK, borderColor: LINE }}
                >
                  D{d.id} {d.short} · {d.items}
                </button>
              );
            })}
          </div>
          <div className="mt-auto pt-5">
            <Button
              onClick={() => {
                setPractice(newPractice(pickDomain));
                setView({ kind: 'practice' });
              }}
            >
              Start practicing
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col p-5 md:p-6">
          <Kicker>Mock exam</Kicker>
          <p className="mt-1 text-[20px] font-extrabold leading-tight" style={{ color: INK }}>
            All {EXAM.items} items, {EXAM.minutes} minutes, scored by domain
          </p>
          <p className="mt-2 text-[14px] leading-relaxed" style={{ color: MUTED }}>
            The blueprint proportions in a shuffled order under the real clock. Flag items and come back to them. No rationale until you submit. Your
            attempt is saved in this browser.
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
            {mock && !mock.submittedAt ? (
              <>
                <Button onClick={() => setView({ kind: 'mock' })}>
                  Resume · {answered}/{EXAM.items} answered · {fmtTime(Math.max(0, MOCK_MS - (Date.now() - mock.startedAt)))} left
                </Button>
                <Button kind="ghost" onClick={discardMock} small>
                  Discard attempt
                </Button>
              </>
            ) : mock && mock.submittedAt ? (
              <>
                <Button onClick={() => setView({ kind: 'results' })}>See last results</Button>
                <Button kind="ghost" onClick={startMock} small>
                  Start a new attempt
                </Button>
              </>
            ) : (
              <Button onClick={startMock}>Start the mock exam</Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // ── practice ──
  if (shown === 'practice' && practice) {
    const finished = practice.index >= practice.order.length;
    if (finished) {
      return (
        <Card className="p-6 text-center">
          <Kicker>Practice complete</Kicker>
          <p className="mt-2 text-[2rem] font-extrabold" style={{ color: INK }}>
            {practice.right} of {practice.done}
          </p>
          <p className="text-[14px]" style={{ color: MUTED }}>
            {pct(practice.right, practice.done)}% on {practice.domain === 0 ? 'all domains' : DOMAIN_BY_ID[practice.domain].title}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button onClick={() => setPractice(newPractice(practice.domain))}>Practice again</Button>
            <Button kind="ghost" onClick={() => setView({ kind: 'menu' })}>
              Back to menu
            </Button>
          </div>
        </Card>
      );
    }
    const q = QUESTION_BY_ID[practice.order[practice.index]];
    const complete = isComplete(q, practice.response);
    return (
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] font-bold" style={{ color: MUTED }}>
            Practicing {practice.domain === 0 ? 'all domains' : `D${practice.domain} · ${DOMAIN_BY_ID[practice.domain].title}`} · {practice.right}/
            {practice.done} correct so far
          </p>
          <Button kind="ghost" small onClick={() => setView({ kind: 'menu' })}>
            Exit practice
          </Button>
        </div>
        <QuestionCard
          q={q}
          response={practice.response}
          onChange={(r) => setPractice({ ...practice, response: r })}
          revealed={practice.revealed}
          position={{ index: practice.index, total: practice.order.length }}
        />
        <div className="flex flex-wrap items-center gap-3">
          {!practice.revealed ? (
            <>
              <Button
                disabled={!complete}
                onClick={() =>
                  setPractice({
                    ...practice,
                    revealed: true,
                    done: practice.done + 1,
                    right: practice.right + (isCorrect(q, practice.response) ? 1 : 0),
                  })
                }
              >
                Check answer
              </Button>
              {!complete && (
                <span className="text-[12.5px] font-bold" style={{ color: MUTED }}>
                  {q.type === 'match' ? 'Answer every scenario to check.' : `Pick ${selectCount(q)} to check.`}
                </span>
              )}
            </>
          ) : (
            <>
              <span className="text-[14px] font-extrabold" style={{ color: isCorrect(q, practice.response) ? GOOD : BAD }}>
                {isCorrect(q, practice.response) ? 'Correct' : 'Not quite'}
              </span>
              <Button
                onClick={() => {
                  const nextIndex = practice.index + 1;
                  const nextQ = practice.order[nextIndex] ? QUESTION_BY_ID[practice.order[nextIndex]] : null;
                  setPractice({
                    ...practice,
                    index: nextIndex,
                    response: nextQ ? emptyResponse(nextQ) : [],
                    revealed: false,
                  });
                }}
              >
                {practice.index + 1 < practice.order.length ? 'Next item' : 'Finish'}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── mock ──
  if (shown === 'mock' && mock && !mock.submittedAt) {
    const q = QUESTION_BY_ID[mock.order[mock.index]];
    const response = mock.responses[q.id] ?? emptyResponse(q);
    const answeredCount = mock.order.filter((id) => isAnswered(QUESTION_BY_ID[id], mock.responses[id])).length;
    const unanswered = EXAM.items - answeredCount;
    const flagged = mock.flags.includes(q.id);
    const low = remaining < 10 * 60 * 1000;
    return (
      <MockScreen
        mock={mock}
        q={q}
        response={response}
        remaining={remaining}
        low={low}
        answeredCount={answeredCount}
        unanswered={unanswered}
        flagged={flagged}
        onChange={(r) => setMock({ ...mock, responses: { ...mock.responses, [q.id]: r } })}
        onToggleFlag={() =>
          setMock({ ...mock, flags: flagged ? mock.flags.filter((id) => id !== q.id) : [...mock.flags, q.id] })
        }
        onJump={(i) => setMock({ ...mock, index: i })}
        onSubmit={submitMock}
        onPause={() => setView({ kind: 'menu' })}
      />
    );
  }

  // ── results ──
  if (shown === 'results' && mock && mock.submittedAt) {
    return (
      <Results
        mock={mock}
        onRetake={startMock}
        onMenu={() => setView({ kind: 'menu' })}
        onPractice={(d) => {
          startPractice(d);
          scrollToId('quiz');
        }}
      />
    );
  }

  return null;
}

function MockScreen({
  mock,
  q,
  response,
  remaining,
  low,
  answeredCount,
  unanswered,
  flagged,
  onChange,
  onToggleFlag,
  onJump,
  onSubmit,
  onPause,
}: {
  mock: MockState;
  q: Question;
  response: Response;
  remaining: number;
  low: boolean;
  answeredCount: number;
  unanswered: number;
  flagged: boolean;
  onChange: (r: Response) => void;
  onToggleFlag: () => void;
  onJump: (i: number) => void;
  onSubmit: () => void;
  onPause: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="grid gap-4">
      <Card className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3">
        <p className="text-[13px] font-bold" style={{ color: MUTED }}>
          <span className="text-[18px] font-extrabold [font-variant-numeric:tabular-nums]" style={{ color: low ? BAD : INK }}>
            {fmtTime(remaining)}
          </span>{' '}
          left
        </p>
        <p className="text-[13px] font-bold" style={{ color: MUTED }}>
          {answeredCount}/{EXAM.items} answered · {mock.flags.length} flagged
        </p>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button kind="ghost" small onClick={onPause}>
            Pause
          </Button>
          {confirming ? (
            <>
              <span className="text-[12.5px] font-bold" style={{ color: BAD }}>
                {unanswered > 0 ? `${unanswered} unanswered. Submit anyway?` : 'Submit and score?'}
              </span>
              <Button kind="danger" small onClick={onSubmit}>
                Yes, submit
              </Button>
              <Button kind="ghost" small onClick={() => setConfirming(false)}>
                Keep going
              </Button>
            </>
          ) : (
            <Button small onClick={() => setConfirming(true)}>
              Submit exam
            </Button>
          )}
        </div>
      </Card>

      {/* The item map: click to jump. Filled = answered, ring = current, amber = flagged. */}
      <ol className="flex flex-wrap gap-1.5" aria-label="Items">
        {mock.order.map((id, i) => {
          const answered = isAnswered(QUESTION_BY_ID[id], mock.responses[id]);
          const isFlag = mock.flags.includes(id);
          const current = i === mock.index;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onJump(i)}
                aria-label={`Item ${i + 1}${answered ? ', answered' : ''}${isFlag ? ', flagged' : ''}`}
                aria-current={current ? 'true' : undefined}
                className="h-7 w-7 rounded-md text-[11px] font-bold [font-variant-numeric:tabular-nums]"
                style={{
                  background: isFlag ? FLAG_BG : answered ? INK : '#fff',
                  color: isFlag ? FLAG : answered ? '#fff' : MUTED,
                  border: `1px solid ${isFlag ? FLAG : answered ? INK : LINE}`,
                  boxShadow: current ? `0 0 0 2px #fff, 0 0 0 4px ${GUIDE.accent.color}` : 'none',
                }}
              >
                {i + 1}
              </button>
            </li>
          );
        })}
      </ol>

      <QuestionCard
        q={q}
        response={response}
        onChange={onChange}
        revealed={false}
        position={{ index: mock.index, total: EXAM.items }}
        flagged={flagged}
        onToggleFlag={onToggleFlag}
      />

      <div className="flex items-center justify-between gap-3">
        <Button kind="ghost" disabled={mock.index === 0} onClick={() => onJump(mock.index - 1)}>
          Previous
        </Button>
        <Button disabled={mock.index === EXAM.items - 1} onClick={() => onJump(mock.index + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

function Results({
  mock,
  onRetake,
  onMenu,
  onPractice,
}: {
  mock: MockState;
  onRetake: () => void;
  onMenu: () => void;
  onPractice: (d: DomainId) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'wrong' | 'flagged'>('all');
  const [open, setOpen] = useState<string | null>(null);

  const rows = mock.order.map((id, i) => {
    const q = QUESTION_BY_ID[id];
    return { i, q, response: mock.responses[id], right: isCorrect(q, mock.responses[id]), flagged: mock.flags.includes(id) };
  });
  const right = rows.filter((r) => r.right).length;
  const overall = pct(right, EXAM.items);
  const byDomain = DOMAINS.map((d) => {
    const qs = rows.filter((r) => r.q.domain === d.id);
    return { d, total: qs.length, right: qs.filter((r) => r.right).length };
  });
  const elapsed = (mock.submittedAt ?? Date.now()) - mock.startedAt;
  const shown = rows.filter((r) => (filter === 'all' ? true : filter === 'wrong' ? !r.right : r.flagged));

  return (
    <div className="grid gap-4">
      <Card className="p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker>Score report</Kicker>
            <p className="mt-1 text-[2.4rem] font-extrabold leading-none" style={{ color: INK }}>
              {overall}%
            </p>
            <p className="mt-1 text-[14px]" style={{ color: MUTED }}>
              {right} of {EXAM.items} items · {fmtTime(Math.min(elapsed, MOCK_MS))} used of {fmtTime(MOCK_MS)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={onRetake}>Retake with a new order</Button>
            <Button kind="ghost" onClick={onMenu}>
              Back to menu
            </Button>
          </div>
        </div>
        <ol className="mt-6 grid gap-2.5">
          {byDomain.map(({ d, total, right: r }) => {
            const p = pct(r, total);
            return (
              // Phone: name and score on one line, bar beneath. Wider: name, bar, score in one row.
              <li key={d.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[220px_minmax(0,1fr)_160px]">
                <p className="text-[13px] font-bold leading-snug sm:truncate" style={{ color: INK }}>
                  D{d.id} {d.short}
                </p>
                <p className="whitespace-nowrap text-right text-[13px] font-bold [font-variant-numeric:tabular-nums] sm:order-3" style={{ color: MUTED }}>
                  {p}% <span className="font-semibold">({r}/{total})</span>
                  <button
                    type="button"
                    onClick={() => onPractice(d.id)}
                    aria-label={`Practice domain ${d.id} again`}
                    className="ml-2 font-bold hover:underline"
                    style={{ color: GUIDE.accent.color }}
                  >
                    Practice
                  </button>
                </p>
                <div className="col-span-2 h-2.5 w-full overflow-hidden rounded-full sm:order-2 sm:col-span-1" style={{ background: PAPER }}>
                  <div className="h-full rounded-full" style={{ width: `${p}%`, background: p >= 75 ? d.accent : BAD }} />
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-5 text-[13px] leading-relaxed" style={{ color: MUTED }}>
          The real exam reports a scaled score from {EXAM.scaleMin} to {EXAM.scaleMax.toLocaleString()} with a pass mark of {EXAM.cutScore}, and the
          mapping from raw to scaled is not published. A common rule of thumb from people who have sat it is to aim for 75% or better in every
          domain. Bars in red are below that line.
        </p>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <Kicker color={MUTED}>Review</Kicker>
        {(['all', 'wrong', 'flagged'] as const).map((f) => {
          const on = filter === f;
          const label = f === 'all' ? `All ${rows.length}` : f === 'wrong' ? `Incorrect ${rows.length - right}` : `Flagged ${mock.flags.length}`;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={on}
              className="rounded-full border px-3 py-1 text-[12px] font-bold"
              style={on ? { background: INK, color: '#fff', borderColor: INK } : { background: '#fff', color: INK, borderColor: LINE }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <ol className="grid gap-2">
        {shown.map(({ i, q, response, right: r, flagged }) => {
          const isOpen = open === q.id;
          return (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : q.id)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-3 rounded-xl border bg-white px-4 py-3 text-left"
                style={{ borderColor: LINE }}
              >
                <span
                  className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[11px] font-extrabold text-white"
                  style={{ background: r ? GOOD : BAD }}
                  aria-label={r ? 'Correct' : 'Incorrect'}
                >
                  {r ? '✓' : '✗'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2 text-[11px] font-bold" style={{ color: MUTED }}>
                    <span>Item {i + 1}</span>
                    <span style={{ color: DOMAIN_BY_ID[q.domain].accent }}>D{q.domain} · {DOMAIN_BY_ID[q.domain].short}</span>
                    {flagged && <span style={{ color: FLAG }}>⚑ flagged</span>}
                  </span>
                  <span className={`mt-0.5 block text-[13.5px] leading-snug ${isOpen ? '' : 'line-clamp-2'}`} style={{ color: INK }}>
                    {q.stem}
                  </span>
                </span>
                <span className="text-[12px] font-bold" style={{ color: MUTED }}>
                  {isOpen ? 'Hide' : 'Review'}
                </span>
              </button>
              {isOpen && (
                <div className="mt-2">
                  <QuestionCard q={q} response={response ?? emptyResponse(q)} onChange={() => {}} revealed position={{ index: i, total: EXAM.items }} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────── the page

export default function ArchitectExam() {
  const active = useActiveSection();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // "Practice this domain" on a card hands the quiz a request and scrolls to
  // it. A counter, not a timestamp, so two quick clicks both register.
  const [practiceRequest, setPracticeRequest] = useState<PracticeRequest | null>(null);
  const requestCount = useRef(0);
  const practiceDomain = (domain: DomainId) => {
    requestCount.current += 1;
    setPracticeRequest({ domain, nonce: requestCount.current });
    scrollToId('quiz');
  };

  // Full screen covers the page, locks the scroll behind it, and exits on
  // Escape: the same behavior as the ChatGPT field guide. The quiz keeps its
  // state across the toggle because only the wrapper's class changes.
  useEffect(() => {
    if (!isFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    const exitOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFullscreen(false);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', exitOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', exitOnEscape);
    };
  }, [isFullscreen]);

  return (
    <div
      className={`fg-scope ${isFullscreen ? 'fg-scope--fullscreen' : ''}`}
      style={
        isFullscreen
          ? {
              position: 'fixed',
              inset: 0,
              zIndex: 2147483647,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              width: '100vw',
              height: '100dvh',
              maxWidth: 'none',
              margin: 0,
              overflow: 'hidden',
              border: 0,
              borderRadius: 0,
              background: '#ffffff',
            }
          : undefined
      }
    >
      <div
        className="fg-toolbar mb-4 flex justify-end"
        style={isFullscreen ? { position: 'absolute', top: 24, right: 24, zIndex: 1, marginBottom: 0 } : undefined}
      >
        <button
          type="button"
          onClick={() => setIsFullscreen((current) => !current)}
          aria-label={isFullscreen ? 'Exit full screen' : 'Expand guide to full screen'}
          className="inline-flex items-center gap-2 rounded-lg border border-[#ded8ce] bg-white px-3 py-2 text-[13px] font-bold text-[#394646] transition-colors hover:border-[#35656E]"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                isFullscreen
                  ? 'M9 9 4.5 4.5M4.5 4.5v3.75m0-3.75h3.75M15 9l4.5-4.5m0 0v3.75m0-3.75h-3.75M9 15l-4.5 4.5m0 0v-3.75m0 3.75h3.75M15 15l4.5 4.5m0 0v-3.75m0 3.75h-3.75'
                  : 'M8.25 3.75h-4.5v4.5M15.75 3.75h4.5v4.5M8.25 20.25h-4.5v-4.5M15.75 20.25h4.5v-4.5'
              }
            />
          </svg>
          {isFullscreen ? 'Exit full screen' : 'Full screen'}
        </button>
      </div>
      {/* In full screen this is the scroll container, so the sidebar sticks
          inside it rather than to a page that no longer scrolls. */}
      <div
        className="fg-guide-body"
        style={isFullscreen ? { flex: '1 1 auto', minHeight: 0, overflowX: 'hidden', overflowY: 'auto' } : undefined}
      >
      <div className="max-w-[1240px] mx-auto flex gap-8 items-start">
        <OnThisPage active={active} compact={isFullscreen} />
        <article className="min-w-0 flex-1 pb-6">
          <SectionPills />

          {/* Hero */}
          <header id="overview" className="scroll-mt-24">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ background: '#FFF4CE', color: '#615D58' }}>
                {GUIDE.kicker}
              </span>
              <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ background: GUIDE.accent.bg, color: GUIDE.accent.color }}>
                {EXAM.code}
              </span>
              <span className="text-[12px] font-semibold" style={{ color: MUTED }}>
                {GUIDE.readMinutes} minute read, then the test
              </span>
            </div>
            <h1 className="mt-4 max-w-[820px] text-[2.3rem] md:text-[3rem] font-extrabold leading-[1.04] tracking-[-0.03em]" style={{ color: INK }}>
              {GUIDE.title}
            </h1>
            <p className="mt-4 max-w-[700px] text-[18px] leading-relaxed" style={{ color: INK }}>
              {GUIDE.lede}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#quiz"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-bold text-white no-underline"
                style={{ background: GUIDE.accent.color }}
              >
                Jump to the practice test
              </a>
              <a
                href="#blueprint"
                className="inline-flex items-center gap-2 rounded-xl border bg-white px-5 py-3 text-[14px] font-bold no-underline"
                style={{ borderColor: LINE, color: INK }}
              >
                See the seven domains
              </a>
            </div>
            <div className="mt-8 rounded-[22px] px-5 py-6 md:px-8 md:py-7" style={{ background: PAPER }}>
              <Kicker>The blueprint</Kicker>
              <p className="mt-1 mb-4 text-[14px]" style={{ color: MUTED }}>
                Seven domains, weighted. Applied to {EXAM.items} items.
              </p>
              <WeightBar onPick={(d) => scrollToId(`domain-${d}`)} />
            </div>
          </header>

          <div className="mt-14 [&>*+*]:mt-20">
            {/* What the exam is */}
            <section>
              <Kicker>What the exam is</Kicker>
              <H2>{OVERVIEW.title}</H2>
              {OVERVIEW.body.map((p) => (
                <Lede key={p}>{p}</Lede>
              ))}
              <div className="mt-6">
                <AtAGlance />
              </div>
            </section>

            {/* Blueprint */}
            <section id="blueprint" className="scroll-mt-24">
              <Kicker>The seven domains</Kicker>
              <H2>Integration, design, and evaluation are half the exam</H2>
              <Lede>Domains 3, 1, and 4 are 52% of the items. Study them first. Each card says what the items actually test.</Lede>
              <DomainCards onPractice={practiceDomain} />
            </section>

            {/* Question shape */}
            <section id="shape" className="scroll-mt-24">
              <Kicker>How questions are shaped</Kicker>
              <H2>{SHAPE.title}</H2>
              <Shape />
            </section>

            {/* Practice test */}
            <section id="quiz" className="scroll-mt-24">
              <Kicker>Practice test</Kicker>
              <H2>{EXAM.items} original items in the shape of the real exam</H2>
              <Lede>
                Distributed to the blueprint weights, with the three item formats candidates report. Every option has a rationale, because the wrong
                options are where the distractor patterns live.
              </Lede>
              <div className="mt-6">
                <Quiz request={practiceRequest} />
              </div>
              <p className="mt-6 text-[12.5px] leading-relaxed" style={{ color: MUTED }}>
                {DISCLAIMER}
              </p>
            </section>

            {/* Sources */}
            <details className="group">
              <summary className="cursor-pointer list-none text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                Official sources
              </summary>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                {SOURCES.map((s) => (
                  <li key={s.href} className="text-[13px]">
                    <a href={s.href} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: GUIDE.accent.color }}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </article>
      </div>
      </div>
    </div>
  );
}
