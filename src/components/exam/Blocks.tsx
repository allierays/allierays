// Renders the structured note blocks produced by scripts/extract-notes.mjs.
// No markdown parser ships to the browser; the AST is built at extract time.
//
// The notes are dense prose, so this file does three things to make them
// readable rather than rendering markdown faithfully:
//
//  1. Paragraphs that open with a known bold lead-in ("Where it goes wrong.",
//     "Example.", "Pattern.") become tinted blocks. Those are the parts worth
//     finding at a glance, and there are 274 and 208 of the first two.
//  2. Citation markers are demoted to small muted superscripts. 1,895 of 2,612
//     paragraphs carry one, and inline "[1]" at body weight is pure noise.
//  3. Prose is held to a readable measure while tables and code stay full width.

import type { Block, Inline, SectionKind } from '../../data/exam/notes-types';
import { CORAL, GOLD, INK, INK_LIGHT, INK_MUTED, MARBLE, MONO, NAVY, SAGE, TEAL, WARM } from './ui';

/** Comfortable line length for the serif body face. */
const MEASURE = 80;

// ------------------------------------------------------------------- inline

export function Inlines({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((n, i) => {
        if (n.t === 'code')
          return (
            <code
              key={i}
              style={{
                fontFamily: MONO,
                fontSize: '0.85em',
                background: '#eef3f4',
                color: '#22525a',
                border: '1px solid #d4e3e5',
                borderRadius: 4,
                padding: '1px 5px',
                wordBreak: 'break-word',
              }}
            >
              {n.v}
            </code>
          );
        if (n.t === 'strong')
          return (
            <strong key={i} style={{ color: INK, fontWeight: 600 }}>
              {n.v}
            </strong>
          );
        if (n.t === 'em')
          return (
            <em key={i} style={{ fontStyle: 'italic', color: INK }}>
              {n.v}
            </em>
          );
        return <Citations key={i} text={n.v} />;
      })}
    </>
  );
}

/** Turns "... a cacheable prefix. [1] [4]" into muted superscript markers. */
function Citations({ text }: { text: string }) {
  if (!text.includes('[')) return <>{text}</>;
  const parts = text.split(/(\[\d+\])/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\[\d+\]$/.test(p) ? (
          <sup
            key={i}
            style={{
              fontFamily: MONO,
              fontSize: '0.62em',
              color: INK_MUTED,
              opacity: 0.75,
              padding: '0 1px',
            }}
          >
            {p.slice(1, -1)}
          </sup>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

// -------------------------------------------------------------- lead-in kinds

type LeadIn = { label: string; bg: string; border: string; ink: string };

const LEAD_INS: Record<string, LeadIn> = {
  'where it goes wrong': { label: 'Where it goes wrong', bg: '#fdf3f0', border: CORAL, ink: '#a8452a' },
  example: { label: 'Example', bg: '#eef3f4', border: TEAL, ink: '#22525a' },
  pattern: { label: 'Pattern', bg: '#f4f1e6', border: GOLD, ink: '#8a6d0b' },
  'how it works': { label: 'How it works', bg: WARM, border: MARBLE, ink: INK_LIGHT },
  'before and after': { label: 'Before and after', bg: WARM, border: MARBLE, ink: INK_LIGHT },
  'best answer': { label: 'Best answer', bg: '#f2f7f0', border: SAGE, ink: '#4a6b3d' },
  distractors: { label: 'Distractors', bg: '#fdf3f0', border: CORAL, ink: '#a8452a' },
  'cost and failure': { label: 'Cost and failure', bg: WARM, border: MARBLE, ink: INK_LIGHT },
};

function leadInFor(b: Block): LeadIn | null {
  if (b.t !== 'p') return null;
  const first = b.v[0];
  if (!first || first.t !== 'strong') return null;
  const key = first.v.trim().replace(/[.:]\s*$/, '').toLowerCase();
  return LEAD_INS[key] ?? null;
}

// ------------------------------------------------------------------- blocks

export function Blocks({
  blocks,
  kind,
  accent,
  wide,
}: {
  blocks: Block[];
  /** Colours the section's callouts to match its purpose. */
  kind?: SectionKind;
  accent?: string;
  /** Drop the readable-measure cap so prose fills the column (used by Cram). */
  wide?: boolean;
}) {
  // Prose is normally held to a comfortable line length; `wide` lets it run
  // the full width of its container instead.
  const measure = wide ? undefined : `${MEASURE}ch`;
  const measurePlus = wide ? undefined : `${MEASURE + 4}ch`;
  return (
    <>
      {blocks.map((b, i) => {
        const lead = leadInFor(b);
        if (lead && b.t === 'p') {
          // Drop the bold lead-in from the body; it becomes the chip.
          const rest = b.v.slice(1);
          return (
            <div
              key={i}
              style={{
                margin: '0 0 14px',
                padding: '11px 14px',
                background: lead.bg,
                borderLeft: `3px solid ${lead.border}`,
                borderRadius: 7,
                maxWidth: measurePlus,
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 10.5,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: lead.ink,
                  marginBottom: 4,
                }}
              >
                {lead.label}
              </div>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: INK_LIGHT }}>
                <Inlines nodes={rest} />
              </p>
            </div>
          );
        }

        switch (b.t) {
          case 'p':
            return (
              <p
                key={i}
                style={{
                  margin: '0 0 13px',
                  fontSize: 15,
                  lineHeight: 1.68,
                  color: INK_LIGHT,
                  maxWidth: measure,
                }}
              >
                <Inlines nodes={b.v} />
              </p>
            );

          case 'h':
            return (
              <h4
                key={i}
                style={{
                  margin: '20px 0 9px',
                  fontSize: 12,
                  fontFamily: MONO,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: accent ?? NAVY,
                }}
              >
                {b.v}
              </h4>
            );

          case 'code':
            return (
              <pre
                key={i}
                style={{
                  margin: '0 0 15px',
                  padding: '13px 15px',
                  background: '#1c2a3a',
                  color: '#dbe7ea',
                  borderRadius: 8,
                  overflowX: 'auto',
                  fontFamily: MONO,
                  fontSize: 12.5,
                  lineHeight: 1.6,
                }}
              >
                <code>{b.v}</code>
              </pre>
            );

          case 'list':
            return b.ordered ? (
              <ol key={i} style={{ ...listStyle, maxWidth: measure }}>
                {b.items.map((it, j) => (
                  <li key={j} style={{ ...itemStyle, marginLeft: it.depth * 16 }}>
                    <Inlines nodes={it.v} />
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={i} style={{ ...listStyle, listStyle: 'none', paddingLeft: 0, maxWidth: measure }}>
                {b.items.map((it, j) => (
                  <li
                    key={j}
                    style={{
                      ...itemStyle,
                      marginLeft: it.depth * 16,
                      paddingLeft: 16,
                      position: 'relative',
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        position: 'absolute',
                        left: 2,
                        top: '0.62em',
                        width: 5,
                        height: 5,
                        borderRadius: 5,
                        background: accent ?? TEAL,
                        opacity: 0.65,
                      }}
                    />
                    <Inlines nodes={it.v} />
                  </li>
                ))}
              </ul>
            );

          case 'table':
            return (
              <div
                key={i}
                style={{
                  overflowX: 'auto',
                  margin: '0 0 16px',
                  border: `1px solid ${MARBLE}`,
                  borderRadius: 9,
                }}
              >
                <table
                  style={{
                    borderCollapse: 'collapse',
                    width: '100%',
                    fontSize: 13.5,
                    minWidth: 420,
                  }}
                >
                  <thead>
                    <tr>
                      {b.head.map((c, j) => (
                        <th
                          key={j}
                          style={{
                            textAlign: 'left',
                            padding: '9px 12px',
                            background: accent ? `${accent}12` : WARM,
                            borderBottom: `2px solid ${accent ?? MARBLE}`,
                            fontFamily: MONO,
                            fontSize: 10.5,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            color: accent ?? INK_MUTED,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Inlines nodes={c} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j} style={{ background: j % 2 ? WARM : 'transparent' }}>
                        {r.map((c, k) => (
                          <td
                            key={k}
                            style={{
                              padding: '9px 12px',
                              borderBottom: `1px solid ${MARBLE}`,
                              color: k === 0 ? INK : INK_LIGHT,
                              fontWeight: k === 0 ? 500 : 400,
                              lineHeight: 1.5,
                              verticalAlign: 'top',
                            }}
                          >
                            <Inlines nodes={c} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'callout': {
            const tone = CALLOUT_TONES[b.kind] ?? CALLOUT_TONES.note;
            return (
              <div
                key={i}
                style={{
                  margin: '0 0 15px',
                  padding: '12px 15px',
                  background: tone.bg,
                  borderLeft: `3px solid ${tone.border}`,
                  borderRadius: 7,
                  maxWidth: measurePlus,
                }}
              >
                {b.title && (
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 10.5,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: tone.label,
                      marginBottom: 5,
                    }}
                  >
                    {b.title}
                  </div>
                )}
                <div style={{ marginBottom: -13 }}>
                  <Blocks blocks={b.children} kind={kind} accent={accent} wide={wide} />
                </div>
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </>
  );
}

const CALLOUT_TONES: Record<string, { bg: string; border: string; label: string }> = {
  summary: { bg: '#eef3f4', border: TEAL, label: '#22525a' },
  tip: { bg: '#f4f1e6', border: GOLD, label: '#8a6d0b' },
  warning: { bg: '#fdf3f0', border: CORAL, label: '#a8452a' },
  note: { bg: WARM, border: MARBLE, label: INK_MUTED },
};

const listStyle: React.CSSProperties = {
  margin: '0 0 15px',
  paddingLeft: 20,
  fontSize: 15,
  lineHeight: 1.68,
  color: INK_LIGHT,
  maxWidth: `${MEASURE}ch`,
};

const itemStyle: React.CSSProperties = { marginBottom: 7 };

// ------------------------------------------------------- section presentation

export const SECTION_TONES: Record<
  SectionKind,
  { label: string; color: string; bg: string }
> = {
  concept: { label: 'Concept', color: NAVY, bg: '#eef1f5' },
  decide: { label: 'Decide', color: '#6d5a9c', bg: '#f2eff7' },
  numbers: { label: 'Numbers', color: '#8a6d0b', bg: '#f4f1e6' },
  exam: { label: 'On the exam', color: '#a8452a', bg: '#fdf3f0' },
  worked: { label: 'Worked example', color: '#4a6b3d', bg: '#f2f7f0' },
  abilities: { label: 'Key facts', color: '#22525a', bg: '#eef3f4' },
  selfcheck: { label: 'Self-check', color: '#22525a', bg: '#eef3f4' },
  sources: { label: 'Sources', color: INK_MUTED, bg: WARM },
  other: { label: '', color: INK_MUTED, bg: WARM },
};

/** Coloured section header shared by the Study tab and the inline accordion. */
export function SectionHeader({
  title,
  kind,
  compact,
}: {
  title: string;
  kind: SectionKind;
  compact?: boolean;
}) {
  const tone = SECTION_TONES[kind] ?? SECTION_TONES.other;
  // Concept titles already read "Concept: X"; strip the prefix, the chip says it.
  const clean = title.replace(/^Concept:\s*/i, '');
  return (
    <div style={{ margin: compact ? '0 0 10px' : '0 0 12px' }}>
      {tone.label && (
        <span
          style={{
            display: 'inline-block',
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: tone.color,
            background: tone.bg,
            borderRadius: 999,
            padding: '3px 9px',
            marginBottom: 7,
          }}
        >
          {tone.label}
        </span>
      )}
      <h3
        style={{
          margin: 0,
          fontSize: compact ? 16 : 17.5,
          fontFamily: 'var(--font-display, system-ui)',
          color: INK,
          lineHeight: 1.3,
          paddingBottom: 7,
          borderBottom: `2px solid ${tone.color}22`,
        }}
      >
        {clean}
      </h3>
    </div>
  );
}
