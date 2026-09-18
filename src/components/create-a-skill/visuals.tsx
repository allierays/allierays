import type { CSSProperties, ReactNode } from 'react';
import {
  ANATOMY,
  CHECKLIST,
  GOTCHAS,
  SCOPE_EXAMPLES,
  HOW,
  WHY,
  CURATION_LOOP,
  CODEX_BUILD,
  DESCRIPTION_COMPARE,
  FREEDOM_STOPS,
  HOMES,
  SAMPLE_SKILL,
  SKILLS_PAGE,
  WORKED_EXAMPLE,
  type Evidence,
} from './content';

// The guide's visuals, drawn from a single progress number.
//
// This file must stay free of motion/react. Every visual takes `t` in 0..1 and
// lays itself out for that moment, so the web page can drive it with a
// motion.dev animation when it scrolls into view and the Remotion video can
// drive it with a spring on the frame clock. One drawing, two clocks; the two
// cannot drift.
//
// Sizes are in px so the video can magnify a visual with `zoom` (which re-lays
// text at its final size) rather than transform: scale (which blurs it).

const INK = '#394646';
const MUTED = '#637979';
const LINE = 'rgba(222,216,206,0.7)';

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Progress of the window [start, end] within t. */
export const seg = (t: number, start: number, end: number) => clamp01((t - start) / (end - start));

/** Ease-out cubic. Progress values arrive linear from the web clock. */
export const ease = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);

/**
 * Progress of item i of n, with windows overlapping so the reveal reads as one
 * cascade rather than n separate pops.
 */
export function cascade(t: number, i: number, n: number, from = 0, to = 1): number {
  const span = to - from;
  const step = span / (n + 1);
  return ease(seg(t, from + i * step, from + (i + 2) * step));
}

/** The t at which item i of n begins in a cascade(t, i, n, from, to). */
export const cascadeStart = (i: number, n: number, from = 0, to = 1) => from + i * ((to - from) / (n + 1));

/**
 * The moments in t where each visual's parts begin, so a clock that knows when
 * the narration reaches each part (the video) can steer t to land on them.
 * Kept next to the cascades they describe; change both together.
 */
export const MILESTONES = {
  tiers: [0, 1, 2].map((i) => cascadeStart(i, 3, 0.1, 0.95)),
  whyCards: WHY.items.map((_, i) => cascadeStart(i, WHY.items.length, 0.05, 0.9)),
  gotchas: GOTCHAS.map((_, i) => cascadeStart(i, GOTCHAS.length, 0.05, 0.92)),
  scope: SCOPE_EXAMPLES.map((_, i) => cascadeStart(i, SCOPE_EXAMPLES.length, 0.05, 0.92)),
  descriptionParts: [0, 1, 2].map((i) => cascadeStart(i, 3, 0.45, 0.9)),
  bars: (n: number) => Array.from({ length: n }, (_, i) => cascadeStart(i, n, 0.15, 0.95)),
  freedomStops: [0.2, 0.575, 0.95],
  loopSteps: [0, 1, 2, 3, 4].map((i) => cascadeStart(i, 5, 0, 0.9)),
  // The three things to look at on the Skills page, in the order the voice
  // names them: the tab, the Create button, the shared section.
  skillsPagePins: [0.14, 0.42, 0.74],
  homeRows: HOMES.rows.map((_, i) => cascadeStart(i, HOMES.rows.length, 0.25, 0.95)),
};

export function rise(p: number, distance = 16): CSSProperties {
  return { opacity: p, transform: `translateY(${(1 - p) * distance}px)` };
}

function Mono({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', ...style }}>{children}</span>
  );
}

// ─── The SKILL.md card ───────────────────────────────────────────────────────

/**
 * A SKILL.md drawn line by line: frontmatter first, then the body. Labels for
 * the two halves ("routes" and "does the work") arrive last, since that split
 * is the guide's one idea.
 */
export function SkillFileCard({ t, width = 560 }: { t: number; width?: number }) {
  const frame = ease(seg(t, 0, 0.15));
  const nameP = cascade(t, 0, 3, 0.1, 0.5);
  const descP = cascade(t, 1, 3, 0.1, 0.5);
  const bodyLines = SAMPLE_SKILL.body;
  const labels = ease(seg(t, 0.82, 1));

  return (
    <div style={{ width, maxWidth: '100%', position: 'relative', ...rise(frame, 12) }}>
      <div
        className="rounded-2xl border bg-white shadow-sm overflow-hidden"
        style={{ borderColor: LINE, fontSize: 14, lineHeight: 1.5 }}
      >
        <div className="flex items-center gap-2 px-4 h-9 border-b" style={{ borderColor: LINE, background: '#FAF9F4' }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#DED8CE' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#DED8CE' }} />
          <Mono style={{ marginLeft: 6, fontSize: 12, color: MUTED }}>
            {SAMPLE_SKILL.name}/SKILL.md
          </Mono>
        </div>
        <div className="px-5 py-4" style={{ background: '#FFF9F5' }}>
          <Mono style={{ color: MUTED, display: 'block', fontSize: 12 }}>---</Mono>
          <div style={rise(nameP, 8)}>
            <Mono style={{ color: '#B05C3B', fontSize: 13 }}>name: </Mono>
            <Mono style={{ color: INK, fontSize: 13 }}>{SAMPLE_SKILL.name}</Mono>
          </div>
          <div style={rise(descP, 8)}>
            <Mono style={{ color: '#B05C3B', fontSize: 13 }}>description: </Mono>
            <Mono style={{ color: INK, fontSize: 13, overflowWrap: 'anywhere' }}>{SAMPLE_SKILL.description}</Mono>
          </div>
          <Mono style={{ color: MUTED, display: 'block', fontSize: 12 }}>---</Mono>
        </div>
        <div className="px-5 py-4 space-y-1.5" style={{ borderTop: `1px solid ${LINE}` }}>
          {bodyLines.map((line, i) => (
            <p key={line} className="flex gap-2" style={{ color: INK, ...rise(cascade(t, i, bodyLines.length, 0.45, 0.85), 8) }}>
              <span style={{ color: '#35656E', fontWeight: 700 }}>{i + 1}.</span>
              <span>{line}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Which half does which job. Sits under the card, so it fits the
          narrow article column beside the page's sidebar and the video's
          hook scene alike. */}
      <div className="mt-3 grid grid-cols-2 gap-3" style={{ opacity: labels, transform: `translateY(${(1 - labels) * 8}px)` }}>
        <SideLabel color="#B05C3B" bg="#FFDDCC" title="Decides whether it opens" body="Read every time you send a message." />
        <SideLabel color="#35656E" bg="#D3E9EE" title="Does the work" body="Read only once it opens. The part you know, not a manual." />
      </div>
    </div>
  );
}

function SideLabel({ color, bg, title, body }: { color: string; bg: string; title: string; body: string }) {
  return (
    <div className="rounded-xl px-3 py-2" style={{ background: bg }}>
      <p className="text-[12px] font-extrabold" style={{ color }}>{title}</p>
      <p className="text-[12px] leading-snug" style={{ color: INK }}>{body}</p>
    </div>
  );
}

// ─── What a skill is: the folder ─────────────────────────────────────────────

/**
 * The standard's own folder shape, with the myth it corrects stamped across
 * the top. Only SKILL.md carries a "Required" note; the rest read "Optional",
 * which is the point of the drawing.
 */
export function SkillFolder({
  t,
  width = 620,
  variant = 'page',
}: {
  t: number;
  width?: number;
  variant?: 'page' | 'video';
}) {
  const video = variant === 'video';
  const note = ease(seg(t, 0.85, 1));
  return (
    <div style={{ width, maxWidth: '100%' }}>
      <FolderTree
        t={t}
        notes
        items={ANATOMY.tree}
        size={video ? 26 : 12.5}
        revealWindow={video ? [0, 0.08] : [0, 0.8]}
      />
      {/* The closing note is reading material. The voice covers it. */}
      {!video && (
        <p className="mt-3" style={{ color: MUTED, fontSize: 12.5, lineHeight: 1.5, ...rise(note, 6) }}>
          {ANATOMY.note}
        </p>
      )}
    </div>
  );
}

// ─── Why skills ──────────────────────────────────────────────────────────────

/** The three benefits, as three cards that arrive in turn. */
export function WhyCards({
  t,
  width = 720,
  variant = 'page',
  stack = false,
}: {
  t: number;
  width?: number;
  variant?: 'page' | 'video';
  /** One card per row, for a scene that puts them in a side column. */
  stack?: boolean;
}) {
  const n = WHY.items.length;
  const video = variant === 'video';
  const usageP = ease(seg(t, 0.85, 1));
  return (
    <div style={{ width, maxWidth: '100%' }}>
      <div className={stack ? 'grid grid-cols-1' : 'grid sm:grid-cols-3'} style={{ gap: video ? 26 : 12 }}>
        {WHY.items.map((item, i) => (
          <div
            key={item.key}
            className="rounded-2xl"
            style={{
              background: item.bg,
              padding: video ? '38px 32px' : '16px',
              ...rise(cascade(t, i, n, 0.05, 0.9), 12),
            }}
          >
            <p
              className="font-extrabold leading-snug"
              style={{ color: item.color, fontSize: video ? 36 : 15, minHeight: video && !stack ? 92 : undefined }}
            >
              {item.title}
            </p>
            <p style={{ marginTop: video ? 14 : 6, color: INK, fontSize: video ? 27 : 12.5, lineHeight: 1.4 }}>
              {video ? item.short : item.body}
            </p>
          </div>
        ))}
      </div>
      {!video && (
        <p className="mt-3" style={{ color: MUTED, fontSize: 12.5, lineHeight: 1.5, ...rise(usageP, 6) }}>{WHY.usage}</p>
      )}
    </div>
  );
}

// ─── How skills work: progressive disclosure ─────────────────────────────────

/**
 * The three stages, numbered, each with a bar for how much of the time that
 * stage's content is sitting in context. Stage one is always there; the other
 * two are conditional, which is what the shrinking bars say.
 */
export function DisclosureStages({
  t,
  width = 620,
  variant = 'page',
}: {
  t: number;
  width?: number;
  variant?: 'page' | 'video';
}) {
  const n = HOW.stages.length;
  const video = variant === 'video';
  const note = ease(seg(t, 0.88, 1));
  return (
    <div style={{ width, maxWidth: '100%' }}>
      <div style={{ display: 'grid', gap: video ? 26 : 16 }}>
        {HOW.stages.map((stage, i) => {
          const p = cascade(t, i, n, 0.1, 0.95);
          return (
            <div key={stage.key} className="flex" style={{ gap: video ? 18 : 12, ...rise(p, 10) }}>
              <span
                className="flex flex-shrink-0 items-center justify-center rounded-full font-extrabold"
                style={{
                  marginTop: video ? 4 : 2,
                  height: video ? 46 : 28,
                  width: video ? 46 : 28,
                  background: stage.bg,
                  color: stage.color,
                  fontSize: video ? 22 : 13,
                }}
              >
                {stage.number}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-extrabold" style={{ color: INK, fontSize: video ? 28 : 14 }}>{stage.label}</p>
                  <p className="flex-shrink-0 font-semibold" style={{ color: stage.color, fontSize: video ? 21 : 12 }}>
                    {stage.when}
                  </p>
                </div>
                <p style={{ marginTop: video ? 6 : 2, color: INK, fontSize: video ? 21 : 12.5, lineHeight: 1.4 }}>
                  {video ? stage.short : stage.body}
                </p>
                <div
                  className="rounded-full"
                  style={{ marginTop: video ? 12 : 6, height: video ? 14 : 10, background: '#F1EEE8' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${stage.share * 100 * ease(seg(p, 0.3, 1))}%`, background: stage.color }}
                  />
                </div>
                <p style={{ marginTop: video ? 8 : 4, color: MUTED, fontSize: video ? 19 : 12 }}>{stage.cost}</p>
              </div>
            </div>
          );
        })}
      </div>
      {/* The closing thought is the video's chip instead. */}
      {!video && (
        <p className="mt-3" style={{ color: MUTED, fontSize: 12.5, lineHeight: 1.5, ...rise(note, 6) }}>{HOW.note}</p>
      )}
    </div>
  );
}

export function FolderTree({
  t,
  items,
  notes = false,
  size = 12.5,
  revealWindow = [0, 0.8],
}: {
  t: number;
  items: { path: string; kind: 'dir' | 'file'; note?: string; depth?: number }[];
  notes?: boolean;
  size?: number;
  /** When the rows arrive, as a [from, to] window in t. */
  revealWindow?: [number, number];
}) {
  return (
    <div className="rounded-xl border bg-white" style={{ borderColor: LINE, padding: size * 1.1 }}>
      {items.map((item, i) => {
        const p = cascade(t, i, items.length, revealWindow[0], revealWindow[1]);
        const depth = item.depth ?? (item.kind === 'dir' ? 0 : 1);
        return (
          <div
            key={item.path}
            className="flex items-start gap-2"
            style={{ paddingLeft: depth * (size * 1.1), paddingTop: size * 0.3, paddingBottom: size * 0.3, ...rise(p, 6) }}
          >
            <span className="flex-shrink-0" style={{ marginTop: size * 0.24, color: item.kind === 'dir' ? '#B05C3B' : '#35656E' }}>
              {item.kind === 'dir' ? <FolderIcon size={size * 1.1} /> : <FileIcon size={size * 1.1} />}
            </span>
            <div className="min-w-0" style={{ overflowWrap: 'anywhere' }}>
              <Mono style={{ fontSize: size, color: INK, fontWeight: item.kind === 'dir' ? 700 : 500 }}>{item.path}</Mono>
              {notes && item.note && (
                <p className="leading-snug" style={{ fontSize: size * 0.94, color: MUTED }}>{item.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FolderIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
    </svg>
  );
}
function FileIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
}

// ─── Description before / after ──────────────────────────────────────────────

/**
 * A vague description on the left that misfires, and the real brand-humanizer
 * description on the right with its three parts lighting up in turn.
 */
export function DescriptionCompare({
  t,
  width = 720,
  variant = 'page',
}: {
  t: number;
  width?: number;
  variant?: 'page' | 'video';
}) {
  const video = variant === 'video';
  const { bad, good, partLabels } = DESCRIPTION_COMPARE;
  const badP = ease(seg(t, 0, 0.25));
  const faults = bad.faults;
  const goodP = ease(seg(t, 0.3, 0.5));
  const parts = good.segments;
  const verdict = ease(seg(t, 0.9, 1));

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_1.5fr]" style={{ width, maxWidth: '100%' }}>
      <div
        className="rounded-2xl border bg-white p-4 flex flex-col"
        style={{
          borderColor: LINE,
          opacity: badP,
          transform: `translateX(${(1 - badP) * -28}px)`,
        }}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: '#B91C1C' }}>Too vague</p>
        <Mono style={{ display: 'block', marginTop: 8, fontSize: 13, color: INK }}>
          description: {bad.text}
        </Mono>
        <ul className="mt-3 space-y-1.5">
          {faults.map((f, i) => (
            <li key={f} className="flex items-start gap-2 text-[13px]" style={{ color: MUTED, ...rise(cascade(t, i, faults.length, 0.1, 0.35), 6) }}>
              <span style={{ color: '#B91C1C', fontWeight: 700 }}>×</span>
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-auto pt-3 text-[12px] font-semibold" style={{ color: '#B91C1C', opacity: verdict }}>{bad.verdict}</p>
      </div>

      <div
        className="rounded-2xl border bg-white p-4 flex flex-col"
        style={{
          borderColor: LINE,
          opacity: goodP,
          transform: `translateX(${(1 - goodP) * 28}px)`,
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: '#51714B' }}>Opens when it should</p>
          <Mono style={{ fontSize: 12, color: MUTED }}>{good.name}/SKILL.md</Mono>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: INK }}>
          <Mono style={{ color: '#B05C3B' }}>description: </Mono>
          {parts.map((s, i) => {
            const p = cascade(t, i, parts.length, 0.45, 0.9);
            const meta = partLabels[s.part];
            return (
              <span
                key={s.part}
                style={{
                  backgroundColor: hexToRgba(meta.bg, p),
                  borderRadius: 6,
                  padding: '1px 4px',
                  margin: '-1px -1px',
                  boxDecorationBreak: 'clone',
                  WebkitBoxDecorationBreak: 'clone',
                  fontWeight: p > 0.5 ? 600 : 400,
                }}
              >
                {video ? s.videoText : s.text}
              </span>
            );
          })}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {parts.map((s, i) => {
            const meta = partLabels[s.part];
            const p = cascade(t, i, parts.length, 0.45, 0.9);
            return (
              <span key={s.part} className="rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ background: meta.bg, color: meta.color, ...rise(p, 6) }}>
                {meta.label}
              </span>
            );
          })}
        </div>
        <p className="mt-auto pt-3 text-[12px] font-semibold" style={{ color: '#51714B', opacity: verdict }}>{good.verdict}</p>
      </div>
    </div>
  );
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${clamp01(alpha)})`;
}

// ─── Evidence bars ───────────────────────────────────────────────────────────

/**
 * Horizontal bars for a principle's evidence. Charcoal by default, the one
 * that carries the point in the guide's accent. One colour pair, because the
 * comparison is the content.
 */
export function GainBars({
  t,
  bars,
  title,
  source,
  width = 560,
  accent = '#B05C3B',
}: {
  t: number;
  bars: Evidence[];
  title: string;
  source: string;
  width?: number;
  accent?: string;
}) {
  const head = ease(seg(t, 0, 0.2));
  return (
    <div className="rounded-2xl border bg-white p-5" style={{ width, maxWidth: '100%', borderColor: LINE }}>
      <p className="text-[13px] font-extrabold" style={{ color: INK, ...rise(head, 8) }}>{title}</p>
      <div className="mt-4 space-y-3.5">
        {bars.map((bar, i) => {
          const p = cascade(t, i, bars.length, 0.15, 0.95);
          const fill = ease(seg(p, 0.2, 1));
          const color = bar.highlight ? accent : '#394646';
          return (
            <div key={bar.label} style={{ opacity: ease(seg(p, 0, 0.4)) }}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[13px]" style={{ color: bar.highlight ? INK : MUTED, fontWeight: bar.highlight ? 700 : 500 }}>{bar.label}</p>
                <p
                  className="text-[15px] font-extrabold [font-variant-numeric:tabular-nums]"
                  style={{ color, fontFamily: 'var(--font-body)', opacity: ease(seg(p, 0.5, 1)) }}
                >
                  {bar.figure}
                </p>
              </div>
              <div className="mt-1.5 h-3 rounded-full" style={{ background: '#F1EEE8' }}>
                <div className="h-full rounded-full" style={{ width: `${Math.max(1.5, bar.share * 100 * fill)}%`, background: color }} />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-[11px]" style={{ color: MUTED, opacity: ease(seg(t, 0.85, 1)) }}>Source: {source}</p>
    </div>
  );
}

// ─── Workflow handoff ────────────────────────────────────────────────────────

/** The four parts of a useful workflow, revealed in the order AI will use them. */
export function FreedomDial({ t, width = 680 }: { t: number; width?: number }) {
  const stops = FREEDOM_STOPS;
  return (
    <div style={{ width, maxWidth: '100%' }}>
      <div className="grid gap-3 sm:grid-cols-4">
        {stops.map((s, i) => {
          const shown = cascade(t, i, stops.length, 0.04, 0.88);
          return (
            <div
              key={s.key}
              className="relative rounded-2xl border p-4"
              style={{
                borderColor: s.color,
                background: hexToRgba(s.bg, 0.72),
                ...rise(shown, 10),
              }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: s.color }}>{s.label}</p>
              <p className="mt-3 text-[15px] font-extrabold leading-snug" style={{ color: INK }}>{s.give}</p>
              <p className="mt-4 text-[13px] leading-snug" style={{ color: MUTED }}>{s.example}</p>
              {i < stops.length - 1 && (
                <span
                  className="absolute -right-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white"
                  style={{ color: s.color, opacity: cascade(t, i + 1, stops.length, 0.04, 0.88) }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Curation loop ───────────────────────────────────────────────────────────

/** The five steps, arriving in order, with a return arrow from the last to the first. */
export function CurationLoop({ t, width = 680 }: { t: number; width?: number }) {
  const steps = CURATION_LOOP;
  const back = ease(seg(t, 0.9, 1));
  return (
    <div style={{ width, maxWidth: '100%' }}>
      <ol className="grid gap-2 sm:grid-cols-5">
        {steps.map((s, i) => {
          const p = cascade(t, i, steps.length, 0, 0.9);
          return (
            <li key={s.key} className="relative rounded-2xl border bg-white p-3" style={{ borderColor: LINE, ...rise(p, 12) }}>
              <span className="flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-extrabold" style={{ background: '#FFDDCC', color: '#B05C3B' }}>
                {i + 1}
              </span>
              <p className="mt-2 text-[13px] font-extrabold leading-snug" style={{ color: INK }}>{s.label}</p>
              <p className="mt-1 text-[12px] leading-snug" style={{ color: MUTED }}>{s.detail}</p>
              {i < steps.length - 1 && (
                <span className="absolute -right-2 top-5 hidden sm:block" style={{ color: '#C7D1D1', opacity: cascade(t, i + 1, steps.length, 0, 0.9) }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <div className="mt-2 flex items-center gap-2 text-[12px] font-semibold" style={{ color: '#B05C3B', opacity: back }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
        Repeat until both scores meet the bar
      </div>
    </div>
  );
}

// ─── Checklist ───────────────────────────────────────────────────────────────

/**
 * The pre-share checklist. Ticks arrive with t in the video; on the web the
 * page owns the ticked state and passes it in, so t only reveals the rows.
 */
export function ChecklistList({
  t,
  checked,
  onToggle,
  width = 680,
}: {
  t: number;
  checked?: boolean[];
  onToggle?: (i: number) => void;
  width?: number;
}) {
  const interactive = Boolean(onToggle);
  return (
    <ul className="space-y-2" style={{ width, maxWidth: '100%' }}>
      {CHECKLIST.map((item, i) => {
        const p = cascade(t, i, CHECKLIST.length, 0, 0.9);
        const done = interactive ? Boolean(checked?.[i]) : p > 0.6;
        const Row = interactive ? 'button' : 'div';
        return (
          <li key={item} style={rise(p, 8)}>
            <Row
              type={interactive ? 'button' : undefined}
              onClick={interactive ? () => onToggle?.(i) : undefined}
              className={`flex w-full items-start gap-3 rounded-xl border bg-white px-4 py-2.5 text-left ${interactive ? 'transition-colors hover:border-[#B05C3B]' : ''}`}
              style={{ borderColor: done ? '#B05C3B' : LINE }}
            >
              <span
                className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2"
                style={{ borderColor: done ? '#B05C3B' : '#C7D1D1', background: done ? '#B05C3B' : 'white' }}
              >
                {done && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                )}
              </span>
              <span className="text-[14px] leading-snug" style={{ color: done ? INK : '#4b5a5a' }}>{item}</span>
            </Row>
          </li>
        );
      })}
    </ul>
  );
}

// ─── Worked example ──────────────────────────────────────────────────────────

/** brand-humanizer's folder, with what each file is for. */
export function WorkedExampleTree({ t }: { t: number }) {
  return <FolderTree t={t} items={WORKED_EXAMPLE.tree} notes />;
}

// ─── The Skills page ─────────────────────────────────────────────────────────

/** A numbered pin, sat over the control it points at. */
function Pin({ n, p, style }: { n: number; p: number; style?: CSSProperties }) {
  return (
    <span
      className="absolute flex items-center justify-center rounded-full font-extrabold text-white"
      style={{
        width: 18,
        height: 18,
        fontSize: 11,
        background: '#B05C3B',
        boxShadow: '0 0 0 3px #FFF9F5',
        opacity: p,
        transform: `scale(${0.6 + p * 0.4})`,
        ...style,
      }}
    >
      {n}
    </span>
  );
}

/** One skill's row in the Skills page list. */
function SkillRow({
  name,
  what,
  p,
  action,
}: {
  name: string;
  what: string;
  p: number;
  action: 'menu' | 'add';
}) {
  return (
    <div className="flex items-center gap-2" style={{ minWidth: 0, ...rise(p, 6) }}>
      <span
        className="flex-shrink-0 rounded-md"
        style={{ width: 20, height: 20, background: '#EFEDE7', border: `1px solid ${LINE}` }}
      />
      <span style={{ minWidth: 0, flex: 1 }}>
        <span className="block truncate font-semibold" style={{ color: INK, fontSize: 11 }}>{name}</span>
        <span className="block truncate" style={{ color: MUTED, fontSize: 10 }}>{what}</span>
      </span>
      <span className="flex-shrink-0 font-bold" style={{ color: MUTED, fontSize: 12 }}>
        {action === 'add' ? '+' : '···'}
      </span>
    </div>
  );
}

/**
 * chatgpt.com/skills, drawn rather than screenshotted.
 *
 * A screenshot would carry a browser chrome, somebody's chat history and a
 * resolution that does not survive a 1920px frame. This is the same page with
 * the real skill names, and it animates: the tab, then the Create button, then
 * the section a published skill lands in. Those three are the pins.
 */
export function SkillsPageShot({ t, width = 720 }: { t: number; width?: number }) {
  const frame = ease(seg(t, 0, 0.1));
  const chrome = ease(seg(t, 0.06, 0.2));
  const installed = SKILLS_PAGE.installed;
  const shared = SKILLS_PAGE.shared;
  const scopes = ease(seg(t, 0.5, 0.62));
  const sharedHead = ease(seg(t, 0.58, 0.7));
  const pins = MILESTONES.skillsPagePins.map((m) => ease(seg(t, m, m + 0.1)));

  return (
    <div style={{ width, maxWidth: '100%', ...rise(frame, 12) }}>
      <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: LINE, background: '#FFF' }}>
        {/* Address bar */}
        <div className="flex items-center gap-2 px-3 border-b" style={{ height: 30, borderColor: LINE, background: '#FAF9F4' }}>
          <span className="rounded-full" style={{ width: 7, height: 7, background: '#DED8CE' }} />
          <span className="rounded-full" style={{ width: 7, height: 7, background: '#DED8CE' }} />
          <span
            className="ml-1 rounded-full px-2.5 py-0.5"
            style={{ background: '#FFF', border: `1px solid ${LINE}` }}
          >
            <Mono style={{ fontSize: 10, color: INK }}>{SKILLS_PAGE.url}</Mono>
          </span>
        </div>

        <div className="flex" style={{ minHeight: 232 }}>
          {/* Sidebar: the route people cannot find. */}
          <div className="flex-shrink-0 border-r py-2.5" style={{ width: 104, borderColor: LINE, background: '#FAF9F4' }}>
            {SKILLS_PAGE.sidebar.map((item, i) => {
              const active = item === SKILLS_PAGE.sidebarActive;
              return (
                <div
                  key={item}
                  className="mx-1.5 rounded-md px-2 py-1"
                  style={{
                    background: active ? '#EFEDE7' : 'transparent',
                    color: active ? INK : MUTED,
                    fontSize: 10.5,
                    fontWeight: active ? 700 : 500,
                    ...rise(ease(seg(t, 0.06 + i * 0.012, 0.2 + i * 0.012)), 4),
                  }}
                >
                  {item}
                </div>
              );
            })}
          </div>

          {/* The panel */}
          <div className="flex-1 px-4 py-3" style={{ minWidth: 0 }}>
            {/* Plugins / Skills toggle */}
            <div className="relative flex justify-center" style={{ opacity: chrome }}>
              <div className="relative inline-flex rounded-full p-0.5" style={{ background: '#EFEDE7' }}>
                {SKILLS_PAGE.tabs.map((tab) => {
                  const active = tab === SKILLS_PAGE.activeTab;
                  return (
                    <span
                      key={tab}
                      className="rounded-full px-3 py-0.5"
                      style={{
                        background: active ? '#FFF' : 'transparent',
                        color: active ? INK : MUTED,
                        fontSize: 10.5,
                        fontWeight: 700,
                        boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : undefined,
                      }}
                    >
                      {tab}
                    </span>
                  );
                })}
                <Pin n={1} p={pins[0]} style={{ top: -8, right: -8 }} />
              </div>
            </div>

            {/* Heading, search and the round Create button */}
            <div className="mt-3 flex items-end justify-between gap-3" style={{ opacity: chrome }}>
              <span style={{ minWidth: 0 }}>
                <span className="block font-extrabold tracking-tight" style={{ color: INK, fontSize: 20 }}>
                  {SKILLS_PAGE.heading}
                </span>
                <span className="block truncate" style={{ color: MUTED, fontSize: 10.5 }}>{SKILLS_PAGE.sub}</span>
              </span>
              <span className="relative flex flex-shrink-0 items-center gap-1.5">
                <span
                  className="rounded-full px-2.5 py-1"
                  style={{ border: `1px solid ${LINE}`, color: MUTED, fontSize: 10 }}
                >
                  Search Skills
                </span>
                <span
                  className="flex items-center justify-center rounded-full font-bold"
                  style={{ width: 20, height: 20, border: `1px solid ${LINE}`, color: INK, fontSize: 13 }}
                >
                  +
                </span>
                <Pin n={2} p={pins[1]} style={{ top: -8, right: -8 }} />
              </span>
            </div>

            {/* Installed */}
            <p className="mt-3 font-bold" style={{ color: INK, fontSize: 11, opacity: chrome }}>
              {SKILLS_PAGE.installedLabel}
            </p>
            <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {installed.map((sk, i) => (
                <SkillRow key={sk.name} name={sk.name} what={sk.what} action="menu" p={cascade(t, i, installed.length, 0.18, 0.55)} />
              ))}
            </div>

            {/* Workspace / Personal */}
            <div className="mt-3 flex gap-1.5" style={{ opacity: scopes }}>
              {SKILLS_PAGE.scopes.map((sc) => {
                const active = sc === SKILLS_PAGE.activeScope;
                return (
                  <span
                    key={sc}
                    className="rounded-full px-2.5 py-0.5"
                    style={{
                      background: active ? '#EFEDE7' : 'transparent',
                      color: active ? INK : MUTED,
                      fontSize: 10.5,
                      fontWeight: 600,
                    }}
                  >
                    {sc}
                  </span>
                );
              })}
            </div>

            {/* Shared with the workspace: where a published skill arrives. */}
            <p className="relative mt-3 inline-block font-bold" style={{ color: INK, fontSize: 11, opacity: sharedHead }}>
              {SKILLS_PAGE.sharedLabel}
              <Pin n={3} p={pins[2]} style={{ top: -8, right: -22 }} />
            </p>
            <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {shared.map((sk, i) => (
                <SkillRow key={sk.name} name={sk.name} what={sk.what} action="add" p={cascade(t, i, shared.length, 0.6, 0.95)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* What each pin is. */}
      <ol className="mt-3 grid gap-1.5 sm:grid-cols-3">
        {SKILLS_PAGE.callouts.map((c, i) => (
          <li key={c.key} className="flex items-start gap-2" style={rise(pins[i], 6)}>
            <span
              className="flex flex-shrink-0 items-center justify-center rounded-full font-extrabold text-white"
              style={{ width: 16, height: 16, fontSize: 10, background: '#B05C3B', marginTop: 1 }}
            >
              {i + 1}
            </span>
            <span style={{ color: INK, fontSize: 12, lineHeight: 1.35 }}>{c.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─── The two homes ───────────────────────────────────────────────────────────

/**
 * ChatGPT and Codex side by side, with the gap between them drawn rather than
 * described. The severed link at the top is the whole point: the two columns
 * never exchange anything, so a skill crosses only when a person carries it.
 */
const COLS = '124px 1fr 1fr';

export function TwoHomes({ t, width = 720 }: { t: number; width?: number }) {
  const frame = ease(seg(t, 0, 0.12));
  const heads = ease(seg(t, 0.08, 0.25));
  const link = ease(seg(t, 0.15, 0.32));
  const note = ease(seg(t, 0.9, 1));
  const [web, codex] = HOMES.columns;

  return (
    <div style={{ width, maxWidth: '100%', ...rise(frame, 12) }}>
      {/* Column heads, then the severed link straddling the two of them. Both
          use the row grid below, padding included, so the head pills, the gap
          and the dashed rule in every row sit on the same two lines. */}
      <div className="grid items-end gap-2 px-3" style={{ gridTemplateColumns: COLS }}>
        <span />
        {[web, codex].map((col) => (
          <div key={col.key} className="rounded-xl px-3 py-2" style={{ background: col.bg, ...rise(heads, 8) }}>
            <p className="font-extrabold leading-none" style={{ color: col.color, fontSize: 15 }}>{col.label}</p>
            <p className="mt-0.5 leading-none" style={{ color: col.color, fontSize: 11, opacity: 0.85 }}>{col.where}</p>
          </div>
        ))}
      </div>

      {/* The severed link: two stubs and a gap, on the seam the rows divide on. */}
      <div className="grid gap-2 px-3" style={{ gridTemplateColumns: COLS, height: 26 }}>
        <span />
        <div className="col-span-2 flex items-center justify-center gap-1.5" style={{ paddingTop: 4, opacity: link }}>
          <span style={{ width: 22, height: 2, background: '#DED8CE', borderRadius: 2 }} />
          <span
            className="rounded-full px-2 py-0.5 font-bold uppercase"
            style={{ background: '#FFF', border: `1px solid ${LINE}`, color: MUTED, fontSize: 9, letterSpacing: '0.08em' }}
          >
            no sync
          </span>
          <span style={{ width: 22, height: 2, background: '#DED8CE', borderRadius: 2 }} />
        </div>
      </div>

      {/* The comparison. */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: LINE, background: '#FFF' }}>
        {HOMES.rows.map((row, i) => {
          const p = cascade(t, i, HOMES.rows.length, 0.25, 0.95);
          return (
            <div
              key={row.label}
              className="grid items-start gap-2 px-3 py-2.5"
              style={{
                gridTemplateColumns: COLS,
                borderTop: i === 0 ? undefined : `1px solid ${LINE}`,
                ...rise(p, 6),
              }}
            >
              <span className="font-bold" style={{ color: MUTED, fontSize: 11, lineHeight: 1.35 }}>{row.label}</span>
              <span style={{ color: INK, fontSize: 12, lineHeight: 1.4 }}>{row.web}</span>
              <span
                style={{ color: INK, fontSize: 12, lineHeight: 1.4, borderLeft: `1px dashed #DED8CE`, paddingLeft: 10 }}
              >
                {row.codex}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3" style={{ color: INK, fontSize: 12.5, lineHeight: 1.5, ...rise(note, 6) }}>
        {HOMES.note}
      </p>
    </div>
  );
}

// ─── Gotchas ─────────────────────────────────────────────────────────────────

/**
 * The shape of a gotcha: a reasonable assumption, and the fact that overrides
 * it. Drawn as a pair so the point lands without being explained, because a
 * list of gotchas described in prose reads like general advice, which is the
 * exact thing a gotcha is not.
 */
export function GotchaList({
  t,
  width = 720,
  variant = 'page',
}: {
  t: number;
  width?: number;
  variant?: 'page' | 'video';
}) {
  const video = variant === 'video';
  const n = GOTCHAS.length;
  return (
    <div style={{ width, maxWidth: '100%', display: 'grid', gap: video ? 22 : 12 }}>
      {video && (
        <p className="text-[16px] font-extrabold uppercase tracking-[0.14em]" style={{ color: '#B05C3B' }}>
          Useful gotchas
        </p>
      )}
      {GOTCHAS.map((g, i) => {
        const p = cascade(t, i, n, 0.05, 0.92);
        const fact = ease(seg(p, 0.45, 1));
        return (
          <div
            key={g.assume}
            className="rounded-2xl border bg-white"
            style={{ borderColor: LINE, padding: video ? 24 : 14, ...rise(p, 12) }}
          >
            <p
              className="flex items-start gap-2"
              style={{ color: MUTED, fontSize: video ? 22 : 12.5, lineHeight: 1.4, textDecoration: 'line-through' }}
            >
              <span style={{ textDecoration: 'none', color: '#B91C1C', fontWeight: 700 }}>&times;</span>
              {g.assume}
            </p>
            <p
              className="flex items-start gap-2"
              style={{
                marginTop: video ? 10 : 6,
                color: INK,
                fontSize: video ? 22 : 12.5,
                lineHeight: 1.45,
                fontWeight: 600,
                ...rise(fact, 6),
              }}
            >
              <span style={{ color: '#51714B', fontWeight: 700 }}>&#10003;</span>
              {g.actually}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Is this one skill? ──────────────────────────────────────────────────────

/**
 * Four candidate jobs and the verdict on each. The three rules are easier to
 * apply against examples than to hold in the abstract, and between them these
 * four fail every rule once.
 */
export function ScopeTest({
  t,
  width = 720,
  variant = 'page',
}: {
  t: number;
  width?: number;
  variant?: 'page' | 'video';
}) {
  const video = variant === 'video';
  const n = SCOPE_EXAMPLES.length;
  return (
    <div style={{ width, maxWidth: '100%', display: 'grid', gap: video ? 16 : 10 }}>
      {SCOPE_EXAMPLES.map((item, i) => {
        const p = cascade(t, i, n, 0.05, 0.92);
        const verdict = ease(seg(p, 0.5, 1));
        return (
          <div
            key={item.job}
            className="flex items-start rounded-2xl border bg-white"
            style={{
              gap: video ? 16 : 10,
              borderColor: item.ok ? 'rgba(81,113,75,0.45)' : LINE,
              padding: video ? '20px 22px' : '12px 14px',
              ...rise(p, 12),
            }}
          >
            <span
              className="flex flex-shrink-0 items-center justify-center rounded-full font-extrabold"
              style={{
                width: video ? 34 : 20,
                height: video ? 34 : 20,
                marginTop: 1,
                fontSize: video ? 20 : 12,
                background: item.ok ? '#DDF1DA' : '#F1EEE8',
                color: item.ok ? '#51714B' : '#B91C1C',
              }}
            >
              {item.ok ? '✓' : '×'}
            </span>
            <span className="flex-1" style={{ minWidth: 0 }}>
              <span className="flex items-center justify-between gap-4">
                <span
                  className="block font-extrabold"
                  style={{ color: INK, fontSize: video ? 24 : 13.5, lineHeight: 1.3 }}
                >
                  {item.job}
                </span>
                <span
                  className="flex-shrink-0 rounded-full font-extrabold uppercase tracking-[0.08em]"
                  style={{
                    padding: video ? '5px 10px' : '3px 7px',
                    background: item.ok ? '#DDF1DA' : '#F1EEE8',
                    color: item.ok ? '#51714B' : '#786F65',
                    fontSize: video ? 13 : 9,
                  }}
                >
                  {item.ok ? 'Clear result' : 'Needs work'}
                </span>
              </span>
              <span
                className="block"
                style={{
                  marginTop: video ? 6 : 3,
                  color: MUTED,
                  fontSize: video ? 21 : 12.5,
                  lineHeight: 1.35,
                  ...rise(verdict, 4),
                }}
              >
                {item.why}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Build in Codex ─────────────────────────────────────────────────────────

/** A six-step path that stays readable at video size. */
export function CodexBuildPath({ t, width = 920 }: { t: number; width?: number }) {
  const n = CODEX_BUILD.steps.length;
  return (
    <div className="relative" style={{ width, maxWidth: '100%' }}>
      <div
        className="absolute rounded-full"
        style={{
          left: 31,
          top: 44,
          bottom: 44,
          width: 4,
          background: '#E8E2D9',
          transformOrigin: 'top',
          transform: `scaleY(${ease(seg(t, 0.04, 0.92))})`,
        }}
      />
      <div className="relative grid gap-3">
        {CODEX_BUILD.steps.map((step, i) => {
          const p = cascade(t, i, n, 0.04, 0.94);
          return (
            <div
              key={step.title}
              className="flex items-center gap-5 rounded-2xl border bg-white px-5 py-4"
              style={{
                borderColor: LINE,
                opacity: p,
                transform: `translateX(${(1 - p) * 28}px)`,
              }}
            >
              <span
                className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-[24px] font-extrabold"
                style={{ background: '#FFDDCC', color: '#B05C3B' }}
              >
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-[25px] font-extrabold leading-tight" style={{ color: INK }}>
                  {step.title}
                </span>
                <span className="mt-1 block text-[20px] leading-snug" style={{ color: MUTED }}>
                  {step.body}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
