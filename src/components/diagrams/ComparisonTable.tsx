import { useState, useEffect, useRef } from 'react';

const NAVY = '#2d4059';
const SAGE = '#7a9a6d';
const TEAL = '#5b9ea6';
const CORAL = '#e07a5f';
const INK = '#1a1915';
const INK_MUTED = '#8a867a';
const MARBLE = '#e2e0db';

const mono = "'JetBrains Mono', monospace";
const serif = "'Source Serif 4', Georgia, serif";
const display = "'Chiron Go Round TC', system-ui, sans-serif";

function Dots({ count, color }: { count: number; color: string }) {
  return (
    <span style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4].map((i) => (
        <i key={i} className="fa-solid fa-circle" style={{ fontSize: '0.375rem', color: i <= count ? color : MARBLE }} />
      ))}
    </span>
  );
}

const patterns = [
  {
    name: 'Workflow',
    definition: 'You define the path. The LLM is one step in it.',
    color: NAVY,
    control: 'You',
    cost: 1,
    complexity: 1,
    benefits: ['Same cost every time you run it', 'You can trace exactly what happened', 'Full control over every step'],
    limitations: ['Struggles with ambiguous or open-ended tasks', 'You have to map every path upfront'],
    example: 'Customer signup: verify email, create account, send welcome email',
  },
  {
    name: 'Agentic Workflow',
    definition: 'You define the structure. The LLM decides when to retry.',
    color: SAGE,
    control: 'You + LLM',
    cost: 2,
    complexity: 2,
    benefits: ['AI makes decisions inside guardrails', 'Can retry and self-correct', 'Structure with room to adapt'],
    limitations: ['Loops need careful bounds', 'Harder to reason about than a straight pipeline'],
    example: 'Code review: analyze files, run checks, re-review if issues found',
  },
  {
    name: 'Agent',
    definition: 'You give it tools and a system prompt. The LLM decides which tool to use.',
    color: TEAL,
    control: 'Model',
    cost: 3,
    complexity: 3,
    benefits: ['Figures out the path on its own', 'Adapts when the environment changes', 'Quick to build a first version'],
    limitations: ['More steps means more room for error', 'Token costs are hard to predict', 'Only as good as the tools you give it'],
    example: 'Support agent: answers questions, looks up orders, processes refunds',
  },
  {
    name: 'Multi-Agent',
    definition: 'Multiple agents, each with their own prompt and tools.',
    color: CORAL,
    control: 'Models',
    cost: 4,
    complexity: 4,
    benefits: ['Roles that would conflict get their own agent', 'Parallel deep work across domains', 'Scales like a team, not a single brain'],
    limitations: ['Token costs multiply fast', 'Coordination overhead adds up fast', 'Hardest to debug when something breaks'],
    example: 'Enterprise automation: cross-functional processes requiring diverse expertise',
  },
];

function Card({ p }: { p: typeof patterns[0] }) {
  return (
    <div style={{ background: '#ffffff', border: `1px solid ${MARBLE}`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ height: 3, background: p.color }} />
      <div style={{ padding: '14px 14px 12px' }}>
        <div style={{ fontFamily: display, fontSize: '0.8125rem', fontWeight: 600, color: p.color, letterSpacing: '0.04em' }}>
          {p.name}
        </div>

        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: mono, fontSize: '0.625rem', color: INK_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Control</span>
          <span style={{ fontFamily: mono, fontSize: '0.6875rem', color: p.color, fontWeight: 600 }}>{p.control}</span>
        </div>
        <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: mono, fontSize: '0.625rem', color: INK_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cost</span>
          <Dots count={p.cost} color={p.color} />
        </div>
        <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: mono, fontSize: '0.625rem', color: INK_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Complexity</span>
          <Dots count={p.complexity} color={p.color} />
        </div>

        <div style={{ height: 1, background: MARBLE, margin: '10px 0' }} />
        <div style={{ fontFamily: mono, fontSize: '0.5625rem', color: INK_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Definition</div>
        <div style={{ fontFamily: serif, fontSize: '0.6875rem', color: INK, lineHeight: 1.4 }}>
          {p.definition}
        </div>

        <div style={{ height: 1, background: MARBLE, margin: '12px 0' }} />

        <div style={{ fontFamily: mono, fontSize: '0.5625rem', color: INK_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Benefits</div>
        {p.benefits.map((b) => (
          <div key={b} style={{ fontFamily: serif, fontSize: '0.75rem', color: INK, lineHeight: 1.6, paddingLeft: 14, position: 'relative' as const }}>
            <i className="fa-solid fa-check" style={{ position: 'absolute' as const, left: 0, top: 4, fontSize: '0.5rem', color: p.color }} />
            {b}
          </div>
        ))}

        <div style={{ fontFamily: mono, fontSize: '0.5625rem', color: INK_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 10, marginBottom: 6 }}>Limitations</div>
        {p.limitations.map((l) => (
          <div key={l} style={{ fontFamily: serif, fontSize: '0.75rem', color: INK, lineHeight: 1.6, paddingLeft: 14, position: 'relative' as const }}>
            <i className="fa-solid fa-minus" style={{ position: 'absolute' as const, left: 0, top: 6, fontSize: '0.4rem', color: INK_MUTED }} />
            {l}
          </div>
        ))}

        <div style={{ height: 1, background: MARBLE, margin: '12px 0' }} />

        <div style={{ fontFamily: mono, fontSize: '0.5625rem', color: INK_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Example</div>
        <div style={{ fontFamily: serif, fontSize: '0.6875rem', color: INK, lineHeight: 1.5 }}>
          {p.example}
        </div>
      </div>
    </div>
  );
}

export default function ComparisonTable() {
  const [isMobile, setIsMobile] = useState(false);
  const [active, setActiveRaw] = useState(0);
  const broadcasting = useRef(false);

  const setActive = (i: number) => {
    setActiveRaw(i);
    broadcasting.current = true;
    window.dispatchEvent(new CustomEvent('pattern-slide', { detail: i }));
    broadcasting.current = false;
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    const onSync = (e: Event) => {
      if (!broadcasting.current) {
        setActiveRaw((e as CustomEvent).detail);
      }
    };
    window.addEventListener('pattern-slide', onSync);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('pattern-slide', onSync);
    };
  }, []);

  if (!isMobile) {
    return (
      <div style={{ margin: '0.5rem 0 2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {patterns.map((p) => <Card key={p.name} p={p} />)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ margin: '0.5rem 0 2.5rem' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 12, borderRadius: 8, overflow: 'hidden', border: `1px solid ${MARBLE}` }}>
        {patterns.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setActive(i)}
            style={{
              flex: 1,
              padding: '10px 4px',
              border: 'none',
              background: i === active ? p.color : '#fff',
              color: i === active ? '#fff' : INK_MUTED,
              fontFamily: display,
              fontSize: '0.6875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
              borderRight: i < patterns.length - 1 ? `1px solid ${MARBLE}` : 'none',
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Active card */}
      <Card p={patterns[active]} />

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
        {patterns.map((p, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: i === active ? p.color : MARBLE,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          />
        ))}
      </div>
    </div>
  );
}
