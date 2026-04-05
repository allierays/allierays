import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

const NAVY = '#2d4059';
const TEAL = '#5b9ea6';
const CORAL = '#e07a5f';
const INK = '#1a1915';
const INK_MUTED = '#8a867a';
const MARBLE = '#e2e0db';
const BG = '#fafaf7';

const mono = "'JetBrains Mono', monospace";
const display = "'Chiron Go Round TC', system-ui, sans-serif";

const channels = [
  {
    label: 'Terminal',
    color: NAVY,
    icon: '>_',
    example: 'Error output, test failures, logs',
    when: 'Backend, CLI, build errors',
  },
  {
    label: 'Screenshot',
    color: TEAL,
    icon: '⊡',
    example: 'Ctrl+V a screenshot into the prompt',
    when: 'UI bugs, layout issues',
  },
  {
    label: 'Claude in Chrome',
    color: CORAL,
    icon: '▷',
    example: 'claude --chrome reads the browser directly',
    when: 'Console errors, network, visual bugs',
  },
];

export default function EvidenceChain() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div style={{
      margin: '2rem 0',
      background: '#ffffff',
      border: `1px solid ${MARBLE}`,
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${NAVY}, ${TEAL}, ${CORAL})` }} />
      <div style={{ padding: '20px 24px 24px' }}>
        <div style={{
          fontFamily: display,
          fontSize: '0.75rem',
          fontWeight: 600,
          color: NAVY,
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          textAlign: 'center' as const,
          marginBottom: 16,
        }}>
          Three Ways to Feed Evidence
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 16,
        }}>
          {channels.map((ch, i) => (
            <motion.div
              key={ch.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              style={{
                background: BG,
                border: `1px solid ${MARBLE}`,
                borderRadius: 6,
                overflow: 'hidden',
              }}
            >
              {/* Color bar */}
              <div style={{ height: 4, background: ch.color, opacity: 0.6 }} />

              <div style={{ padding: '16px 16px 18px' }}>
                {/* Icon + Label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: `${ch.color}1a`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: mono,
                    fontSize: 12,
                    fontWeight: 700,
                    color: ch.color,
                    flexShrink: 0,
                  }}>
                    {ch.icon}
                  </div>
                  <div style={{
                    fontFamily: mono,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: ch.color,
                  }}>
                    {ch.label}
                  </div>
                </div>

                {/* Example */}
                <div style={{
                  fontFamily: display,
                  fontSize: '0.875rem',
                  color: INK,
                  lineHeight: 1.5,
                  marginBottom: 12,
                }}>
                  {ch.example}
                </div>

                {/* When to use */}
                <div style={{
                  fontFamily: mono,
                  fontSize: '0.6875rem',
                  color: INK_MUTED,
                  lineHeight: 1.4,
                }}>
                  Best for:
                </div>
                <div style={{
                  fontFamily: display,
                  fontSize: '0.8125rem',
                  color: INK_MUTED,
                  lineHeight: 1.4,
                }}>
                  {ch.when}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
