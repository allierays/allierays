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

export default function DebugLoop() {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setBroken((b) => !b);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const attempts = [
    { label: 'Fix #1', detail: 'Patch file C' },
    { label: 'Fix #2', detail: 'Undo #1, try file B' },
    { label: 'Fix #3', detail: 'Back to file C' },
    { label: 'Fix #4', detail: 'Same approach again' },
  ];

  return (
    <div style={{
      margin: '2rem 0',
      background: '#ffffff',
      border: `1px solid ${MARBLE}`,
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      <div style={{ height: 3, background: broken ? SAGE : CORAL }} />
      <svg viewBox="0 0 680 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block', padding: '20px 16px 16px' }}>
        <defs>
          <marker id="dl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={CORAL} />
          </marker>
          <marker id="dl-arrow-sage" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={SAGE} />
          </marker>
        </defs>

        {/* Title */}
        <text x={340} y={16} textAnchor="middle" fontFamily={display} fontSize={10} fontWeight={600} fill={NAVY} letterSpacing="0.08em">
          {broken ? 'BREAK THE LOOP' : 'THE LOOP'}
        </text>

        {/* Attempt boxes */}
        {attempts.map((a, i) => {
          const x = 60 + i * 145;
          const y = 45;
          const isActive = !broken;
          const opacity = broken && i > 1 ? 0.25 : broken && i > 0 ? 0.5 : 1;

          return (
            <motion.g key={i} animate={{ opacity }} transition={{ duration: 0.6 }}>
              <rect x={x} y={y} width={110} height={36} rx={5} fill={isActive ? '#fff' : (i === 0 ? '#fff' : BG)} stroke={isActive ? CORAL : MARBLE} strokeWidth={isActive ? 1.2 : 1} />
              <text x={x + 55} y={y + 16} textAnchor="middle" fontFamily={mono} fontSize={10} fontWeight={600} fill={isActive ? CORAL : INK_MUTED}>
                {a.label}
              </text>
              <text x={x + 55} y={y + 29} textAnchor="middle" fontFamily={font} fontSize={9} fill={INK_MUTED}>
                {a.detail}
              </text>

              {/* Arrows between boxes */}
              {i < attempts.length - 1 && !broken && (
                <line x1={x + 110} y1={y + 18} x2={x + 145} y2={y + 18} stroke={CORAL} strokeWidth={1.2} markerEnd="url(#dl-arrow)" />
              )}
            </motion.g>
          );
        })}

        {/* Loop back arrow (only when not broken) */}
        {!broken && (
          <motion.path
            d="M 570,88 Q 580,130 340,130 Q 100,130 95,88"
            fill="none"
            stroke={CORAL}
            strokeWidth={1.2}
            strokeDasharray="5 3"
            markerEnd="url(#dl-arrow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}

        {!broken && (
          <text x={340} y={145} textAnchor="middle" fontFamily={mono} fontSize={9} fill={CORAL}>
            same approach, different order
          </text>
        )}

        {/* Break intervention */}
        {broken && (
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Interrupt line */}
            <line x1={205} y1={45} x2={205} y2={85} stroke={SAGE} strokeWidth={2} />
            <line x1={195} y1={47} x2={215} y2={47} stroke={SAGE} strokeWidth={2} />

            {/* Stop and explain box */}
            <rect x={140} y={100} width={220} height={64} rx={6} fill={SAGE} opacity={0.1} stroke={SAGE} strokeWidth={1.2} />
            <text x={250} y={120} textAnchor="middle" fontFamily={mono} fontSize={10} fontWeight={600} fill={SAGE}>
              "Stop. Explain the root cause."
            </text>
            <text x={250} y={138} textAnchor="middle" fontFamily={font} fontSize={10} fill={INK_MUTED}>
              Claude switches from fixing to diagnosing
            </text>
            <text x={250} y={152} textAnchor="middle" fontFamily={font} fontSize={10} fill={INK_MUTED}>
              → surfaces the real issue
            </text>

            {/* Arrow to resolution */}
            <line x1={360} y1={132} x2={420} y2={132} stroke={SAGE} strokeWidth={1.2} markerEnd="url(#dl-arrow-sage)" />
            <rect x={420} y={114} width={120} height={36} rx={6} fill={SAGE} />
            <text x={480} y={136} textAnchor="middle" fontFamily={mono} fontSize={10} fontWeight={600} fill="#fff">
              Actual fix
            </text>
          </motion.g>
        )}

        {/* Toggle hint */}
        <text x={340} y={190} textAnchor="middle" fontFamily={mono} fontSize={9} fill={INK_MUTED} opacity={0.6}>
          {broken ? 'diagnosing →' : '← looping'}
        </text>
      </svg>
    </div>
  );
}
