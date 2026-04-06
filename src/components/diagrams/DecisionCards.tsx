const NAVY = '#2d4059';
const SAGE = '#7a9a6d';
const TEAL = '#5b9ea6';
const CORAL = '#e07a5f';
const INK = '#1a1915';
const INK_MUTED = '#8a867a';
const MARBLE = '#e2e0db';

const decisions = [
  {
    question: 'Do I know the steps?',
    answer: 'If you can whiteboard the flow before writing any code, it\'s a workflow. Most of the time, this is the answer. Don\'t add autonomy you don\'t need.',
    pattern: 'Workflow',
    color: NAVY,
  },
  {
    question: 'Does the AI need to figure things out inside the flow?',
    answer: 'If the steps are clear but the AI needs to decide how deep to go, whether to retry, or which subtask to prioritize, that\'s an agentic workflow. You keep the structure. The AI gets room to think.',
    pattern: 'Agentic Workflow',
    color: SAGE,
  },
  {
    question: 'Is the task open-ended?',
    answer: 'If you genuinely can\'t predict what the AI will need to do, build an agent. But make sure the tools are well-designed first, because the agent is only as good as what you give it to work with.',
    pattern: 'Agent',
    color: TEAL,
  },
  {
    question: 'Does one agent\'s context get in the way of another\'s?',
    answer: 'If the system prompt for one role conflicts with another, or the context window gets too crowded to reason well, split them up. But try one agent first. Token costs multiply fast, and debugging across agents is harder than debugging one.',
    pattern: 'Multi-Agent',
    color: CORAL,
  },
];

export default function DecisionCards() {
  return (
    <div style={{ margin: '2rem 0 2.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {decisions.map((d) => (
        <div key={d.question} style={{
          background: '#ffffff',
          border: `1px solid ${MARBLE}`,
          borderRadius: 8,
          overflow: 'hidden',
          display: 'flex',
        }}>
          <div style={{
            width: 4,
            background: d.color,
            flexShrink: 0,
          }} />
          <div style={{ padding: '18px 22px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <div style={{
                fontFamily: "'Chiron Go Round TC', system-ui, sans-serif",
                fontSize: '1.0625rem',
                fontWeight: 600,
                color: INK,
                lineHeight: 1.4,
              }}>
                {d.question}
              </div>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.625rem',
                fontWeight: 600,
                color: d.color,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
                marginLeft: 16,
              }}>
                → {d.pattern}
              </span>
            </div>
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '0.875rem',
              color: INK_MUTED,
              lineHeight: 1.65,
            }}>
              {d.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
