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

export default function WriterReviewer() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { writerLabel: 'Writing code...', reviewerLabel: 'Waiting', arrowVisible: false, resultVisible: false },
    { writerLabel: 'Done → diff', reviewerLabel: 'Reviewing diff...', arrowVisible: true, resultVisible: false },
    { writerLabel: 'Done → diff', reviewerLabel: 'Found issue ✓', arrowVisible: true, resultVisible: true },
  ];

  const s = steps[step];

  return (
    <div style={{
      margin: '2rem 0',
      background: '#ffffff',
      border: `1px solid ${MARBLE}`,
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${TEAL}, ${CORAL})` }} />
      <svg viewBox="0 0 680 175" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block', padding: '16px 16px 12px' }}>
        <defs>
          <marker id="wr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={NAVY} />
          </marker>
        </defs>

        <text x={340} y={18} textAnchor="middle" fontFamily={display} fontSize={10} fontWeight={600} fill={NAVY} letterSpacing="0.08em">
          WRITER / REVIEWER PATTERN
        </text>

        {/* Session 1: Writer */}
        <rect x={40} y={40} width={240} height={100} rx={6} fill={BG} stroke={TEAL} strokeWidth={1.2} />
        <rect x={40} y={40} width={240} height={4} rx={2} fill={TEAL} />

        <text x={60} y={66} fontFamily={mono} fontSize={11} fontWeight={600} fill={TEAL}>Session 1: Writer</text>
        <text x={60} y={86} fontFamily={font} fontSize={10} fill={INK_MUTED}>Full context, accumulated state</text>
        <text x={60} y={102} fontFamily={font} fontSize={10} fill={INK_MUTED}>Deep in the problem</text>

        <motion.text
          key={`w-${step}`}
          x={60}
          y={124}
          fontFamily={mono}
          fontSize={10}
          fill={INK}
          fontWeight={500}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {s.writerLabel}
        </motion.text>

        {/* Arrow */}
        <motion.g animate={{ opacity: s.arrowVisible ? 1 : 0.15 }} transition={{ duration: 0.5 }}>
          <line x1={280} y1={90} x2={390} y2={90} stroke={NAVY} strokeWidth={1.2} strokeDasharray={s.arrowVisible ? '0' : '5 3'} markerEnd="url(#wr-arrow)" />
          <text x={335} y={82} textAnchor="middle" fontFamily={mono} fontSize={9} fill={INK_MUTED}>diff</text>
        </motion.g>

        {/* Session 2: Reviewer */}
        <rect x={400} y={40} width={240} height={100} rx={6} fill={BG} stroke={CORAL} strokeWidth={1.2} />
        <rect x={400} y={40} width={240} height={4} rx={2} fill={CORAL} />

        <text x={420} y={66} fontFamily={mono} fontSize={11} fontWeight={600} fill={CORAL}>Session 2: Reviewer</text>
        <text x={420} y={86} fontFamily={font} fontSize={10} fill={INK_MUTED}>Fresh context, no assumptions</text>
        <text x={420} y={102} fontFamily={font} fontSize={10} fill={INK_MUTED}>Sees only the changes</text>

        <motion.text
          key={`r-${step}`}
          x={420}
          y={124}
          fontFamily={mono}
          fontSize={10}
          fill={step === 2 ? SAGE : INK}
          fontWeight={500}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {s.reviewerLabel}
        </motion.text>

        {/* Result callout */}
        {s.resultVisible && (
          <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <rect x={400} y={148} width={240} height={20} rx={4} fill={SAGE} opacity={0.1} />
            <text x={520} y={162} textAnchor="middle" fontFamily={font} fontSize={10} fill={SAGE} fontWeight={500}>
              No confirmation bias. Catches blind spots.
            </text>
          </motion.g>
        )}

        {/* Step dots */}
        {steps.map((_, i) => (
          <circle
            key={i}
            cx={328 + i * 14}
            cy={165}
            r={3}
            fill={i === step ? NAVY : MARBLE}
            style={{ transition: 'fill 0.3s ease' }}
          />
        ))}
      </svg>
    </div>
  );
}
