import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { DOMAINS } from '../../data/exam/domains';
import { ICONS } from './concepts';
import DomainCheckpoint from './DomainCheckpoint';
import VisualObjectiveLesson from './VisualObjectiveLesson';

type DomainId = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Page = 'start' | `domain-${DomainId}` | string;

type DomainMeta = {
  id: DomainId;
  title: string;
  short: string;
  weight: number;
  color: string;
  bg: string;
  icon: string;
  question: string;
  intro: string;
};

const META: DomainMeta[] = [
  { id: 1, title: 'Solution Design & Architecture', short: 'Shape the solution', weight: 17, color: '#2D4059', bg: '#DCE3EC', icon: ICONS.squares, question: 'What should we build?', intro: 'Start with the business problem, make success measurable, then choose the simplest architecture that can meet it.' },
  { id: 2, title: 'Claude Models, Prompting & Context Engineering', short: 'Shape the model call', weight: 13, color: '#35656E', bg: '#DCECEE', icon: ICONS.sliders, question: 'What should Claude see, and which model should handle it?', intro: 'Model, prompt, context, and caching are one system. Tune them together around the workload rather than chasing a model leaderboard.' },
  { id: 3, title: 'Integration', short: 'Reach the world safely', weight: 19, color: '#A9512F', bg: '#F7DED5', icon: ICONS.link, question: 'How does Claude reach data and take action?', intro: 'Every connection adds capability and risk. Give Claude the smallest useful surface, retrieve the right context, and observe every boundary.' },
  { id: 4, title: 'Evaluation, Testing & Optimization', short: 'Prove it works', weight: 16, color: '#4C6942', bg: '#DFE8DA', icon: ICONS.chart, question: 'What evidence says the system is good enough?', intro: 'Define the bar before testing, use the right grader for each output, and optimize only after you can locate the layer that failed.' },
  { id: 5, title: 'Governance, Safety & Risk Management', short: 'Contain the risk', weight: 14, color: '#715581', bg: '#E9E1EE', icon: ICONS.scale, question: 'Where must the system stop, ask, or hand over?', intro: 'Safety is a stack of controls, not a sentence in a prompt. Match each failure mode to a boundary that still holds when the model gets it wrong.' },
  { id: 6, title: 'Stakeholder Communication & Lifecycle Management', short: 'Carry it into production', weight: 14, color: '#806B19', bg: '#F4E9C9', icon: ICONS.users, question: 'How does an idea become an owned production system?', intro: 'Discovery, trade-offs, handoff, service levels, and feedback are one continuous loop. The architecture is not finished when the diagram is.' },
  { id: 7, title: 'Developer Productivity & Operational Enablement', short: 'Make the team effective', weight: 7, color: '#416D79', bg: '#DDE8EC', icon: ICONS.wrench, question: 'How do teams use Claude quickly without giving up control?', intro: 'Put guidance, permissions, automation, and isolation in the layer that can actually enforce them, then turn failures into repeatable fixes.' },
];

const metaById = (id: DomainId) => META.find((item) => item.id === id)!;

function Icon({ path, className = 'h-5 w-5' }: { path: string; className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d={path} /></svg>;
}

function Arrow({ label }: { label?: string }) {
  return <div className="flex flex-shrink-0 flex-col items-center justify-center px-1 text-[#9A9389]"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-4-4 4 4-4 4" /></svg>{label && <span className="mt-0.5 text-[9px] font-bold">{label}</span>}</div>;
}

function Frame({ title, children, color = '#637979' }: { title: string; children: ReactNode; color?: string }) {
  return <section className="overflow-hidden rounded-xl border border-[#DED8CE] bg-white"><div className="border-b border-[#DED8CE] bg-[#FAF9F4] px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color }}>{title}</p></div><div className="p-4 sm:p-5">{children}</div></section>;
}

function Box({ title, text, color, bg = '#FAF9F4', className = '' }: { title: string; text?: string; color?: string; bg?: string; className?: string }) {
  return <div className={`min-w-0 rounded-lg border border-[#DED8CE] px-3 py-2.5 ${className}`} style={{ backgroundColor: bg }}><p className="text-[12px] font-extrabold leading-snug" style={{ color: color ?? '#394646' }}>{title}</p>{text && <p className="mt-1 text-[11px] leading-snug text-[#637979]">{text}</p>}</div>;
}

function Rule({ children, color, bg }: { children: ReactNode; color: string; bg: string }) {
  return <div className="rounded-xl border px-4 py-3 text-[13px] font-bold leading-relaxed" style={{ color, backgroundColor: bg, borderColor: `${color}40` }}>{children}</div>;
}

function ObjectiveRibbon({ id, go }: { id: DomainId; go: (page: Page) => void }) {
  const domain = DOMAINS.find((item) => item.id === id)!;
  const meta = metaById(id);
  return <div className="rounded-xl border border-[#DED8CE] bg-[#FAF9F4] p-4"><div className="flex flex-wrap items-baseline justify-between gap-2"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#637979]">Visual pages in this domain</p><p className="text-[10px] font-bold text-[#9A9389]">{domain.objectives.length} objectives</p></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{domain.objectives.map((objective) => <button type="button" onClick={() => go(objective.id)} key={objective.id} className="group flex gap-2 rounded-lg bg-white px-3 py-2 text-left text-[12px] leading-snug text-[#394646] hover:ring-2 hover:ring-[#DED8CE]"><span className="flex-shrink-0 font-extrabold" style={{ color: meta.color }}>{objective.id}</span><span className="group-hover:underline">{objective.title}</span><span className="ml-auto" aria-hidden>→</span></button>)}</div></div>;
}

function DomainOne() {
  const m = metaById(1);
  return <div className="space-y-3"><Frame title="From request to architecture" color={m.color}><div className="flex flex-wrap items-stretch justify-center gap-y-3"><Box title="Business problem" text="Who, what, why now?" /><Arrow /><Box title="Success bar" text="Quality · latency · cost · risk" bg={m.bg} color={m.color} /><Arrow /><Box title="System boundary" text="Claude · code · data · people" /><Arrow /><Box title="Feedback loop" text="Measure, learn, adjust" /></div><div className="mt-5 grid gap-2 sm:grid-cols-3"><Box title="Single call" text="One bounded transformation" /><Box title="Workflow" text="Steps known in advance" bg={m.bg} color={m.color} /><Box title="Agent" text="Path discovered at runtime" /></div></Frame><div className="grid gap-3 md:grid-cols-2"><Frame title="Decompose by dependency" color={m.color}><div className="grid grid-cols-2 gap-2"><Box title="Shares context" text="Keep together" /><Box title="Independent work" text="Split or parallelize" bg={m.bg} color={m.color} /><Box title="Known subtasks" text="Parallel workflow" /><Box title="Unknown subtasks" text="Orchestrator-workers" /></div></Frame><Frame title="Value keeps the design honest" color={m.color}><div className="space-y-2">{['Efficiency: less time or effort', 'Productivity: more useful work', 'Transformation: a new capability', 'Performance: a measurable SLA'].map((item) => <div key={item} className="flex items-center gap-2 text-[13px] text-[#394646]"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />{item}</div>)}</div></Frame></div><Rule color={m.color} bg={m.bg}>Architecture starts after the success bar is written down, not after someone asks for “an agent.”</Rule></div>;
}

function DomainTwo() {
  const m = metaById(2);
  return <div className="space-y-3"><Frame title="The model call is a stack" color={m.color}><div className="mx-auto max-w-2xl space-y-2"><Box title="Dynamic request" text="The user’s current task" /><Box title="Retrieved context and examples" text="Only what this request needs" bg="#EEF5F4" color={m.color} /><Box title="Stable prompt contract" text="Role · instructions · format · guardrails" bg={m.bg} color={m.color} /><Box title="Tools and model" text="Chosen for this workload and its constraints" /></div></Frame><div className="grid gap-3 md:grid-cols-2"><Frame title="Choose a model with four measurements" color={m.color}><div className="grid grid-cols-2 gap-2">{['Task quality', 'End-to-end latency', 'Cost per success', 'Platform constraints'].map((label) => <Box key={label} title={label} bg={label === 'Task quality' ? m.bg : '#FAF9F4'} color={label === 'Task quality' ? m.color : undefined} />)}</div></Frame><Frame title="Make repeated context cheap" color={m.color}><div className="flex items-center justify-center"><Box title="Stable prefix" text="tools → system → reusable content" bg={m.bg} color={m.color} /><Arrow label="cache" /><Box title="Variable tail" text="the current user turn" /></div></Frame></div><Rule color={m.color} bg={m.bg}>Change the narrowest layer first. A model swap changes behavior everywhere; a clearer prompt or smaller context often fixes the actual problem.</Rule></div>;
}

function DomainThree() {
  const m = metaById(3);
  return <div className="space-y-3"><Frame title="Every connection crosses a boundary" color={m.color}><div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]"><div className="grid gap-2"><Box title="Knowledge" text="RAG · search · resources" /><Box title="Capabilities" text="tools · APIs · MCP" /><Box title="Specialists" text="subagents · A2A" /></div><div className="flex flex-col items-center gap-2"><span className="rounded-full px-4 py-3 text-[13px] font-extrabold" style={{ backgroundColor: m.bg, color: m.color }}>Claude</span><span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9A9389]">auth + logs</span></div><div className="grid gap-2"><Box title="Read" text="bounded, relevant context" bg="#DDF1DA" color="#51714B" /><Box title="Act" text="least privilege" bg="#FFF4CE" color="#806B19" /><Box title="Observe" text="inputs · calls · outputs" bg="#EEF5F4" color="#35656E" /></div></div></Frame><div className="grid gap-3 md:grid-cols-2"><Frame title="Match retrieval to the question" color={m.color}><div className="space-y-2"><Box title="Exact term or identifier" text="Lexical search" /><Box title="Same meaning, different words" text="Vector search" bg={m.bg} color={m.color} /><Box title="Mixed corpus" text="Hybrid + reranking" /></div></Frame><Frame title="Reduce capability before guarding it" color={m.color}><div className="space-y-2">{['Remove tools the role never needs', 'Consolidate overlapping actions', 'Defer the long tail', 'Return only useful fields'].map((label, index) => <div key={label} className="flex items-center gap-3 rounded-lg px-3 py-2 text-[12px] font-bold" style={{ backgroundColor: index === 0 ? '#FEE2E2' : '#FAF9F4', color: index === 0 ? '#B91C1C' : '#394646' }}><span>{index + 1}</span><span>{label}</span></div>)}</div></Frame></div><Rule color={m.color} bg={m.bg}>A connection is not finished when it works. It is finished when identity, permission, failure, and observability are explicit.</Rule></div>;
}

function DomainFour() {
  const m = metaById(4);
  return <div className="space-y-3"><Frame title="The evaluation loop" color={m.color}><div className="flex flex-wrap items-center justify-center gap-y-3"><Box title="Success criteria" text="metric + threshold" bg={m.bg} color={m.color} /><Arrow /><Box title="Test set" text="normal · edge · adversarial" /><Arrow /><Box title="Grade" text="code · human · model" /><Arrow /><Box title="Compare" text="baseline · A/B · regression" /><Arrow /><Box title="Monitor" text="production feedback" /></div><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">{['Accuracy', 'Latency', 'Cost', 'Safety', 'Security'].map((label) => <Box key={label} title={label} />)}</div></Frame><div className="grid gap-3 md:grid-cols-2"><Frame title="Use the cheapest trustworthy grader" color={m.color}><div className="space-y-2"><Box title="One checkable answer" text="Grade with code" /><Box title="Taste or expert judgment" text="Grade with people" /><Box title="Judgment at scale" text="Calibrated model rubric" bg={m.bg} color={m.color} /></div></Frame><Frame title="Diagnose the layer that changed" color={m.color}><div className="grid grid-cols-2 gap-2">{['Prompt', 'Retrieval', 'Tool', 'Model', 'Orchestration', 'Data'].map((label) => <Box key={label} title={label} />)}</div></Frame></div><Rule color={m.color} bg={m.bg}>If the bar was not written before the experiment, the result cannot tell you whether the change helped.</Rule></div>;
}

function DomainFive() {
  const m = metaById(5);
  return <div className="space-y-3"><Frame title="Defense in depth" color={m.color}><div className="flex flex-wrap items-center justify-center gap-y-3"><Box title="Untrusted input" text="user or retrieved content" /><Arrow /><Box title="Screen" text="classify · sanitize · bound" bg={m.bg} color={m.color} /><Arrow /><Box title="Constrained Claude" text="least privilege" /><Arrow /><Box title="Validate" text="schema · policy · evidence" /><Arrow /><Box title="Human gate" text="when impact is high" bg="#FFF4CE" color="#806B19" /></div></Frame><div className="grid gap-3 md:grid-cols-2"><Frame title="Match the control to the failure" color={m.color}><div className="space-y-2">{[['Prompt injection', 'isolate content + restrict tools'], ['Hallucination', 'ground + verify + abstain'], ['Bias or unfairness', 'representative tests + review'], ['Sensitive data', 'minimize + control + audit']].map(([risk, control]) => <div key={risk} className="grid grid-cols-[0.8fr_1.2fr] gap-2 rounded-lg bg-[#FAF9F4] p-2.5 text-[11px]"><span className="font-extrabold" style={{ color: m.color }}>{risk}</span><span className="text-[#637979]">{control}</span></div>)}</div></Frame><Frame title="Human review belongs where impact changes" color={m.color}><div className="space-y-2"><Box title="Low impact" text="monitor and sample" /><Box title="Reversible action" text="confirm before execution" /><Box title="High impact or regulated" text="qualified human approval" bg={m.bg} color={m.color} /></div></Frame></div><Rule color={m.color} bg={m.bg}>Prompts influence behavior. Permissions, schemas, isolation, and human approval create boundaries.</Rule></div>;
}

function DomainSix() {
  const m = metaById(6);
  return <div className="space-y-3"><Frame title="The architecture lifecycle" color={m.color}><div className="flex flex-wrap items-center justify-center gap-y-3"><Box title="Discover" text="problem · users · baseline" /><Arrow /><Box title="Design" text="options · trade-offs · risks" bg={m.bg} color={m.color} /><Arrow /><Box title="Handoff" text="owners · runbook · acceptance" /><Arrow /><Box title="Operate" text="SLA · monitoring · support" /><Arrow /><Box title="Iterate" text="feedback · evals · retirement" /></div></Frame><div className="grid gap-3 md:grid-cols-2"><Frame title="Translate for the room" color={m.color}><div className="space-y-2"><Box title="Executives" text="value, exposure, and timing" /><Box title="Legal and security" text="data, controls, and residual risk" /><Box title="Engineering" text="boundaries, interfaces, and failure handling" bg={m.bg} color={m.color} /></div></Frame><Frame title="A useful handoff answers four questions" color={m.color}><div className="grid grid-cols-2 gap-2">{['What was chosen?', 'Why this option?', 'Who owns it?', 'How will it change?'].map((label) => <Box key={label} title={label} />)}</div></Frame></div><Rule color={m.color} bg={m.bg}>A diagram records the shape. An architecture decision record explains the choice; an operating plan keeps it true.</Rule></div>;
}

function DomainSeven() {
  const m = metaById(7);
  return <div className="space-y-3"><Frame title="Put each rule where it can hold" color={m.color}><div className="mx-auto max-w-2xl space-y-2"><Box title="Managed policy" text="organization-wide settings and allowed integrations" bg={m.bg} color={m.color} /><Box title="Project instructions" text="repository context, conventions, and workflows" /><Box title="Permissions and hooks" text="allow, ask, deny, validate" /><Box title="Sandbox" text="operating-system boundary" /></div></Frame><div className="grid gap-3 md:grid-cols-2"><Frame title="AI-assisted development loop" color={m.color}><div className="flex flex-wrap items-center justify-center gap-y-2"><Box title="Issue" /><Arrow /><Box title="Plan" /><Arrow /><Box title="Build" bg={m.bg} color={m.color} /><Arrow /><Box title="Test" /><Arrow /><Box title="Review" /></div></Frame><Frame title="Debug with evidence" color={m.color}><div className="space-y-2">{['Reproduce the failure', 'Inspect context, tools, and logs', 'Change one layer', 'Turn the failure into a regression test'].map((label, index) => <div key={label} className="flex items-center gap-3 text-[12px] text-[#394646]"><span className="font-extrabold" style={{ color: m.color }}>{index + 1}</span>{label}</div>)}</div></Frame></div><Rule color={m.color} bg={m.bg}>CLAUDE.md guides the model. Permission rules, hooks, managed settings, and the sandbox enforce the boundary.</Rule></div>;
}

/* Retained in git history. The active guide now renders source-backed visual lessons.
function MultiAgentBlueprint() {
  const m = metaById(1);
  return <div className="space-y-3"><Frame title="A multi-agent system needs a coordination contract" color={m.color}><div className="grid gap-3 md:grid-cols-[1fr_1.2fr_1fr]"><div className="space-y-2"><Box title="Coordinator owns" text="plan · task graph · routing · global budget" bg={m.bg} color={m.color} /><Box title="It does not own" text="every specialist’s working context" /></div><div className="rounded-xl border-2 p-3" style={{ borderColor: m.color, backgroundColor: '#fff' }}><p className="text-center text-[12px] font-extrabold" style={{ color: m.color }}>Worker contract</p><div className="mt-2 grid grid-cols-2 gap-2"><Box title="Task" text="one bounded outcome" /><Box title="Context" text="only its slice" /><Box title="Tools" text="role-specific access" /><Box title="Return" text="schema + evidence" /></div></div><div className="space-y-2"><Box title="Shared state owns" text="task status · artifacts · trace IDs" bg="#EEF5F4" color="#35656E" /><Box title="Synthesizer owns" text="conflicts · completeness · final validation" /></div></div></Frame><Frame title="Bound the loop before it runs" color={m.color}><div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{[['Fan-out', 'max workers'], ['Turns', 'max loop depth'], ['Time', 'deadline'], ['Spend', 'token or cost cap'], ['Failure', 'retry → fallback → stop']].map(([title, text]) => <Box key={title} title={title} text={text} />)}</div><div className="mt-3 rounded-lg bg-[#FEE2E2] px-3 py-2 text-[11px] font-bold text-[#991B1B]">Do not use multi-agent when work is sequential, workers need the same context, outputs cannot be reconciled, or coordination costs more than the work.</div></Frame></div>;
}

function TeachingLesson({ lesson, color, bg }: { lesson: ObjectiveLesson; color: string; bg: string }) {
  return <div className="space-y-3"><Frame title="The idea" color={color}><p className="max-w-4xl text-[14px] leading-relaxed text-[#394646]">{lesson.idea}</p></Frame><Frame title="Work through one example" color={color}><div className="rounded-lg border border-[#DED8CE] bg-[#FAF9F4] px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9A9389]">Situation</p><p className="mt-1 text-[13px] font-bold leading-relaxed text-[#394646]">{lesson.example.situation}</p></div><div className="mt-3 grid items-stretch gap-2 md:grid-cols-[1fr_auto_1fr]"><div className="rounded-lg border border-[#F3CACA] bg-[#FFF7F7] px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#B91C1C]">Tempting shortcut</p><p className="mt-1.5 text-[12px] leading-relaxed text-[#633B3B]">{lesson.example.tempting}</p></div><div className="hidden items-center text-[#9A9389] md:flex" aria-hidden>→</div><div className="rounded-lg border px-4 py-3" style={{ borderColor: `${color}55`, backgroundColor: bg }}><p className="text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color }}>Architect’s move</p><p className="mt-1.5 text-[12px] leading-relaxed text-[#394646]">{lesson.example.move}</p></div></div><div className="mt-2 rounded-lg border-l-4 bg-white px-4 py-3" style={{ borderColor: color }}><p className="text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color }}>Why this works</p><p className="mt-1 text-[12px] leading-relaxed text-[#394646]">{lesson.example.why}</p></div></Frame></div>;
}
*/

const DOMAIN_VISUALS: Record<DomainId, () => ReactNode> = { 1: DomainOne, 2: DomainTwo, 3: DomainThree, 4: DomainFour, 5: DomainFive, 6: DomainSix, 7: DomainSeven };

function StartPage({ go }: { go: (page: Page) => void }) {
  return <div className="w-full min-w-0"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#637979]">Start here</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#394646]">See the exam blueprint as one system</h2><p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[#394646]">This is an exam field guide for practicing the architecture behind all 38 blueprint objectives. Open a domain for the big picture, then choose any numbered objective for its visual explanation.</p><div className="mt-5 rounded-xl border border-[#DED8CE] bg-[#FAF9F4] p-4"><div className="flex flex-wrap items-center justify-center gap-y-3">{META.map((domain, index) => <div key={domain.id} className="flex items-center"><button type="button" onClick={() => go(`domain-${domain.id}`)} className="group rounded-lg border border-[#DED8CE] bg-white px-3 py-2 text-left transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35656E]"><span className="block text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: domain.color }}>D{domain.id} · {domain.weight}%</span><span className="mt-0.5 block text-[11px] font-extrabold text-[#394646] group-hover:underline">{domain.short}</span></button>{index < META.length - 1 && <Arrow />}</div>)}</div></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{META.map((domain) => <button key={domain.id} type="button" onClick={() => go(`domain-${domain.id}`)} className="group rounded-xl border border-[#DED8CE] bg-white p-4 text-left transition-colors hover:border-[#35656E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35656E]"><div className="flex items-start gap-3"><span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg" style={{ color: domain.color, backgroundColor: domain.bg }}><Icon path={domain.icon} /></span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: domain.color }}>Domain {domain.id} · {domain.weight}%</p><p className="mt-1 text-[14px] font-extrabold leading-snug text-[#394646] group-hover:underline">{domain.title}</p><p className="mt-1.5 text-[12px] leading-relaxed text-[#637979]">{DOMAINS.find((item) => item.id === domain.id)?.objectives.length} visual pages</p></div></div></button>)}</div></div>;
}

function DomainPage({ id, go }: { id: DomainId; go: (page: Page) => void }) {
  const meta = metaById(id);
  const Visual = DOMAIN_VISUALS[id];
  return <div className="w-full min-w-0"><div className="flex flex-wrap items-center gap-x-2"><p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: meta.color }}>Domain {id} overview</p><p className="text-[11px] font-semibold text-[#9A9389]">{meta.weight}% of the exam</p><button type="button" onClick={() => go(`quiz-${id}`)} className="ml-auto rounded-full border px-3 py-1.5 text-[11px] font-extrabold" style={{ color: meta.color, borderColor: `${meta.color}55`, backgroundColor: meta.bg }}>Take the domain quiz</button></div><h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#394646]">{meta.title}</h2><p className="mt-2 text-[16px] font-extrabold leading-relaxed" style={{ color: meta.color }}>{meta.question}</p><p className="mt-1 max-w-3xl text-[15px] leading-relaxed text-[#394646]">{meta.intro}</p><div className="mt-5"><Visual /></div><div className="mt-3"><ObjectiveRibbon id={id} go={go} /></div></div>;
}

/* Retained in git history. The old repeated objective template is no longer compiled.
function ObjectivePageLegacy({ objectiveId, go }: { objectiveId: string; go: (page: Page) => void }) {
  const spec = OBJECTIVE_VISUALS[objectiveId];
  const review = OBJECTIVE_REVIEWS[objectiveId];
  const lesson = OBJECTIVE_LESSONS[objectiveId];
  const domainId = Number(objectiveId.split('.')[0]) as DomainId;
  const domain = DOMAINS.find((item) => item.id === domainId)!;
  const objective = domain.objectives.find((item) => item.id === objectiveId)!;
  const meta = metaById(domainId);
  const index = domain.objectives.findIndex((item) => item.id === objectiveId);
  const previous = index === 0 ? `domain-${domainId}` : domain.objectives[index - 1].id;
  const next = index === domain.objectives.length - 1 ? (domainId === 7 ? 'start' : `domain-${(domainId + 1) as DomainId}`) : domain.objectives[index + 1].id;
  const scenarioColumns = review.scenarios.length === 4 ? 'md:grid-cols-2' : 'md:grid-cols-3';
  const trapColumns = review.traps.length === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2';
  return <div className="w-full min-w-0"><div className="flex flex-wrap items-baseline gap-x-2"><p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: meta.color }}>Objective {objective.id}</p><p className="text-[11px] font-semibold text-[#9A9389]">Domain {domainId} · {meta.weight}%</p></div><h2 className="mt-1 max-w-4xl text-2xl font-extrabold tracking-tight text-[#394646]">{objective.title}</h2><p className="mt-2 text-[16px] font-extrabold leading-relaxed" style={{ color: meta.color }}>{spec.question}</p><p className="mt-1 max-w-3xl text-[15px] leading-relaxed text-[#394646]">{spec.explain}</p><div className="mt-5 space-y-3"><Frame title={spec.flowTitle} color={meta.color}><div className="flex flex-wrap items-stretch justify-center gap-y-3 sm:flex-nowrap">{spec.flow.map(([title, text], step) => <div key={title} className="flex min-w-0 flex-1 items-center"><Box title={title} text={text} bg={step === 1 ? meta.bg : '#FAF9F4'} color={step === 1 ? meta.color : undefined} className="w-[120px] flex-1" />{step < spec.flow.length - 1 && <Arrow />}</div>)}</div></Frame>{objectiveId === '1.4' && <MultiAgentBlueprint />}<Frame title={spec.lensTitle} color={meta.color}><div className={`grid gap-2 ${spec.lenses.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>{spec.lenses.map(([title, text]) => <Box key={title} title={title} text={text} />)}</div></Frame><Frame title="Read the scenario" color={meta.color}><div className={`grid gap-2 ${scenarioColumns}`}>{review.scenarios.map(([clue, move, why]) => <div key={clue} className="overflow-hidden rounded-lg border border-[#DED8CE] bg-white"><div className="bg-[#FAF9F4] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#637979]">When the scenario says</div><div className="px-3 py-2.5"><p className="text-[12px] font-extrabold text-[#394646]">{clue}</p><p className="mt-2 text-[11px] font-extrabold" style={{ color: meta.color }}>Choose: {move}</p><p className="mt-1 text-[11px] leading-snug text-[#637979]">{why}</p></div></div>)}</div></Frame><Frame title="Tempting answers that miss the point" color={meta.color}><div className={`grid gap-2 ${trapColumns}`}>{review.traps.map(([temptation, correction]) => <div key={temptation} className="grid grid-cols-[auto_1fr] gap-2 rounded-lg border border-[#F3CACA] bg-[#FFF7F7] px-3 py-2.5"><span className="font-extrabold text-[#B91C1C]">×</span><div><p className="text-[12px] font-extrabold text-[#8D3030]">{temptation}</p><p className="mt-1 text-[11px] leading-snug text-[#637979]">{correction}</p></div></div>)}</div></Frame><Rule color={meta.color} bg={meta.bg}>{spec.rule}</Rule>{review.sources && <div className="flex flex-wrap items-center gap-2 rounded-lg bg-[#FAF9F4] px-3 py-2 text-[10px]"><span className="font-bold uppercase tracking-[0.08em] text-[#9A9389]">Go deeper</span>{review.sources.map(([label, url]) => <a key={url} href={url} target="_blank" rel="noreferrer" className="rounded-full border border-[#DED8CE] bg-white px-2.5 py-1 font-bold text-[#35656E] hover:underline">{label} ↗</a>)}</div>}</div><div className="mt-5 flex items-stretch justify-between gap-2 border-t border-[#E6E1D8] pt-4"><button type="button" onClick={() => go(previous)} className="rounded-lg border border-[#DED8CE] bg-white px-3 py-2 text-left text-[12px] font-bold text-[#394646] hover:border-[#35656E]">← {index === 0 ? `Domain ${domainId} overview` : domain.objectives[index - 1].id}</button><button type="button" onClick={() => go(next)} className="rounded-lg border border-[#DED8CE] bg-white px-3 py-2 text-right text-[12px] font-bold text-[#394646] hover:border-[#35656E]">{index === domain.objectives.length - 1 ? (domainId === 7 ? 'Start' : `Domain ${domainId + 1} overview`) : domain.objectives[index + 1].id} →</button></div></div>;
}
*/

function ObjectivePage({ objectiveId, go }: { objectiveId: string; go: (page: Page) => void }) {
  if (objectiveId.startsWith('quiz-')) {
    return <QuizPage id={Number(objectiveId.slice(5)) as DomainId} go={go} />;
  }
  const domainId = Number(objectiveId.split('.')[0]) as DomainId;
  const domain = DOMAINS.find((item) => item.id === domainId)!;
  const objective = domain.objectives.find((item) => item.id === objectiveId)!;
  const meta = metaById(domainId);
  const index = domain.objectives.findIndex((item) => item.id === objectiveId);
  const previous = index === 0 ? `domain-${domainId}` : domain.objectives[index - 1].id;
  const next = index === domain.objectives.length - 1
    ? `quiz-${domainId}`
    : domain.objectives[index + 1].id;
  return <div className="w-full min-w-0">
    <div className="flex flex-wrap items-center gap-x-2">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: meta.color }}>Objective {objective.id}</p>
      <p className="text-[11px] font-semibold text-[#9A9389]">Domain {domainId} · {meta.weight}%</p>
      <button type="button" onClick={() => go(`quiz-${domainId}`)} className="ml-auto rounded-full border px-3 py-1.5 text-[11px] font-extrabold" style={{ color: meta.color, borderColor: `${meta.color}55`, backgroundColor: meta.bg }}>Take the domain quiz</button>
    </div>
    <h2 className="mt-1 max-w-4xl text-2xl font-extrabold tracking-tight text-[#394646]">{objective.title}</h2>
    <VisualObjectiveLesson objectiveId={objectiveId} color={meta.color} bg={meta.bg} />

    <div className="mt-5 flex items-stretch justify-between gap-2 border-t border-[#E6E1D8] pt-4">
      <button type="button" onClick={() => go(previous)} className="rounded-lg border border-[#DED8CE] bg-white px-3 py-2 text-left text-[12px] font-bold text-[#394646] hover:border-[#35656E]">← {index === 0 ? `Domain ${domainId} overview` : domain.objectives[index - 1].id}</button>
      <button type="button" onClick={() => go(next)} className="rounded-lg border border-[#DED8CE] bg-white px-3 py-2 text-right text-[12px] font-bold text-[#394646] hover:border-[#35656E]">{index === domain.objectives.length - 1 ? `Domain ${domainId} quiz` : domain.objectives[index + 1].id} →</button>
    </div>
  </div>;
}

function QuizPage({ id, go }: { id: DomainId; go: (page: Page) => void }) {
  const meta = metaById(id);
  const domain = DOMAINS.find((item) => item.id === id)!;
  const previous = domain.objectives[domain.objectives.length - 1].id;
  const next = id === 7 ? 'start' : `domain-${(id + 1) as DomainId}`;

  return <div className="w-full min-w-0">
    <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: meta.color }}>Domain {id} quiz</p>
    <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#394646]">Check what you understood</h2>
    <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-[#394646]">This checkpoint samples one question from every objective in {meta.title}. Answers are explained immediately, so a missed question becomes the next thing to review.</p>
    <DomainCheckpoint domainId={id} color={meta.color} bg={meta.bg} onReview={go} />
    <div className="mt-5 flex items-stretch justify-between gap-2 border-t border-[#E6E1D8] pt-4">
      <button type="button" onClick={() => go(previous)} className="rounded-lg border border-[#DED8CE] bg-white px-3 py-2 text-left text-[12px] font-bold text-[#394646] hover:border-[#35656E]">← Objective {previous}</button>
      <button type="button" onClick={() => go(next)} className="rounded-lg border border-[#DED8CE] bg-white px-3 py-2 text-right text-[12px] font-bold text-[#394646] hover:border-[#35656E]">{id === 7 ? 'Start' : `Domain ${id + 1} overview`} →</button>
    </div>
  </div>;
}

/* Retained in git history. The first navigation shell is no longer compiled.
function ArchitectGuideLegacy() {
  const [page, setPage] = useState<Page>('start');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const currentDomain = page === 'start' ? null : Number(page.startsWith('domain-') ? page.slice(7) : page.startsWith('quiz-') ? page.slice(5) : page.split('.')[0]) as DomainId;
  useEffect(() => { if (!isFullscreen) return; const previous = document.body.style.overflow; const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setIsFullscreen(false); document.body.style.overflow = 'hidden'; document.addEventListener('keydown', onKey); return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', onKey); }; }, [isFullscreen]);
  return <MotionConfig reducedMotion="user"><div className={`fg-scope ${isFullscreen ? 'fg-scope--fullscreen' : ''}`}><div className="fg-toolbar mb-4 flex justify-end"><button type="button" onClick={() => setIsFullscreen((value) => !value)} aria-label={isFullscreen ? 'Exit full screen' : 'Expand guide to full screen'} className="inline-flex items-center gap-2 rounded-lg border border-[#DED8CE] bg-white px-3 py-2 text-[13px] font-bold text-[#394646] hover:border-[#35656E]"><Icon path={isFullscreen ? 'M9 9 4.5 4.5M4.5 4.5v3.75m0-3.75h3.75M15 9l4.5-4.5m0 0v3.75m0-3.75h-3.75M9 15l-4.5 4.5m0 0v-3.75m0 3.75h3.75M15 15l4.5 4.5m0 0v-3.75m0 3.75h-3.75' : 'M8.25 3.75h-4.5v4.5M15.75 3.75h4.5v4.5M8.25 20.25h-4.5v-4.5M15.75 20.25h4.5v-4.5'} className="h-4 w-4" />{isFullscreen ? 'Exit full screen' : 'Full screen'}</button></div><div className="fg-guide-body grid items-start gap-5 lg:grid-cols-[250px_1fr]"><nav aria-label="Guide contents" className="hidden lg:flex flex-col gap-1"><button type="button" onClick={() => setPage('start')} aria-pressed={page === 'start'} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left ${page === 'start' ? 'bg-[#FFF4CE]' : 'hover:bg-[#FAF9F4]'}`}><span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/60 text-[#615D58]"><Icon path={ICONS.play} /></span><span><span className="block text-sm font-extrabold text-[#394646]">Start here</span><span className="block text-xs text-[#637979]">38 visual objectives</span></span></button>{META.map((domain) => { const active = currentDomain === domain.id; const official = DOMAINS.find((item) => item.id === domain.id)!; return <div key={domain.id}><button type="button" onClick={() => setPage(`domain-${domain.id}`)} aria-pressed={page === `domain-${domain.id}`} className="relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-[#FAF9F4]">{active && <motion.span layoutId="domain-active" className="absolute inset-0 rounded-xl" style={{ backgroundColor: domain.bg }} />}<span className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/55" style={{ color: domain.color }}><Icon path={domain.icon} /></span><span className="relative min-w-0"><span className="block text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: domain.color }}>Domain {domain.id} · {domain.weight}%</span><span className="mt-0.5 block text-[13px] font-extrabold leading-snug text-[#394646]">{domain.title}</span></span></button>{active && <div className="ml-6 border-l border-[#DED8CE] py-1 pl-3">{official.objectives.map((objective) => <button key={objective.id} type="button" onClick={() => setPage(objective.id)} aria-pressed={page === objective.id} className={`block w-full rounded-lg px-2 py-1.5 text-left text-[11px] leading-snug ${page === objective.id ? 'bg-white font-extrabold shadow-sm' : 'text-[#637979] hover:bg-white/70'}`}><span className="mr-1.5 font-extrabold" style={{ color: domain.color }}>{objective.id}</span>{objective.title}</button>)}</div>}</div>; })}</nav><div className="lg:hidden -mx-2 flex gap-2 overflow-x-auto px-2 pb-1"><button type="button" onClick={() => setPage('start')} className="flex-shrink-0 rounded-full border border-[#DED8CE] bg-white px-3 py-2 text-[12px] font-bold text-[#394646]">Start</button>{META.map((domain) => <button key={domain.id} type="button" onClick={() => setPage(`domain-${domain.id}`)} className="flex-shrink-0 rounded-full border px-3 py-2 text-[12px] font-bold" style={{ color: domain.color, backgroundColor: currentDomain === domain.id ? domain.bg : '#fff', borderColor: currentDomain === domain.id ? 'transparent' : '#DED8CE' }}>D{domain.id} · {domain.weight}%</button>)}</div><AnimatePresence mode="wait"><motion.div key={page} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.16 }}>{page === 'start' ? <StartPage go={setPage} /> : page.startsWith('domain-') ? <DomainPage id={currentDomain!} go={setPage} /> : <ObjectivePage objectiveId={page} go={setPage} />}</motion.div></AnimatePresence></div></div></MotionConfig>;
}
*/

function GuideNavigation({ page, currentDomain, go }: { page: Page; currentDomain: DomainId | null; go: (page: Page) => void }) {
  return <>
    <nav aria-label="Guide contents" className="hidden lg:flex flex-col gap-1">
      <button type="button" onClick={() => go('start')} aria-pressed={page === 'start'} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left ${page === 'start' ? 'bg-[#FFF4CE]' : 'hover:bg-[#FAF9F4]'}`}>
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/60 text-[#615D58]"><Icon path={ICONS.play} /></span>
        <span><span className="block text-sm font-extrabold text-[#394646]">Start here</span><span className="block text-xs text-[#637979]">38 objectives · 7 quizzes</span></span>
      </button>
      {META.map((domain) => {
        const active = currentDomain === domain.id;
        const official = DOMAINS.find((item) => item.id === domain.id)!;
        return <div key={domain.id}>
          <button type="button" onClick={() => go(`domain-${domain.id}`)} aria-pressed={page === `domain-${domain.id}`} className="relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-[#FAF9F4]">
            {active && <motion.span layoutId="domain-active-new" className="absolute inset-0 rounded-xl" style={{ backgroundColor: domain.bg }} />}
            <span className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/55" style={{ color: domain.color }}><Icon path={domain.icon} /></span>
            <span className="relative min-w-0"><span className="block text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: domain.color }}>Domain {domain.id} · {domain.weight}%</span><span className="mt-0.5 block text-[13px] font-extrabold leading-snug text-[#394646]">{domain.title}</span></span>
          </button>
          {active && <div className="ml-6 border-l border-[#DED8CE] py-1 pl-3">
            {official.objectives.map((objective) => <button key={objective.id} type="button" onClick={() => go(objective.id)} aria-pressed={page === objective.id} className={`block w-full rounded-lg px-2 py-1.5 text-left text-[11px] leading-snug ${page === objective.id ? 'bg-white font-extrabold shadow-sm' : 'text-[#637979] hover:bg-white/70'}`}>
              <span className="mr-1.5 font-extrabold" style={{ color: domain.color }}>{objective.id}</span>{objective.title}
            </button>)}
            <button type="button" onClick={() => go(`quiz-${domain.id}`)} aria-pressed={page === `quiz-${domain.id}`} className={`mt-1 flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-[11px] font-extrabold ${page === `quiz-${domain.id}` ? 'bg-white shadow-sm' : 'hover:bg-white/70'}`} style={{ color: domain.color, borderColor: page === `quiz-${domain.id}` ? `${domain.color}66` : 'transparent' }}>
              <Icon path="M9 11.25 11.25 13.5 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" className="h-4 w-4" />Domain {domain.id} quiz
            </button>
          </div>}
        </div>;
      })}
    </nav>
    <div className="lg:hidden -mx-2 flex gap-2 overflow-x-auto px-2 pb-1">
      <button type="button" onClick={() => go('start')} className="flex-shrink-0 rounded-full border border-[#DED8CE] bg-white px-3 py-2 text-[12px] font-bold text-[#394646]">Start</button>
      {META.map((domain) => <button key={domain.id} type="button" onClick={() => go(`domain-${domain.id}`)} className="flex-shrink-0 rounded-full border px-3 py-2 text-[12px] font-bold" style={{ color: domain.color, backgroundColor: currentDomain === domain.id ? domain.bg : '#fff', borderColor: currentDomain === domain.id ? 'transparent' : '#DED8CE' }}>D{domain.id} · {domain.weight}%</button>)}
      {currentDomain && <button type="button" onClick={() => go(`quiz-${currentDomain}`)} className="flex-shrink-0 rounded-full border px-3 py-2 text-[12px] font-bold" style={{ color: metaById(currentDomain).color, backgroundColor: page === `quiz-${currentDomain}` ? metaById(currentDomain).bg : '#fff', borderColor: `${metaById(currentDomain).color}55` }}>D{currentDomain} quiz</button>}
    </div>
  </>;
}

export default function ArchitectGuide() {
  const [page, setPage] = useState<Page>('start');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const currentDomain = page === 'start' ? null : Number(page.startsWith('domain-') ? page.slice(7) : page.startsWith('quiz-') ? page.slice(5) : page.split('.')[0]) as DomainId;

  useEffect(() => {
    if (!isFullscreen) return;
    const previous = document.body.style.overflow;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setIsFullscreen(false);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [isFullscreen]);

  const content = page === 'start'
    ? <StartPage go={setPage} />
    : page.startsWith('domain-')
      ? <DomainPage id={currentDomain!} go={setPage} />
      : page.startsWith('quiz-')
        ? <QuizPage id={currentDomain!} go={setPage} />
        : <ObjectivePage objectiveId={page} go={setPage} />;

  return <MotionConfig reducedMotion="user">
    <div className={`fg-scope ${isFullscreen ? 'fg-scope--fullscreen' : ''}`}>
      <div className="fg-toolbar mb-4 flex justify-end">
        <button type="button" onClick={() => setIsFullscreen((value) => !value)} aria-label={isFullscreen ? 'Exit full screen' : 'Expand guide to full screen'} className="inline-flex items-center gap-2 rounded-lg border border-[#DED8CE] bg-white px-3 py-2 text-[13px] font-bold text-[#394646] hover:border-[#35656E]">
          <Icon path={isFullscreen ? 'M9 9 4.5 4.5M4.5 4.5v3.75m0-3.75h3.75M15 9l4.5-4.5m0 0v3.75m0-3.75h-3.75M9 15l-4.5 4.5m0 0v-3.75m0 3.75h3.75M15 15l4.5 4.5m0 0v-3.75m0 3.75h-3.75' : 'M8.25 3.75h-4.5v4.5M15.75 3.75h4.5v4.5M8.25 20.25h-4.5v-4.5M15.75 20.25h4.5v-4.5'} className="h-4 w-4" />
          {isFullscreen ? 'Exit full screen' : 'Full screen'}
        </button>
      </div>
      <div className="fg-guide-body grid items-start gap-5 lg:grid-cols-[250px_1fr]">
        <GuideNavigation page={page} currentDomain={currentDomain} go={setPage} />
        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.16 }}>{content}</motion.div>
        </AnimatePresence>
      </div>
    </div>
  </MotionConfig>;
}
