import { useState, useEffect, useRef } from 'react';

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

function Box({ x, y, w, h, label, fill = '#fff', stroke = MARBLE, textColor = NAVY, fontSize = 11 }: any) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={fill} stroke={stroke} strokeWidth={1.2} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontFamily={mono} fontSize={fontSize} fill={textColor} fontWeight={500}>{label}</text>
    </g>
  );
}

function CurvedArrow({ path, color = MARBLE }: any) {
  return <path d={path} fill="none" stroke={color} strokeWidth={1.2} markerEnd={`url(#a-${color.replace('#', '')})`} />;
}

function Markers() {
  return (
    <defs>
      {[NAVY, TEAL, CORAL, SAGE, MARBLE].map((c) => (
        <marker key={c} id={`a-${c.replace('#', '')}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
        </marker>
      ))}
    </defs>
  );
}

function WorkflowSlide() {
  return (
    <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <rect width="300" height="200" fill={BG} />
      <Markers />
      <text x={150} y={30} textAnchor="middle" fontFamily={display} fontSize={12} fill={NAVY} fontWeight={600} letterSpacing="0.08em">WORKFLOW</text>
      <text x={150} y={48} textAnchor="middle" fontFamily={font} fontSize={10} fill={INK_MUTED} fontStyle="italic">Predefined path</text>
      <Box x={20} y={70} w={55} h={28} label="Input" fill={NAVY} stroke={NAVY} textColor="#fff" />
      <line x1={75} y1={84} x2={90} y2={84} stroke={NAVY} strokeWidth={1.2} markerEnd={`url(#a-${NAVY.slice(1)})`} />
      <Box x={90} y={70} w={55} h={28} label="Step 1" />
      <line x1={145} y1={84} x2={160} y2={84} stroke={NAVY} strokeWidth={1.2} markerEnd={`url(#a-${NAVY.slice(1)})`} />
      <Box x={160} y={70} w={55} h={28} label="Step 2" />
      <line x1={215} y1={84} x2={230} y2={84} stroke={NAVY} strokeWidth={1.2} markerEnd={`url(#a-${NAVY.slice(1)})`} />
      <Box x={230} y={70} w={55} h={28} label="Output" fill={NAVY} stroke={NAVY} textColor="#fff" />
      <text x={150} y={130} textAnchor="middle" fontFamily={font} fontSize={10} fill={INK_MUTED}>Every step predetermined.</text>
      <text x={150} y={146} textAnchor="middle" fontFamily={font} fontSize={10} fill={INK_MUTED}>Predictable. Debuggable. Cheap.</text>
    </svg>
  );
}

function AgenticSlide() {
  return (
    <svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <rect width="300" height="220" fill={BG} />
      <Markers />
      <text x={150} y={30} textAnchor="middle" fontFamily={display} fontSize={12} fill={SAGE} fontWeight={600} letterSpacing="0.08em">AGENTIC WORKFLOW</text>
      <text x={150} y={48} textAnchor="middle" fontFamily={font} fontSize={10} fill={INK_MUTED} fontStyle="italic">Structured + AI decisions</text>
      <Box x={25} y={70} w={55} h={28} label="Input" fill={SAGE} stroke={SAGE} textColor="#fff" />
      <line x1={80} y1={84} x2={95} y2={84} stroke={SAGE} strokeWidth={1.2} markerEnd={`url(#a-${SAGE.slice(1)})`} />
      <Box x={95} y={70} w={50} h={28} label="Plan" />
      <line x1={145} y1={84} x2={155} y2={84} stroke={SAGE} strokeWidth={1.2} markerEnd={`url(#a-${SAGE.slice(1)})`} />
      <Box x={155} y={70} w={55} h={28} label="Execute" />
      <line x1={210} y1={84} x2={220} y2={84} stroke={SAGE} strokeWidth={1.2} markerEnd={`url(#a-${SAGE.slice(1)})`} />
      <Box x={220} y={70} w={55} h={28} label="Reflect" />
      <path d="M 247,98 Q 247,125 172,125 Q 120,125 120,100" fill="none" stroke={SAGE} strokeWidth={1.2} strokeDasharray="4 3" markerEnd={`url(#a-${SAGE.slice(1)})`} />
      <text x={180} y={140} textAnchor="middle" fontFamily={mono} fontSize={8} fill={SAGE}>LLM loop — retry if needed</text>
      <text x={150} y={175} textAnchor="middle" fontFamily={font} fontSize={10} fill={INK_MUTED}>AI decides within a structure.</text>
      <text x={150} y={191} textAnchor="middle" fontFamily={font} fontSize={10} fill={INK_MUTED}>Best of both worlds.</text>
    </svg>
  );
}

function AgentSlide() {
  return (
    <svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <rect width="300" height="220" fill={BG} />
      <Markers />
      <text x={150} y={30} textAnchor="middle" fontFamily={display} fontSize={12} fill={TEAL} fontWeight={600} letterSpacing="0.08em">AGENT</text>
      <text x={150} y={48} textAnchor="middle" fontFamily={font} fontSize={10} fill={INK_MUTED} fontStyle="italic">Dynamic decisions</text>
      <Box x={20} y={75} w={55} h={28} label="Query" fill={TEAL} stroke={TEAL} textColor="#fff" />
      <line x1={75} y1={89} x2={95} y2={89} stroke={TEAL} strokeWidth={1.2} markerEnd={`url(#a-${TEAL.slice(1)})`} />
      <polygon points="120,70 148,89 120,108 92,89" fill="#fff" stroke={TEAL} strokeWidth={1.2} />
      <text x={120} y={93} textAnchor="middle" fontFamily={mono} fontSize={10} fill={TEAL} fontWeight={600}>LLM</text>
      <CurvedArrow path="M 148,82 Q 165,68 180,68" color={TEAL} />
      <Box x={180} y={55} w={55} h={26} label="Tool A" />
      <line x1={148} y1={89} x2={180} y2={89} stroke={TEAL} strokeWidth={1.2} markerEnd={`url(#a-${TEAL.slice(1)})`} />
      <Box x={180} y={77} w={55} h={26} label="Tool B" />
      <CurvedArrow path="M 148,96 Q 165,110 180,110" color={TEAL} />
      <Box x={180} y={99} w={55} h={26} label="Tool C" />
      <path d="M 120,108 Q 120,140 90,140 Q 60,140 60,105 Q 60,89 72,84" fill="none" stroke={TEAL} strokeWidth={1.2} strokeDasharray="4 3" markerEnd={`url(#a-${TEAL.slice(1)})`} />
      <text x={80} y={152} textAnchor="middle" fontFamily={mono} fontSize={8} fill={TEAL}>loop</text>
      <text x={150} y={180} textAnchor="middle" fontFamily={font} fontSize={10} fill={INK_MUTED}>The model decides what to do.</text>
      <text x={150} y={196} textAnchor="middle" fontFamily={font} fontSize={10} fill={INK_MUTED}>Flexible and autonomous.</text>
    </svg>
  );
}

function MultiAgentSlide() {
  return (
    <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <rect width="300" height="200" fill={BG} />
      <Markers />
      <text x={150} y={30} textAnchor="middle" fontFamily={display} fontSize={12} fill={CORAL} fontWeight={600} letterSpacing="0.08em">MULTI-AGENT</text>
      <text x={150} y={48} textAnchor="middle" fontFamily={font} fontSize={10} fill={INK_MUTED} fontStyle="italic">Team collaboration</text>
      <Box x={15} y={80} w={60} h={28} label="Task" fill={CORAL} stroke={CORAL} textColor="#fff" />
      <line x1={75} y1={94} x2={95} y2={94} stroke={CORAL} strokeWidth={1.2} markerEnd={`url(#a-${CORAL.slice(1)})`} />
      <Box x={95} y={80} w={80} h={28} label="Orchestrator" stroke={CORAL} textColor={CORAL} />
      <CurvedArrow path="M 175,86 Q 195,72 205,72" color={CORAL} />
      <Box x={205} y={60} w={70} h={24} label="Agent A" />
      <line x1={175} y1={94} x2={205} y2={94} stroke={CORAL} strokeWidth={1.2} markerEnd={`url(#a-${CORAL.slice(1)})`} />
      <Box x={205} y={82} w={70} h={24} label="Agent B" />
      <CurvedArrow path="M 175,102 Q 195,116 205,116" color={CORAL} />
      <Box x={205} y={104} w={70} h={24} label="Agent C" />
      <text x={150} y={160} textAnchor="middle" fontFamily={font} fontSize={10} fill={INK_MUTED}>Specialized agents coordinate.</text>
      <text x={150} y={176} textAnchor="middle" fontFamily={font} fontSize={10} fill={INK_MUTED}>Powerful, but complex.</text>
    </svg>
  );
}

const slides = [
  { component: WorkflowSlide, color: NAVY, label: 'Workflow' },
  { component: AgenticSlide, color: SAGE, label: 'Agentic' },
  { component: AgentSlide, color: TEAL, label: 'Agent' },
  { component: MultiAgentSlide, color: CORAL, label: 'Multi-Agent' },
];

function DesktopBanner() {
  return (
    <svg viewBox="0 0 1200 280" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <rect width="1200" height="280" fill={BG} />
      <Markers />
      {[300, 600, 900].map((x) => (
        <line key={x} x1={x} y1={35} x2={x} y2={245} stroke={MARBLE} strokeWidth={1} strokeDasharray="4 4" />
      ))}
      {/* Workflow */}
      <text x={150} y={50} textAnchor="middle" fontFamily={display} fontSize={10} fill={NAVY} fontWeight={600} letterSpacing="0.08em">WORKFLOW</text>
      <text x={150} y={64} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED} fontStyle="italic">Predefined path</text>
      <Box x={40} y={90} w={55} h={24} label="Input" fill={NAVY} stroke={NAVY} textColor="#fff" fontSize={9.5} />
      <line x1={95} y1={102} x2={110} y2={102} stroke={NAVY} strokeWidth={1.2} markerEnd={`url(#a-${NAVY.slice(1)})`} />
      <Box x={110} y={90} w={55} h={24} label="Step 1" fontSize={9.5} />
      <line x1={165} y1={102} x2={180} y2={102} stroke={NAVY} strokeWidth={1.2} markerEnd={`url(#a-${NAVY.slice(1)})`} />
      <Box x={180} y={90} w={55} h={24} label="Step 2" fontSize={9.5} />
      <line x1={235} y1={102} x2={250} y2={102} stroke={NAVY} strokeWidth={1.2} markerEnd={`url(#a-${NAVY.slice(1)})`} />
      <Box x={250} y={90} w={55} h={24} label="Output" fill={NAVY} stroke={NAVY} textColor="#fff" fontSize={9.5} />
      <text x={150} y={145} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED}>Every step predetermined.</text>
      <text x={150} y={158} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED}>Predictable. Debuggable. Cheap.</text>
      {/* Agentic */}
      <text x={450} y={50} textAnchor="middle" fontFamily={display} fontSize={10} fill={SAGE} fontWeight={600} letterSpacing="0.08em">AGENTIC WORKFLOW</text>
      <text x={450} y={64} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED} fontStyle="italic">Structured + AI decisions</text>
      <Box x={340} y={90} w={52} h={24} label="Input" fill={SAGE} stroke={SAGE} textColor="#fff" fontSize={9.5} />
      <line x1={392} y1={102} x2={407} y2={102} stroke={SAGE} strokeWidth={1.2} markerEnd={`url(#a-${SAGE.slice(1)})`} />
      <Box x={407} y={90} w={52} h={24} label="Plan" fontSize={9.5} />
      <line x1={459} y1={102} x2={474} y2={102} stroke={SAGE} strokeWidth={1.2} markerEnd={`url(#a-${SAGE.slice(1)})`} />
      <Box x={474} y={90} w={52} h={24} label="Execute" fontSize={9.5} />
      <line x1={526} y1={102} x2={541} y2={102} stroke={SAGE} strokeWidth={1.2} markerEnd={`url(#a-${SAGE.slice(1)})`} />
      <Box x={541} y={90} w={52} h={24} label="Reflect" fontSize={9.5} />
      <path d="M 567,114 Q 567,140 500,140 Q 433,140 433,118" fill="none" stroke={SAGE} strokeWidth={1.2} strokeDasharray="4 3" markerEnd={`url(#a-${SAGE.slice(1)})`} />
      <text x={500} y={153} textAnchor="middle" fontFamily={mono} fontSize={7} fill={SAGE}>LLM loop — retry if needed</text>
      <text x={450} y={185} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED}>AI decides within a structure.</text>
      <text x={450} y={198} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED}>Best of both worlds.</text>
      {/* Agent */}
      <text x={750} y={50} textAnchor="middle" fontFamily={display} fontSize={10} fill={TEAL} fontWeight={600} letterSpacing="0.08em">AGENT</text>
      <text x={750} y={64} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED} fontStyle="italic">Dynamic decisions</text>
      <Box x={655} y={90} w={52} h={24} label="Query" fill={TEAL} stroke={TEAL} textColor="#fff" fontSize={8.5} />
      <line x1={707} y1={102} x2={722} y2={102} stroke={TEAL} strokeWidth={1.2} markerEnd={`url(#a-${TEAL.slice(1)})`} />
      <polygon points="750,85 778,102 750,119 722,102" fill="#fff" stroke={TEAL} strokeWidth={1.2} />
      <text x={750} y={106} textAnchor="middle" fontFamily={mono} fontSize={8.5} fill={TEAL} fontWeight={600}>LLM</text>
      <CurvedArrow path="M 778,95 Q 800,82 810,82" color={TEAL} />
      <Box x={810} y={70} w={52} h={22} label="Tool A" fontSize={8.5} />
      <line x1={778} y1={102} x2={810} y2={102} stroke={TEAL} strokeWidth={1.2} markerEnd={`url(#a-${TEAL.slice(1)})`} />
      <Box x={810} y={92} w={52} h={22} label="Tool B" fontSize={8.5} />
      <CurvedArrow path="M 778,109 Q 800,122 810,122" color={TEAL} />
      <Box x={810} y={112} w={52} h={22} label="Tool C" fontSize={8.5} />
      <path d="M 750,119 Q 750,150 720,150 Q 690,150 690,115 Q 690,102 700,97" fill="none" stroke={TEAL} strokeWidth={1.2} strokeDasharray="4 3" markerEnd={`url(#a-${TEAL.slice(1)})`} />
      <text x={710} y={162} textAnchor="middle" fontFamily={mono} fontSize={7} fill={TEAL}>loop</text>
      <text x={750} y={195} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED}>The model decides what to do.</text>
      <text x={750} y={208} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED}>Flexible and autonomous.</text>
      {/* Multi-Agent */}
      <text x={1050} y={50} textAnchor="middle" fontFamily={display} fontSize={10} fill={CORAL} fontWeight={600} letterSpacing="0.08em">MULTI-AGENT</text>
      <text x={1050} y={64} textAnchor="middle" fontFamily={font} fontSize={8.5} fill={INK_MUTED} fontStyle="italic">Team collaboration</text>
      <Box x={920} y={95} w={58} h={24} label="Task" fill={CORAL} stroke={CORAL} textColor="#fff" fontSize={9.5} />
      <line x1={978} y1={107} x2={993} y2={107} stroke={CORAL} strokeWidth={1.2} markerEnd={`url(#a-${CORAL.slice(1)})`} />
      <Box x={993} y={95} w={75} h={24} label="Orchestrator" stroke={CORAL} textColor={CORAL} fontSize={9.5} />
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

export default function Banner() {
  const [isMobile, setIsMobile] = useState(false);
  const [active, setActiveRaw] = useState(0);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const broadcasting = useRef(false);

  const setActive = (i: number) => {
    setActiveRaw(i);
    broadcasting.current = true;
    window.dispatchEvent(new CustomEvent('pattern-slide', { detail: i }));
    broadcasting.current = false;
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    const onSync = (e: Event) => {
      if (!broadcasting.current) {
        setActiveRaw((e as CustomEvent).detail);
      }
    };
    window.addEventListener('pattern-slide', onSync);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('pattern-slide', onSync);
    };
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const minSwipe = 50;
    if (distance > minSwipe && active < slides.length - 1) {
      setActive(active + 1);
    } else if (distance < -minSwipe && active > 0) {
      setActive(active - 1);
    }
  };

  if (!isMobile) {
    return <DesktopBanner />;
  }

  const Slide = slides[active].component;

  return (
    <div>
      <div
        style={{ position: 'relative' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Slide />

        {/* Left arrow */}
        {active > 0 && (
          <button
            onClick={() => setActive(active - 1)}
            style={{
              position: 'absolute',
              left: 4,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.8)',
              border: `1px solid ${MARBLE}`,
              borderRadius: '50%',
              width: 32,
              height: 32,
              cursor: 'pointer',
              fontFamily: mono,
              fontSize: 14,
              color: INK_MUTED,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ‹
          </button>
        )}

        {/* Right arrow */}
        {active < slides.length - 1 && (
          <button
            onClick={() => setActive(active + 1)}
            style={{
              position: 'absolute',
              right: 4,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.8)',
              border: `1px solid ${MARBLE}`,
              borderRadius: '50%',
              width: 32,
              height: 32,
              cursor: 'pointer',
              fontFamily: mono,
              fontSize: 14,
              color: INK_MUTED,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ›
          </button>
        )}
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
        {slides.map((s, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: i === active ? s.color : MARBLE,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          />
        ))}
      </div>
    </div>
  );
}
