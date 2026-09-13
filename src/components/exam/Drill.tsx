// Drill mode: practise a domain with the rationale revealed after each answer.
//
// This is the learning mode, so it does things the real exam does not: instant
// feedback, a weakest-first queue, and a link back to the study note. Those are
// labelled as practice affordances so they do not set expectations for exam day.

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Attempt, DomainId, OptionLetter, Question } from '../../data/exam/types';
import { DOMAINS, DOMAIN_BY_ID } from '../../data/exam/domains';
import { isCorrect } from '../../data/exam/scoring';
import QuestionCard from './QuestionCard';
import {
  Button,
  Card,
  CORAL,
  DISPLAY,
  H,
  INK,
  INK_MUTED,
  MARBLE,
  Meter,
  MONO,
  Pill,
  Pressable,
  SAGE,
  useVariants,
} from './ui';

type Queue = { questions: Question[]; label: string };

export default function Drill({
  bank,
  attempts,
  initialDomain,
  onAttempt,
  onExit,
  onStudy,
}: {
  bank: Question[];
  attempts: Attempt[];
  initialDomain: DomainId | null;
  onAttempt: (a: Attempt) => void;
  onExit: () => void;
  onStudy: (objective: string) => void;
}) {
  const { stagger, pop, reduced } = useVariants();
  const [queue, setQueue] = useState<Queue | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<OptionLetter[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [sessionLog, setSessionLog] = useState<{ correct: boolean }[]>([]);
  // After a miss, the objective note opens and must be acknowledged before
  // moving on. Getting it wrong is the moment the explanation lands.
  const [mustRead, setMustRead] = useState(false);
  const [hasRead, setHasRead] = useState(false);

  // Weakest-first: never seen, then most recently wrong, then least seen.
  const rank = useMemo(() => {
    const latest = new Map<string, Attempt>();
    for (const a of attempts) {
      const prev = latest.get(a.questionId);
      if (!prev || a.at >= prev.at) latest.set(a.questionId, a);
    }
    return (q: Question) => {
      const a = latest.get(q.id);
      if (!a) return 0; // unseen first
      return a.correct ? 2 : 1; // wrong before right
    };
  }, [attempts]);

  const start = (domain: DomainId | 'weak', size: number | 'all') => {
    let pool =
      domain === 'weak'
        ? bank.filter((q) => rank(q) < 2)
        : bank.filter((q) => q.domain === domain);
    pool = [...pool].sort((a, b) => rank(a) - rank(b) || Math.random() - 0.5);
    const questions = size === 'all' ? pool : pool.slice(0, size);
    if (!questions.length) return;
    setQueue({
      questions,
      label:
        domain === 'weak'
          ? 'Weak spots'
          : `D${domain} ${DOMAIN_BY_ID[domain as DomainId].title}`,
    });
    setIndex(0);
    setPicked([]);
    setRevealed(false);
    setSessionLog([]);
    setStartedAt(Date.now());
  };

  // ------------------------------------------------------------- picker
  if (!queue) {
    if (initialDomain) {
      // Deep-linked from the plan: start immediately.
      start(initialDomain, 10);
    }
    return (
      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={pop}>
          <H sub="Feedback is immediate here. The mock exam withholds it, like the real one.">
            Drill
          </H>
        </motion.div>
        <motion.div variants={pop} style={{ marginBottom: 14 }}>
          <Card style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 16, color: INK }}>Weak spots</div>
              <div style={{ fontFamily: MONO, fontSize: 12, color: INK_MUTED, marginTop: 3 }}>
                Everything unseen or last answered wrong, across all domains.
              </div>
            </div>
            <Button onClick={() => start('weak', 20)}>20 questions</Button>
            <Button variant="ghost" onClick={() => start('weak', 'all')}>
              All
            </Button>
          </Card>
        </motion.div>

        <motion.div variants={stagger} style={{ display: 'grid', gap: 10 }}>
          {DOMAINS.map((d) => {
            const count = bank.filter((q) => q.domain === d.id).length;
            return (
              <motion.div key={d.id} variants={pop}>
                <Pressable
                  as="div"
                  accent={d.accent}
                  slide={2}
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    borderLeft: `3px solid ${d.accent}`,
                    padding: '13px 15px',
                    cursor: 'default',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 15, color: INK }}>
                      <span style={{ fontFamily: MONO, fontSize: 12, color: d.accent }}>
                        D{d.id}{' '}
                      </span>
                      {d.title}
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 11.5, color: INK_MUTED, marginTop: 3 }}>
                      {count} questions · {d.weight}% of the exam
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => start(d.id, 10)}>
                    10
                  </Button>
                  <Button variant="ghost" onClick={() => start(d.id, 'all')}>
                    All {count}
                  </Button>
                </Pressable>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    );
  }

  // ------------------------------------------------------------ session
  const q = queue.questions[index];
  const done = sessionLog.length;
  const right = sessionLog.filter((x) => x.correct).length;
  const finished = index >= queue.questions.length;

  if (finished) {
    return (
      <Card accent={SAGE}>
        <H>Set finished</H>
        <p style={{ fontSize: 15, color: INK, margin: '0 0 14px' }}>
          {right} of {done} correct on {queue.label}.
        </p>
        <div style={{ maxWidth: 300, marginBottom: 18 }}>
          <Meter value={done ? right / done : 0} color={SAGE} />
        </div>
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
          <Button onClick={() => setQueue(null)}>Pick another set</Button>
          <Button variant="ghost" onClick={onExit}>
            Back to plan
          </Button>
        </div>
      </Card>
    );
  }

  const submit = () => {
    if (picked.length !== q.selectCount) return;
    const correct = isCorrect(q, picked);
    onAttempt({
      questionId: q.id,
      picked,
      correct,
      at: Date.now(),
      ms: Date.now() - startedAt,
      mode: 'drill',
    });
    setSessionLog((l) => [...l, { correct }]);
    setRevealed(true);
    setMustRead(!correct);
    setHasRead(false);
  };

  const next = () => {
    setIndex((i) => i + 1);
    setPicked([]);
    setRevealed(false);
    setMustRead(false);
    setHasRead(false);
    setStartedAt(Date.now());
  };

  return (
    <div>
      {/* session bar */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: 14,
        }}
      >
        <Pill>{queue.label}</Pill>
        <span style={{ fontFamily: MONO, fontSize: 12, color: INK_MUTED }}>
          {done > 0 ? `${right}/${done} correct` : 'not answered yet'}
        </span>
        <div style={{ flex: 1, minWidth: 120, maxWidth: 220 }}>
          <Meter
            value={index}
            max={queue.questions.length}
            color={INK_MUTED}
            height={5}
          />
        </div>
        <Button variant="ghost" onClick={() => setQueue(null)} style={{ marginLeft: 'auto' }}>
          End set
        </Button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={q.id}
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, x: -18 }}
          transition={reduced ? { duration: 0.01 } : { duration: 0.2, ease: 'easeOut' }}
        >
          <QuestionCard
            question={q}
            picked={picked}
            onPick={setPicked}
            revealed={revealed}
            position={{ index, total: queue.questions.length }}
            onStudy={onStudy}
            showNote
            requireNote={mustRead && !hasRead}
            onNoteRead={() => setHasRead(true)}
          />
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', gap: 9, marginTop: 14, flexWrap: 'wrap' }}>
        {!revealed ? (
          <Button onClick={submit} disabled={picked.length !== q.selectCount}>
            {picked.length !== q.selectCount
              ? `Select ${q.selectCount - picked.length} more`
              : 'Check answer'}
          </Button>
        ) : (
          <Button onClick={next} disabled={mustRead && !hasRead}>
            {mustRead && !hasRead
              ? 'Read the note to continue'
              : index + 1 >= queue.questions.length
                ? 'Finish set'
                : 'Next question'}
          </Button>
        )}
        {!revealed && (
          <Button
            variant="ghost"
            onClick={() => {
              setSessionLog((l) => [...l, { correct: false }]);
              setRevealed(true);
              setMustRead(true);
              setHasRead(false);
            }}
          >
            Skip and show answer
          </Button>
        )}
      </div>
    </div>
  );
}
