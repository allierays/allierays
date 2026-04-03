const NAVY = '#2d4059';
const MARBLE = '#e2e0db';
const INK_MUTED = '#8a867a';

export default function Callout({ text, source }: { text: string; source?: string }) {
  return (
    <div style={{
      margin: '2rem 0',
      padding: '24px 28px',
      borderLeft: `3px solid ${NAVY}`,
      background: '#ffffff',
      borderRadius: '0 8px 8px 0',
    }}>
      <div style={{
        fontFamily: "'Chiron Go Round TC', system-ui, sans-serif",
        fontSize: '1.0625rem',
        fontWeight: 500,
        color: NAVY,
        lineHeight: 1.6,
      }}>
        {text}
      </div>
      {source && (
        <div style={{
          marginTop: 10,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.6875rem',
          color: INK_MUTED,
          letterSpacing: '0.02em',
        }}>
          {source}
        </div>
      )}
    </div>
  );
}
