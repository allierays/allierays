import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

const NAVY = '#2d4059';
const CORAL = '#e07a5f';
const SAGE = '#7a9a6d';
const INK_MUTED = '#8a867a';
const MARBLE = '#e2e0db';

const mono = "'JetBrains Mono', monospace";
const font = "'Source Serif 4', Georgia, serif";
const display = "'Chiron Go Round TC', system-ui, sans-serif";

export default function DebugLoop() {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setBroken((b) => !b);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        margin: '0 0 2rem',
        background: '#ffffff',
        border: `1px solid ${MARBLE}`,
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={() => setBroken((b) => !b)}
    >
      <div style={{ height: 3, background: broken ? SAGE : CORAL }} />
      <svg viewBox="0 0 600 160" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block', padding: '16px 16px 8px' }}>

        {/* Fix mode */}
        {!broken && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <text x={300} y={18} textAnchor="middle" fontFamily={display} fontSize={10} fontWeight={600} fill={NAVY} letterSpacing="0.08em">
              FIX MODE
            </text>

            {/* Circular loop */}
            <circle cx={200} cy={85} r={40} fill="none" stroke={CORAL} strokeWidth={1.5} strokeDasharray="6 4" opacity={0.5} />
            <text x={200} y={82} textAnchor="middle" fontFamily={mono} fontSize={11} fontWeight={600} fill={CORAL}>fix</text>
            <text x={200} y={96} textAnchor="middle" fontFamily={mono} fontSize={11} fontWeight={600} fill={CORAL}>fail</text>
            <text x={200} y={110} textAnchor="middle" fontFamily={mono} fontSize={11} fontWeight={600} fill={CORAL}>repeat</text>

            {/* Arrow labels */}
            <text x={400} y={72} textAnchor="middle" fontFamily={font} fontSize={12} fill={INK_MUTED}>
              You say "fix this"
            </text>
            <text x={400} y={92} textAnchor="middle" fontFamily={font} fontSize={12} fill={INK_MUTED}>
              Claude keeps fixing
            </text>
            <text x={400} y={112} textAnchor="middle" fontFamily={font} fontSize={12} fill={CORAL} fontWeight={600}>
              Same file. Same approach.
            </text>

            <text x={300} y={150} textAnchor="middle" fontFamily={mono} fontSize={8} fill={INK_MUTED} opacity={0.5}>
              click to break the loop
            </text>
          </motion.g>
        )}

        {/* Explain mode */}
        {broken && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <text x={300} y={18} textAnchor="middle" fontFamily={display} fontSize={10} fontWeight={600} fill={NAVY} letterSpacing="0.08em">
              EXPLAIN MODE
            </text>

            {/* Straight arrow */}
            <line x1={160} y1={85} x2={240} y2={85} stroke={SAGE} strokeWidth={2} />
            <polygon points="240,80 250,85 240,90" fill={SAGE} />

            <text x={140} y={82} textAnchor="middle" fontFamily={mono} fontSize={11} fontWeight={600} fill={SAGE}>stop</text>
            <text x={140} y={96} textAnchor="middle" fontFamily={mono} fontSize={11} fill={INK_MUTED}>think</text>

            <rect x={260} y={68} width={120} height={34} rx={6} fill={SAGE} opacity={0.1} stroke={SAGE} strokeWidth={1.2} />
            <text x={320} y={90} textAnchor="middle" fontFamily={mono} fontSize={11} fontWeight={600} fill={SAGE}>
              root cause
            </text>

            <text x={460} y={72} textAnchor="middle" fontFamily={font} fontSize={12} fill={INK_MUTED}>
              You say "explain why"
            </text>
            <text x={460} y={92} textAnchor="middle" fontFamily={font} fontSize={12} fill={INK_MUTED}>
              Claude starts reasoning
            </text>
            <text x={460} y={112} textAnchor="middle" fontFamily={font} fontSize={12} fill={SAGE} fontWeight={600}>
              Different question. Different answer.
            </text>

            <text x={300} y={150} textAnchor="middle" fontFamily={mono} fontSize={8} fill={INK_MUTED} opacity={0.5}>
              click to see the loop
            </text>
          </motion.g>
        )}
      </svg>
    </div>
  );
}
