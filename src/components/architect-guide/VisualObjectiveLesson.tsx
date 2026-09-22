import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Inline, NoteSection } from './lesson-types';
import { OBJECTIVE_EXPERIENCES, type ExperienceLayout, type ObjectiveExperience } from './objectiveExperiences';
function cleanText(value: string) {
  return value.replaceAll('\u2014', ',');
}

function shortTitle(title: string) {
  return cleanText(title.replace(/^Concept:\s*/, ''));
}

function inlineText(nodes: Inline[]) {
  return cleanText(nodes.map((node) => node.v).join('')).replace(/\s*\[\d+\]/g, '').trim();
}

function conceptExcerpt(section: NoteSection, fallback: string) {
  const table = section.blocks.find((block) => block.t === 'table');
  const paragraph = section.blocks.find((block) => block.t === 'p');
  const list = section.blocks.find((block) => block.t === 'list');
  const tableText = table?.t === 'table'
    ? table.rows.slice(0, 6).map((row) => {
      const name = row[0] ? inlineText(row[0]) : '';
      const meaning = row[1] ? inlineText(row[1]) : '';
      return meaning ? `${name}: ${meaning}` : name;
    }).filter(Boolean).join('; ')
    : '';
  const text = tableText || (paragraph?.t === 'p'
    ? inlineText(paragraph.v)
    : list?.t === 'list' && list.items[0] ? inlineText(list.items[0].v) : cleanText(fallback));
  if (text.length <= 300) return text;
  const clipped = text.slice(0, 300);
  return `${clipped.slice(0, Math.max(clipped.lastIndexOf('.'), clipped.lastIndexOf(' ')))}…`;
}

type CanvasProps = {
  layout: ExperienceLayout;
  concepts: NoteSection[];
  active: number;
  setActive: (index: number) => void;
  mode: number;
  color: string;
  bg: string;
};

function ConceptNode({ section, index, active, onClick, color, bg, className = '' }: { section: NoteSection; index: number; active: boolean; onClick: () => void; color: string; bg: string; className?: string }) {
  return <motion.button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    layout
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    className={`relative rounded-xl border px-3 py-2.5 text-left ${className}`}
    style={{ borderColor: active ? color : '#DED8CE', backgroundColor: active ? bg : '#fff' }}
  >
    <span className="block text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: active ? color : '#9A9389' }}>Concept {index + 1}</span>
    <span className="mt-1 block text-[12px] font-extrabold leading-snug text-[#394646]">{shortTitle(section.title)}</span>
    {active && <motion.span layoutId="visual-concept-active" className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />}
  </motion.button>;
}

function LinearCanvas({ concepts, active, setActive, mode, color, bg, loop = false }: Omit<CanvasProps, 'layout'> & { loop?: boolean }) {
  return <div className="relative min-w-[650px] py-7">
    <div className="absolute left-[6%] right-[6%] top-[68px] h-0.5 bg-[#DED8CE]" />
    <motion.span className="absolute top-[62px] z-10 h-3 w-3 rounded-full" style={{ backgroundColor: color }} animate={{ left: loop ? ['90%', '6%'] : ['6%', '90%'] }} transition={{ duration: 4 - mode * 0.45, repeat: Infinity, ease: 'linear' }} />
    <div className="relative z-20 grid gap-2" style={{ gridTemplateColumns: `repeat(${concepts.length}, minmax(105px, 1fr))` }}>
      {concepts.map((section, index) => <ConceptNode key={section.title} section={section} index={index} active={active === index} onClick={() => setActive(index)} color={color} bg={bg} />)}
    </div>
    {loop && <div className="mx-[8%] mt-5 h-7 rounded-b-full border-b-2 border-l-2 border-r-2" style={{ borderColor: `${color}66` }} />}
  </div>;
}

function PipelineCanvas(props: Omit<CanvasProps, 'layout'>) {
  return <div className="relative min-w-[680px] py-5">
    <div className="grid items-center gap-3" style={{ gridTemplateColumns: `repeat(${props.concepts.length}, minmax(96px, 1fr))` }}>
      {props.concepts.map((section, index) => <div key={section.title} className="relative">
        <motion.div animate={{ scale: props.active === index ? 1.04 : 1 }} style={{ marginInline: `${Math.min(index * 3, 15)}px` }}>
          <ConceptNode section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg={props.bg} className="w-full" />
        </motion.div>
        {index < props.concepts.length - 1 && <span className="absolute -right-3 top-1/2 z-20 -translate-y-1/2 font-bold" style={{ color: props.color }}>›</span>}
      </div>)}
    </div>
    <div className="relative mx-[5%] mt-6 h-3 overflow-hidden rounded-full bg-[#E6E1D8]">
      <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ backgroundColor: props.color }} animate={{ width: [`${20 + props.mode * 12}%`, `${75 + props.mode * 10}%`] }} transition={{ duration: 2.2, repeat: Infinity, repeatType: 'reverse' }} />
    </div>
    <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.1em] text-[#9A9389]">Each stage narrows, validates, or enriches what reaches the next</p>
  </div>;
}

function TimelineCanvas(props: Omit<CanvasProps, 'layout'>) {
  return <div className="relative min-w-[650px] py-4">
    <div className="absolute bottom-7 left-[26px] top-7 w-0.5 bg-[#DED8CE]" />
    <div className="space-y-3">{props.concepts.map((section, index) => <motion.div key={section.title} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.07 }} className="relative grid grid-cols-[52px_1fr_auto] items-center gap-3">
      <motion.span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white text-[10px] font-extrabold" style={{ borderColor: props.active === index ? props.color : '#DED8CE', color: props.color }} animate={props.active === index ? { scale: [1, 1.12, 1] } : undefined} transition={{ repeat: Infinity, duration: 1.8 }}>{index + 1}</motion.span>
      <ConceptNode section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg={props.bg} className="w-full" />
      <span className="rounded-full px-2 py-1 text-[10px] font-bold" style={{ color: index <= props.mode + 1 ? props.color : '#9A9389', backgroundColor: index <= props.mode + 1 ? props.bg : '#FAF9F4' }}>{index <= props.mode + 1 ? 'owned' : 'next'}</span>
    </motion.div>)}</div>
  </div>;
}

function TraceCanvas(props: Omit<CanvasProps, 'layout'>) {
  return <div className="min-w-[650px] rounded-2xl border border-[#DED8CE] bg-[#172331] p-4 text-white">
    <div className="mb-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.1em] text-white/45"><span>End-to-end trace</span><span>first changed signal wins</span></div>
    <div className="space-y-2">{props.concepts.map((section, index) => { const width = 48 + ((index * 13 + props.mode * 11) % 45); return <button key={section.title} type="button" onClick={() => props.setActive(index)} className="grid w-full grid-cols-[120px_1fr_40px] items-center gap-3 text-left">
      <span className="truncate text-[11px] font-bold" style={{ color: props.active === index ? '#fff' : '#9FB4C0' }}>{shortTitle(section.title)}</span>
      <span className="h-7 overflow-hidden rounded bg-white/5"><motion.span initial={{ width: 0 }} animate={{ width: `${width}%` }} className="block h-full rounded" style={{ backgroundColor: props.active === index ? props.color : `${props.color}77` }} /></span>
      <span className="text-right font-mono text-[10px] text-white/45">{width}ms</span>
    </button>; })}</div>
  </div>;
}

function TransformCanvas(props: Omit<CanvasProps, 'layout'>) {
  const groups = [props.concepts.slice(0, 2), props.concepts.slice(2, -2), props.concepts.slice(-2)];
  const activeGroup = groups.findIndex((group) => group.includes(props.concepts[props.active]));
  const solutionLabels = ['Retrieval layer + citations', 'System-of-record tool', 'Authorized tool + approval gate'];
  return <div className="grid min-w-[650px] items-center gap-5 py-4 md:grid-cols-[1fr_auto_1.2fr_auto_1fr]">
    {groups.map((group, groupIndex) => <div key={groupIndex} className="contents">
      <motion.div
        animate={{ scale: activeGroup === groupIndex ? 1.035 : 1, opacity: activeGroup === groupIndex ? 1 : 0.68 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="space-y-2 rounded-2xl border-2 p-3"
        style={{ borderColor: activeGroup === groupIndex ? props.color : '#DED8CE', backgroundColor: activeGroup === groupIndex ? props.bg : '#FAF9F4' }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: props.color }}>{['Frame', 'Allocate', 'Prove'][groupIndex]}</p>
        {group.map((section) => { const index = props.concepts.indexOf(section); return <ConceptNode key={section.title} section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg={props.bg} />; })}
      </motion.div>
      {groupIndex < 2 && <motion.span animate={{ x: [0, 8, 0], opacity: groupIndex < activeGroup ? 1 : 0.3 }} transition={{ repeat: Infinity, duration: 1.2 }} className="text-xl font-bold" style={{ color: props.color }}>→</motion.span>}
    </div>)}
    <motion.div key={props.mode} initial={{ opacity: 0, scaleX: 0.8 }} animate={{ opacity: 1, scaleX: 1 }} className="rounded-xl border-2 px-4 py-3 text-center md:col-span-5" style={{ borderColor: props.color, backgroundColor: props.bg }}>
      <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: props.color }}>Architecture result</span>
      <span className="ml-3 text-[13px] font-extrabold text-[#394646]">{solutionLabels[props.mode]}</span>
    </motion.div>
  </div>;
}

function SwitcherCanvas(props: Omit<CanvasProps, 'layout'>) {
  return <div className="grid min-h-[250px] gap-4 md:grid-cols-[0.75fr_1.5fr]">
    <motion.div layout className="flex flex-col justify-center rounded-2xl border-2 p-5 text-center" style={{ borderColor: props.color, backgroundColor: props.bg }}>
      <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: props.color }}>Control moves here</p>
      <motion.p key={props.mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-xl font-extrabold text-[#394646]">{['Model call', 'Application code', 'Agent loop'][props.mode]}</motion.p>
    </motion.div>
    <div className="grid gap-2 sm:grid-cols-2">{props.concepts.map((section, index) => <ConceptNode key={section.title} section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg={props.bg} />)}</div>
  </div>;
}

const WORKFLOW_PATTERNS = [
  ['Prompt chaining', 'Fixed steps that depend on the prior result'],
  ['Routing', 'Known categories need different handling'],
  ['Parallelization', 'Independent work or multiple votes'],
  ['Orchestrator-workers', 'Subtasks are discovered from the input'],
  ['Evaluator-optimizer', 'Clear feedback measurably improves the result'],
] as const;

function PatternsCanvas(props: Omit<CanvasProps, 'layout'>) {
  return <div className="grid min-w-[760px] gap-3 py-2 lg:grid-cols-[0.75fr_1.5fr_0.75fr]">
    <motion.div animate={{ opacity: props.mode === 0 ? 1 : 0.45, scale: props.mode === 0 ? 1.02 : 1 }} className="flex min-h-48 flex-col justify-center rounded-2xl border-2 p-5 text-center" style={{ borderColor: props.mode === 0 ? props.color : '#DED8CE', backgroundColor: props.mode === 0 ? props.bg : '#FAF9F4' }}>
      <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: props.color }}>Augmented call</p>
      <p className="mt-3 text-[15px] font-extrabold text-[#394646]">One bounded result</p>
      <p className="mt-2 text-[11px] leading-relaxed text-[#637979]">Prompt + context + tools, with no control loop.</p>
    </motion.div>

    <motion.div animate={{ opacity: props.mode === 1 ? 1 : 0.55, scale: props.mode === 1 ? 1.02 : 1 }} className="rounded-2xl border-2 p-4" style={{ borderColor: props.mode === 1 ? props.color : '#DED8CE', backgroundColor: props.mode === 1 ? props.bg : '#FAF9F4' }}>
      <div className="flex items-baseline justify-between gap-3"><p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: props.color }}>Workflow</p><p className="text-[10px] font-bold text-[#9A9389]">Code owns the path</p></div>
      <div className="mt-3 space-y-1.5">{WORKFLOW_PATTERNS.map(([name, fit], index) => <motion.button key={name} type="button" onClick={() => props.setActive(2)} initial={false} animate={{ x: props.mode === 1 ? 0 : -3 }} transition={{ delay: index * 0.04 }} className="grid w-full grid-cols-[132px_1fr] gap-3 rounded-lg border border-[#DED8CE] bg-white px-3 py-2 text-left"><span className="text-[11px] font-extrabold" style={{ color: props.color }}>{name}</span><span className="text-[11px] leading-snug text-[#637979]">{fit}</span></motion.button>)}</div>
    </motion.div>

    <motion.div animate={{ opacity: props.mode === 2 ? 1 : 0.45, scale: props.mode === 2 ? 1.02 : 1 }} className="flex min-h-48 flex-col justify-center rounded-2xl border-2 p-5 text-center" style={{ borderColor: props.mode === 2 ? props.color : '#DED8CE', backgroundColor: props.mode === 2 ? props.bg : '#FAF9F4' }}>
      <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: props.color }}>Agent</p>
      <p className="mt-3 text-[15px] font-extrabold text-[#394646]">Unknown next step</p>
      <p className="mt-2 text-[11px] leading-relaxed text-[#637979]">The model chooses actions, observes results, and continues until done or stopped.</p>
    </motion.div>
  </div>;
}

function NetworkCanvas(props: Omit<CanvasProps, 'layout'>) {
  const center = Math.floor(props.concepts.length / 2);
  return <div className="relative mx-auto grid min-h-[280px] min-w-[640px] max-w-4xl grid-cols-[1fr_0.7fr_1fr] items-center gap-6">
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 700 280" preserveAspectRatio="none" aria-hidden>{props.concepts.map((_, index) => <motion.path key={index} d={`M 350 140 C ${index % 2 ? 500 : 200} ${25 + index * 28}, ${index % 2 ? 560 : 140} ${245 - index * 18}, ${index % 2 ? 700 : 0} ${45 + index * 25}`} fill="none" stroke={props.color} strokeOpacity=".25" strokeWidth="2" strokeDasharray="6 7" animate={{ strokeDashoffset: [0, -26] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }} />)}</svg>
    <div className="relative z-10 space-y-2">{props.concepts.filter((_, index) => index !== center && index % 2 === 0).map((section) => { const index = props.concepts.indexOf(section); return <ConceptNode key={section.title} section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg={props.bg} />; })}</div>
    <motion.button type="button" onClick={() => props.setActive(center)} className="relative z-20 aspect-square rounded-full border-2 bg-white p-3 text-center shadow-md" style={{ borderColor: props.color }} animate={{ boxShadow: [`0 0 0 0 ${props.color}33`, `0 0 0 14px ${props.color}00`] }} transition={{ duration: 2, repeat: Infinity }}><span className="text-[11px] font-extrabold" style={{ color: props.color }}>{shortTitle(props.concepts[center].title)}</span></motion.button>
    <div className="relative z-10 space-y-2">{props.concepts.filter((_, index) => index !== center && index % 2 === 1).map((section) => { const index = props.concepts.indexOf(section); return <ConceptNode key={section.title} section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg={props.bg} />; })}</div>
  </div>;
}

function GraphCanvas(props: Omit<CanvasProps, 'layout'>) {
  return <div className="relative mx-auto min-w-[620px] max-w-4xl py-3">
    <div className="grid grid-cols-3 gap-x-8 gap-y-3">{props.concepts.map((section, index) => <motion.div key={section.title} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className={index === 0 || index === props.concepts.length - 1 ? 'col-start-2' : ''}><ConceptNode section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg={props.bg} /></motion.div>)}</div>
    <motion.div className="pointer-events-none absolute left-1/2 top-10 h-[70%] w-px" style={{ backgroundColor: `${props.color}55` }} animate={{ scaleY: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity }} />
  </div>;
}

function LabCanvas(props: Omit<CanvasProps, 'layout'>) {
  return <div className="grid min-h-[270px] gap-4 md:grid-cols-[1fr_1.1fr]">
    <div className="rounded-2xl border border-[#DED8CE] bg-[#FAF9F4] p-3"><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: props.color }}>Experiment controls</p><div className="grid gap-2 sm:grid-cols-2">{props.concepts.map((section, index) => <ConceptNode key={section.title} section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg={props.bg} />)}</div></div>
    <motion.div key={`${props.active}-${props.mode}`} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col justify-center rounded-2xl border-2 bg-white p-6" style={{ borderColor: props.color }}><div className="flex items-end gap-2">{[48, 72, 58, 88].map((height, index) => <motion.span key={index} initial={{ height: 0 }} animate={{ height: height - props.mode * 6 + (props.active % 3) * 5 }} className="w-1/4 rounded-t-lg" style={{ backgroundColor: index === props.active % 4 ? props.color : '#DED8CE' }} />)}</div><p className="mt-4 text-[12px] font-extrabold" style={{ color: props.color }}>Observed result</p><p className="mt-1 text-[14px] font-bold text-[#394646]">{shortTitle(props.concepts[props.active].title)}</p></motion.div>
  </div>;
}

function BudgetCanvas(props: Omit<CanvasProps, 'layout'>) {
  const total = props.concepts.length;
  return <div className="py-5"><div className="flex h-20 min-w-[620px] overflow-hidden rounded-2xl border border-[#DED8CE] bg-white">{props.concepts.map((section, index) => <motion.button key={section.title} type="button" onClick={() => props.setActive(index)} animate={{ flexGrow: props.active === index ? 2.1 : 1 }} className="min-w-[70px] border-r border-white/70 px-2 text-center" style={{ backgroundColor: props.active === index ? props.color : `${props.color}${Math.round(35 + index * (110 / total)).toString(16).padStart(2, '0')}` }}><span className="text-[10px] font-bold leading-tight text-white">{shortTitle(section.title)}</span></motion.button>)}</div><div className="mt-4 flex items-center justify-between text-[11px] font-bold text-[#637979]"><span>Context or capability cost</span><motion.span key={props.mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: props.color }}>{[38, 91, 52][props.mode]}% of working budget</motion.span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E6E1D8]"><motion.div animate={{ width: `${[38, 91, 52][props.mode]}%` }} className="h-full rounded-full" style={{ backgroundColor: props.color }} /></div></div>;
}

function BoundaryCanvas(props: Omit<CanvasProps, 'layout'>) {
  return <div className="relative min-w-[650px] py-8"><div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${props.concepts.length}, minmax(100px, 1fr))` }}>{props.concepts.map((section, index) => <div key={section.title} className="relative"><ConceptNode section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg={props.bg} /><motion.span className="absolute -right-1 top-1/2 z-10 h-7 w-2 -translate-y-1/2 rounded-full" style={{ backgroundColor: index <= props.mode * 2 ? props.color : '#E6E1D8' }} animate={index === props.active ? { scaleY: [1, 1.35, 1] } : undefined} transition={{ repeat: Infinity, duration: 1.6 }} /></div>)}</div><motion.div className="mt-5 rounded-lg border px-4 py-2 text-center text-[11px] font-bold" style={{ color: props.color, borderColor: `${props.color}66`, backgroundColor: props.bg }} animate={{ x: props.mode === 0 ? [-5, 5, -5] : 0 }}>{props.mode === 0 ? 'Untrusted input reaches too much authority' : 'The boundary still holds when the model is wrong'}</motion.div></div>;
}

function FrontierCanvas(props: Omit<CanvasProps, 'layout'>) {
  const points = [[90, 175], [175, 135], [275, 105], [390, 82], [520, 62]];
  const point = points[Math.min(points.length - 1, props.mode + 1)];
  return <div className="grid min-h-[280px] gap-4 md:grid-cols-[1.4fr_1fr]"><div className="rounded-2xl border border-[#DED8CE] bg-[#FAF9F4] p-3"><svg viewBox="0 0 600 220" className="h-[220px] w-full" aria-label="Quality and latency frontier"><path d="M45 190 C150 145 250 105 545 45" fill="none" stroke={props.color} strokeWidth="4" strokeLinecap="round" /><path d="M45 20V190H565" fill="none" stroke="#9A9389" strokeWidth="1.5" />{points.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="6" fill="#fff" stroke={props.color} strokeWidth="2" />)}<motion.circle animate={{ cx: point[0], cy: point[1] }} r="11" fill={props.color} /><text x="12" y="24" fill="#637979" fontSize="12">quality</text><text x="505" y="212" fill="#637979" fontSize="12">cost / latency</text></svg></div><div className="space-y-2">{props.concepts.map((section, index) => <ConceptNode key={section.title} section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg={props.bg} />)}</div></div>;
}

function RouterCanvas(props: Omit<CanvasProps, 'layout'>) {
  return <div className="grid min-w-[640px] items-center gap-5 py-5 grid-cols-[0.8fr_0.5fr_1.6fr]"><motion.div key={props.mode} initial={{ x: -15, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="rounded-2xl border-2 p-5 text-center" style={{ borderColor: props.color, backgroundColor: props.bg }}><p className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: props.color }}>Incoming query</p><p className="mt-2 text-[15px] font-extrabold text-[#394646]">Shape {props.mode + 1}</p></motion.div><motion.span animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-center text-2xl" style={{ color: props.color }}>→</motion.span><div className="grid grid-cols-2 gap-2">{props.concepts.map((section, index) => <ConceptNode key={section.title} section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg={props.bg} />)}</div></div>;
}

function CompareCanvas(props: Omit<CanvasProps, 'layout'>) {
  return <div className="grid min-h-[270px] gap-4 md:grid-cols-2"><div className="rounded-2xl border border-[#DED8CE] bg-[#FAF9F4] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9A9389]">Option A</p>{props.concepts.filter((_, index) => index % 2 === 0).map((section) => { const index = props.concepts.indexOf(section); return <div key={section.title} className="mt-2"><ConceptNode section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg={props.bg} /></div>; })}</div><motion.div layout className="rounded-2xl border-2 p-4" style={{ borderColor: props.color, backgroundColor: props.bg }}><p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: props.color }}>Option B and the tradeoff</p>{props.concepts.filter((_, index) => index % 2 === 1).map((section) => { const index = props.concepts.indexOf(section); return <div key={section.title} className="mt-2"><ConceptNode section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg="#fff" /></div>; })}</motion.div></div>;
}

function ScorecardCanvas(props: Omit<CanvasProps, 'layout'>) {
  return <div className="grid gap-3 py-3 sm:grid-cols-2 lg:grid-cols-3">{props.concepts.map((section, index) => { const value = 38 + ((index * 17 + props.mode * 13) % 58); return <button key={section.title} type="button" onClick={() => props.setActive(index)} className="rounded-xl border p-3 text-left" style={{ borderColor: props.active === index ? props.color : '#DED8CE', backgroundColor: props.active === index ? props.bg : '#fff' }}><div className="flex items-center justify-between gap-2"><span className="text-[12px] font-extrabold text-[#394646]">{shortTitle(section.title)}</span><span className="text-[11px] font-bold" style={{ color: props.color }}>{value}%</span></div><div className="mt-3 h-2 rounded-full bg-[#E6E1D8]"><motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className="h-full rounded-full" style={{ backgroundColor: props.color }} /></div><p className="mt-2 text-[10px] font-bold text-[#9A9389]">metric + slice + threshold</p></button>; })}</div>;
}

function StackCanvas(props: Omit<CanvasProps, 'layout'>) {
  return <div className="mx-auto flex max-w-3xl flex-col-reverse gap-2 py-3">{props.concepts.map((section, index) => <motion.div key={section.title} initial={{ opacity: 0, x: index % 2 ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }} style={{ marginInline: `${Math.min(index * 3, 18)}%` }}><ConceptNode section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg={props.bg} /></motion.div>)}</div>;
}

function BowtieCanvas(props: Omit<CanvasProps, 'layout'>) {
  const middle = Math.floor(props.concepts.length / 2);
  return <div className="grid min-w-[650px] items-center gap-3 py-5 grid-cols-[1fr_auto_1fr_auto_1fr]"><div className="space-y-2">{props.concepts.slice(0, middle).map((section) => { const index = props.concepts.indexOf(section); return <ConceptNode key={section.title} section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg={props.bg} />; })}</div><motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.4 }} style={{ color: props.color }}>→</motion.span><ConceptNode section={props.concepts[middle]} index={middle} active={props.active === middle} onClick={() => props.setActive(middle)} color={props.color} bg={props.bg} /><motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.4 }} style={{ color: props.color }}>→</motion.span><div className="space-y-2">{props.concepts.slice(middle + 1).map((section) => { const index = props.concepts.indexOf(section); return <ConceptNode key={section.title} section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg={props.bg} />; })}</div></div>;
}

function QueueCanvas(props: Omit<CanvasProps, 'layout'>) {
  return <div className="grid min-w-[620px] items-center gap-4 py-5 grid-cols-[1.5fr_auto_0.8fr]"><div className="grid grid-cols-2 gap-2">{props.concepts.map((section, index) => <ConceptNode key={section.title} section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg={props.bg} />)}</div><motion.span animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.4 }} className="text-xl" style={{ color: props.color }}>→</motion.span><motion.div key={props.mode} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="rounded-2xl border-2 p-5 text-center" style={{ borderColor: props.color, backgroundColor: props.bg }}><p className="text-[11px] font-bold uppercase" style={{ color: props.color }}>Oversight</p><p className="mt-2 text-[15px] font-extrabold text-[#394646]">{['Sample', 'Confirm', 'Qualified review'][props.mode]}</p></motion.div></div>;
}

function ZoomCanvas(props: Omit<CanvasProps, 'layout'>) {
  return <div className="relative mx-auto min-h-[310px] max-w-4xl py-3">{props.concepts.slice(0, 6).map((section, index) => <motion.button key={section.title} type="button" onClick={() => props.setActive(index)} animate={{ inset: `${index * 18}px`, opacity: props.active === index ? 1 : 0.62 }} className="absolute rounded-2xl border-2 p-3 text-left" style={{ borderColor: props.active === index ? props.color : '#DED8CE', backgroundColor: props.active === index ? `${props.bg}F2` : '#FFFFFFE8', zIndex: props.concepts.length - index }}><span className="text-[11px] font-extrabold" style={{ color: props.active === index ? props.color : '#637979' }}>{shortTitle(section.title)}</span></motion.button>)}</div>;
}

function DossierCanvas(props: Omit<CanvasProps, 'layout'>) {
  return <div className="relative mx-auto min-h-[300px] max-w-3xl py-4">{props.concepts.map((section, index) => <motion.button key={section.title} type="button" onClick={() => props.setActive(index)} animate={{ x: (index - (props.concepts.length - 1) / 2) * 68, rotate: (index - (props.concepts.length - 1) / 2) * 2.5, y: props.active === index ? -12 : 0 }} className="absolute left-1/2 top-8 h-52 w-44 -translate-x-1/2 rounded-xl border bg-white p-4 text-left shadow-md" style={{ borderColor: props.active === index ? props.color : '#DED8CE', zIndex: props.active === index ? 30 : index }}><span className="block h-2 w-10 rounded-full" style={{ backgroundColor: props.active === index ? props.color : '#DED8CE' }} /><span className="mt-8 block text-[12px] font-extrabold text-[#394646]">{shortTitle(section.title)}</span><span className="mt-5 block h-1 rounded bg-[#E6E1D8]" /><span className="mt-2 block h-1 w-2/3 rounded bg-[#E6E1D8]" /></motion.button>)}</div>;
}

function TerminalCanvas(props: Omit<CanvasProps, 'layout'>) {
  return <div className="overflow-hidden rounded-2xl border border-[#1C2A3A] bg-[#172331] text-white"><div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2"><span className="h-2.5 w-2.5 rounded-full bg-[#F3A39A]" /><span className="h-2.5 w-2.5 rounded-full bg-[#FEE19A]" /><span className="h-2.5 w-2.5 rounded-full bg-[#9BC695]" /><span className="ml-3 text-[10px] font-bold text-white/45">request trace</span></div><div className="grid min-h-[270px] gap-4 p-4 md:grid-cols-[1fr_1.2fr]"><div className="space-y-1">{props.concepts.map((section, index) => <motion.button key={section.title} type="button" onClick={() => props.setActive(index)} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="block w-full rounded px-2 py-1.5 text-left text-[11px]" style={{ color: props.active === index ? '#fff' : '#9FB4C0', backgroundColor: props.active === index ? `${props.color}66` : 'transparent' }}><span className="mr-2 text-white/35">{String(index + 1).padStart(2, '0')}</span>{shortTitle(section.title)}</motion.button>)}</div><motion.div key={`${props.active}-${props.mode}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-white/10 bg-black/20 p-4 font-mono text-[12px] leading-relaxed"><p className="text-[#8FD5C8]">$ inspect --layer {props.active + 1}</p><p className="mt-3 text-white/55">request_id=trace_{props.mode + 1}0{props.active + 1}</p><p className="mt-1 text-white">first_signal={shortTitle(props.concepts[props.active].title).toLowerCase()}</p><motion.p animate={{ opacity: [0.45, 1, 0.45] }} transition={{ repeat: Infinity, duration: 1.4 }} className="mt-4 text-[#FEE19A]">evidence located at this boundary</motion.p></motion.div></div></div>;
}

function MapCanvas(props: Omit<CanvasProps, 'layout'>) {
  return <div className="relative grid min-w-[650px] grid-cols-3 gap-4 py-4">{props.concepts.map((section, index) => <motion.div key={section.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.06 }}><ConceptNode section={section} index={index} active={props.active === index} onClick={() => props.setActive(index)} color={props.color} bg={props.bg} /></motion.div>)}<motion.div className="pointer-events-none absolute inset-x-[8%] top-1/2 h-0.5" style={{ backgroundColor: `${props.color}44` }} animate={{ scaleX: [0.25, 1, 0.25] }} transition={{ duration: 4, repeat: Infinity }} /></div>;
}

function Canvas(props: CanvasProps) {
  switch (props.layout) {
    case 'transform': return <TransformCanvas {...props} />;
    case 'loop': return <LinearCanvas {...props} loop />;
    case 'switcher': return <SwitcherCanvas {...props} />;
    case 'patterns': return <PatternsCanvas {...props} />;
    case 'network': return <NetworkCanvas {...props} />;
    case 'graph': return <GraphCanvas {...props} />;
    case 'lab': return <LabCanvas {...props} />;
    case 'budget': return <BudgetCanvas {...props} />;
    case 'boundary': return <BoundaryCanvas {...props} />;
    case 'frontier': return <FrontierCanvas {...props} />;
    case 'zoom': return <ZoomCanvas {...props} />;
    case 'router': return <RouterCanvas {...props} />;
    case 'compare': return <CompareCanvas {...props} />;
    case 'scorecard': return <ScorecardCanvas {...props} />;
    case 'stack': return <StackCanvas {...props} />;
    case 'bowtie': return <BowtieCanvas {...props} />;
    case 'queue': return <QueueCanvas {...props} />;
    case 'map': return <MapCanvas {...props} />;
    case 'dossier': return <DossierCanvas {...props} />;
    case 'terminal': return <TerminalCanvas {...props} />;
    case 'timeline': return <TimelineCanvas {...props} />;
    case 'trace': return <TraceCanvas {...props} />;
    case 'pipeline': return <PipelineCanvas {...props} />;
    default: return <LinearCanvas {...props} />;
  }
}

export default function VisualObjectiveLesson({ objectiveId, color, bg }: { objectiveId: string; color: string; bg: string }) {
  const config: ObjectiveExperience = OBJECTIVE_EXPERIENCES[objectiveId];
  const [active, setActive] = useState(config.focus?.[0] ?? 0);
  const [mode, setMode] = useState(0);
  const concepts: NoteSection[] = (config.items ?? []).slice(0, 6).map(([title, explanation]) => ({
    title,
    kind: 'concept',
    blocks: [{ t: 'p', v: [{ t: 'text', v: explanation }] }],
  }));
  const focusForMode = (nextMode: number) => config.focus?.[nextMode]
    ?? Math.round((concepts.length - 1) * (nextMode / 2));

  if (!concepts.length) return null;
  const activeSection = concepts[Math.min(active, concepts.length - 1)];

  return <div className="mt-5 space-y-4">
    <section className="overflow-hidden rounded-2xl border border-[#DED8CE] bg-white shadow-sm">
      <div className="border-b border-[#DED8CE] bg-[#FAF9F4] px-4 py-4 sm:px-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color }}>{config.title}</p>
        <p className="mt-1 text-[14px] leading-relaxed text-[#637979]">{config.instruction}</p>
        <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Change the scenario">
          {config.modes.map((label, index) => <button key={label} type="button" role="tab" aria-selected={mode === index} onClick={() => { setMode(index); setActive(focusForMode(index)); }} className="relative overflow-hidden rounded-full border px-3 py-1.5 text-[12px] font-bold" style={{ color: mode === index ? '#fff' : color, borderColor: `${color}66` }}>{mode === index && <motion.span layoutId={`experience-mode-${objectiveId}`} className="absolute inset-0" style={{ backgroundColor: color }} />}<span className="relative">{label}</span></button>)}
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-hidden p-4 sm:p-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`${objectiveId}-${mode}`} initial={{ opacity: 0, y: 10, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.99 }} transition={{ duration: 0.24 }}>
            <Canvas layout={config.layout} concepts={concepts} active={active} setActive={setActive} mode={mode} color={color} bg={bg} />
          </motion.div>
        </AnimatePresence>
      </div>
      <motion.div key={mode} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="border-t px-4 py-3 text-[14px] font-bold leading-relaxed sm:px-5" style={{ color, borderColor: `${color}35`, backgroundColor: bg }}>{config.outcomes[mode]}</motion.div>
    </section>

    <AnimatePresence mode="wait">
      <motion.div key={activeSection.title} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="rounded-xl border border-[#DED8CE] bg-[#FAF9F4] p-4">
        <p className="text-[14px] leading-relaxed text-[#394646]"><strong>{shortTitle(activeSection.title)}.</strong> {conceptExcerpt(activeSection, config.instruction)}</p>
      </motion.div>
    </AnimatePresence>
  </div>;
}
