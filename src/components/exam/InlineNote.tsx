// The objective's teaching note, inline under a revealed question.
//
// Closed by default and lazily loaded: each domain's notes are a 150-300 KB
// chunk, so nothing downloads until you actually open one. Once a domain is
// fetched it is cached for the session, so later questions in the same domain
// expand instantly.

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { ObjectiveNote, SectionKind } from '../../data/exam/notes-types';
import { DOMAIN_BY_ID } from '../../data/exam/domains';
import type { DomainId } from '../../data/exam/types';
import { Blocks, SectionHeader } from './Blocks';
import {
  Button,
  DISPLAY,
  INK,
  INK_LIGHT,
  INK_MUTED,
  MARBLE,
  MONO,
  Pressable,
  TinyButton,
  WARM,
  useVariants,
} from './ui';

const loaders: Record<number, () => Promise<{ default: ObjectiveNote[] }>> = {
  1: () => import('../../data/exam/notes/d1'),
  2: () => import('../../data/exam/notes/d2'),
  3: () => import('../../data/exam/notes/d3'),
  4: () => import('../../data/exam/notes/d4'),
  5: () => import('../../data/exam/notes/d5'),
  6: () => import('../../data/exam/notes/d6'),
  7: () => import('../../data/exam/notes/d7'),
};

/** Shared across every question card, so a domain downloads at most once. */
const cache = new Map<number, ObjectiveNote[]>();

/** Concepts first: that is what a missed question usually needs. */
const ORDER: SectionKind[] = [
  'concept',
  'decide',
  'numbers',
  'exam',
  'worked',
  'abilities',
  'selfcheck',
  'sources',
];

export default function InlineNote({
  objective,
  domain,
  onOpenFull,
  required = false,
  onRead,
}: {
  objective: string;
  domain: DomainId;
  /** Opens the same note in the Study tab, for a full-width read. */
  onOpenFull?: (objective: string) => void;
  /**
   * Set after a wrong answer. The note opens itself, cannot be collapsed, and
   * the reader has to acknowledge it before the session will move on.
   */
  required?: boolean;
  onRead?: () => void;
}) {
  const { reduced } = useVariants();
  const [open, setOpen] = useState(required);
  const [note, setNote] = useState<ObjectiveNote | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const accent = DOMAIN_BY_ID[domain].accent;

  const load = () => {
    if (note || loading) return;
    const cached = cache.get(domain);
    if (cached) {
      setNote(cached.find((n) => n.objective === objective) ?? null);
      return;
    }
    setLoading(true);
    setFailed(false);
    loaders[domain]()
      .then((m) => {
        cache.set(domain, m.default);
        setNote(m.default.find((n) => n.objective === objective) ?? null);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  };

  const toggle = () => {
    if (required) return; // a required note stays open
    const next = !open;
    setOpen(next);
    if (next) load();
  };

  // A wrong answer opens the note without being asked.
  useEffect(() => {
    if (required) {
      setOpen(true);
      load();
    }
  }, [required, objective]);

  return (
    <div
      style={{
        marginTop: 14,
        border: `1px solid ${MARBLE}`,
        borderRadius: 9,
        overflow: 'hidden',
        background: open ? '#fff' : WARM,
      }}
    >
      <Pressable
        onClick={toggle}
        ariaExpanded={open}
        accent={accent}
        active={open}
        slide={0}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: 'none',
          borderRadius: 0,
          padding: '11px 14px',
          background: 'transparent',
        }}
      >
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 30 }}
          style={{ color: accent, fontSize: 11, lineHeight: 1 }}
          aria-hidden
        >
          ▶
        </motion.span>
        <span style={{ fontFamily: MONO, fontSize: 12, color: accent }}>{objective}</span>
        <span style={{ fontSize: 13.5, color: required ? INK : INK_LIGHT, flex: 1, minWidth: 0 }}>
          {required
            ? 'Read this before moving on'
            : open
              ? 'Hide the note'
              : 'Read the note on this objective'}
        </span>
        {loading && (
          <span style={{ fontFamily: MONO, fontSize: 11, color: INK_MUTED }}>loading…</span>
        )}
      </Pressable>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={reduced ? { duration: 0.01 } : { duration: 0.26, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '2px 16px 18px', borderTop: `1px solid ${MARBLE}` }}>
              {failed && (
                <p style={{ fontSize: 14, color: INK_MUTED, margin: '14px 0' }}>
                  The note failed to load. Check the connection and try again.
                </p>
              )}

              {!failed && !note && loading && (
                <p style={{ fontSize: 14, color: INK_MUTED, margin: '14px 0' }}>
                  Loading the note…
                </p>
              )}

              {note && (
                <>
                  <div
                    style={{
                      margin: '14px 0 16px',
                      display: 'flex',
                      gap: 10,
                      alignItems: 'baseline',
                      flexWrap: 'wrap',
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontFamily: DISPLAY,
                        fontSize: 17,
                        color: INK,
                        flex: 1,
                        minWidth: 200,
                      }}
                    >
                      {note.title}
                    </h4>
                    {onOpenFull && (
                      <TinyButton onClick={() => onOpenFull(objective)} accent={accent}>
                        open full width
                      </TinyButton>
                    )}
                  </div>

                  {note.summary && (
                    <p
                      style={{
                        margin: '0 0 18px',
                        padding: '11px 13px',
                        background: WARM,
                        borderLeft: `3px solid ${accent}`,
                        borderRadius: 7,
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: INK_LIGHT,
                      }}
                    >
                      {note.summary}
                    </p>
                  )}

                  {[...note.sections]
                    .sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind))
                    .map((s, i) => (
                      <section key={i} style={{ marginBottom: 24 }}>
                        <SectionHeader title={s.title} kind={s.kind} compact />
                        <Blocks blocks={s.blocks} kind={s.kind} accent={accent} />
                      </section>
                    ))}
                </>
              )}

              {!loading && !failed && !note && (
                <p style={{ fontSize: 14, color: INK_MUTED, margin: '14px 0' }}>
                  No note exists for this objective yet.
                </p>
              )}

              {required && onRead && (note || failed) && (
                <div
                  style={{
                    marginTop: 18,
                    paddingTop: 14,
                    borderTop: `1px solid ${MARBLE}`,
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <Button onClick={onRead}>I have read this</Button>
                  <span style={{ fontSize: 13, color: INK_MUTED }}>
                    You missed this one, so the note opened automatically.
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
