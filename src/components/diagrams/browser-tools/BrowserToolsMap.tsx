import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

const TERRACOTTA = '#c4785a';
const TEAL = '#5a8a8a';
const GREEN = '#3d7a45';
const INK = '#1a1a1a';
const INK_MUTED = '#8a867a';
const MARBLE = '#e2e0db';

const display = "'Chiron Go Round TC', system-ui, sans-serif";
const mono = "'JetBrains Mono', monospace";

const tools = [
  {
    name: 'Claude in Chrome',
    icon: '/images/5-techniques-debug-claude-code.svg',
    useClaudeIcon: true,
    color: TERRACOTTA,
    what: 'Claude sees your screen',
    how: 'Screenshots',
    cost: 'Higher',
    costColor: '#b85c5c',
    when: 'You need Claude to see the page',
    anchor: '1-claude-in-chrome',
  },
  {
    name: 'Playwright',
    icon: '/images/Playwright_Logo.svg.png',
    color: TEAL,
    what: 'Claude clicks and types for you',
    how: 'Page structure (text)',
    cost: 'Lower',
    costColor: GREEN,
    when: 'You want to automate browser tasks',
    anchor: '2-playwright-mcp',
  },
  {
    name: 'DevTools',
    icon: '/images/chrome-devtools.jpeg',
    color: GREEN,
    what: 'Claude reads error messages',
    how: 'Console, network, perf',
    cost: 'Lower',
    costColor: GREEN,
    when: 'You need to find what\'s broken',
    anchor: '3-chrome-devtools-mcp',
  },
];

export default function BrowserToolsMap() {
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
      <div style={{ height: 3, background: `linear-gradient(90deg, ${TERRACOTTA}, ${TEAL}, ${GREEN})` }} />
      <div style={{ padding: '20px 24px 24px' }}>
        <div style={{
          fontFamily: display,
          fontSize: '0.75rem',
          fontWeight: 600,
          color: INK,
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          marginBottom: 16,
          textAlign: 'center' as const,
        }}>
          Three Browser Tools for Claude Code
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 12,
        }}>
          {tools.map((t, i) => (
            <motion.a
              key={t.name}
              href={`#${t.anchor}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                padding: '18px 16px',
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
              <img
                src={t.useClaudeIcon ? undefined : t.icon}
                alt=""
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  objectFit: 'cover',
                  display: t.useClaudeIcon ? 'none' : 'block',
                }}
              />
              {t.useClaudeIcon && (
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: '#f5f2ed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                    <path d="M16 4L18 13L27 11L20 16L27 21L18 19L16 28L14 19L5 21L12 16L5 11L14 13Z" fill={TERRACOTTA} />
                  </svg>
                </div>
              )}
              <div style={{
                fontFamily: display,
                fontSize: '1rem',
                fontWeight: 700,
                color: INK,
                lineHeight: 1.3,
                textAlign: 'center',
              }}>
                {t.name}
              </div>
              <div style={{
                fontFamily: display,
                fontSize: '0.8125rem',
                color: INK_MUTED,
                lineHeight: 1.4,
                textAlign: 'center',
              }}>
                {t.what}
              </div>
              <div style={{
                fontFamily: mono,
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: t.costColor,
                background: `${t.costColor}15`,
                padding: '3px 10px',
                borderRadius: 10,
              }}>
                {t.cost} tokens
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
