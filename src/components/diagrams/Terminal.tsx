interface Line {
  type: 'prompt' | 'text' | 'action' | 'muted' | 'heading' | 'status' | 'menu' | 'menu-active' | 'hint';
  content: string;
  color?: string;
}

interface Props {
  lines: Line[];
  version?: string;
  model?: string;
  cwd?: string;
  showHeader?: boolean;
  showInput?: boolean;
  showFooter?: boolean;
  imageLabel?: string;
  children?: any;
  inputLines?: string[];
}

export default function Terminal({
  lines,
  version = 'v2.1.84',
  model = 'Opus 4.6',
  cwd = '~/my-app',
  showHeader = true,
  showInput = true,
  showFooter = true,
  imageLabel,
  children,
  inputLines,
}: Props) {
  return (
    <div
      style={{
        background: '#0a0a0a',
        borderRadius: '12px',
        overflow: 'hidden',
        fontFamily: "'SF Mono', Menlo, Monaco, monospace",
        fontSize: '0.8125rem',
        lineHeight: 1.7,
        margin: '0 0 1.5rem',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Title bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', gap: '8px', background: '#2a2a2a', flexShrink: 0, height: '36px', boxSizing: 'border-box' }}>
        <svg width="12" height="12" style={{ flexShrink: 0 }}><circle cx="6" cy="6" r="6" fill="#ff5f57"/></svg>
        <svg width="12" height="12" style={{ flexShrink: 0 }}><circle cx="6" cy="6" r="6" fill="#ffbd2e"/></svg>
        <svg width="12" height="12" style={{ flexShrink: 0 }}><circle cx="6" cy="6" r="6" fill="#28c840"/></svg>
      </div>

      {/* Header */}
      {showHeader && (
        <div style={{ padding: '0 20px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/images/claudecode-color.png" alt="" style={{ width: '32px', height: '32px', imageRendering: 'pixelated', border: 'none', boxShadow: 'none', margin: 0, padding: 0, float: 'none' }} />
          <div>
            <div style={{ color: '#c8c4ba', fontSize: '0.8125rem' }}>
              <span style={{ fontWeight: 600 }}>Claude Code</span>{' '}
              <span style={{ color: '#8a867a' }}>{version}</span>
            </div>
            <div style={{ color: '#8a867a', fontSize: '0.75rem' }}>
              {model} · {cwd}
            </div>
          </div>
        </div>
      )}

      {/* Lines */}
      <div style={{ padding: '0 20px 16px' }}>
        {lines.map((line, i) => {
          if (line.type === 'heading') {
            return (
              <div key={i} style={{ color: '#28c840', fontWeight: 700, fontSize: '0.9375rem', marginTop: i > 0 ? '8px' : 0 }}>
                {line.content}
              </div>
            );
          }
          if (line.type === 'prompt') {
            return (
              <div key={i} style={{ color: '#ffffff', fontWeight: 600, marginTop: i > 0 ? '4px' : 0 }}>
                <span style={{ color: '#8a867a' }}>{'> '}</span>
                {line.content}
              </div>
            );
          }
          if (line.type === 'text') {
            return (
              <div key={i} style={{ color: '#c8c4ba', marginTop: '8px' }}>
                <span style={{ color: '#e8915a', marginRight: '6px' }}>●</span>
                {line.content}
              </div>
            );
          }
          if (line.type === 'action') {
            return (
              <div key={i} style={{ color: '#8a867a', paddingLeft: '18px' }}>
                {line.content}
              </div>
            );
          }
          if (line.type === 'status') {
            const parts = line.content.split(': ');
            return (
              <div key={i} style={{ color: '#c8c4ba', marginTop: '2px' }}>
                {parts[0]}:{' '}
                <span style={{ color: line.color || '#28c840', fontWeight: 600 }}>{parts[1]}</span>
              </div>
            );
          }
          if (line.type === 'menu-active') {
            return (
              <div key={i} style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>
                <span style={{ color: '#22d3ee', marginRight: '6px' }}>❯</span>
                {line.content}
              </div>
            );
          }
          if (line.type === 'menu') {
            return (
              <div key={i} style={{ color: '#8a867a', paddingLeft: '18px', marginTop: '2px' }}>
                {line.content}
              </div>
            );
          }
          if (line.type === 'hint') {
            return (
              <div key={i} style={{ color: '#5a5750', fontSize: '0.75rem', marginTop: '12px' }}>
                {line.content}
              </div>
            );
          }
          // muted
          return (
            <div key={i} style={{ color: '#8a867a', marginTop: '4px' }}>
              {line.content}
            </div>
          );
        })}
      </div>

      {/* Image label */}
      {imageLabel && (
        <div style={{ padding: '8px 20px 4px', color: '#8a867a', fontSize: '0.75rem', fontStyle: 'italic' }}>
          {imageLabel} <span style={{ color: '#5a5750' }}>(↑ to select)</span>
        </div>
      )}

      {/* Input line */}
      {showInput && (
        <div style={{ padding: '8px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {inputLines ? (
            inputLines.map((line, i) => (
              <div key={i} style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.8125rem', lineHeight: 1.7 }}>
                <span style={{ color: '#8a867a', marginRight: '4px' }}>{'>'}</span>
                {line}
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#8a867a' }}>{'>'}</span>
              <div style={{ width: '8px', height: '16px', background: '#c8c4ba', borderRadius: '1px' }} />
            </div>
          )}
        </div>
      )}

      {/* Children content between input and footer */}
      {children && (
        <div style={{ padding: '16px 20px', color: '#c8c4ba', fontSize: '0.8125rem', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {children}
        </div>
      )}

      {/* Footer */}
      {showFooter && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ padding: '6px 20px 2px', color: '#5a5750', fontSize: '0.6875rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span>{model} (1M context)</span>
            <span style={{ color: '#3a3a3a' }}>|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              ctx:
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1px', margin: '0 2px' }}>
                <span style={{ display: 'inline-block', width: '24px', height: '6px', background: '#c8c4ba', borderRadius: '1px' }} />
                <span style={{ display: 'inline-block', width: '40px', height: '6px', background: '#3a3a3a', borderRadius: '1px' }} />
              </span>
              19%
            </span>
            <span style={{ color: '#3a3a3a' }}>|</span>
            <span>{cwd}</span>
          </div>
          <div style={{ padding: '2px 20px 8px', color: '#5a5750', fontSize: '0.6875rem' }}>
            <span style={{ color: '#e8915a' }}>▸▸</span> bypass permissions on <span style={{ color: '#5a5750' }}>(shift+tab to cycle)</span>
          </div>
        </div>
      )}
    </div>
  );
}
