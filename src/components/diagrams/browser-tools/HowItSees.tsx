import { motion } from 'motion/react';

const INK = '#1a1a1a';
const INK_MUTED = '#8a867a';
const MARBLE = '#e2e0db';
const TERRACOTTA = '#c4785a';
const TEAL = '#5a8a8a';
const GREEN = '#3d7a45';

const display = "'Chiron Go Round TC', system-ui, sans-serif";
const mono = "'JetBrains Mono', monospace";

interface HowItSeesProps {
  tool: 'chrome' | 'playwright' | 'devtools';
}

const configs = {
  chrome: {
    label: 'Claude in Chrome',
    color: TERRACOTTA,
    leftTitle: 'What you see',
    rightTitle: 'What Claude sees',
    leftContent: (
      <div style={{ padding: 20, background: '#f8f6f1', borderRadius: 12, height: '100%', display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
        <div style={{ background: '#e2dbd2', borderRadius: 8, padding: '8px 12px', display: 'flex', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: '#b85c5c', opacity: 0.5 }} />
          <div style={{ width: 8, height: 8, borderRadius: 4, background: '#c4a050', opacity: 0.5 }} />
          <div style={{ width: 8, height: 8, borderRadius: 4, background: '#6b8f71', opacity: 0.5 }} />
        </div>
        <div style={{ fontFamily: display, fontSize: '1rem', fontWeight: 700, color: INK, textAlign: 'center' as const }}>Submit a ticket</div>
        <div style={{ background: '#fff', border: `1px solid ${MARBLE}`, borderRadius: 6, padding: '8px 12px', fontFamily: display, fontSize: '0.8rem', color: INK }}>Allie Jones</div>
        <div style={{ background: '#fff', border: `1px solid ${MARBLE}`, borderRadius: 6, padding: '8px 12px', fontFamily: display, fontSize: '0.8rem', color: INK }}>allie@company.com</div>
        <div style={{ background: TERRACOTTA, borderRadius: 6, padding: '8px 12px', fontFamily: display, fontSize: '0.8rem', fontWeight: 600, color: '#fff', textAlign: 'center' as const }}>Submit</div>
      </div>
    ),
    rightContent: (
      <div style={{ padding: 20, background: '#1a1a1a', borderRadius: 12, height: '100%', display: 'flex', alignItems: 'center' as const, justifyContent: 'center' as const }}>
        <div style={{ position: 'relative' as const }}>
          <div style={{ width: 120, height: 80, background: '#2a2a2a', borderRadius: 8, border: `2px dashed ${TERRACOTTA}40`, display: 'flex', alignItems: 'center' as const, justifyContent: 'center' as const }}>
            <span style={{ fontFamily: mono, fontSize: '0.7rem', color: TERRACOTTA }}>📸 screenshot</span>
          </div>
          <div style={{ position: 'absolute' as const, top: -8, right: -8, width: 20, height: 20, borderRadius: 10, background: TERRACOTTA, display: 'flex', alignItems: 'center' as const, justifyContent: 'center' as const }}>
            <span style={{ color: '#fff', fontSize: '0.6rem' }}>👁</span>
          </div>
        </div>
      </div>
    ),
  },
  playwright: {
    label: 'Playwright',
    color: TEAL,
    leftTitle: 'What you see',
    rightTitle: 'What Playwright reads',
    leftContent: (
      <div style={{ padding: 20, background: '#f8f6f1', borderRadius: 12, height: '100%', display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
        <div style={{ fontFamily: display, fontSize: '1rem', fontWeight: 700, color: INK, textAlign: 'center' as const }}>Welcome back</div>
        <div style={{ background: '#e2dbd2', borderRadius: 6, padding: '8px 12px', fontFamily: display, fontSize: '0.8rem', color: INK_MUTED }}>Email</div>
        <div style={{ background: '#e2dbd2', borderRadius: 6, padding: '8px 12px', fontFamily: display, fontSize: '0.8rem', color: INK_MUTED }}>Password</div>
        <div style={{ background: TEAL, borderRadius: 6, padding: '8px 12px', fontFamily: display, fontSize: '0.8rem', fontWeight: 600, color: '#fff', textAlign: 'center' as const }}>Sign in</div>
      </div>
    ),
    rightContent: (
      <div style={{ padding: 16, background: '#1a1a1a', borderRadius: 12, height: '100%', display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
        <div><span style={{ fontFamily: mono, fontSize: '0.7rem', color: TEAL }}>heading </span><span style={{ fontFamily: mono, fontSize: '0.7rem', color: '#6b8f71' }}>"Welcome back"</span></div>
        <div><span style={{ fontFamily: mono, fontSize: '0.7rem', color: TEAL }}>textbox </span><span style={{ fontFamily: mono, fontSize: '0.7rem', color: '#6b8f71' }}>"Email"</span><span style={{ fontFamily: mono, fontSize: '0.65rem', color: '#e8915a' }}> [ref=e1]</span></div>
        <div><span style={{ fontFamily: mono, fontSize: '0.7rem', color: TEAL }}>textbox </span><span style={{ fontFamily: mono, fontSize: '0.7rem', color: '#6b8f71' }}>"Password"</span><span style={{ fontFamily: mono, fontSize: '0.65rem', color: '#e8915a' }}> [ref=e2]</span></div>
        <div><span style={{ fontFamily: mono, fontSize: '0.7rem', color: TEAL }}>button </span><span style={{ fontFamily: mono, fontSize: '0.7rem', color: '#6b8f71' }}>"Sign in"</span><span style={{ fontFamily: mono, fontSize: '0.65rem', color: '#e8915a' }}> [ref=e3]</span></div>
      </div>
    ),
  },
  devtools: {
    label: 'DevTools',
    color: GREEN,
    leftTitle: 'What looks fine',
    rightTitle: 'What DevTools finds',
    leftContent: (
      <div style={{ padding: 20, background: '#f8f6f1', borderRadius: 12, height: '100%', display: 'flex', flexDirection: 'column' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 8 }}>
        <div style={{ fontFamily: display, fontSize: '1rem', fontWeight: 700, color: INK }}>Dashboard</div>
        <div style={{ fontFamily: display, fontSize: '0.8rem', color: INK_MUTED }}>Page loads. No visible errors.</div>
        <div style={{ fontFamily: display, fontSize: '0.8rem', color: GREEN }}>✓ Looks good</div>
      </div>
    ),
    rightContent: (
      <div style={{ padding: 12, background: '#1e1e1e', borderRadius: 12, height: '100%', display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
        <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#ff5f57' }}>✕ Error: /api/auth 500</div>
        <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#ff5f57' }}>✕ TypeError: Cannot read 'token'</div>
        <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#e8915a' }}>⚠ 3 cookies will be blocked</div>
        <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#6b8f71' }}>✓ Page loaded in 3247ms</div>
        <div style={{ background: '#252526', borderRadius: 4, padding: '4px 8px', marginTop: 4 }}>
          <span style={{ fontFamily: mono, fontSize: '0.6rem', color: INK_MUTED }}>bundle.js </span>
          <span style={{ fontFamily: mono, fontSize: '0.6rem', color: '#e8915a' }}>842 kB</span>
        </div>
      </div>
    ),
  },
};

export default function HowItSees({ tool }: HowItSeesProps) {
  const config = configs[tool];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        margin: '1.5rem 0',
        background: '#ffffff',
        border: `1px solid ${MARBLE}`,
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div style={{ height: 3, background: config.color }} />
      <div style={{ padding: '16px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 40px 1fr',
          gap: 0,
          alignItems: 'stretch',
          minHeight: 160,
        }}>
          <div>
            <div style={{ fontFamily: display, fontSize: '0.7rem', fontWeight: 600, color: INK_MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: 8 }}>
              {config.leftTitle}
            </div>
            {config.leftContent}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.5rem', color: config.color }}>→</span>
          </div>
          <div>
            <div style={{ fontFamily: display, fontSize: '0.7rem', fontWeight: 600, color: config.color, letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: 8 }}>
              {config.rightTitle}
            </div>
            {config.rightContent}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
