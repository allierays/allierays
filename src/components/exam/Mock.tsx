// Timed mock exam: 63 items at the real domain weights, 120 minutes.
//
// Exam parity is the point, so this mode is deliberately bare:
//  - No feedback of any kind until you submit. The skill being practised is
//    committing to an answer while uncertain, and mid-session feedback removes
//    the chance to practise it.
//  - Free navigation, flag for review, answers changeable until submit.
//  - One session countdown, auto-submit at zero.
//
// The clock is an absolute deadline compared against Date.now(), never an
// accumulated tick count, so a throttled background tab cannot cause drift.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type {
  ActiveMock,
  Attempt,
  MockResult,
  OptionLetter,
  Question,
} from '../../data/exam/types';
import { CUT_SCORE, DOMAINS, DOMAIN_BY_ID, TIME_LIMIT_MIN } from '../../data/exam/domains';
import { ASSUMED_PASS_RATIO, buildMockForm, gradeMock, isCorrect } from '../../data/exam/scoring';
import QuestionCard from './QuestionCard';
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
  HOVER_TRANSITION,
  Pill,
  SAGE,
  TEAL,
  WARM,
  useVariants,
} from './ui';

const MS_LIMIT = TIME_LIMIT_MIN * 60_000;
/** Pace target leaves a review reserve, mirroring how takers describe using it. */
const REVIEW_RESERVE_MS = 15 * 60_000;

export default function Mock({
  bank,
  attempts,
  active,
  lastResult,
  onStart,
  onUpdate,
  onFinish,
  onAbandon,
  onAttempts,
  onExit,
  onStudy,
}: {
  bank: Question[];
  attempts: Attempt[];
  active: ActiveMock | null;
  lastResult: MockResult | null;
  onStart: (m: ActiveMock) => void;
  onUpdate: (patch: Partial<ActiveMock>) => void;
  onFinish: (r: MockResult) => void;
  onAbandon: () => void;
  onAttempts: (a: Attempt[]) => void;
  onExit: () => void;
  onStudy: (objective: string) => void;
}) {
  const [result, setResult] = useState<MockResult | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const { pop, reduced } = useVariants();

  const form = useMemo(
    () =>
      active
        ? (active.questionIds
            .map((id) => bank.find((q) => q.id === id))
            .filter(Boolean) as Question[])
        : [],
    [active, bank]
  );

  const submit = useCallback(
    (timedOut: boolean) => {
      if (!active) return;
      const graded = gradeMock(form, active.answers);
      const r: MockResult = {
        id: active.id,
        startedAt: active.startedAt,
        finishedAt: Date.now(),
        questionIds: active.questionIds,
        answers: active.answers,
        flagged: active.flagged,
        timedOut,
        ...graded,
      };
      // Every answered item also becomes an attempt, so the mock feeds readiness.
      const newAttempts: Attempt[] = form
        .filter((q) => (active.answers[q.id] ?? []).length > 0)
        .map((q) => ({
          questionId: q.id,
          picked: active.answers[q.id],
          correct: isCorrect(q, active.answers[q.id]),
          at: Date.now(),
          ms: 0,
          mode: 'mock' as const,
        }));
      onAttempts(newAttempts);
      onFinish(r);
      setResult(r);
      setConfirming(false);
    },
    [active, form, onFinish, onAttempts]
  );

  // Clock. Compares against an absolute deadline; ticks are never accumulated.
  useEffect(() => {
    if (!active || result) return;
    const t = window.setInterval(() => setNow(Date.now()), 500);
    const onVisible = () => setNow(Date.now());
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(t);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [active, result]);

  useEffect(() => {
    if (active && !result && now >= active.deadline) submit(true);
  }, [now, active, result, submit]);

  // Persist in-flight state when the tab goes away. pagehide, not beforeunload,
  // because iOS Safari does not reliably fire the latter.
  const activeRef = useRef(active);
  activeRef.current = active;
  useEffect(() => {
    const flush = () => {
      if (activeRef.current) onUpdate({});
    };
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, [onUpdate]);

  // ------------------------------------------------------------- results
  if (result) {
    return (
      <ResultView
        result={result}
        bank={bank}
        onExit={onExit}
        onStudy={onStudy}
        onAgain={() => setResult(null)}
      />
    );
  }

  // ------------------------------------------------------------- launcher
  if (!active) {
    return (
      <div>
        <H sub="63 items at the real domain weights, 120 minutes on one clock, no feedback until you submit.">
          Mock exam
        </H>
        <Card accent={NAVY} style={{ marginBottom: 14 }}>
          <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
            {DOMAINS.map((d) => (
              <div
                key={d.id}
                style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14 }}
              >
                <span style={{ fontFamily: MONO, fontSize: 12, color: d.accent, minWidth: 24 }}>
                  D{d.id}
                </span>
                <span style={{ flex: 1, color: INK_LIGHT }}>{d.title}</span>
                <span style={{ fontFamily: MONO, fontSize: 12, color: INK_MUTED }}>
                  {d.itemsOnExam} items
                </span>
              </div>
            ))}
          </div>
          <Button
            onClick={() => {
              const questions = buildMockForm(bank, attempts);
              onStart({
                id: `mock-${Date.now()}`,
                startedAt: Date.now(),
                deadline: Date.now() + MS_LIMIT,
                questionIds: questions.map((q) => q.id),
                answers: {},
                flagged: [],
                index: 0,
              });
            }}
          >
            Start the clock
          </Button>
        </Card>

        <Card>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: INK_MUTED,
              marginBottom: 8,
            }}
          >
            Where this differs from exam day
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: INK_LIGHT, lineHeight: 1.65 }}>
            <li>
              Every item here has four options. One taker reports the real multi-response items
              offer five. Nothing about the strategy changes: read the count line, eliminate, pick.
            </li>
            <li>
              The same taker reports scenario-matching dropdowns, which the official guide does not
              mention. None are built here, because inventing the format would teach an invented skill.
            </li>
            <li>
              These questions were written from study notes, so recognising one is not the same as
              knowing it. Treat a pass here as necessary, not sufficient.
            </li>
            <li>
              The scaled score is an approximation. Anthropic does not publish the raw-to-scaled
              mapping.
            </li>
          </ul>
        </Card>
      </div>
    );
  }

  // -------------------------------------------------------------- running
  const remaining = Math.max(0, active.deadline - now);
  const elapsed = MS_LIMIT - remaining;
  const q = form[active.index];
  const answeredCount = Object.values(active.answers).filter((a) => a.length > 0).length;
  const expected = (elapsed / (MS_LIMIT - REVIEW_RESERVE_MS)) * form.length;
  const paceDelta = active.index - expected;

  const setPicked = (letters: OptionLetter[]) =>
    onUpdate({ answers: { ...active.answers, [q.id]: letters } });

  const toggleFlag = () =>
    onUpdate({
      flagged: active.flagged.includes(q.id)
        ? active.flagged.filter((x) => x !== q.id)
        : [...active.flagged, q.id],
    });

  const goto = (i: number) => {
    onUpdate({ index: Math.max(0, Math.min(form.length - 1, i)) });
    setReviewing(false);
  };

  return (
    <div>
      <ExamBar
        remaining={remaining}
        answered={answeredCount}
        total={form.length}
        flagged={active.flagged.length}
        paceDelta={paceDelta}
        reduced={reduced}
        onReview={() => setReviewing((r) => !r)}
        reviewing={reviewing}
      />

      <AnimatePresence mode="wait" initial={false}>
        {reviewing ? (
          <motion.div
            key="review"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0.01 } : { duration: 0.18 }}
          >
            <ReviewGrid
              form={form}
              answers={active.answers}
              flagged={active.flagged}
              current={active.index}
              onJump={goto}
            />
          </motion.div>
        ) : (
          <motion.div
            key={q.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -16 }}
            transition={reduced ? { duration: 0.01 } : { duration: 0.18, ease: 'easeOut' }}
          >
            <QuestionCard
              question={q}
              picked={active.answers[q.id] ?? []}
              onPick={setPicked}
              revealed={false}
              position={{ index: active.index, total: form.length }}
              flagged={active.flagged.includes(q.id)}
              onToggleFlag={toggleFlag}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: 9, marginTop: 14, flexWrap: 'wrap' }}>
        <Button variant="ghost" onClick={() => goto(active.index - 1)} disabled={active.index === 0}>
          Previous
        </Button>
        <Button
          onClick={() => goto(active.index + 1)}
          disabled={active.index >= form.length - 1}
        >
          Next
        </Button>
        <Button variant="ghost" onClick={() => setConfirming(true)} style={{ marginLeft: 'auto' }}>
          Submit exam
        </Button>
      </div>

      <AnimatePresence>
        {confirming && (
          <ConfirmSubmit
            answered={answeredCount}
            total={form.length}
            flagged={active.flagged.length}
            reduced={reduced}
            onCancel={() => setConfirming(false)}
            onConfirm={() => submit(false)}
            onAbandon={() => {
              onAbandon();
              setConfirming(false);
              onExit();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ------------------------------------------------------------------ pieces

function ExamBar({
  remaining,
  answered,
  total,
  flagged,
  paceDelta,
  reduced,
  onReview,
  reviewing,
}: {
  remaining: number;
  answered: number;
  total: number;
  flagged: number;
  paceDelta: number;
  reduced: boolean;
  onReview: () => void;
  reviewing: boolean;
}) {
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const warn = remaining < 5 * 60_000;
  const caution = remaining < 15 * 60_000;
  const color = warn ? CORAL : caution ? GOLD : INK;

  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '11px 15px',
        background: warn ? '#fdf2ef' : WARM,
        border: `1px solid ${warn ? CORAL : MARBLE}`,
        borderRadius: 10,
        marginBottom: 14,
      }}
    >
      <motion.div
        // The 5-minute warning pulses, but never under reduced motion: an
        // infinite pulse is exactly what that setting exists to stop.
        animate={warn && !reduced ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={warn && !reduced ? { repeat: Infinity, duration: 2 } : { duration: 0 }}
        style={{ fontFamily: MONO, fontSize: 21, color, minWidth: 74 }}
      >
        {mins}:{String(secs).padStart(2, '0')}
      </motion.div>
      <span style={{ fontFamily: MONO, fontSize: 12, color: INK_MUTED }}>
        {answered}/{total} answered
        {flagged > 0 && ` · ${flagged} flagged`}
      </span>
      {/* Practice-only: the real exam shows no pace indicator. */}
      <span
        style={{
          fontFamily: MONO,
          fontSize: 11,
          color: INK_MUTED,
          border: `1px dotted ${MARBLE}`,
          borderRadius: 999,
          padding: '3px 9px',
        }}
        title="Practice only. The real exam shows one countdown and nothing else."
      >
        {Math.abs(paceDelta) < 1.5
          ? 'on pace'
          : paceDelta > 0
            ? `${Math.round(paceDelta)} ahead`
            : `${Math.round(-paceDelta)} behind`}
      </span>
      <Button variant="ghost" onClick={onReview} style={{ marginLeft: 'auto' }}>
        {reviewing ? 'Back to question' : 'Review all'}
      </Button>
    </div>
  );
}

function ReviewGrid({
  form,
  answers,
  flagged,
  current,
  onJump,
}: {
  form: Question[];
  answers: Record<string, OptionLetter[]>;
  flagged: string[];
  current: number;
  onJump: (i: number) => void;
}) {
  const { stagger, pop, reduced } = useVariants();
  const [hot, setHot] = useState<number | null>(null);
  return (
    <Card>
      <H sub="Answered, incomplete, flagged, or blank. Click any square to jump to it.">
        Review
      </H>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(42px, 1fr))',
          gap: 7,
        }}
      >
        {form.map((q, i) => {
          const picked = answers[q.id] ?? [];
          const isFlagged = flagged.includes(q.id);
          const complete = picked.length === q.selectCount;
          const partial = picked.length > 0 && !complete;
          let bg = '#fff';
          let border = MARBLE;
          let color = INK_MUTED;
          if (complete) {
            bg = '#eef3f4';
            border = TEAL;
            color = INK;
          }
          if (partial) {
            bg = '#fdf6ec';
            border = GOLD;
            color = '#8a6d0b';
          }
          if (isFlagged) border = GOLD;
          return (
            <motion.button
              key={q.id}
              variants={pop}
              type="button"
              onClick={() => onJump(i)}
              onMouseEnter={() => setHot(i)}
              onMouseLeave={() => setHot((h) => (h === i ? null : h))}
              onFocus={() => setHot(i)}
              onBlur={() => setHot((h) => (h === i ? null : h))}
              whileHover={reduced ? undefined : { scale: 1.09 }}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              transition={{ type: 'spring' as const, stiffness: 500, damping: 30 }}
              title={
                partial
                  ? `${picked.length} of ${q.selectCount} selected`
                  : complete
                    ? 'answered'
                    : 'not answered'
              }
              style={{
                position: 'relative',
                aspectRatio: '1',
                background: hot === i ? '#e6eef0' : bg,
                border: `${i === current ? 2 : 1}px solid ${
                  i === current ? INK : hot === i ? TEAL : border
                }`,
                borderRadius: 7,
                fontFamily: MONO,
                fontSize: 12,
                color: hot === i ? INK : color,
                cursor: 'pointer',
                transition: reduced ? 'none' : HOVER_TRANSITION,
                zIndex: hot === i ? 1 : 0,
              }}
            >
              {i + 1}
              {isFlagged && (
                <span
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 3,
                    width: 5,
                    height: 5,
                    borderRadius: 5,
                    background: GOLD,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </Card>
  );
}

function ConfirmSubmit({
  answered,
  total,
  flagged,
  reduced,
  onCancel,
  onConfirm,
  onAbandon,
}: {
  answered: number;
  total: number;
  flagged: number;
  reduced: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onAbandon: () => void;
}) {
  const blank = total - answered;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26,25,21,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 50,
      }}
      onClick={onCancel}
    >
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
        transition={reduced ? { duration: 0.01 } : { type: 'spring', stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 420, width: '100%' }}
      >
        <Card>
          <H>Submit?</H>
          <p style={{ fontSize: 14.5, color: INK_LIGHT, lineHeight: 1.6, margin: '0 0 16px' }}>
            {blank > 0 ? (
              <>
                <strong style={{ color: CORAL }}>{blank} unanswered.</strong> Blank items score
                zero, so a guess is strictly better.{' '}
              </>
            ) : (
              'Everything is answered. '
            )}
            {flagged > 0 && `${flagged} still flagged for review.`}
          </p>
          <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
            <Button onClick={onConfirm}>Submit and score</Button>
            <Button variant="ghost" onClick={onCancel}>
              Keep working
            </Button>
            <Button variant="danger" onClick={onAbandon} style={{ marginLeft: 'auto' }}>
              Discard
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function ResultView({
  result,
  bank,
  onExit,
  onStudy,
  onAgain,
}: {
  result: MockResult;
  bank: Question[];
  onExit: () => void;
  onStudy: (objective: string) => void;
  onAgain: () => void;
}) {
  const { reduced } = useVariants();
  const pct = Math.round((result.raw / result.total) * 100);
  const color = result.passed ? SAGE : CORAL;

  return (
    <div>
      <Card accent={color} style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: INK_MUTED,
              }}
            >
              Raw score
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 44, color: INK, lineHeight: 1.1 }}>
              {result.raw}
              <span style={{ fontSize: 17, color: INK_MUTED }}>/{result.total}</span>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 12, color: INK_MUTED }}>{pct}% correct</div>
          </div>
          <div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: INK_MUTED,
              }}
            >
              Scaled estimate
            </div>
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 24 }}
              style={{ fontFamily: DISPLAY, fontSize: 44, color, lineHeight: 1.1 }}
            >
              {result.scaled}
            </motion.div>
            <div style={{ fontFamily: MONO, fontSize: 12, color }}>
              {result.passed ? 'above' : 'below'} the {CUT_SCORE} cut
            </div>
          </div>
          {result.timedOut && (
            <div style={{ alignSelf: 'center' }}>
              <Pill color={CORAL}>time expired</Pill>
            </div>
          )}
        </div>
        <p
          style={{
            margin: '16px 0 0',
            paddingTop: 13,
            borderTop: `1px solid ${MARBLE}`,
            fontSize: 12.5,
            color: INK_MUTED,
            lineHeight: 1.55,
          }}
        >
          The raw score is the only true number here. The scaled figure assumes{' '}
          {Math.round(ASSUMED_PASS_RATIO * 100)}% raw sits at {CUT_SCORE}, because Anthropic does
          not publish the real mapping.
        </p>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <H sub="The real score report gives percent correct per domain. It is informational; only the total decides pass or fail.">
          By domain
        </H>
        <div style={{ display: 'grid', gap: 10 }}>
          {DOMAINS.map((d) => {
            const s = result.byDomain[String(d.id)];
            if (!s) return null;
            const p = s.total ? s.correct / s.total : 0;
            return (
              <div key={d.id}>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    fontSize: 13.5,
                    marginBottom: 4,
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ fontFamily: MONO, fontSize: 12, color: d.accent }}>D{d.id}</span>
                  <span style={{ flex: 1, color: INK_LIGHT }}>{d.title}</span>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: INK_MUTED }}>
                    {s.correct}/{s.total} · {Math.round(p * 100)}%
                  </span>
                </div>
                <Meter
                  value={p}
                  color={p >= 0.8 ? SAGE : p >= 0.6 ? GOLD : CORAL}
                  height={6}
                />
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <H sub="Every item with the rationale. Work the ones you missed.">Answer review</H>
        <div style={{ display: 'grid', gap: 12 }}>
          {result.questionIds.map((id, i) => {
            const q = bank.find((x) => x.id === id);
            if (!q) return null;
            return (
              <QuestionCard
                key={id}
                question={q}
                picked={result.answers[id] ?? []}
                onPick={() => {}}
                revealed
                position={{ index: i, total: result.questionIds.length }}
                onStudy={onStudy}
                showNote
              />
            );
          })}
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 9, marginTop: 16, flexWrap: 'wrap' }}>
        <Button onClick={onAgain}>New mock exam</Button>
        <Button variant="ghost" onClick={onExit}>
          Back to plan
        </Button>
      </div>
    </div>
  );
}
