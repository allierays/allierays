const NAVY = '#2d4059';
const SAGE = '#7a9a6d';
const TEAL = '#5b9ea6';
const CORAL = '#e07a5f';
const INK = '#1a1915';
const INK_MUTED = '#8a867a';
const MARBLE = '#e2e0db';

const decisions = [
  {
    question: 'Can I map the steps?',
    answer: 'If you can write the control flow yourself, write it. Don\'t hand the model control you don\'t need to. Most of the time, this is the answer.',
    pattern: 'Workflow',
    color: NAVY,
  },
  {
    question: 'Does the workflow need to branch or adapt?',
    answer: 'The steps are clear, but the workflow needs to branch, retry, or adapt based on what happens. You keep the structure. The model gets room to make decisions within it.',
    pattern: 'Agentic Workflow',
    color: SAGE,
  },
  {
    question: 'Is the task open-ended for the user?',
    answer: 'The model needs to pick its own tools and path based on what it finds. You can\'t hardcode every route. Make sure the tools are well-designed, because the agent is only as good as what you give it.',
    pattern: 'Agent',
    color: TEAL,
  },
  {
    question: 'Is one agent\'s context getting in the way?',
    answer: 'Split them up only when context from one role conflicts with another. Try one agent first. Token costs multiply fast, and debugging across agents is harder than debugging one.',
    pattern: 'Multi-Agent (MAS)',
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
