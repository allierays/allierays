const NAVY = '#2d4059';
const TEAL = '#5b9ea6';
const CORAL = '#e07a5f';
const SAGE = '#7a9a6d';
const INK_MUTED = '#8a867a';
const MARBLE = '#e2e0db';
const BG = '#fafaf7';

const mono = "'JetBrains Mono', monospace";

function Box({ x, y, w, h, label, fill = '#fff', stroke = MARBLE, textColor = NAVY, fontSize = 11 }: any) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={fill} stroke={stroke} strokeWidth={1.2} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontFamily={mono} fontSize={fontSize} fill={textColor} fontWeight={500}>{label}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color }: any) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd={`url(#m-${color.replace('#', '')})`} />;
}

function Markers() {
  return (
    <defs>
      {[NAVY, TEAL, CORAL, SAGE, MARBLE].map((c) => (
        <marker key={c} id={`m-${c.replace('#', '')}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
        </marker>
      ))}
    </defs>
  );
}

function WorkflowDiagram() {
  return (
    <svg viewBox="0 0 600 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <Markers />
      <Box x={20} y={30} w={80} h={32} label="Input" fill={NAVY} stroke={NAVY} textColor="#fff" />
      <Arrow x1={100} y1={46} x2={130} y2={46} color={NAVY} />
      <Box x={130} y={30} w={80} h={32} label="Step 1" />
      <Arrow x1={210} y1={46} x2={240} y2={46} color={NAVY} />
      <Box x={240} y={30} w={80} h={32} label="LLM" />
      <Arrow x1={320} y1={46} x2={350} y2={46} color={NAVY} />
      <Box x={350} y={30} w={80} h={32} label="Step 3" />
      <Arrow x1={430} y1={46} x2={460} y2={46} color={NAVY} />
      <Box x={460} y={30} w={80} h={32} label="Output" fill={NAVY} stroke={NAVY} textColor="#fff" />
    </svg>
  );
}

function AgenticWorkflowDiagram() {
  return (
    <svg viewBox="0 0 600 130" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <Markers />
      <Box x={20} y={30} w={75} h={32} label="Input" fill={SAGE} stroke={SAGE} textColor="#fff" />
      <Arrow x1={95} y1={46} x2={125} y2={46} color={SAGE} />
      <Box x={125} y={30} w={75} h={32} label="Plan" />
      <Arrow x1={200} y1={46} x2={230} y2={46} color={SAGE} />
      <Box x={230} y={30} w={85} h={32} label="Execute" />
      <Arrow x1={315} y1={46} x2={345} y2={46} color={SAGE} />
      <Box x={345} y={30} w={80} h={32} label="Reflect" />
      <Arrow x1={425} y1={46} x2={455} y2={46} color={SAGE} />
      <Box x={455} y={30} w={80} h={32} label="Output" fill={SAGE} stroke={SAGE} textColor="#fff" />
      {/* Loop */}
      <path d="M 385,62 Q 385,100 267,100 Q 163,100 163,66" fill="none" stroke={SAGE} strokeWidth={1.2} strokeDasharray="5 3" markerEnd={`url(#m-${SAGE.slice(1)})`} />
      <text x={270} y={115} textAnchor="middle" fontFamily={mono} fontSize={9} fill={SAGE}>LLM loop — retry if needed</text>
    </svg>
  );
}

function AgentDiagram() {
  return (
    <svg viewBox="0 0 600 150" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <Markers />
      <Box x={20} y={50} w={75} h={32} label="Query" fill={TEAL} stroke={TEAL} textColor="#fff" />
      <Arrow x1={95} y1={66} x2={135} y2={66} color={TEAL} />
      {/* Diamond */}
      <polygon points="175,40 215,66 175,92 135,66" fill="#fff" stroke={TEAL} strokeWidth={1.2} />
      <text x={175} y={70} textAnchor="middle" fontFamily={mono} fontSize={11} fill={TEAL} fontWeight={600}>LLM</text>
      {/* Tools */}
      <path d="M 215,55 Q 240,35 260,35" fill="none" stroke={TEAL} strokeWidth={1.2} markerEnd={`url(#m-${TEAL.slice(1)})`} />
      <Box x={260} y={20} w={80} h={28} label="Tool A" />
      <Arrow x1={215} y1={66} x2={260} y2={66} color={TEAL} />
      <Box x={260} y={52} w={80} h={28} label="Tool B" />
      <path d="M 215,77 Q 240,97 260,97" fill="none" stroke={TEAL} strokeWidth={1.2} markerEnd={`url(#m-${TEAL.slice(1)})`} />
      <Box x={260} y={84} w={80} h={28} label="Tool C" />
      {/* Output */}
      <Arrow x1={340} y1={66} x2={400} y2={66} color={TEAL} />
      <Box x={400} y={50} w={80} h={32} label="Response" fill={TEAL} stroke={TEAL} textColor="#fff" />
      {/* Loop */}
      <path d="M 175,92 Q 175,130 130,130 Q 85,130 85,80 Q 85,66 100,60" fill="none" stroke={TEAL} strokeWidth={1.2} strokeDasharray="5 3" markerEnd={`url(#m-${TEAL.slice(1)})`} />
      <text x={120} y={143} textAnchor="middle" fontFamily={mono} fontSize={9} fill={TEAL}>loop</text>
    </svg>
  );
}

function MultiAgentDiagram() {
  return (
    <svg viewBox="0 0 600 130" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <Markers />
      <Box x={20} y={40} w={80} h={32} label="Task" fill={CORAL} stroke={CORAL} textColor="#fff" />
      <Arrow x1={100} y1={56} x2={140} y2={56} color={CORAL} />
      <Box x={140} y={40} w={110} h={32} label="Orchestrator" stroke={CORAL} textColor={CORAL} />
      {/* Agents */}
      <path d="M 250,48 Q 280,25 310,25" fill="none" stroke={CORAL} strokeWidth={1.2} markerEnd={`url(#m-${CORAL.slice(1)})`} />
      <Box x={310} y={10} w={90} h={28} label="Agent A" />
      <Arrow x1={250} y1={56} x2={310} y2={56} color={CORAL} />
      <Box x={310} y={42} w={90} h={28} label="Agent B" />
      <path d="M 250,64 Q 280,87 310,87" fill="none" stroke={CORAL} strokeWidth={1.2} markerEnd={`url(#m-${CORAL.slice(1)})`} />
      <Box x={310} y={74} w={90} h={28} label="Agent C" />
      {/* Converge */}
      <path d="M 400,24 Q 430,24 450,44" fill="none" stroke={CORAL} strokeWidth={1.2} markerEnd={`url(#m-${CORAL.slice(1)})`} />
      <Arrow x1={400} y1={56} x2={440} y2={56} color={CORAL} />
      <path d="M 400,88 Q 430,88 450,68" fill="none" stroke={CORAL} strokeWidth={1.2} markerEnd={`url(#m-${CORAL.slice(1)})`} />
      <Box x={440} y={40} w={90} h={32} label="Output" fill={CORAL} stroke={CORAL} textColor="#fff" />
    </svg>
  );
}

export function Workflow() { return <WorkflowDiagram />; }
export function AgenticWorkflow() { return <AgenticWorkflowDiagram />; }
export function Agent() { return <AgentDiagram />; }
export function MultiAgent() { return <MultiAgentDiagram />; }
