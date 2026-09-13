// One exam item.
//
// Fidelity rules taken from the official guide:
//  - Items are multiple-choice or multiple-response, and each item states how
//    many responses to select. That instruction is always rendered.
//  - Four options, one correct, unless the item names a higher select count.
//  - Rationales explain why each distractor fails, not just why the key is
//    right, so the review state shows the full rationale rather than "correct".
//
// Practice affordances that the real exam does NOT have are marked in the UI so
// they do not create false expectations: instant feedback in drill mode, and
// the link back to the source study note.

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { OptionLetter, Question } from '../../data/exam/types';
import { isCorrect } from '../../data/exam/scoring';
import { DOMAIN_BY_ID } from '../../data/exam/domains';
import InlineNote from './InlineNote';
import {
  CARD,
  CORAL,
  INK,
  INK_LIGHT,
  INK_MUTED,
  MARBLE,
  MONO,
  Pill,
  RichText,
  SAGE,
  TinyButton,
  WARM,
  useVariants,
} from './ui';

const LETTERS: OptionLetter[] = ['A', 'B', 'C', 'D', 'E'];

export interface QuestionCardProps {
  question: Question;
  picked: OptionLetter[];
  onPick: (letters: OptionLetter[]) => void;
  /** Drill mode reveals the rationale after answering; mock mode never does. */
  revealed: boolean;
  /** Index within the current set, for the counter. */
  position?: { index: number; total: number };
  flagged?: boolean;
  onToggleFlag?: () => void;
  /** Opens the teaching note for this question's objective. */
  onStudy?: (objective: string) => void;
  /**
   * Show the collapsed objective note. True in drill (before and after
   * answering) and in mock review; false while a mock is running, where any
   * reference material would defeat the point.
   */
  showNote?: boolean;
  /** Wrong answer in drill: the note opens itself and must be acknowledged. */
  requireNote?: boolean;
  onNoteRead?: () => void;
}

export default function QuestionCard({
  question: q,
  picked,
  onPick,
  revealed,
  position,
  flagged,
  onToggleFlag,
  onStudy,
  showNote = false,
  requireNote = false,
  onNoteRead,
}: QuestionCardProps) {
  const { reduced } = useVariants();
  const [refused, setRefused] = useState<OptionLetter | null>(null);
  const [hovered, setHovered] = useState<OptionLetter | null>(null);
  const domain = DOMAIN_BY_ID[q.domain];
  const correct = revealed && isCorrect(q, picked);
  const answered = picked.length > 0;

  const toggle = (letter: OptionLetter) => {
    if (revealed) return;
    if (q.selectCount === 1) {
      onPick([letter]);
      return;
    }
    // Multi-response: toggle, and refuse a pick that would exceed the stated
    // count. Refusing matches how proctored engines behave; silently displacing
    // an earlier pick would teach the wrong habit.
    if (picked.includes(letter)) {
      onPick(picked.filter((l) => l !== letter));
    } else if (picked.length < q.selectCount) {
      onPick([...picked, letter]);
    } else {
      setRefused(letter);
      window.setTimeout(() => setRefused(null), 1400);
    }
  };

  const short = picked.length < q.selectCount;

  // A new question reuses this component; drop any stale hover.
  if (hovered && !q.options[LETTERS.indexOf(hovered)]) setHovered(null);

  return (
    <div
      style={{
        background: CARD,
        border: `1px solid ${MARBLE}`,
        borderRadius: 12,
        padding: '22px 24px',
      }}
    >
      {/* meta row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          marginBottom: 14,
        }}
      >
        {position && (
          <span style={{ fontFamily: MONO, fontSize: 12, color: INK_MUTED }}>
            {position.index + 1} / {position.total}
          </span>
        )}
        <Pill color={domain.accent}>
          D{q.domain} {q.objective ?? ''}
        </Pill>
        {q.type === 'multi' && <Pill color={CORAL}>multiple response</Pill>}
        {onToggleFlag && (
          <span style={{ marginLeft: 'auto' }}>
            <TinyButton
              onClick={onToggleFlag}
              ariaPressed={flagged}
              active={flagged}
              accent="#b8730c"
            >
              {flagged ? 'flagged' : 'flag for review'}
            </TinyButton>
          </span>
        )}
      </div>

      {/* stem */}
      <p
        style={{
          margin: '0 0 6px',
          fontSize: 16,
          lineHeight: 1.6,
          color: INK,
        }}
      >
        <RichText text={q.stem} />
      </p>

      {/* The real exam always states how many to select. */}
      <p
        style={{
          margin: '0 0 16px',
          fontFamily: MONO,
          fontSize: 12,
          color: q.selectCount > 1 ? CORAL : INK_MUTED,
        }}
      >
        {q.selectCount === 1 ? 'Select one.' : `Select ${numberWord(q.selectCount)}.`}
      </p>

      {/* options */}
      <div style={{ display: 'grid', gap: 8 }}>
        {q.options.map((opt, i) => {
          const letter = LETTERS[i];
          const isPicked = picked.includes(letter);
          const isKey = q.keys.includes(letter);
          const showAsKey = revealed && isKey;
          const showAsWrong = revealed && isPicked && !isKey;

          let border = MARBLE;
          let bg = 'transparent';
          if (showAsKey) {
            border = SAGE;
            bg = '#f2f7f0';
          } else if (showAsWrong) {
            border = CORAL;
            bg = '#fdf2ef';
          } else if (isPicked) {
            border = INK_LIGHT;
            bg = WARM;
          }

          // Hover only means anything while the item is still answerable.
          const isHot = !revealed && hovered === letter;
          const atCap = q.selectCount > 1 && picked.length >= q.selectCount && !isPicked;
          if (isHot && !showAsKey && !showAsWrong) {
            border = atCap ? CORAL : isPicked ? INK : domain.accent;
            bg = atCap ? '#fdf5f2' : isPicked ? WARM : '#f7f9fa';
          }

          return (
            <motion.button
              key={letter}
              type="button"
              onClick={() => toggle(letter)}
              onMouseEnter={() => setHovered(letter)}
              onMouseLeave={() => setHovered((h) => (h === letter ? null : h))}
              onFocus={() => setHovered(letter)}
              onBlur={() => setHovered((h) => (h === letter ? null : h))}
              disabled={revealed}
              aria-pressed={isPicked}
              whileHover={revealed ? undefined : { x: 3 }}
              whileTap={revealed ? undefined : { scale: 0.994 }}
              transition={{ type: 'spring', stiffness: 500, damping: 34 }}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                textAlign: 'left',
                width: '100%',
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 9,
                padding: '12px 14px',
                cursor: revealed ? 'default' : atCap ? 'not-allowed' : 'pointer',
                transition: reduced
                  ? 'none'
                  : 'background 130ms ease, border-color 130ms ease, box-shadow 130ms ease',
                boxShadow: isHot && !atCap ? `0 1px 6px ${domain.accent}1f` : 'none',
                font: 'inherit',
                color: INK,
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  fontWeight: 700,
                  color: showAsKey
                    ? SAGE
                    : showAsWrong
                      ? CORAL
                      : isHot && !atCap
                        ? domain.accent
                        : INK_MUTED,
                  minWidth: 16,
                  paddingTop: 2,
                  transition: reduced ? 'none' : 'color 130ms ease',
                }}
              >
                {letter}
              </span>
              <span style={{ fontSize: 15, lineHeight: 1.5 }}>
                <RichText text={opt} />
              </span>
              {showAsKey && (
                <span style={{ marginLeft: 'auto', color: SAGE, fontFamily: MONO, fontSize: 11 }}>
                  key
                </span>
              )}
              {atCap && isHot && (
                <span style={{ marginLeft: 'auto', color: CORAL, fontFamily: MONO, fontSize: 10.5 }}>
                  deselect one first
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* selection state, before reveal only */}
      {!revealed && (
        <div aria-live="polite" style={{ minHeight: 18, marginTop: 10 }}>
          {refused && (
            <p style={{ margin: 0, fontFamily: MONO, fontSize: 12, color: CORAL }}>
              This item asks for exactly {q.selectCount}. Deselect one first.
            </p>
          )}
          {!refused && answered && short && (
            <p style={{ margin: 0, fontFamily: MONO, fontSize: 12, color: INK_MUTED }}>
              {picked.length} of {q.selectCount} selected.
            </p>
          )}
        </div>
      )}

      {/* rationale */}
      <AnimatePresence initial={false}>
        {revealed && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={reduced ? { duration: 0.01 } : { duration: 0.22, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                marginTop: 16,
                paddingTop: 14,
                borderTop: `1px solid ${MARBLE}`,
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: correct ? SAGE : CORAL,
                  marginBottom: 7,
                }}
              >
                {correct ? 'Correct' : answered ? 'Not quite' : 'Unanswered'}
                <span style={{ color: INK_MUTED, textTransform: 'none', letterSpacing: 0 }}>
                  {'  ·  key: '}
                  {q.keys.join(' + ')}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: INK_LIGHT }}>
                <RichText text={q.rationale} />
              </p>
              <p style={{ margin: '10px 0 0', fontFamily: MONO, fontSize: 11, color: INK_MUTED }}>
                {q.objectiveTitle ? `${q.objective} ${q.objectiveTitle}` : domain.title}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showNote && q.objective && (
        <InlineNote
          objective={q.objective}
          domain={q.domain}
          onOpenFull={onStudy}
          required={requireNote}
          onRead={onNoteRead}
        />
      )}
    </div>
  );
}

function numberWord(n: number): string {
  return ['zero', 'one', 'two', 'three', 'four', 'five'][n] ?? String(n);
}
