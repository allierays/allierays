const NAVY = '#2d4059';
const SAGE = '#7a9a6d';
const TEAL = '#5b9ea6';
const CORAL = '#e07a5f';
const INK = '#1a1915';
const INK_MUTED = '#8a867a';
const MARBLE = '#e2e0db';

const mono = "'JetBrains Mono', monospace";
const font = "'Source Serif 4', Georgia, serif";
const display = "'Chiron Go Round TC', system-ui, sans-serif";

export default function DecisionTree() {
  const qW = 280;
  const qH = 40;
  const aW = 180;
  const aH = 40;
  const rowGap = 72;
  const qX = 60;
  const aX = 430;
  const startY = 20;

  const rows = [
    { question: 'Are the steps known before you start?', answer: 'Workflow', color: NAVY },
    { question: 'Is the goal clear but the path isn\'t?', answer: 'Agentic Workflow', color: SAGE },
    { question: 'Can one agent hold all the context?', answer: 'Agent', color: TEAL },
  ];

  return (
    <div style={{ margin: '2rem 0 2.5rem', background: '#ffffff', border: `1px solid ${MARBLE}`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${NAVY}, ${SAGE}, ${TEAL}, ${CORAL})` }} />
      <svg viewBox={`0 0 680 ${startY + rowGap * 4 + 10}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block', padding: '20px 16px 12px' }}>
        <defs>
          {[NAVY, SAGE, TEAL, CORAL, MARBLE].map((c) => (
            <marker key={c} id={`dt-${c.replace('#', '')}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
            </marker>
          ))}
        </defs>

        {rows.map((row, i) => {
          const y = startY + i * rowGap;
          const qCx = qX + qW / 2;
          const qCy = y + qH / 2;

          return (
            <g key={i}>
              {/* Question */}
              <rect x={qX} y={y} width={qW} height={qH} rx={6} fill="#ffffff" stroke={MARBLE} strokeWidth={1.5} />
              <text x={qCx} y={qCy + 4} textAnchor="middle" fontFamily={font} fontSize={12.5} fill={INK} fontWeight={500}>
                {row.question}
              </text>

              {/* Yes arrow */}
              <line x1={qX + qW} y1={qCy} x2={aX} y2={qCy} stroke={row.color} strokeWidth={1.5} markerEnd={`url(#dt-${row.color.replace('#', '')})`} />
              <text x={qX + qW + 12} y={qCy - 8} fontFamily={mono} fontSize={10} fill={row.color} fontWeight={600}>yes</text>

              {/* Answer */}
              <rect x={aX} y={y} width={aW} height={aH} rx={6} fill={row.color} />
              <text x={aX + aW / 2} y={qCy + 4} textAnchor="middle" fontFamily={mono} fontSize={12} fill="#ffffff" fontWeight={600}>{row.answer}</text>

              {/* No arrow down */}
              {i < rows.length - 1 && (
                <>
                  <line x1={qCx} y1={y + qH} x2={qCx} y2={y + rowGap} stroke={MARBLE} strokeWidth={1.2} markerEnd={`url(#dt-${MARBLE.replace('#', '')})`} />
                  <text x={qCx + 10} y={y + qH + 16} fontFamily={mono} fontSize={10} fill={INK_MUTED}>no</text>
                </>
              )}
            </g>
          );
        })}

        {/* Final no to multi-agent */}
        {(() => {
          const lastY = startY + (rows.length - 1) * rowGap;
          const qCx = qX + qW / 2;
          const finalY = lastY + rowGap;
          return (
            <>
              <line x1={qCx} y1={lastY + qH} x2={qCx} y2={finalY} stroke={MARBLE} strokeWidth={1.2} markerEnd={`url(#dt-${MARBLE.replace('#', '')})`} />
              <text x={qCx + 10} y={lastY + qH + 16} fontFamily={mono} fontSize={10} fill={INK_MUTED}>no</text>
              <rect x={qCx - aW / 2} y={finalY} width={aW} height={aH} rx={6} fill={CORAL} />
              <text x={qCx} y={finalY + aH / 2 + 4} textAnchor="middle" fontFamily={mono} fontSize={12} fill="#ffffff" fontWeight={600}>Multi-Agent</text>
            </>
          );
        })()}
      </svg>
    </div>
  );
}
