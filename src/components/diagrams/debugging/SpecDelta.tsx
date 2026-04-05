import { motion } from 'motion/react';

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

export default function SpecDelta() {
  const specItems = [
    { label: 'Token refresh', done: true },
    { label: 'Error handling', done: false },
    { label: 'Session expiry', done: true },
    { label: 'Rate limiting', done: false },
    { label: 'Retry logic', done: true },
  ];

  return (
    <div style={{
      margin: '2rem 0',
      background: '#ffffff',
      border: `1px solid ${MARBLE}`,
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${TEAL}, ${SAGE})` }} />
      <svg viewBox="0 0 680 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block', padding: '16px 16px 12px' }}>
        <defs>
          <marker id="sd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={NAVY} />
          </marker>
        </defs>

        <text x={340} y={18} textAnchor="middle" fontFamily={display} fontSize={10} fontWeight={600} fill={NAVY} letterSpacing="0.08em">
          SPEC → DELTA → FIX
        </text>

        {/* Spec column */}
        <rect x={40} y={38} width={190} height={145} rx={6} fill={BG} stroke={TEAL} strokeWidth={1.2} />
        <rect x={40} y={38} width={190} height={4} rx={2} fill={TEAL} />
        <text x={135} y={62} textAnchor="middle" fontFamily={mono} fontSize={11} fontWeight={600} fill={TEAL}>
          The Spec
        </text>
        <text x={135} y={78} textAnchor="middle" fontFamily={font} fontSize={9.5} fill={INK_MUTED} fontStyle="italic">
          How it should work
        </text>

        {specItems.map((item, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
          >
            <text x={62} y={102 + i * 18} fontFamily={mono} fontSize={10} fill={INK_MUTED}>
              {item.done ? '✓' : '○'}
            </text>
            <text x={80} y={102 + i * 18} fontFamily={font} fontSize={10.5} fill={item.done ? INK_MUTED : INK} fontWeight={item.done ? 400 : 500}>
              {item.label}
            </text>
          </motion.g>
        ))}

        {/* Arrow: spec → delta */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <line x1={230} y1={110} x2={270} y2={110} stroke={NAVY} strokeWidth={1.2} markerEnd="url(#sd-arrow)" />
          <text x={250} y={100} textAnchor="middle" fontFamily={mono} fontSize={8} fill={INK_MUTED}>compare</text>
        </motion.g>

        {/* Delta column */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <rect x={270} y={38} width={170} height={145} rx={6} fill={BG} stroke={CORAL} strokeWidth={1.2} />
          <rect x={270} y={38} width={170} height={4} rx={2} fill={CORAL} />
          <text x={355} y={62} textAnchor="middle" fontFamily={mono} fontSize={11} fontWeight={600} fill={CORAL}>
            The Delta
          </text>
          <text x={355} y={78} textAnchor="middle" fontFamily={font} fontSize={9.5} fill={INK_MUTED} fontStyle="italic">
            What's wrong
          </text>

          {specItems.filter(s => !s.done).map((item, i) => (
            <g key={i}>
              <rect x={285} y={88 + i * 30} width={140} height={22} rx={4} fill={CORAL} opacity={0.08} stroke={CORAL} strokeWidth={0.8} />
              <text x={355} y={103 + i * 30} textAnchor="middle" fontFamily={mono} fontSize={10} fill={CORAL} fontWeight={500}>
                {item.label}
              </text>
            </g>
          ))}

          <text x={355} y={160} textAnchor="middle" fontFamily={font} fontSize={9.5} fill={INK_MUTED}>
            Only 2 things to fix
          </text>
        </motion.g>

        {/* Arrow: delta → fix */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <line x1={440} y1={110} x2={480} y2={110} stroke={NAVY} strokeWidth={1.2} markerEnd="url(#sd-arrow)" />
          <text x={460} y={100} textAnchor="middle" fontFamily={mono} fontSize={8} fill={INK_MUTED}>fix only</text>
        </motion.g>

        {/* Fix column */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <rect x={480} y={38} width={170} height={145} rx={6} fill={BG} stroke={SAGE} strokeWidth={1.2} />
          <rect x={480} y={38} width={170} height={4} rx={2} fill={SAGE} />
          <text x={565} y={62} textAnchor="middle" fontFamily={mono} fontSize={11} fontWeight={600} fill={SAGE}>
            Targeted Fix
          </text>
          <text x={565} y={78} textAnchor="middle" fontFamily={font} fontSize={9.5} fill={INK_MUTED} fontStyle="italic">
            Close the gap
          </text>

          {specItems.map((item, i) => (
            <text key={i} x={565} y={102 + i * 18} textAnchor="middle" fontFamily={mono} fontSize={10} fill={SAGE}>
              ✓ {item.label}
            </text>
          ))}
        </motion.g>
      </svg>
    </div>
  );
}
