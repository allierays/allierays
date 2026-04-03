const NAVY = '#2d4059';
const SAGE = '#7a9a6d';
const TEAL = '#5b9ea6';
const CORAL = '#e07a5f';
const INK = '#1a1915';
const INK_MUTED = '#8a867a';
const MARBLE = '#e2e0db';

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
    color: SAGE,
    control: 'Shared',
    cost: 2,
    complexity: 2,
    benefits: ['AI makes decisions inside guardrails', 'Can retry and self-correct', 'Structure with room to adapt'],
    limitations: ['Loops need careful bounds', 'Harder to reason about than a straight pipeline'],
    example: 'Code review: analyze files, run checks, re-review if issues found',
  },
  {
    name: 'Agent',
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
    color: CORAL,
    control: 'Models',
    cost: 4,
    complexity: 4,
    benefits: ['Roles that would conflict get their own agent', 'Parallel deep work across domains', 'Scales like a team, not a single brain'],
    limitations: ['Every handoff loses context', 'Coordination overhead adds up fast', 'Hardest to debug when something breaks'],
    example: 'Enterprise automation: cross-functional processes requiring diverse expertise',
  },
];

export default function ComparisonTable() {
  return (
    <div style={{ margin: '2rem 0 2.5rem', overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, minWidth: 700 }}>
        {patterns.map((p) => (
          <div key={p.name} style={{ background: '#ffffff', border: `1px solid ${MARBLE}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ height: 3, background: p.color }} />
            <div style={{ padding: '14px 14px 12px' }}>
              <div style={{ fontFamily: "'Chiron Go Round TC', system-ui, sans-serif", fontSize: '0.8125rem', fontWeight: 600, color: p.color, letterSpacing: '0.04em' }}>
                {p.name}
              </div>

              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.625rem', color: INK_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Control</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6875rem', color: p.color, fontWeight: 600 }}>{p.control}</span>
              </div>
              <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.625rem', color: INK_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cost</span>
                <Dots count={p.cost} color={p.color} />
              </div>
              <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.625rem', color: INK_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Complexity</span>
                <Dots count={p.complexity} color={p.color} />
              </div>

              <div style={{ height: 1, background: MARBLE, margin: '12px 0' }} />

              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5625rem', color: INK_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Benefits</div>
              {p.benefits.map((b) => (
                <div key={b} style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.75rem', color: INK, lineHeight: 1.6, paddingLeft: 14, position: 'relative' }}>
                  <i className="fa-solid fa-check" style={{ position: 'absolute', left: 0, top: 4, fontSize: '0.5rem', color: p.color }} />
                  {b}
                </div>
              ))}

              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5625rem', color: INK_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 10, marginBottom: 6 }}>Limitations</div>
              {p.limitations.map((l) => (
                <div key={l} style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.75rem', color: INK, lineHeight: 1.6, paddingLeft: 14, position: 'relative' }}>
                  <i className="fa-solid fa-minus" style={{ position: 'absolute', left: 0, top: 6, fontSize: '0.4rem', color: INK_MUTED }} />
                  {l}
                </div>
              ))}

              <div style={{ height: 1, background: MARBLE, margin: '12px 0' }} />

              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5625rem', color: INK_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Example</div>
              <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.6875rem', color: INK, lineHeight: 1.5 }}>
                {p.example}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
