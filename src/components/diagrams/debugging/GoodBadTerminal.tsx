const mono = "'JetBrains Mono', monospace";
const display = "'Chiron Go Round TC', system-ui, sans-serif";

const SAGE = '#7a9a6d';
const CORAL = '#c0392b';
const BG = '#1e1e1e';
const BG_TITLE = '#333333';
const TEXT = '#cccccc';
const DIM = '#808080';

type Line =
  | { type: 'prompt'; text: string }
  | { type: 'response'; text: string }
  | { type: 'tool'; text: string }
  | { type: 'error'; text: string }
  | { type: 'dim'; text: string }
  | { type: 'blank' };

function ClaudeTerminal({ lines, label, labelColor, labelText, bad }: {
  lines: Line[];
  label: string;
  labelColor: string;
  labelText: string;
  bad?: boolean;
}) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontFamily: display,
        fontSize: '0.75rem',
        fontWeight: 600,
        color: labelColor,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{
          display: 'inline-block',
          width: 20,
          height: 20,
          borderRadius: 4,
          background: labelColor,
          color: '#fff',
          fontSize: '0.6875rem',
          fontWeight: 700,
          textAlign: 'center' as const,
          lineHeight: '20px',
          fontFamily: mono,
        }}>
          {label}
        </span>
        {labelText}
      </div>
      <div style={{
        borderRadius: 8,
        overflow: 'hidden',
        background: bad ? '#221a1a' : '#1a221a',
        border: bad ? '1.5px solid rgba(224, 122, 95, 0.35)' : 'none',
      }}>
        {/* macOS title bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          background: BG_TITLE,
          gap: 6,
          flexShrink: 0,
          height: 32,
          boxSizing: 'border-box',
        }}>
          <svg width="10" height="10" style={{ flexShrink: 0 }}><circle cx="5" cy="5" r="5" fill="#ff5f57"/></svg>
          <svg width="10" height="10" style={{ flexShrink: 0 }}><circle cx="5" cy="5" r="5" fill="#febc2e"/></svg>
          <svg width="10" height="10" style={{ flexShrink: 0 }}><circle cx="5" cy="5" r="5" fill="#28c840"/></svg>
        </div>

        <div style={{ padding: '12px 16px 14px' }}>
          {/* Claude Code header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <img
              src="/images/claudecode-color.png"
              alt=""
              style={{ width: 28, height: 28, imageRendering: 'pixelated' as any, border: 'none', boxShadow: 'none', borderRadius: 0, float: 'none' as any, margin: 0, maxWidth: 28 }}
            />
            <div style={{ fontFamily: mono, fontSize: '0.7rem', lineHeight: 1.4 }}>
              <div><span style={{ color: '#fff', fontWeight: 700 }}>Claude Code</span> <span style={{ color: DIM }}>v2.1.84</span></div>
              <div style={{ color: DIM }}>Opus 4.6 · ~/my-app</div>
            </div>
          </div>

          {/* Lines */}
          {lines.map((line, i) => {
            if (line.type === 'blank') {
              return <div key={i} style={{ height: '0.6em' }} />;
            }
            if (line.type === 'prompt') {
              return (
                <div key={i} style={{ fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.9 }}>
                  <span style={{ color: DIM }}>{'> '}</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>{line.text}</span>
                </div>
              );
            }
            if (line.type === 'response') {
              return (
                <div key={i} style={{ fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.9, color: TEXT }}>
                  <span style={{ color: '#e07a5f', marginRight: 6 }}>●</span>
                  {line.text}
                </div>
              );
            }
            if (line.type === 'tool') {
              return (
                <div key={i} style={{ fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.9, color: DIM, paddingLeft: 16 }}>
                  {line.text}
                </div>
              );
            }
            if (line.type === 'error') {
              return (
                <div key={i} style={{ fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.9, color: '#f7768e', paddingLeft: 16 }}>
                  {line.text}
                </div>
              );
            }
            if (line.type === 'dim') {
              return (
                <div key={i} style={{ fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.9, color: DIM, paddingLeft: 16 }}>
                  {line.text}
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Input prompt */}
        <div style={{
          padding: '8px 16px',
          borderTop: `1px solid ${BG_TITLE}`,
          fontFamily: mono,
          fontSize: '0.75rem',
        }}>
          <span style={{ color: DIM }}>{'> '}</span>
          <span style={{
            display: 'inline-block',
            width: 8,
            height: 14,
            background: '#fff',
            verticalAlign: 'text-bottom',
          }} />
        </div>

        {/* Bottom bar */}
        <div style={{
          padding: '4px 16px 6px',
          borderTop: `1px solid ${BG_TITLE}`,
          fontFamily: mono,
          fontSize: '0.625rem',
          color: DIM,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap',
        }}>
          <span>Opus 4.6 (1M context)</span>
          <span style={{ color: '#333' }}>|</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            ctx:
            <span style={{ display: 'inline-block', width: 20, height: 5, background: '#808080', borderRadius: 1, marginLeft: 2 }} />
            <span style={{ display: 'inline-block', width: 36, height: 5, background: '#333', borderRadius: 1 }} />
            19%
          </span>
          <span style={{ color: '#333' }}>|</span>
          <span>~/my-app</span>
        </div>
      </div>
    </div>
  );
}

export default function GoodBadTerminal() {
  return (
    <div style={{
      margin: '0 0 2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
    }}>
      <ClaudeTerminal
        label="✗"
        labelColor={CORAL}
        labelText="Vague description"
        bad
        lines={[
          { type: 'prompt', text: 'the login page is broken' },
          { type: 'blank' },
          { type: 'response', text: 'I\'ll investigate the login page.' },
          { type: 'tool', text: 'Read src/app/login/page.tsx' },
          { type: 'tool', text: 'Read src/lib/auth.ts' },
          { type: 'tool', text: 'Edit src/lib/auth.ts' },
          { type: 'error', text: 'Tests still failing...' },
        ]}
      />
      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0' }} />
      <ClaudeTerminal
        label="✓"
        labelColor={SAGE}
        labelText="Let Claude get the evidence"
        lines={[
          { type: 'prompt', text: 'login is broken. open localhost:3000' },
          { type: 'prompt', text: 'and check the console for errors' },
          { type: 'blank' },
          { type: 'response', text: 'I\'ll check the browser directly.' },
          { type: 'tool', text: 'Navigate to localhost:3000/login' },
          { type: 'tool', text: 'Read console → Error: 500 on /api/auth/callback' },
          { type: 'blank' },
          { type: 'response', text: 'The auth callback redirect runs outside a server action context.' },
          { type: 'tool', text: 'Edit src/app/api/auth/callback/route.ts' },
        ]}
      />
    </div>
  );
}
