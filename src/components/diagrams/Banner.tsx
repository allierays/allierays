const NAVY = '#2d4059';
const TEAL = '#5b9ea6';
const CORAL = '#e07a5f';
const SAGE = '#7a9a6d';
const INK_MUTED = '#8a867a';
const MARBLE = '#e2e0db';
const BG = '#fafaf7';

const mono = "'JetBrains Mono', monospace";
const font = "'Source Serif 4', Georgia, serif";
const display = "'Chiron Go Round TC', system-ui, sans-serif";

function Box({ x, y, w, h, label, fill = '#fff', stroke = MARBLE, textColor = NAVY, fontSize = 9.5 }: any) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={fill} stroke={stroke} strokeWidth={1.2} />
      <text x={x + w / 2} y={y + h / 2 + 3} textAnchor="middle" fontFamily={mono} fontSize={fontSize} fill={textColor} fontWeight={500}>{label}</text>
    </g>
  );
}

function CurvedArrow({ path, color = MARBLE }: any) {
  return <path d={path} fill="none" stroke={color} strokeWidth={1.2} markerEnd={`url(#a-${color.replace('#', '')})`} />;
}

export default function Banner() {
  return (
    <svg viewBox="0 0 1200 280" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="1200" height="280" fill={BG} />

      <defs>
        {[NAVY, TEAL, CORAL, SAGE, MARBLE].map((c) => (
          <marker key={c} id={`a-${c.replace('#', '')}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
          </marker>
        ))}
      </defs>

      {/* Dividers */}
      {[300, 600, 900].map((x) => (
        <line key={x} x1={x} y1={35} x2={x} y2={245} stroke={MARBLE} strokeWidth={1} strokeDasharray="4 4" />
      ))}

      {/* ═══ 1. WORKFLOW ═══ */}
      <text x={150} y={50} textAnchor="middle" fontFamily={display} fontSize={10} fill={NAVY} fontWeight={600} letterSpacing="0.08em">WORKFLOW</text>
      <text x={150} y={64} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED} fontStyle="italic">Predefined path</text>

      <Box x={40} y={90} w={55} h={24} label="Input" fill={NAVY} stroke={NAVY} textColor="#fff" />
      <line x1={95} y1={102} x2={110} y2={102} stroke={NAVY} strokeWidth={1.2} markerEnd={`url(#a-${NAVY.slice(1)})`} />
      <Box x={110} y={90} w={55} h={24} label="Step 1" />
      <line x1={165} y1={102} x2={180} y2={102} stroke={NAVY} strokeWidth={1.2} markerEnd={`url(#a-${NAVY.slice(1)})`} />
      <Box x={180} y={90} w={55} h={24} label="Step 2" />
      <line x1={235} y1={102} x2={250} y2={102} stroke={NAVY} strokeWidth={1.2} markerEnd={`url(#a-${NAVY.slice(1)})`} />
      <Box x={250} y={90} w={55} h={24} label="Output" fill={NAVY} stroke={NAVY} textColor="#fff" />

      <text x={150} y={145} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED}>Every step predetermined.</text>
      <text x={150} y={158} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED}>Predictable. Debuggable. Cheap.</text>

      {/* ═══ 2. AGENTIC WORKFLOW ═══ */}
      <text x={450} y={50} textAnchor="middle" fontFamily={display} fontSize={10} fill={SAGE} fontWeight={600} letterSpacing="0.08em">AGENTIC WORKFLOW</text>
      <text x={450} y={64} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED} fontStyle="italic">Structured + AI decisions</text>

      <Box x={340} y={90} w={52} h={24} label="Input" fill={SAGE} stroke={SAGE} textColor="#fff" />
      <line x1={392} y1={102} x2={407} y2={102} stroke={SAGE} strokeWidth={1.2} markerEnd={`url(#a-${SAGE.slice(1)})`} />
      <Box x={407} y={90} w={52} h={24} label="Plan" />
      <line x1={459} y1={102} x2={474} y2={102} stroke={SAGE} strokeWidth={1.2} markerEnd={`url(#a-${SAGE.slice(1)})`} />
      <Box x={474} y={90} w={52} h={24} label="Execute" />
      <line x1={526} y1={102} x2={541} y2={102} stroke={SAGE} strokeWidth={1.2} markerEnd={`url(#a-${SAGE.slice(1)})`} />
      <Box x={541} y={90} w={52} h={24} label="Reflect" />

      {/* Loop back */}
      <path d="M 567,114 Q 567,140 500,140 Q 433,140 433,118" fill="none" stroke={SAGE} strokeWidth={1.2} strokeDasharray="4 3" markerEnd={`url(#a-${SAGE.slice(1)})`} />
      <text x={500} y={153} textAnchor="middle" fontFamily={mono} fontSize={7} fill={SAGE}>retry if needed</text>

      <text x={450} y={185} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED}>AI decides within a structure.</text>
      <text x={450} y={198} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED}>Best of both worlds.</text>

      {/* ═══ 3. AGENT ═══ */}
      <text x={750} y={50} textAnchor="middle" fontFamily={display} fontSize={10} fill={TEAL} fontWeight={600} letterSpacing="0.08em">AGENT</text>
      <text x={750} y={64} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED} fontStyle="italic">Dynamic decisions</text>

      <Box x={655} y={90} w={52} h={24} label="Query" fill={TEAL} stroke={TEAL} textColor="#fff" />
      <line x1={707} y1={102} x2={722} y2={102} stroke={TEAL} strokeWidth={1.2} markerEnd={`url(#a-${TEAL.slice(1)})`} />

      {/* LLM diamond */}
      <polygon points="750,85 778,102 750,119 722,102" fill="#fff" stroke={TEAL} strokeWidth={1.2} />
      <text x={750} y={106} textAnchor="middle" fontFamily={mono} fontSize={8.5} fill={TEAL} fontWeight={600}>LLM</text>

      <CurvedArrow path="M 778,95 Q 800,82 810,82" color={TEAL} />
      <Box x={810} y={70} w={52} h={22} label="Tool A" fontSize={8.5} />
      <line x1={778} y1={102} x2={810} y2={102} stroke={TEAL} strokeWidth={1.2} markerEnd={`url(#a-${TEAL.slice(1)})`} />
      <Box x={810} y={92} w={52} h={22} label="Tool B" fontSize={8.5} />
      <CurvedArrow path="M 778,109 Q 800,122 810,122" color={TEAL} />
      <Box x={810} y={112} w={52} h={22} label="Tool C" fontSize={8.5} />

      {/* Loop */}
      <path d="M 750,119 Q 750,150 720,150 Q 690,150 690,115 Q 690,102 700,97" fill="none" stroke={TEAL} strokeWidth={1.2} strokeDasharray="4 3" markerEnd={`url(#a-${TEAL.slice(1)})`} />
      <text x={710} y={162} textAnchor="middle" fontFamily={mono} fontSize={7} fill={TEAL}>loop</text>

      <text x={750} y={195} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED}>The model decides what to do.</text>
      <text x={750} y={208} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED}>Flexible and autonomous.</text>

      {/* ═══ 4. MULTI-AGENT ═══ */}
      <text x={1050} y={50} textAnchor="middle" fontFamily={display} fontSize={10} fill={CORAL} fontWeight={600} letterSpacing="0.08em">MULTI-AGENT</text>
      <text x={1050} y={64} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED} fontStyle="italic">Team collaboration</text>

      <Box x={920} y={95} w={58} h={24} label="Task" fill={CORAL} stroke={CORAL} textColor="#fff" />
      <line x1={978} y1={107} x2={993} y2={107} stroke={CORAL} strokeWidth={1.2} markerEnd={`url(#a-${CORAL.slice(1)})`} />
      <Box x={993} y={95} w={75} h={24} label="Orchestrator" stroke={CORAL} textColor={CORAL} />

      <CurvedArrow path="M 1068,100 Q 1088,85 1098,85" color={CORAL} />
      <Box x={1098} y={73} w={68} h={22} label="Agent A" fontSize={8.5} />
      <line x1={1068} y1={107} x2={1098} y2={107} stroke={CORAL} strokeWidth={1.2} markerEnd={`url(#a-${CORAL.slice(1)})`} />
      <Box x={1098} y={96} w={68} h={22} label="Agent B" fontSize={8.5} />
      <CurvedArrow path="M 1068,114 Q 1088,129 1098,129" color={CORAL} />
      <Box x={1098} y={119} w={68} h={22} label="Agent C" fontSize={8.5} />

      <text x={1050} y={175} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED}>Specialized agents coordinate.</text>
      <text x={1050} y={188} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED}>Powerful, but complex.</text>
    </svg>
  );
}
