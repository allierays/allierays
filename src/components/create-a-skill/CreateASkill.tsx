import { useEffect, useRef, useState, type ReactNode } from 'react';
import { animate, motion, useInView, useReducedMotion, type Variants } from 'motion/react';
import {
  ADVANCED,
  ANATOMY,
  CHECKLIST,
  CHECKLIST_TITLE,
  CLOSE,
  GUIDE,
  HOOK,
  HOW,
  WHY,
  PRINCIPLES,
  SECTIONS,
  SOURCES,
  STANDARD,
  WALKTHROUGH_YOUTUBE_ID,
  WORKED_EXAMPLE,
  type Principle,
  type SectionId,
} from './content';
import {
  ChecklistList,
  CurationLoop,
  DescriptionCompare,
  FreedomDial,
  GotchaList,
  ScopeTest,
  GainBars,
  DisclosureStages,
  SkillFileCard,
  SkillFolder,
  WhyCards,
  WorkedExampleTree,
} from './visuals';

// "How to create a great skill", the interactive guide embedded in the blog
// post of the same name.
//
// Sections (SECTIONS in content.ts) with a sticky sidebar that tracks the one
// in view. Copy lives in ./content.ts; the drawings live in ./visuals.tsx and
// take a progress value, which this page produces with motion when each one
// scrolls into view.
//
// Ported from the internal version I built for a company rollout. The company
// examples are now generic ones, the internal cross-links point at the ChatGPT
// & Codex field guide post, and the hero video is a YouTube slot rather than an
// internal recording.
//
// Visual-first: one line under each heading, the drawing, short chips, and the
// reasoning folded behind "More on this".

const INK = '#394646';
const MUTED = '#637979';

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const pop: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } },
};

const CHECKLIST_KEY = 'createASkillChecklist';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

/**
 * Drives a visual's progress 0 -> 1 the first time it scrolls into view.
 * Linear, because the visuals ease their own segments; reduced motion jumps
 * straight to the finished drawing. `replay` restarts it.
 */
function useReveal(seconds: number, amount = 0.35) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setT(1);
      return;
    }
    setT(0);
    const controls = animate(0, 1, { duration: seconds, ease: 'linear', onUpdate: setT });
    return () => controls.stop();
  }, [inView, reduce, seconds, run]);

  return { ref, t, replay: () => setRun((n) => n + 1) };
}

/** Which section heading is nearest the top of the viewport. */
function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>(SECTIONS[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // The first section whose heading zone is intersecting, top to bottom.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id as SectionId);
      },
      // A band across the upper part of the viewport, so the active item
      // changes as a heading passes through it rather than at the page edge.
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

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Kicker({ children, color = '#B05C3B' }: { children: ReactNode; color?: string }) {
  return (
    <motion.p variants={pop} className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color }}>
      {children}
    </motion.p>
  );
}

/** A top-level section heading: the ones the sidebar lists. */
function H2({ children }: { children: ReactNode }) {
  return (
    <motion.h2
      variants={pop}
      className="text-[2rem] md:text-[2.4rem] font-extrabold leading-[1.05] tracking-[-0.02em]"
      style={{ color: INK }}
    >
      {children}
    </motion.h2>
  );
}

/** A heading inside a section. */
function H3({ children }: { children: ReactNode }) {
  return (
    <motion.h3
      variants={pop}
      className="mt-2 text-[1.5rem] md:text-[1.75rem] font-extrabold leading-[1.1] tracking-[-0.02em]"
      style={{ color: INK }}
    >
      {children}
    </motion.h3>
  );
}

function Lede({ children }: { children: ReactNode }) {
  return (
    <motion.p variants={pop} className="mt-3 max-w-[640px] text-[16px] leading-[1.6]" style={{ color: INK }}>
      {children}
    </motion.p>
  );
}

/** A visual that draws itself once when it scrolls into view. */
function Stage({
  seconds,
  children,
  className = '',
}: {
  seconds: number;
  children: (t: number) => ReactNode;
  className?: string;
}) {
  const { ref, t } = useReveal(seconds);
  return (
    <div ref={ref} className={`relative min-w-0 ${className}`}>
      {children(t)}
    </div>
  );
}

function PrincipleVisual({ principle, t }: { principle: Principle; t: number }) {
  switch (principle.visual) {
    case 'description':
      return <DescriptionCompare t={t} width={720} />;
    case 'freedom':
      return <FreedomDial t={t} width={720} />;
    case 'scope':
      return <ScopeTest t={t} width={720} />;
    case 'gotchas':
      return <GotchaList t={t} width={720} />;
    case 'loop':
      return <CurationLoop t={t} width={720} />;
    case 'bars':
    case 'bars-count':
      return principle.evidence ? (
        <GainBars t={t} bars={principle.evidence.bars} title={principle.evidence.title} source={principle.evidence.source} width={560} />
      ) : null;
    default:
      return null;
  }
}

function PrincipleBlock({ principle }: { principle: Principle }) {
  const wide = principle.visual !== 'bars' && principle.visual !== 'bars-count';
  return (
    <div id={`principle-${principle.number}`} className="scroll-mt-24">
      <Reveal>
        <div className="flex items-center gap-3">
          <motion.span
            variants={pop}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[16px] font-extrabold"
            style={{ background: GUIDE.accent.bg, color: GUIDE.accent.color }}
          >
            {principle.number}
          </motion.span>
          <Kicker>Principle {principle.number} of {PRINCIPLES.length}</Kicker>
        </div>
        <H3>{principle.title}</H3>
        <motion.p
          variants={pop}
          className="mt-2 max-w-[640px] text-[19px] leading-snug"
          style={{ color: INK, fontFamily: 'var(--font-body)' }}
        >
          {principle.takeaway}
        </motion.p>
      </Reveal>

      <div className={`mt-5 grid gap-6 ${wide ? '' : 'grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_560px] lg:items-start'}`}>
        <Reveal className="flex flex-wrap content-start gap-2">
          {principle.rules.map((r) => (
            <motion.span
              key={r}
              variants={pop}
              className="inline-flex items-center gap-2 rounded-full border border-[#ded8ce] bg-[#FAF9F4] px-3.5 py-1.5 text-[13px] font-semibold"
              style={{ color: INK }}
            >
              <svg className="h-3.5 w-3.5 flex-shrink-0" style={{ color: GUIDE.accent.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {r}
            </motion.span>
          ))}
        </Reveal>

        <Stage seconds={principle.visual === 'freedom' ? 4 : 2.6} className="mb-8">
          {(t) => <PrincipleVisual principle={principle} t={t} />}
        </Stage>
      </div>

      {/* The reasoning and the numbers, folded away: the drawing carries the
          point, this is for whoever wants to check it. */}
      <details className="group mt-2 max-w-[640px]">
        <summary className="cursor-pointer list-none text-[13px] font-semibold" style={{ color: GUIDE.accent.color }}>
          <span className="group-open:hidden">More on this</span>
          <span className="hidden group-open:inline">Less</span>
        </summary>
        <div className="mt-3 space-y-3">
          {principle.body.map((para) => (
            <p key={para} className="text-[15px] leading-[1.6]" style={{ color: INK }}>{para}</p>
          ))}
          {wide && principle.evidence && (
            <div className="pt-2">
              <GainBars t={1} bars={principle.evidence.bars} title={principle.evidence.title} source={principle.evidence.source} width={560} />
            </div>
          )}
        </div>
      </details>
    </div>
  );
}

function useChecklist() {
  const [checked, setChecked] = useState<boolean[]>(() => {
    try {
      const raw = localStorage.getItem(CHECKLIST_KEY);
      const parsed = raw ? (JSON.parse(raw) as boolean[]) : null;
      if (Array.isArray(parsed) && parsed.length === CHECKLIST.length) return parsed;
    } catch {
      // Storage unavailable or unreadable: start unticked.
    }
    return CHECKLIST.map(() => false);
  });
  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = prev.map((v, j) => (j === i ? !v : v));
      try {
        localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next));
      } catch {
        // Fine to lose: it is a convenience, not a record.
      }
      return next;
    });
  const reset = () => {
    const next = CHECKLIST.map(() => false);
    setChecked(next);
    try {
      localStorage.removeItem(CHECKLIST_KEY);
    } catch {
      // Same as above.
    }
  };
  return { checked, toggle, reset };
}

/**
 * The page's only side navigation: one entry per section, the current one
 * highlighted, in the slot LearnLayout's rail would otherwise occupy. Same
 * geometry as that rail (w-56, sticky under the h-12 site header).
 */
function OnThisPage({ active }: { active: SectionId }) {
  return (
    <nav aria-label="On this page" className="hidden md:block w-56 flex-shrink-0 sticky top-16 self-start">
      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9A9389]">On this page</p>
      <ol className="flex flex-col gap-0.5">
        {SECTIONS.map((s, i) => {
          const isActive = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`flex items-baseline gap-2 rounded-lg px-3 py-2 text-[13px] leading-snug no-underline transition-colors ${
                  isActive ? 'bg-[#FFDDCC] font-semibold text-[#B05C3B]' : 'text-[#394646] hover:bg-[#FAF9F4]'
                }`}
              >
                <span className="text-[11px] font-bold [font-variant-numeric:tabular-nums]" style={{ color: isActive ? '#B05C3B' : '#9A9389' }}>
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

/** The same list as a pill row, for screens without room for the rail. */
function SectionPills() {
  return (
    <nav aria-label="On this page" className="md:hidden mb-6 flex flex-wrap gap-2">
      {SECTIONS.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="inline-flex items-baseline gap-1.5 rounded-full border border-[#ded8ce] bg-white px-3.5 py-1.5 no-underline transition-colors hover:border-[#B05C3B]"
        >
          <span className="text-[12px] font-extrabold" style={{ color: GUIDE.accent.color }}>{i + 1}</span>
          <span className="text-[13px] font-semibold" style={{ color: INK }}>{s.label}</span>
        </a>
      ))}
    </nav>
  );
}

export default function CreateASkill() {
  const hero = useReveal(3.2, 0.1);
  const { checked, toggle, reset } = useChecklist();
  const doneCount = checked.filter(Boolean).length;
  const active = useActiveSection();

  return (
    <div className="fg-scope">
      <div className="max-w-[1240px] mx-auto flex gap-8 items-start">
        <OnThisPage active={active} />
        <article className="min-w-0 flex-1 pb-6">
        {/* Mobile nav lives inside the article column; as a sibling it would
            become a second flex item and push the page wider than the viewport. */}
        <SectionPills />
        {/* Hero */}
        <header>
          <Reveal>
            <motion.div variants={pop} className="flex flex-wrap items-center gap-2">
              <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ background: '#FFF4CE', color: '#615D58' }}>
                {GUIDE.kicker}
              </span>
              <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ background: GUIDE.accent.bg, color: GUIDE.accent.color }}>
                Skills
              </span>
              <span className="text-[12px] font-semibold" style={{ color: MUTED }}>
                {GUIDE.readMinutes} minute read
              </span>
            </motion.div>
            <motion.h1
              variants={pop}
              className="mt-4 max-w-[760px] text-[2.5rem] md:text-[3.1rem] font-extrabold leading-[1.02] tracking-[-0.03em]"
              style={{ color: INK }}
            >
              {GUIDE.title}
            </motion.h1>
            <motion.p variants={pop} className="mt-4 max-w-[640px] text-[19px] leading-relaxed" style={{ color: INK }}>
              {GUIDE.lede}
            </motion.p>
            <motion.div
              variants={pop}
              className="relative mt-8 aspect-video max-w-[960px] overflow-hidden rounded-[18px] border border-[#ded8ce] bg-[#FAF9F4]"
            >
              {WALKTHROUGH_YOUTUBE_ID ? (
                <iframe
                  src={`https://www.youtube.com/embed/${WALKTHROUGH_YOUTUBE_ID}?rel=0`}
                  title="How to create a great skill video guide"
                  className="absolute inset-0 h-full w-full"
                  style={{ border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-[13px] font-bold" style={{ color: MUTED }}>
                  Video walkthrough coming shortly
                </div>
              )}
            </motion.div>
            <motion.p variants={pop} className="mt-5 text-[14px] font-semibold" style={{ color: MUTED }}>
              {GUIDE.examplesIntro}
            </motion.p>
            <motion.ul variants={pop} className="mt-2 flex flex-wrap gap-2">
              {GUIDE.examples.map((e) => (
                <li
                  key={e}
                  className="inline-flex items-center gap-2 rounded-full border border-[#ded8ce] bg-white px-3.5 py-1.5 text-[13.5px] font-semibold"
                  style={{ color: INK }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: GUIDE.accent.color }} />
                  {e}
                </li>
              ))}
            </motion.ul>
            <motion.p variants={pop} className="mt-5 max-w-[640px] text-[16px] leading-relaxed" style={{ color: INK }}>
              {GUIDE.playbook}
            </motion.p>
          </Reveal>

          <div ref={hero.ref} className="mt-8 overflow-hidden rounded-[22px] px-5 py-8 md:px-10 md:py-10" style={{ background: GUIDE.accent.bg }}>
            <div className="mx-auto w-full" style={{ maxWidth: 560 }}>
              <SkillFileCard t={hero.t} width={560} />
            </div>
          </div>

        </header>

        <div className="mt-16 [&>*+*]:mt-24">
          {/* 1. What is a skill */}
          <section id="what" className="scroll-mt-24">
            <Reveal>
              <H2>What is a skill</H2>
              <motion.p
                variants={pop}
                className="mt-3 max-w-[640px] text-[19px] leading-snug"
                style={{ color: INK, fontFamily: 'var(--font-body)' }}
              >
                {ANATOMY.title}.
              </motion.p>
              {ANATOMY.body.map((para) => (
                <Lede key={para}>{para}</Lede>
              ))}
              <motion.div variants={pop} className="mt-4">
                <a
                  href={GUIDE.fieldGuide.to}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#ded8ce] bg-white px-4 py-2.5 text-[13px] font-semibold no-underline transition-colors hover:border-[#B05C3B]"
                  style={{ color: INK }}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: GUIDE.accent.bg }}>
                    <svg className="h-3.5 w-3.5" style={{ color: GUIDE.accent.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                  </span>
                  {ANATOMY.fieldGuideNote}
                </a>
              </motion.div>
            </Reveal>
            <div className="mt-8">
              <Stage seconds={3} className="mb-8">
                {(t) => <SkillFolder t={t} width={620} />}
              </Stage>
            </div>

            {/* The standard, as two reference cards. */}
            <Reveal className="mt-10">
              <Kicker>The standard</Kicker>
              <Lede>{STANDARD.body[0]}</Lede>
            </Reveal>
            <Reveal className="mt-5 grid gap-4 md:grid-cols-2">
              <motion.div variants={pop} className="rounded-2xl border border-[#ded8ce]/70 bg-white p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: GUIDE.accent.color }}>
                  The header: two required fields
                </p>
                <dl className="mt-3 space-y-3">
                  {STANDARD.required.map((f) => (
                    <div key={f.field}>
                      <dt className="text-[13px] font-bold" style={{ color: INK, fontFamily: MONO }}>{f.field}</dt>
                      <dd className="text-[14px] leading-snug" style={{ color: INK }}>{f.rule}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: MUTED }}>Optional</p>
                <dl className="mt-2 space-y-1.5">
                  {STANDARD.optional.map((f) => (
                    <div key={f.field} className="flex gap-3 text-[13px]">
                      <dt className="w-[124px] flex-shrink-0 font-semibold" style={{ color: INK, fontFamily: MONO }}>{f.field}</dt>
                      <dd className="leading-snug" style={{ color: MUTED }}>{f.rule}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
              <motion.div variants={pop} className="flex flex-col rounded-2xl border border-[#ded8ce]/70 bg-white p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: '#35656E' }}>{STANDARD.portableTitle}</p>
                <dl className="mt-3 space-y-3">
                  {STANDARD.portable.map((f) => (
                    <div key={f.path}>
                      <dt className="text-[13px] font-bold" style={{ color: INK, fontFamily: MONO }}>{f.path}</dt>
                      <dd className="text-[14px] leading-snug" style={{ color: INK }}>{f.note}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-auto pt-4 text-[13px] leading-relaxed" style={{ color: MUTED }}>{STANDARD.note}</p>
                <a href={STANDARD.href} target="_blank" rel="noreferrer" className="mt-3 text-[13px] font-semibold hover:underline" style={{ color: '#35656E' }}>
                  Read the specification at agentskills.io
                </a>
              </motion.div>
            </Reveal>
          </section>

          {/* 2. Why skills */}
          <section id="why" className="scroll-mt-24">
            <Reveal>
              <H2>{WHY.title}</H2>
              <Lede>{WHY.body[0]}</Lede>
            </Reveal>
            <div className="mt-8">
              <Stage seconds={2.6} className="mb-8">
                {(t) => <WhyCards t={t} width={720} />}
              </Stage>
            </div>
          </section>

          {/* 3. How skills work */}
          <section id="how" className="scroll-mt-24">
            <Reveal>
              <H2>How skills work</H2>
              <motion.p
                variants={pop}
                className="mt-3 max-w-[640px] text-[19px] leading-snug"
                style={{ color: INK, fontFamily: 'var(--font-body)' }}
              >
                {HOW.title}.
              </motion.p>
              <Lede>{HOW.body[0]}</Lede>
            </Reveal>
            <div className="mt-8">
              <Stage seconds={3.2} className="mb-8">
                {(t) => <DisclosureStages t={t} width={640} />}
              </Stage>
            </div>
          </section>

          {/* 4. How to write a great skill */}
          <section id="write" className="scroll-mt-24">
            <Reveal>
              <H2>How to write a great skill</H2>
              <motion.p
                variants={pop}
                className="mt-3 max-w-[640px] text-[19px] leading-snug"
                style={{ color: INK, fontFamily: 'var(--font-body)' }}
              >
                {HOOK.title}.
              </motion.p>
              <Lede>{HOOK.body[0]}</Lede>
            </Reveal>

            <div className="mt-12 [&>*+*]:mt-16">
              {PRINCIPLES.map((p) => (
                <PrincipleBlock key={p.key} principle={p} />
              ))}

              {/* Worked example */}
              <div id="example" className="scroll-mt-24">
                <Reveal>
                  <Kicker>Worked example</Kicker>
                  <H3>{WORKED_EXAMPLE.title}</H3>
                  <Lede>{WORKED_EXAMPLE.intro}</Lede>
                </Reveal>
                <div className="mt-6 grid gap-8 grid-cols-[minmax(0,1fr)] lg:grid-cols-[420px_minmax(0,1fr)] lg:items-start">
                  <Stage seconds={2.4} className="mb-8">
                    {(t) => <WorkedExampleTree t={t} />}
                  </Stage>
                  <Reveal className="grid gap-3 sm:grid-cols-2">
                    {WORKED_EXAMPLE.callouts.map((c) => (
                      <motion.div key={c.title} variants={pop} className="rounded-2xl border border-[#ded8ce]/70 bg-white p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: GUIDE.accent.color }}>
                          Principle {c.principle}
                        </p>
                        <p className="mt-1 text-[15px] font-extrabold leading-snug" style={{ color: INK }}>{c.title}</p>
                        <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: INK }}>{c.body}</p>
                      </motion.div>
                    ))}
                  </Reveal>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Advanced */}
          <section id="advanced" className="scroll-mt-24">
            <Reveal>
              <H2>{ADVANCED.title}</H2>
              <Lede>{ADVANCED.lede}</Lede>
            </Reveal>
            <Reveal className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ADVANCED.items.map((item, i) => (
                <motion.div key={item.title} variants={pop} className="rounded-2xl border border-[#ded8ce]/70 bg-white p-4">
                  <span className="text-[11px] font-bold [font-variant-numeric:tabular-nums]" style={{ color: GUIDE.accent.color }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-1 text-[15px] font-extrabold leading-snug" style={{ color: INK }}>{item.title}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: MUTED }}>{item.body}</p>
                </motion.div>
              ))}
            </Reveal>
          </section>

          {/* 5. Checklist */}
          <section id="checklist" className="scroll-mt-24">
            <Reveal>
              <H2>{CHECKLIST_TITLE}</H2>
              <motion.div variants={pop} className="mt-3 flex items-center gap-4 text-[13px]" style={{ color: MUTED }}>
                <span>{doneCount} of {CHECKLIST.length} ticked</span>
                {doneCount > 0 && (
                  <button type="button" onClick={reset} className="font-semibold hover:underline" style={{ color: GUIDE.accent.color }}>
                    Reset
                  </button>
                )}
              </motion.div>
            </Reveal>
            <div className="mt-5">
              <Stage seconds={2} className="mb-8">
                {(t) => <ChecklistList t={t} checked={checked} onToggle={toggle} width={720} />}
              </Stage>
            </div>
          </section>

          {/* Close */}
          <section>
            <Reveal>
              <motion.div variants={pop} className="rounded-[22px] bg-[#35656e] p-8 flex flex-wrap items-center gap-x-8 gap-y-4 justify-between">
                <div className="max-w-[560px]">
                  <h2 className="text-2xl font-extrabold tracking-tight text-white">{CLOSE.title}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#DDF1DA]">{CLOSE.body}</p>
                  <p className="mt-2 text-[13px] text-[#DDF1DA]/80">{CLOSE.help}</p>
                </div>
                <a
                  href={CLOSE.cta.to}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#35656E] no-underline transition-colors hover:bg-[#DDF1DA]"
                >
                  {CLOSE.cta.label}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </motion.div>
            </Reveal>
          </section>

          {/* Sources */}
          <details className="group">
            <summary className="cursor-pointer list-none text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: MUTED }}>
              Sources
            </summary>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {SOURCES.map((s) => (
                <li key={s.href} className="text-[13px]">
                  <a href={s.href} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: '#35656E' }}>
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
  );
}
