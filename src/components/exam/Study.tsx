// Study mode: the teaching notes behind the questions.
//
// Notes are ~1.3 MB of markdown across seven domains, so each domain is a
// dynamic import that only loads when opened. The Study tab is also where a
// missed question sends you, via the "Read the note" link on the review state.

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { ObjectiveNote, SectionKind } from '../../data/exam/notes-types';
import { DOMAINS, DOMAIN_BY_ID } from '../../data/exam/domains';
import type { DomainId } from '../../data/exam/types';
import { Blocks, SectionHeader } from './Blocks';
import {
  Button,
  Card,
  DISPLAY,
  H,
  INK,
  INK_LIGHT,
  INK_MUTED,
  MARBLE,
  MONO,
  Pill,
  Pressable,
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

const cache = new Map<number, ObjectiveNote[]>();

/** Sections a studier wants first, in the order they want them. */
const ORDER: SectionKind[] = [
  'abilities',
  'concept',
  'decide',
  'numbers',
  'exam',
  'worked',
  'selfcheck',
  'sources',
];

export default function Study({
  target,
  onClearTarget,
}: {
  /** Objective id like "3.2", set when arriving from a missed question. */
  target: string | null;
  onClearTarget: () => void;
}) {
  const { stagger, pop, reduced } = useVariants();
  const [domain, setDomain] = useState<DomainId | null>(
    target ? (Number(target.split('.')[0]) as DomainId) : null
  );
  const [notes, setNotes] = useState<ObjectiveNote[] | null>(null);
  const [open, setOpen] = useState<string | null>(target);
  const [loading, setLoading] = useState(false);

  // Arriving from a missed question jumps straight to that objective.
  useEffect(() => {
    if (!target) return;
    setDomain(Number(target.split('.')[0]) as DomainId);
    setOpen(target);
  }, [target]);

  useEffect(() => {
    if (domain === null) return;
    if (cache.has(domain)) {
      setNotes(cache.get(domain)!);
      return;
    }
    setLoading(true);
    loaders[domain]()
      .then((m) => {
        cache.set(domain, m.default);
        setNotes(m.default);
      })
      .finally(() => setLoading(false));
  }, [domain]);

  // ------------------------------------------------------------ domain list
  if (domain === null) {
    return (
      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={pop}>
          <H sub="The full notes behind every question: concepts, decision rules, the numbers worth memorising, and how the exam phrases each one.">
            Study
          </H>
        </motion.div>
        <motion.div variants={stagger} style={{ display: 'grid', gap: 10 }}>
          {DOMAINS.map((d) => (
            <motion.div key={d.id} variants={pop}>
            <Pressable
              onClick={() => setDomain(d.id)}
              accent={d.accent}
              style={{ borderLeft: `3px solid ${d.accent}`, padding: '15px 17px' }}
            >
              <div style={{ display: 'flex', gap: 9, alignItems: 'baseline', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: MONO, fontSize: 12, color: d.accent }}>D{d.id}</span>
                <span style={{ fontSize: 16, color: INK, fontFamily: DISPLAY }}>{d.title}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: INK_MUTED }}>
                  {d.weight}% · {d.objectives.length} objectives
                </span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 14, color: INK_MUTED, lineHeight: 1.5 }}>
                {d.blurb}
              </p>
            </Pressable>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    );
  }

  const d = DOMAIN_BY_ID[domain];

  // ------------------------------------------------------- objectives + note
  return (
    <div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <Button
          variant="ghost"
          onClick={() => {
            setDomain(null);
            setOpen(null);
            onClearTarget();
          }}
        >
          All domains
        </Button>
        <span style={{ fontFamily: MONO, fontSize: 12, color: d.accent }}>D{d.id}</span>
        <span style={{ fontSize: 15, color: INK }}>{d.title}</span>
      </div>

      {loading && (
        <div style={{ padding: 30, textAlign: 'center', fontFamily: MONO, color: INK_MUTED }}>
          Loading notes…
        </div>
      )}

      {notes && (
        <div style={{ display: 'grid', gap: 10 }}>
          {notes.map((n) => {
            const isOpen = open === n.objective;
            return (
              <div
                key={n.objective}
                style={{
                  background: '#fff',
                  border: `1px solid ${isOpen ? d.accent : MARBLE}`,
                  borderRadius: 11,
                  overflow: 'hidden',
                }}
              >
                <Pressable
                  onClick={() => {
                    setOpen(isOpen ? null : n.objective);
                    if (isOpen) onClearTarget();
                  }}
                  ariaExpanded={isOpen}
                  active={isOpen}
                  accent={d.accent}
                  slide={0}
                  style={{ border: 'none', borderRadius: 0, padding: '14px 17px' }}
                >
                  <div style={{ display: 'flex', gap: 9, alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: MONO, fontSize: 12, color: d.accent }}>
                      {n.objective}
                    </span>
                    <span style={{ fontSize: 15.5, color: INK, flex: 1, minWidth: 200 }}>
                      {n.title}
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: INK_MUTED }}>
                      {n.sections.filter((s) => s.kind === 'concept').length} concepts
                    </span>
                  </div>
                  {!isOpen && n.summary && (
                    <p
                      style={{
                        margin: '7px 0 0',
                        fontSize: 13.5,
                        color: INK_MUTED,
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {n.summary}
                    </p>
                  )}
                </Pressable>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      animate={reduced ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                      exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      transition={reduced ? { duration: 0.01 } : { duration: 0.26, ease: 'easeOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '4px 17px 20px' }}>
                        {n.summary && (
                          <p
                            style={{
                              margin: '0 0 18px',
                              padding: '11px 14px',
                              background: WARM,
                              borderLeft: `3px solid ${d.accent}`,
                              borderRadius: 7,
                              fontSize: 14.5,
                              lineHeight: 1.6,
                              color: INK_LIGHT,
                            }}
                          >
                            {n.summary}
                          </p>
                        )}
                        {[...n.sections]
                          .sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind))
                          .map((s, i) => (
                            <section key={i} style={{ marginBottom: 28 }}>
                              <SectionHeader title={s.title} kind={s.kind} />
                              <Blocks blocks={s.blocks} kind={s.kind} accent={d.accent} />
                            </section>
                          ))}
                        <div style={{ fontFamily: MONO, fontSize: 11, color: INK_MUTED }}>
                          From the study vault, objective {n.objective}.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
