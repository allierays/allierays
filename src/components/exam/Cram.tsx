// Cram mode: every objective's "Key facts" (and optionally its "Numbers to
// remember" table) on one scrollable, printable page. This is the last-mile
// review surface — no accordions, no navigation, just the facts in blueprint
// order. It loads all seven domain note files up front, so it is a heavier
// screen than Study; that is the point.

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { ObjectiveNote } from '../../data/exam/notes-types';
import { DOMAINS } from '../../data/exam/domains';
import { Blocks } from './Blocks';
import {
  Button,
  DISPLAY,
  H,
  INK,
  INK_MUTED,
  MARBLE,
  MONO,
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

let allCache: ObjectiveNote[] | null = null;

export default function Cram() {
  const { stagger, pop } = useVariants();
  const [notes, setNotes] = useState<ObjectiveNote[] | null>(allCache);
  const [includeNumbers, setIncludeNumbers] = useState(true);

  useEffect(() => {
    if (allCache) return;
    let live = true;
    Promise.all(DOMAINS.map((d) => loaders[d.id]().then((m) => m.default)))
      .then((lists) => {
        allCache = lists.flat();
        if (live) setNotes(allCache);
      })
      .catch(() => {
        if (live) setNotes([]);
      });
    return () => {
      live = false;
    };
  }, []);

  const byObjective = new Map(notes?.map((n) => [n.objective, n]) ?? []);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <style>{`@media print { .cram-controls { display: none !important; } }`}</style>

      <motion.div variants={pop}>
        <H sub="Every objective's key facts on one page. Print it or scan it the night before. Numbers tables are folded in by default; toggle them off for a tighter pass.">
          Cram sheet
        </H>
      </motion.div>

      <motion.div
        variants={pop}
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
          margin: '0 0 22px',
        }}
        className="cram-controls"
      >
        <Button variant="ghost" onClick={() => window.print()}>
          Print / save as PDF
        </Button>
        <label
          style={{
            display: 'inline-flex',
            gap: 7,
            alignItems: 'center',
            fontSize: 13.5,
            color: INK,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
          />
          Include Numbers tables
        </label>
      </motion.div>

      {!notes && (
        <div style={{ padding: 30, textAlign: 'center', fontFamily: MONO, color: INK_MUTED }}>
          Loading every note…
        </div>
      )}

      {notes && notes.length === 0 && (
        <div style={{ padding: 30, textAlign: 'center', fontFamily: MONO, color: INK_MUTED }}>
          Notes failed to load. Reopen the tab to retry.
        </div>
      )}

      {notes && notes.length > 0 && (
        <AnimatePresence initial={false}>
          <div style={{ display: 'grid', gap: 34 }}>
            {DOMAINS.map((d) => (
              <section key={d.id} style={{ breakInside: 'avoid' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: 9,
                    alignItems: 'baseline',
                    flexWrap: 'wrap',
                    borderBottom: `2px solid ${d.accent}`,
                    paddingBottom: 7,
                    marginBottom: 16,
                  }}
                >
                  <span style={{ fontFamily: MONO, fontSize: 13, color: d.accent }}>D{d.id}</span>
                  <span style={{ fontSize: 18, color: INK, fontFamily: DISPLAY }}>{d.title}</span>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: INK_MUTED }}>{d.weight}%</span>
                </div>

                <div style={{ display: 'grid', gap: 20 }}>
                  {d.objectives.map((obj) => {
                    const n = byObjective.get(obj.id);
                    const facts = n?.sections.find((s) => s.kind === 'abilities');
                    const numbers = n?.sections.find((s) => s.kind === 'numbers');
                    return (
                      <article key={obj.id} style={{ breakInside: 'avoid' }}>
                        <div
                          style={{
                            display: 'flex',
                            gap: 8,
                            alignItems: 'baseline',
                            flexWrap: 'wrap',
                            marginBottom: 8,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: MONO,
                              fontSize: 12,
                              color: d.accent,
                              fontWeight: 700,
                            }}
                          >
                            {obj.id}
                          </span>
                          <span style={{ fontSize: 14.5, color: INK, fontWeight: 600 }}>
                            {n?.title ?? obj.title}
                          </span>
                        </div>

                        {facts ? (
                          <Blocks blocks={facts.blocks} kind="abilities" accent={d.accent} />
                        ) : (
                          <p style={{ fontSize: 13, color: INK_MUTED, fontStyle: 'italic' }}>
                            No key facts recorded for this objective.
                          </p>
                        )}

                        {includeNumbers && numbers && (
                          <div style={{ marginTop: 12 }}>
                            <div
                              style={{
                                fontFamily: MONO,
                                fontSize: 10,
                                letterSpacing: '0.07em',
                                textTransform: 'uppercase',
                                color: INK_MUTED,
                                marginBottom: 6,
                              }}
                            >
                              Numbers
                            </div>
                            <Blocks blocks={numbers.blocks} kind="numbers" accent={d.accent} />
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </AnimatePresence>
      )}

      <div style={{ height: 1, background: MARBLE, margin: '34px 0 0' }} />
      <p style={{ fontFamily: MONO, fontSize: 11, color: INK_MUTED, marginTop: 14 }}>
        Facts are extracted from the study vault. For the reasoning behind each, open the full note in
        Study.
      </p>
    </motion.div>
  );
}
