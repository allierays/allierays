import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

const NAVY = '#2d4059';
const TEAL = '#5b9ea6';
const CORAL = '#e07a5f';
const SAGE = '#7a9a6d';
const INK = '#1a1915';
const INK_MUTED = '#8a867a';
const MARBLE = '#e2e0db';

const mono = "'JetBrains Mono', monospace";
const display = "'Chiron Go Round TC', system-ui, sans-serif";

const techniques = [
  { num: '1', name: 'Feed Claude the Evidence', desc: 'Terminal, screenshots, Chrome', color: TEAL },
  { num: '2', name: 'Build a Source of Truth File', desc: 'Persistent context that survives', color: CORAL },
  { num: '3', name: 'Stop and Explain', desc: 'Diagnose, don\'t fix', color: NAVY },
  { num: '4', name: 'Look at It Holistically', desc: 'Zoom out from the stack trace', color: SAGE },
  { num: '5', name: 'Spec, Then Delta', desc: 'Define right, close the gap', color: CORAL },
  { num: '6', name: 'Write Tests First', desc: 'Encode intent before code', color: SAGE },
  { num: '7', name: 'Fresh Eyes', desc: 'Separate writer and reviewer', color: TEAL },
  { num: '8', name: 'Plan Before You Act', desc: 'Agree on approach, then execute', color: NAVY },
];

export default function TechniqueMap() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div style={{
      margin: '2.5rem 0',
      background: '#ffffff',
      border: `1px solid ${MARBLE}`,
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${NAVY}, ${SAGE}, ${TEAL}, ${CORAL})` }} />
      <div style={{ padding: '20px 24px 24px' }}>
        <div style={{
          fontFamily: display,
          fontSize: '0.75rem',
          fontWeight: 600,
          color: NAVY,
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          marginBottom: 16,
          textAlign: 'center' as const,
        }}>
          Eight Techniques to Debug Claude Code
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: 12,
        }}>
          {techniques.map((t, i) => (
            <motion.a
              key={t.num}
              href={`#${t.num}-${t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '14px 16px',
                borderRadius: 6,
                border: `1px solid ${MARBLE}`,
                background: '#fafaf7',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              whileHover={{
                borderColor: t.color,
                boxShadow: `0 2px 8px ${t.color}18`,
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: t.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: mono,
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}>
                {t.num}
              </div>
              <div>
                <div style={{
                  fontFamily: display,
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: INK,
                  lineHeight: 1.3,
                  marginBottom: 3,
                }}>
                  {t.name}
                </div>
                <div style={{
                  fontFamily: display,
                  fontSize: '0.8125rem',
                  color: INK_MUTED,
                  lineHeight: 1.4,
                }}>
                  {t.desc}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
