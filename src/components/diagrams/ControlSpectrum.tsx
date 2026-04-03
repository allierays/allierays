const NAVY = '#2d4059';
const SAGE = '#7a9a6d';
const TEAL = '#5b9ea6';
const CORAL = '#e07a5f';
const MARBLE = '#e2e0db';
const INK_MUTED = '#8a867a';

const segments = [
  { label: 'Workflow', sub: 'You control the path', accent: NAVY },
  { label: 'Agentic Workflow', sub: 'Structured + AI decisions', accent: SAGE },
  { label: 'Agent', sub: 'The model controls the path', accent: TEAL },
  { label: 'Multi-Agent', sub: 'Models coordinate together', accent: CORAL },
];

export default function ControlSpectrum() {
  return (
    <div style={{ margin: '2rem 0 2.5rem', userSelect: 'none' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {segments.map((seg) => (
          <div key={seg.label} style={{ background: '#ffffff', border: `1px solid ${MARBLE}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ height: 3, background: seg.accent }} />
            <div style={{ padding: '16px 12px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Chiron Go Round TC', system-ui, sans-serif", fontSize: '0.875rem', fontWeight: 600, color: seg.accent, marginBottom: 4 }}>{seg.label}</div>
              <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.75rem', color: INK_MUTED, lineHeight: 1.5 }}>{seg.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', height: 4, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ flex: 2, background: NAVY }} />
          <div style={{ flex: 2, background: SAGE }} />
          <div style={{ flex: 2, background: TEAL }} />
          <div style={{ flex: 2, background: CORAL }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.625rem', color: '#b5b0a3', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          <span>Predictable</span>
          <span>Autonomous</span>
        </div>
      </div>
    </div>
  );
}
