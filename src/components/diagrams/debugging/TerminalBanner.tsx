const mono = "'JetBrains Mono', monospace";

export default function TerminalBanner() {
  return (
    <div style={{
      margin: 0,
      borderRadius: 10,
      overflow: 'hidden',
      background: '#1a1b26',
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 16px',
        background: '#13141c',
        gap: 8,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
        </div>
        <div style={{
          flex: 1,
          textAlign: 'center' as const,
          fontFamily: mono,
          fontSize: '0.6875rem',
          color: '#565869',
          letterSpacing: '0.04em',
        }}>
          claude-code — ~/projects/my-app
        </div>
      </div>

      {/* Terminal body */}
      <div style={{
        display: 'flex',
        gap: 24,
        padding: '20px 24px 24px',
        fontFamily: mono,
        fontSize: '0.8125rem',
        lineHeight: 1.8,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* User prompt */}
          <div style={{ color: '#ffffff' }}>
            <span style={{ color: '#9ece6a' }}>❯ </span>
            fix the auth flow
          </div>

          {/* Blank line */}
          <div style={{ height: '0.5em' }} />

          {/* Claude tool use - Read */}
          <div style={{ color: '#565f89', display: 'flex', gap: 8 }}>
            <span style={{ color: '#e07a5f' }}>⏵</span>
            <span>Read <span style={{ color: '#7aa2f7' }}>src/auth/handler.ts</span></span>
          </div>

          {/* Claude tool use - Edit attempts */}
          <div style={{ color: '#565f89', display: 'flex', gap: 8 }}>
            <span style={{ color: '#e07a5f' }}>⏵</span>
            <span>Edit <span style={{ color: '#7aa2f7' }}>src/auth/handler.ts</span></span>
          </div>
          <div style={{ color: '#565f89', display: 'flex', gap: 8 }}>
            <span style={{ color: '#e07a5f' }}>⏵</span>
            <span>Edit <span style={{ color: '#7aa2f7' }}>src/auth/handler.ts</span></span>
          </div>
          <div style={{ color: '#565f89', display: 'flex', gap: 8 }}>
            <span style={{ color: '#e07a5f' }}>⏵</span>
            <span>Edit <span style={{ color: '#7aa2f7' }}>src/auth/handler.ts</span></span>
          </div>

          {/* Error */}
          <div style={{ height: '0.3em' }} />
          <div style={{ color: '#f7768e', paddingLeft: 20 }}>
            Test failed: token mismatch on refresh
          </div>

          {/* Blank line */}
          <div style={{ height: '0.5em' }} />

          {/* User prompt 2 */}
          <div style={{ color: '#ffffff' }}>
            <span style={{ color: '#9ece6a' }}>❯ </span>
            stop. explain what you think the root cause is.
          </div>

          <div style={{ height: '0.5em' }} />

          {/* Claude response */}
          <div style={{ color: '#ffffff', paddingLeft: 20 }}>
            The issue isn't in handler.ts. The token schema in
          </div>
          <div style={{ color: '#ffffff', paddingLeft: 20 }}>
            <span style={{ color: '#7aa2f7' }}>db/migrations/004.sql</span> doesn't match the type contract.
          </div>

          <div style={{ height: '0.3em' }} />

          {/* Fix */}
          <div style={{ color: '#565f89', display: 'flex', gap: 8 }}>
            <span style={{ color: '#e07a5f' }}>⏵</span>
            <span>Edit <span style={{ color: '#7aa2f7' }}>db/migrations/004.sql</span></span>
          </div>
          <div style={{ color: '#9ece6a', paddingLeft: 20 }}>
            ✓ All tests passing.
          </div>
        </div>

        {/* Right: Claude Code logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: 120,
          opacity: 0.12,
        }}>
          <img
            src="/images/claudecode-color.png"
            alt=""
            style={{
              width: '100%',
              height: 'auto',
              filter: 'brightness(1.8) saturate(0.5)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
