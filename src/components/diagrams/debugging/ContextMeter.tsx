import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

const NAVY = '#2d4059';
const TEAL = '#5b9ea6';
const CORAL = '#e07a5f';
const SAGE = '#7a9a6d';
const INK = '#1a1915';
const INK_MUTED = '#8a867a';
const MARBLE = '#e2e0db';
const BG = '#fafaf7';

const mono = "'JetBrains Mono', monospace";
const font = "'Source Serif 4', Georgia, serif";
const display = "'Chiron Go Round TC', system-ui, sans-serif";

export default function ContextMeter() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => (p + 1) % 4);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const stages = [
    { fill: 0.15, quality: 0.95, label: 'Fresh session', qualityLabel: 'Sharp', fillColor: SAGE },
    { fill: 0.40, quality: 0.82, label: '40% context used', qualityLabel: 'Subtle drift', fillColor: TEAL },
    { fill: 0.70, quality: 0.55, label: '70% context used', qualityLabel: 'Looping starts', fillColor: CORAL },
    { fill: 0.92, quality: 0.25, label: 'Near limit', qualityLabel: 'Guessing', fillColor: '#c0392b' },
  ];

  const stage = stages[phase];

  const barW = 480;
  const barH = 28;
  const barX = 120;
  const barY = 60;

  const qualityY = 130;
  const qualityH = 6;

  return (
    <div style={{
      margin: '2.5rem 0',
      background: '#ffffff',
      border: `1px solid ${MARBLE}`,
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${SAGE}, ${TEAL}, ${CORAL})` }} />
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{
          fontFamily: display,
          fontSize: '0.75rem',
          fontWeight: 600,
          color: NAVY,
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          marginBottom: 4,
          textAlign: 'center' as const,
        }}>
          The Meta-Pattern
        </div>
        <div style={{
          fontFamily: font,
          fontSize: '0.9375rem',
          color: INK_MUTED,
          textAlign: 'center' as const,
          fontStyle: 'italic',
          marginBottom: 8,
        }}>
          When Claude fails, the problem is context, not intelligence.
        </div>
      </div>
      <svg viewBox="0 0 720 185" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block', padding: '0 16px 16px' }}>

        {/* Context window bar */}
        <text x={barX - 8} y={barY + barH / 2 + 4} textAnchor="end" fontFamily={mono} fontSize={10} fill={INK_MUTED}>
          Context
        </text>

        {/* Bar background */}
        <rect x={barX} y={barY} width={barW} height={barH} rx={4} fill={BG} stroke={MARBLE} strokeWidth={1} />

        {/* Bar fill */}
        <motion.rect
          x={barX}
          y={barY}
          height={barH}
          rx={4}
          fill={stage.fillColor}
          initial={false}
          animate={{ width: barW * stage.fill, opacity: 0.7 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />

        {/* Percentage */}
        <motion.text
          x={barX + barW + 12}
          y={barY + barH / 2 + 4}
          fontFamily={mono}
          fontSize={11}
          fontWeight={600}
          fill={stage.fillColor}
          initial={false}
          animate={{ fill: stage.fillColor }}
          transition={{ duration: 0.6 }}
        >
          {Math.round(stage.fill * 100)}%
        </motion.text>

        {/* Stage label */}
        <motion.text
          key={phase}
          x={barX + barW / 2}
          y={barY - 10}
          textAnchor="middle"
          fontFamily={font}
          fontSize={11.5}
          fill={INK}
          fontWeight={500}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {stage.label}
        </motion.text>

        {/* Quality section */}
        <text x={barX - 8} y={qualityY + 4} textAnchor="end" fontFamily={mono} fontSize={10} fill={INK_MUTED}>
          Quality
        </text>

        {/* Quality track */}
        <rect x={barX} y={qualityY} width={barW} height={qualityH} rx={3} fill={BG} stroke={MARBLE} strokeWidth={1} />

        {/* Quality fill */}
        <motion.rect
          x={barX}
          y={qualityY}
          height={qualityH}
          rx={3}
          fill={NAVY}
          initial={false}
          animate={{ width: barW * stage.quality, opacity: 0.8 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />

        {/* Quality label */}
        <motion.text
          key={`q-${phase}`}
          x={barX + barW + 12}
          y={qualityY + 5}
          fontFamily={mono}
          fontSize={11}
          fontWeight={600}
          fill={NAVY}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {stage.qualityLabel}
        </motion.text>

        {/* Dots indicator */}
        {stages.map((_, i) => (
          <circle
            key={i}
            cx={barX + barW / 2 - 24 + i * 16}
            cy={165}
            r={3.5}
            fill={i === phase ? NAVY : MARBLE}
            style={{ transition: 'fill 0.3s ease' }}
          />
        ))}
      </svg>
    </div>
  );
}
