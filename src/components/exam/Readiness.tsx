// The learning plan, as a readiness dashboard.
//
// Why this shape rather than a linear roadmap: the study vault already IS the
// syllabus. The scarce thing is an answer to "am I ready, and what is the
// highest-leverage next hour", which only measured accuracy can give. So the
// plan ranks domains by weighted gap and reorders itself as you drill.

import { AnimatePresence, motion } from 'motion/react';
import type { DomainId, MockResult, Question } from '../../data/exam/types';
import { CUT_SCORE, DOMAINS, DOMAIN_BY_ID, TOTAL_ITEMS } from '../../data/exam/domains';
import {
  ASSUMED_PASS_RATIO,
  MIN_FOR_CONFIDENCE,
  nextUp,
  projectedScore,
  type DomainReadiness,
} from '../../data/exam/scoring';
import {
  Button,
  Card,
  CORAL,
  DISPLAY,
  GOLD,
  H,
  INK,
  INK_LIGHT,
  INK_MUTED,
  MARBLE,
  Meter,
  MONO,
  NAVY,
  Pill,
  Pressable,
  SAGE,
  TEAL,
  WARM,
  useVariants,
} from './ui';

const TARGET = 0.8;

export default function Readiness({
  bank,
  readiness,
  mocks,
  onDrill,
  onMock,
  onStudy,
}: {
  bank: Question[];
  readiness: DomainReadiness[];
  mocks: MockResult[];
  onDrill: (domain: DomainId) => void;
  onMock: () => void;
  onStudy: (domain: DomainId) => void;
}) {
  const { stagger, pop, reduced } = useVariants();
  const projection = projectedScore(readiness);
  const totalSeen = readiness.reduce((s, r) => s + r.attempted, 0);
  const coverage = bank.length ? totalSeen / bank.length : 0;
  const next = nextUp(readiness);

  // Ranked by drag: weight times the gap to target. A 19% domain at 70% beats
  // a 7% domain at 55%, which is the whole point of weighting.
  const ranked = [...readiness]
    .filter((r) => r.drag > 0)
    .sort((a, b) => b.drag - a.drag)
    .slice(0, 3);

  const verdict = getVerdict(projection.scaled, readiness, coverage);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      {/* headline */}
      <motion.div variants={pop}>
        <Card accent={NAVY} style={{ marginBottom: 16 }}>
          <div
            style={{
              display: 'flex',
              gap: 28,
              flexWrap: 'wrap',
              alignItems: 'flex-start',
            }}
          >
            <div style={{ minWidth: 190 }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: INK_MUTED,
                  marginBottom: 6,
                }}
              >
                Projected scaled score
              </div>
              <ScoreNumber value={projection.scaled} reduced={reduced} />
              <div style={{ marginTop: 10, maxWidth: 210 }}>
                <ScoreTrack scaled={projection.scaled} reduced={reduced} />
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 260 }}>
              <p
                style={{
                  margin: '0 0 10px',
                  fontSize: 15.5,
                  lineHeight: 1.55,
                  color: INK,
                  fontFamily: DISPLAY,
                }}
              >
                {verdict.line}
              </p>
              <p style={{ margin: '0 0 12px', fontSize: 14, color: INK_LIGHT, lineHeight: 1.55 }}>
                {verdict.detail}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Pill color={INK_MUTED}>
                  bank seen {Math.round(coverage * 100)}%
                </Pill>
                {projection.untouched.length > 0 && (
                  <Pill color={CORAL}>
                    {projection.untouched.length} domain
                    {projection.untouched.length === 1 ? '' : 's'} untouched
                  </Pill>
                )}
                {mocks.length > 0 && (
                  <Pill color={INK_MUTED}>
                    {mocks.length} mock{mocks.length === 1 ? '' : 's'} sat
                  </Pill>
                )}
              </div>
            </div>
          </div>

          {/* the honesty chips */}
          <div
            style={{
              marginTop: 16,
              paddingTop: 13,
              borderTop: `1px solid ${MARBLE}`,
              display: 'grid',
              gap: 6,
            }}
          >
            <Note>
              <strong>Approximate.</strong> Anthropic does not publish the raw-to-scaled
              mapping. This assumes {Math.round(ASSUMED_PASS_RATIO * 100)}% raw sits at the
              published {CUT_SCORE} cut.
            </Note>
            {coverage > 0.6 && (
              <Note tone={GOLD}>
                <strong>Inflated.</strong> You have seen {Math.round(coverage * 100)}% of the
                bank. Recognising a question is not the same as knowing the answer.
              </Note>
            )}
          </div>
        </Card>
      </motion.div>

      {/* what to study next */}
      {ranked.length > 0 && (
        <motion.div variants={pop} style={{ marginBottom: 16 }}>
          <H sub="Ranked by how much each domain drags the projected score: exam weight times the gap to 80%.">
            Study next
          </H>
          <AnimatePresence initial={false}>
            <div style={{ display: 'grid', gap: 10 }}>
              {ranked.map((r, i) => {
                const d = DOMAIN_BY_ID[r.domain];
                return (
                  <motion.div
                    key={r.domain}
                    layout={!reduced}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={
                      reduced
                        ? { duration: 0.01 }
                        : { type: 'spring', stiffness: 380, damping: 30 }
                    }
                  >
                    <Pressable
                      as="div"
                      accent={d.accent}
                      active={i === 0}
                      slide={2}
                      style={{
                        display: 'flex',
                        gap: 14,
                        alignItems: 'center',
                        borderLeft: `3px solid ${d.accent}`,
                        padding: '14px 16px',
                        cursor: 'default',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: MONO,
                          fontSize: 20,
                          color: d.accent,
                          minWidth: 26,
                        }}
                      >
                        {i + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, color: INK, marginBottom: 3 }}>
                          D{d.id} {d.title}
                        </div>
                        <div style={{ fontFamily: MONO, fontSize: 12, color: INK_MUTED }}>
                          {d.weight}% of the exam ·{' '}
                          {r.attempted === 0
                            ? 'not started'
                            : `${Math.round(r.accuracy * 100)}% on ${r.attempted} of ${r.available}`}
                          {r.attempted > 0 && !r.confident && ' · thin sample'}
                        </div>
                      </div>
                      <Button variant="ghost" onClick={() => onStudy(r.domain)}>
                        Read
                      </Button>
                      <Button variant="ghost" onClick={() => onDrill(r.domain)}>
                        Drill
                      </Button>
                    </Pressable>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        </motion.div>
      )}

      {/* all seven domains */}
      <motion.div variants={pop}>
        <H sub="Bars show accuracy. The tick marks the 80% target used for ranking.">
          Every domain
        </H>
        <div style={{ display: 'grid', gap: 11 }}>
          {DOMAINS.map((d) => {
            const r = readiness.find((x) => x.domain === d.id)!;
            return (
              <DomainRow
                key={d.id}
                accent={d.accent}
                id={d.id}
                title={d.title}
                weight={d.weight}
                items={d.itemsOnExam}
                r={r}
                reduced={reduced}
                onDrill={() => onDrill(d.id)}
              />
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={pop} style={{ marginTop: 22 }}>
        <Card style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 17, color: INK, marginBottom: 4 }}>
              Sit a full mock
            </div>
            <p style={{ margin: 0, fontSize: 14, color: INK_MUTED, lineHeight: 1.5 }}>
              {TOTAL_ITEMS} items at the real domain weights, {120} minutes, flag and revisit.
              No rationales until you submit.
            </p>
          </div>
          <Button onClick={onMock}>Start mock exam</Button>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function DomainRow({
  id,
  title,
  weight,
  items,
  accent,
  r,
  reduced,
  onDrill,
}: {
  id: DomainId;
  title: string;
  weight: number;
  items: number;
  accent: string;
  r: DomainReadiness;
  reduced: boolean;
  onDrill: () => void;
}) {
  const pct = r.attempted ? Math.round(r.accuracy * 100) : null;
  const color = pct === null ? MARBLE : pct >= 80 ? SAGE : pct >= 60 ? GOLD : CORAL;
  return (
    <Pressable
      as="div"
      accent={accent}
      slide={2}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) auto',
        gap: 14,
        alignItems: 'center',
        padding: '12px 14px',
        cursor: 'default',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            gap: 9,
            alignItems: 'baseline',
            marginBottom: 7,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontFamily: MONO, fontSize: 12, color: accent }}>D{id}</span>
          <span style={{ fontSize: 14.5, color: INK }}>{title}</span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: INK_MUTED }}>
            {weight}% · {items} items
          </span>
        </div>
        <div style={{ position: 'relative' }}>
          <Meter value={r.accuracy} color={color} height={7} />
          {/* 80% target tick */}
          <div
            style={{
              position: 'absolute',
              left: `${TARGET * 100}%`,
              top: -2,
              width: 1,
              height: 11,
              background: INK_MUTED,
              opacity: 0.5,
            }}
          />
        </div>
        <div style={{ fontFamily: MONO, fontSize: 11, color: INK_MUTED, marginTop: 5 }}>
          {r.attempted === 0
            ? `not started · ${r.available} in bank`
            : `${pct}% · ${r.attempted} of ${r.available} seen${
                r.confident ? '' : ` · needs ${MIN_FOR_CONFIDENCE - r.attempted} more to be meaningful`
              }`}
        </div>
      </div>
      <Button variant="ghost" onClick={onDrill}>
        Drill
      </Button>
    </Pressable>
  );
}

function ScoreNumber({ value, reduced }: { value: number | null; reduced: boolean }) {
  if (value === null) {
    return (
      <div style={{ fontFamily: DISPLAY, fontSize: 40, color: INK_MUTED, lineHeight: 1 }}>—</div>
    );
  }
  const color = value >= CUT_SCORE ? SAGE : value >= CUT_SCORE - 80 ? GOLD : CORAL;
  return (
    <motion.div
      key={value}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0.01 } : { type: 'spring', stiffness: 340, damping: 26 }}
      style={{ fontFamily: DISPLAY, fontSize: 46, lineHeight: 1, color }}
    >
      {value}
      <span style={{ fontSize: 15, color: INK_MUTED, marginLeft: 6 }}>/ 1000</span>
    </motion.div>
  );
}

/** A 100-1000 track with the 720 cut drawn on it. */
function ScoreTrack({ scaled, reduced }: { scaled: number | null; reduced: boolean }) {
  const pos = scaled === null ? 0 : (scaled - 100) / 900;
  const cut = (CUT_SCORE - 100) / 900;
  return (
    <div>
      <div style={{ position: 'relative', height: 8, background: MARBLE, borderRadius: 8 }}>
        <motion.div
          initial={reduced ? false : { width: 0 }}
          animate={{ width: `${pos * 100}%` }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 110, damping: 20 }}
          style={{
            height: '100%',
            borderRadius: 8,
            background: scaled !== null && scaled >= CUT_SCORE ? SAGE : TEAL,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${cut * 100}%`,
            top: -3,
            width: 2,
            height: 14,
            background: INK,
          }}
          title={`cut score ${CUT_SCORE}`}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: MONO,
          fontSize: 10,
          color: INK_MUTED,
          marginTop: 4,
        }}
      >
        <span>100</span>
        <span>pass {CUT_SCORE}</span>
        <span>1000</span>
      </div>
    </div>
  );
}

function Note({ children, tone = INK_MUTED }: { children: React.ReactNode; tone?: string }) {
  return (
    <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: tone }}>{children}</p>
  );
}

function getVerdict(
  scaled: number | null,
  readiness: DomainReadiness[],
  coverage: number
): { line: string; detail: string } {
  if (scaled === null) {
    return {
      line: 'Nothing measured yet.',
      detail:
        'Drill any domain and this becomes a real number. Integration is the heaviest at 19%, so it is the usual place to start.',
    };
  }
  const weakest = readiness.filter((r) => r.attempted > 0 && r.accuracy < 0.7);
  const untouched = readiness.filter((r) => r.attempted === 0);

  if (scaled >= 780 && !weakest.length && !untouched.length && coverage >= 0.6) {
    return {
      line: 'Book it.',
      detail:
        'Every domain is above 70%, the projection clears the cut with a buffer, and you have covered most of the bank. The buffer matters because these are questions you wrote.',
    };
  }
  if (untouched.length) {
    return {
      line: 'Too early to say.',
      detail: `${untouched.length} domain${
        untouched.length === 1 ? ' has' : 's have'
      } no attempts, so the projection only covers part of the exam. An untouched domain is unknown, not strong.`,
    };
  }
  if (scaled >= CUT_SCORE) {
    return {
      line: 'Above the line, with no margin.',
      detail: weakest.length
        ? `The projection clears ${CUT_SCORE}, but ${weakest.length} domain${
            weakest.length === 1 ? ' is' : 's are'
          } under 70%. Weighted, that is where the risk sits.`
        : 'Clearing the cut on practice questions you wrote yourself is a weaker signal than it looks. Aim for 780 before booking.',
    };
  }
  return {
    line: 'Not yet.',
    detail: `The projection is ${CUT_SCORE - scaled} points under the cut. Work the ranked list below, heaviest drag first.`,
  };
}
