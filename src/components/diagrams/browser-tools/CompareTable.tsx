import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

const TERRACOTTA = '#c4785a';
const TEAL = '#5a8a8a';
const GREEN = '#3d7a45';
const INK = '#1a1a1a';
const INK_MUTED = '#8a867a';
const MARBLE = '#e2e0db';
const BG_WARM = '#f5f2ed';
const BG_WHITE = '#ffffff';

const display = "'Chiron Go Round TC', system-ui, sans-serif";
const mono = "'JetBrains Mono', monospace";

const rows = [
  {
    label: 'Why',
    values: [
      { text: 'For seeing', color: TERRACOTTA },
      { text: 'For doing', color: TEAL },
      { text: 'For debugging', color: GREEN },
    ],
  },
  {
    label: 'What is it',
    values: [
      { text: 'Claude sees your screen' },
      { text: 'Claude clicks and types for you' },
      { text: 'Claude reads error messages from the browser' },
    ],
  },
  {
    label: 'How it sees',
    values: [
      { text: 'Screenshots', bold: true },
      { text: 'Page code', bold: true },
      { text: 'Console & network', bold: true },
    ],
  },
  {
    label: 'Token cost',
    values: [
      { text: 'Higher', badge: true, color: '#b85c5c' },
      { text: 'Lower', badge: true, color: GREEN },
      { text: 'Lower', badge: true, color: GREEN },
    ],
  },
  {
    label: 'Use when',
    values: [
      { text: 'You need Claude to see the page', color: TERRACOTTA },
      { text: 'You want to automate browser tasks', color: TEAL },
      { text: 'You need to find what\'s broken', color: GREEN },
    ],
  },
  {
    label: 'Say this',
    values: [
      { text: '"fill out the form in Chrome"', code: true },
      { text: '"write a Playwright script"', code: true },
      { text: '"check the console logs"', code: true },
    ],
  },
];

export default function CompareTable() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return (
      <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { name: 'Claude in Chrome', color: TERRACOTTA, icon: '👁', why: 'For seeing' },
          { name: 'Playwright', color: TEAL, icon: '🎭', why: 'For doing' },
          { name: 'DevTools', color: GREEN, icon: '🔧', why: 'For debugging' },
        ].map((tool, ti) => (
          <div key={tool.name} style={{
            background: BG_WHITE,
            border: `1px solid ${MARBLE}`,
            borderLeft: `4px solid ${tool.color}`,
            borderRadius: 8,
            padding: '16px 20px',
          }}>
            <div style={{ fontFamily: display, fontSize: '1rem', fontWeight: 700, color: INK, marginBottom: 4 }}>{tool.name}</div>
            <div style={{ fontFamily: display, fontSize: '0.85rem', fontWeight: 700, color: tool.color, marginBottom: 8 }}>{tool.why}</div>
            {rows.slice(1).map((row, ri) => (
              <div key={row.label} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: display, fontSize: '0.75rem', color: INK_MUTED, minWidth: 80 }}>{row.label}:</span>
                <span style={{ fontFamily: display, fontSize: '0.75rem', color: INK }}>{row.values[ti].text}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        margin: '2rem 0',
        background: BG_WHITE,
        border: `1px solid ${MARBLE}`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '140px 1fr 1fr 1fr',
        background: BG_WARM,
        borderBottom: `1px solid ${MARBLE}`,
      }}>
        <div />
        {[
          { name: 'Claude in Chrome', icon: '/images/5-techniques-debug-claude-code.svg', useClaudeIcon: true, color: TERRACOTTA },
          { name: 'Playwright', icon: '/images/Playwright_Logo.svg.png', color: TEAL },
          { name: 'DevTools', icon: '/images/chrome-devtools.jpeg', color: GREEN },
        ].map((tool) => (
          <div key={tool.name} style={{
            textAlign: 'center',
            padding: '16px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            borderLeft: `1px solid ${MARBLE}`,
          }}>
            {tool.useClaudeIcon ? (
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4L18 13L27 11L20 16L27 21L18 19L16 28L14 19L5 21L12 16L5 11L14 13Z" fill={tool.color} />
              </svg>
            ) : (
              <img src={tool.icon} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
            )}
            <div style={{ fontFamily: display, fontSize: '0.8rem', fontWeight: 700, color: INK }}>{tool.name}</div>
          </div>
        ))}
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <div
          key={row.label}
          style={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr 1fr 1fr',
            background: i % 2 === 0 ? BG_WHITE : BG_WARM,
            borderBottom: i < rows.length - 1 ? `1px solid ${MARBLE}` : 'none',
          }}
        >
          <div style={{
            padding: '12px 16px',
            fontFamily: display,
            fontSize: '0.8rem',
            fontWeight: 700,
            color: INK,
            display: 'flex',
            alignItems: 'center',
          }}>
            {row.label}
          </div>
          {row.values.map((val, vi) => (
            <div key={vi} style={{
              padding: '12px 12px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderLeft: `1px solid ${MARBLE}`,
            }}>
              {val.badge ? (
                <span style={{
                  fontFamily: display,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: val.color,
                  background: `${val.color}15`,
                  padding: '4px 14px',
                  borderRadius: 12,
                }}>
                  {val.text}
                </span>
              ) : val.code ? (
                <span style={{
                  fontFamily: mono,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: INK,
                  background: '#eae5dd',
                  padding: '6px 10px',
                  borderRadius: 6,
                  lineHeight: 1.3,
                }}>
                  {val.text}
                </span>
              ) : (
                <span style={{
                  fontFamily: display,
                  fontSize: val.bold ? '0.85rem' : '0.8rem',
                  fontWeight: val.color ? 700 : (val.bold ? 700 : 500),
                  color: val.color || INK,
                  lineHeight: 1.3,
                }}>
                  {val.text}
                </span>
              )}
            </div>
          ))}
        </div>
      ))}
    </motion.div>
  );
}
