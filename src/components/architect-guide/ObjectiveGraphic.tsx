import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import type { ObjectiveVisual } from './objectiveVisuals';

type GraphicKind = 'flow' | 'loop' | 'branch' | 'stack' | 'matrix' | 'network' | 'funnel' | 'balance' | 'bowtie' | 'documents';

const KINDS: Record<string, GraphicKind> = {
  '1.1': 'flow', '1.2': 'loop', '1.3': 'branch', '1.4': 'network', '1.5': 'branch', '1.6': 'matrix',
  '2.1': 'funnel', '2.2': 'stack', '2.3': 'branch', '2.4': 'stack', '2.5': 'stack',
  '3.1': 'funnel', '3.2': 'network', '3.3': 'balance', '3.4': 'network', '3.5': 'flow', '3.6': 'branch', '3.7': 'branch', '3.8': 'funnel',
  '4.1': 'matrix', '4.2': 'matrix', '4.3': 'loop', '4.4': 'branch', '4.5': 'balance', '4.6': 'loop',
  '5.1': 'stack', '5.2': 'bowtie', '5.3': 'balance', '5.4': 'flow', '5.5': 'flow',
  '6.1': 'funnel', '6.2': 'matrix', '6.3': 'loop', '6.4': 'documents', '6.5': 'loop',
  '7.1': 'stack', '7.2': 'flow', '7.3': 'loop',
};

type Props = { id: string; spec: ObjectiveVisual; color: string; bg: string };

function Shell({ title, caption, children, color }: { title: string; caption: string; children: ReactNode; color: string }) {
  return <section className="overflow-hidden rounded-xl border border-[#DED8CE] bg-white">
    <div className="border-b border-[#DED8CE] bg-[#FAF9F4] px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color }}>{title}</p>
      <p className="mt-1 text-[11px] leading-snug text-[#637979]">{caption}</p>
    </div>
    <div className="relative min-h-[250px] overflow-x-auto overflow-y-hidden p-5">{children}</div>
  </section>;
}

function Node({ title, text, color, bg, active = false }: { title: string; text: string; color: string; bg: string; active?: boolean }) {
  return <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    className="relative rounded-xl border px-3 py-3"
    style={{ borderColor: active ? color : '#DED8CE', backgroundColor: active ? bg : '#FAF9F4' }}
  >
    {active && <motion.span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.8, repeat: Infinity }} />}
    <p className="text-[12px] font-extrabold leading-snug" style={{ color: active ? color : '#394646' }}>{title}</p>
    <p className="mt-1 text-[11px] leading-snug text-[#637979]">{text}</p>
  </motion.div>;
}

function FlowGraphic({ spec, color, bg }: Omit<Props, 'id'>) {
  return <Shell title={spec.flowTitle} caption="Follow the moving signal. Each stage changes what the next stage is allowed to do." color={color}>
    <div className="relative min-w-[620px] overflow-hidden pt-7">
      <div className="absolute left-[7%] right-[7%] top-[62px] h-0.5 bg-[#E6E1D8]" />
      <motion.div className="absolute top-[57px] z-10 h-3 w-3 rounded-full" style={{ backgroundColor: color }} animate={{ left: ['7%', '91%'] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }} />
      <div className="relative z-20 grid gap-3" style={{ gridTemplateColumns: `repeat(${spec.flow.length}, minmax(0, 1fr))` }}>
        {spec.flow.map(([title, text], i) => <motion.div key={title} transition={{ delay: i * 0.12 }}><Node title={title} text={text} color={color} bg={bg} active={i === 1} /></motion.div>)}
      </div>
      <p className="mt-6 text-center text-[11px] font-bold" style={{ color }}>The output of one stage becomes the constraint or evidence for the next.</p>
    </div>
  </Shell>;
}

function LoopGraphic({ spec, color, bg }: Omit<Props, 'id'>) {
  return <Shell title={spec.flowTitle} caption="The return path matters. Production evidence changes the next pass through the system." color={color}>
    <div className="relative mx-auto min-w-[620px] max-w-4xl pb-12 pt-3">
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${spec.flow.length}, minmax(0, 1fr))` }}>
        {spec.flow.map(([title, text], i) => <motion.div key={title} animate={{ y: [0, -4, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.35 }}><Node title={title} text={text} color={color} bg={bg} active={i === 0} /></motion.div>)}
      </div>
      <div className="absolute bottom-4 left-[8%] right-[8%] h-7 rounded-b-full border-b-2 border-l-2 border-r-2" style={{ borderColor: color }} />
      <motion.div className="absolute bottom-[9px] h-3 w-3 rounded-full" style={{ backgroundColor: color }} animate={{ right: ['8%', '88%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
      <p className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white px-3 text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color }}>feedback changes the next cycle</p>
    </div>
  </Shell>;
}

function BranchGraphic({ spec, color, bg }: Omit<Props, 'id'>) {
  const root = spec.flow[0];
  const branches = spec.flow.slice(1);
  return <Shell title={spec.flowTitle} caption="Start at the signal on the left, then choose the branch whose conditions actually match." color={color}>
    <div className="grid min-h-[210px] items-center gap-5 md:grid-cols-[0.7fr_1.5fr]">
      <motion.div animate={{ scale: [1, 1.025, 1] }} transition={{ duration: 2.2, repeat: Infinity }}><Node title={root[0]} text={root[1]} color={color} bg={bg} active /></motion.div>
      <div className="relative grid gap-2 sm:grid-cols-2">
        <div className="absolute -left-5 bottom-[12%] top-[12%] w-5 rounded-l-lg border-b border-l border-t" style={{ borderColor: `${color}88` }} />
        {branches.map(([title, text], i) => <motion.div key={title} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.12 }}><Node title={title} text={text} color={color} bg={bg} /></motion.div>)}
      </div>
    </div>
  </Shell>;
}

function StackGraphic({ spec, color, bg }: Omit<Props, 'id'>) {
  return <Shell title={spec.flowTitle} caption="Read from the foundation upward. Each layer adds a responsibility that the others should not carry." color={color}>
    <div className="mx-auto flex max-w-2xl flex-col-reverse gap-2">
      {spec.flow.map(([title, text], i) => <motion.div key={title} initial={{ opacity: 0, x: i % 2 ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="relative">
        <div className="absolute inset-y-0 left-0 w-1 rounded-full" style={{ backgroundColor: color, opacity: 0.35 + i * 0.12 }} />
        <Node title={title} text={text} color={color} bg={bg} active={i === spec.flow.length - 1} />
      </motion.div>)}
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.08em] text-[#9A9389]"><span>stronger boundary</span><span>more behavioral</span></div>
    </div>
  </Shell>;
}

function MatrixGraphic({ spec, color, bg }: Omit<Props, 'id'>) {
  return <Shell title={spec.flowTitle} caption="Compare the dimensions together. A strong answer names which dimension changes the choice." color={color}>
    <div className="grid min-h-[210px] gap-3 sm:grid-cols-2">
      {spec.flow.map(([title, text], i) => <motion.div key={title} initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative overflow-hidden rounded-xl border border-[#DED8CE] p-4" style={{ backgroundColor: i === 1 ? bg : '#FAF9F4' }}>
        <motion.div className="absolute bottom-0 left-0 h-1" style={{ backgroundColor: color }} initial={{ width: 0 }} whileInView={{ width: `${45 + i * 18}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.25 + i * 0.12 }} />
        <p className="text-[12px] font-extrabold" style={{ color }}>{title}</p><p className="mt-2 text-[12px] leading-relaxed text-[#637979]">{text}</p>
      </motion.div>)}
    </div>
  </Shell>;
}

function NetworkGraphic({ spec, color, bg }: Omit<Props, 'id'>) {
  const center = spec.flow[Math.floor(spec.flow.length / 2)];
  const nodes = spec.flow.filter((_, i) => i !== Math.floor(spec.flow.length / 2));
  return <Shell title={spec.flowTitle} caption="Watch the center coordinate bounded work. Connections represent contracts, not shared hidden context." color={color}>
    <div className="relative mx-auto grid min-h-[230px] min-w-[620px] max-w-3xl grid-cols-[1fr_0.8fr_1fr] items-center gap-5">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 230" preserveAspectRatio="none" aria-hidden>
        {[35, 90, 145, 200].map((y, i) => <motion.path key={y} d={`M ${i % 2 ? 300 : 0} 115 C 180 ${y}, 420 ${230 - y}, ${i % 2 ? 600 : 300} 115`} fill="none" stroke={color} strokeOpacity=".28" strokeWidth="2" strokeDasharray="6 6" animate={{ strokeDashoffset: [0, -24] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }} />)}
      </svg>
      <div className="relative z-10 space-y-3">{nodes.filter((_, i) => i % 2 === 0).map(([title, text]) => <Node key={title} title={title} text={text} color={color} bg={bg} />)}</div>
      <motion.div className="relative z-20 rounded-full border-2 bg-white p-5 text-center shadow-md" style={{ borderColor: color }} animate={{ boxShadow: [`0 0 0 0 ${color}22`, `0 0 0 12px ${color}00`] }} transition={{ duration: 2, repeat: Infinity }}><p className="text-[12px] font-extrabold" style={{ color }}>{center[0]}</p><p className="mt-1 text-[10px] leading-snug text-[#637979]">{center[1]}</p></motion.div>
      <div className="relative z-10 space-y-3">{nodes.filter((_, i) => i % 2 === 1).map(([title, text]) => <Node key={title} title={title} text={text} color={color} bg={bg} />)}</div>
    </div>
  </Shell>;
}

function FunnelGraphic({ spec, color, bg }: Omit<Props, 'id'>) {
  return <Shell title={spec.flowTitle} caption="The system becomes more selective at each level. What survives is smaller, clearer, and more useful." color={color}>
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 py-2">
      {spec.flow.map(([title, text], i) => <motion.div key={title} initial={{ opacity: 0, scaleX: 1.12 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.14 }} className="rounded-lg border px-4 py-2.5 text-center" style={{ width: `${100 - i * (52 / Math.max(1, spec.flow.length - 1))}%`, borderColor: i === spec.flow.length - 1 ? color : '#DED8CE', backgroundColor: i === spec.flow.length - 1 ? bg : '#FAF9F4' }}><p className="text-[12px] font-extrabold" style={{ color: i === spec.flow.length - 1 ? color : '#394646' }}>{title}</p><p className="text-[10px] text-[#637979]">{text}</p></motion.div>)}
    </div>
  </Shell>;
}

function BalanceGraphic({ spec, color, bg }: Omit<Props, 'id'>) {
  const left = spec.flow[0];
  const right = spec.flow[spec.flow.length - 1];
  return <Shell title={spec.flowTitle} caption="The right answer balances constraints. Moving one side changes what the other side can afford." color={color}>
    <div className="relative mx-auto min-h-[220px] min-w-[560px] max-w-3xl pt-5">
      <motion.div className="absolute left-[14%] right-[14%] top-[92px] h-1 origin-center rounded-full" style={{ backgroundColor: color }} animate={{ rotate: [-2.5, 2.5, -2.5] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
      <div className="absolute left-1/2 top-[92px] h-24 w-1 -translate-x-1/2" style={{ backgroundColor: color }} /><div className="absolute left-1/2 top-[178px] h-3 w-28 -translate-x-1/2 rounded-full" style={{ backgroundColor: color }} />
      <div className="grid grid-cols-2 gap-[28%]"><Node title={left[0]} text={left[1]} color={color} bg={bg} active /><Node title={right[0]} text={right[1]} color={color} bg={bg} /></div>
      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-1">{spec.flow.slice(1, -1).map(([title]) => <span key={title} className="rounded-full border border-[#DED8CE] bg-white px-2 py-1 text-[9px] font-bold text-[#637979]">{title}</span>)}</div>
    </div>
  </Shell>;
}

function BowtieGraphic({ spec, color, bg }: Omit<Props, 'id'>) {
  const middle = Math.floor(spec.flow.length / 2);
  return <Shell title={spec.flowTitle} caption="Causes converge on a failure; controls prevent it or reduce the impact after it occurs." color={color}>
    <div className="grid min-h-[220px] items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
      <div className="space-y-2">{spec.flow.slice(0, middle).map(([title, text]) => <Node key={title} title={title} text={text} color={color} bg={bg} />)}</div>
      <motion.span className="rotate-90 text-center md:rotate-0" style={{ color }} animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
      <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Node title={spec.flow[middle][0]} text={spec.flow[middle][1]} color={color} bg={bg} active /></motion.div>
      <motion.span className="rotate-90 text-center md:rotate-0" style={{ color }} animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
      <div className="space-y-2">{spec.flow.slice(middle + 1).map(([title, text]) => <Node key={title} title={title} text={text} color={color} bg={bg} />)}</div>
    </div>
  </Shell>;
}

function DocumentsGraphic({ spec, color, bg }: Omit<Props, 'id'>) {
  return <Shell title={spec.flowTitle} caption="Each artifact answers a different question. Together they let another team build, choose, and operate." color={color}>
    <div className="relative mx-auto min-h-[230px] max-w-3xl">
      {spec.flow.map(([title, text], i) => <motion.div key={title} initial={{ opacity: 0, rotate: 0, x: 0 }} whileInView={{ opacity: 1, rotate: (i - (spec.flow.length - 1) / 2) * 3, x: (i - (spec.flow.length - 1) / 2) * 105 }} viewport={{ once: true }} transition={{ delay: i * 0.12, type: 'spring' }} className="absolute left-1/2 top-5 w-44 -translate-x-1/2 rounded-lg border bg-white p-4 shadow-md" style={{ borderColor: i === 2 ? color : '#DED8CE', zIndex: i }}><div className="mb-5 h-2 w-10 rounded-full" style={{ backgroundColor: i === 2 ? color : '#DED8CE' }} /><p className="text-[12px] font-extrabold" style={{ color: i === 2 ? color : '#394646' }}>{title}</p><p className="mt-2 text-[10px] leading-snug text-[#637979]">{text}</p><div className="mt-4 space-y-1"><span className="block h-1 rounded bg-[#E6E1D8]" /><span className="block h-1 w-2/3 rounded bg-[#E6E1D8]" /></div></motion.div>)}
    </div>
  </Shell>;
}

export default function ObjectiveGraphic({ id, spec, color, bg }: Props) {
  const props = { spec, color, bg };
  switch (KINDS[id]) {
    case 'loop': return <LoopGraphic {...props} />;
    case 'branch': return <BranchGraphic {...props} />;
    case 'stack': return <StackGraphic {...props} />;
    case 'matrix': return <MatrixGraphic {...props} />;
    case 'network': return <NetworkGraphic {...props} />;
    case 'funnel': return <FunnelGraphic {...props} />;
    case 'balance': return <BalanceGraphic {...props} />;
    case 'bowtie': return <BowtieGraphic {...props} />;
    case 'documents': return <DocumentsGraphic {...props} />;
    default: return <FlowGraphic {...props} />;
  }
}
