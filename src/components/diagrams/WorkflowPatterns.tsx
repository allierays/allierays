import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  Position,
} from '@xyflow/react';
import { useState, useEffect } from 'react';

const NAVY = '#2d4059';
const TEAL = '#5b9ea6';
const CORAL = '#e07a5f';
const INK = '#1a1915';
const INK_MUTED = '#8a867a';
const MARBLE = '#e2e0db';

const baseNode = {
  style: {
    background: '#ffffff',
    border: `1px solid ${MARBLE}`,
    borderRadius: 6,
    padding: '8px 14px',
    fontSize: 13,
    fontFamily: "'Source Serif 4', Georgia, serif",
    color: INK,
    textAlign: 'center' as const,
    fontWeight: 400,
    width: 'auto',
  },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const filledNode = (bg: string) => ({
  ...baseNode,
  style: {
    ...baseNode.style,
    background: bg,
    color: '#ffffff',
    fontWeight: 600,
    border: `1px solid ${bg}`,
    fontSize: 12,
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.02em',
  },
});

const gateNode = {
  ...baseNode,
  style: {
    ...baseNode.style,
    background: 'rgba(224,122,95,0.1)',
    border: `1px solid rgba(224,122,95,0.35)`,
    fontSize: 11,
    fontFamily: "'JetBrains Mono', monospace",
    color: '#c06a50',
    fontWeight: 600,
  },
};

const edgeLight = { style: { stroke: MARBLE, strokeWidth: 1.5 }, animated: false };
const edgeActive = (c: string) => ({ style: { stroke: c, strokeWidth: 2 }, animated: true });

type PatternDef = { label: string; description: string; nodes: Node[]; edges: Edge[]; height: number };

const patterns: PatternDef[] = [
  {
    label: 'Prompt Chaining',
    description: 'Sequential steps with validation gates between each',
    height: 100,
    nodes: [
      { id: 'in', position: { x: 0, y: 25 }, data: { label: 'Input' }, ...filledNode(NAVY) },
      { id: 's1', position: { x: 135, y: 25 }, data: { label: 'Step 1' }, ...baseNode },
      { id: 'g1', position: { x: 255, y: 25 }, data: { label: '✓ gate' }, ...gateNode },
      { id: 's2', position: { x: 370, y: 25 }, data: { label: 'Step 2' }, ...baseNode },
      { id: 'g2', position: { x: 490, y: 25 }, data: { label: '✓ gate' }, ...gateNode },
      { id: 's3', position: { x: 605, y: 25 }, data: { label: 'Step 3' }, ...baseNode },
      { id: 'out', position: { x: 730, y: 25 }, data: { label: 'Output' }, ...filledNode(TEAL) },
    ],
    edges: [
      { id: 'e1', source: 'in', target: 's1', ...edgeLight },
      { id: 'e2', source: 's1', target: 'g1', ...edgeActive(CORAL) },
      { id: 'e3', source: 'g1', target: 's2', ...edgeLight },
      { id: 'e4', source: 's2', target: 'g2', ...edgeActive(CORAL) },
      { id: 'e5', source: 'g2', target: 's3', ...edgeLight },
      { id: 'e6', source: 's3', target: 'out', ...edgeLight },
    ],
  },
  {
    label: 'Routing',
    description: 'Classify input, send to specialized handlers',
    height: 200,
    nodes: [
      { id: 'in', position: { x: 0, y: 70 }, data: { label: 'Input' }, ...filledNode(NAVY) },
      { id: 'router', position: { x: 155, y: 70 }, data: { label: 'Router' }, ...filledNode(CORAL) },
      { id: 'h1', position: { x: 360, y: 0 }, data: { label: 'Handler A' }, ...baseNode },
      { id: 'h2', position: { x: 360, y: 70 }, data: { label: 'Handler B' }, ...baseNode },
      { id: 'h3', position: { x: 360, y: 140 }, data: { label: 'Handler C' }, ...baseNode },
      { id: 'out', position: { x: 540, y: 70 }, data: { label: 'Output' }, ...filledNode(TEAL) },
    ],
    edges: [
      { id: 'e1', source: 'in', target: 'router', ...edgeLight },
      { id: 'e2', source: 'router', target: 'h1', ...edgeActive(CORAL) },
      { id: 'e3', source: 'router', target: 'h2', ...edgeLight },
      { id: 'e4', source: 'router', target: 'h3', ...edgeLight },
      { id: 'e5', source: 'h1', target: 'out', ...edgeActive(TEAL) },
      { id: 'e6', source: 'h2', target: 'out', ...edgeLight },
      { id: 'e7', source: 'h3', target: 'out', ...edgeLight },
    ],
  },
  {
    label: 'Parallelization',
    description: 'Run independent tasks simultaneously, aggregate results',
    height: 200,
    nodes: [
      { id: 'in', position: { x: 0, y: 70 }, data: { label: 'Input' }, ...filledNode(NAVY) },
      { id: 'w1', position: { x: 175, y: 0 }, data: { label: 'Task A' }, ...baseNode },
      { id: 'w2', position: { x: 175, y: 70 }, data: { label: 'Task B' }, ...baseNode },
      { id: 'w3', position: { x: 175, y: 140 }, data: { label: 'Task C' }, ...baseNode },
      { id: 'agg', position: { x: 360, y: 70 }, data: { label: 'Aggregate' }, ...filledNode(CORAL) },
      { id: 'out', position: { x: 520, y: 70 }, data: { label: 'Output' }, ...filledNode(TEAL) },
    ],
    edges: [
      { id: 'e1', source: 'in', target: 'w1', ...edgeActive(NAVY) },
      { id: 'e2', source: 'in', target: 'w2', ...edgeActive(NAVY) },
      { id: 'e3', source: 'in', target: 'w3', ...edgeActive(NAVY) },
      { id: 'e4', source: 'w1', target: 'agg', ...edgeLight },
      { id: 'e5', source: 'w2', target: 'agg', ...edgeLight },
      { id: 'e6', source: 'w3', target: 'agg', ...edgeLight },
      { id: 'e7', source: 'agg', target: 'out', ...edgeLight },
    ],
  },
  {
    label: 'Orchestrator-Workers',
    description: 'Central LLM dynamically delegates to workers',
    height: 200,
    nodes: [
      { id: 'in', position: { x: 0, y: 70 }, data: { label: 'Task' }, ...filledNode(NAVY) },
      { id: 'orch', position: { x: 155, y: 70 }, data: { label: 'Orchestrator' }, ...filledNode(TEAL) },
      { id: 'w1', position: { x: 355, y: 0 }, data: { label: 'Worker' }, ...baseNode },
      { id: 'w2', position: { x: 355, y: 70 }, data: { label: 'Worker' }, ...baseNode },
      { id: 'w3', position: { x: 355, y: 140 }, data: { label: 'Worker' }, ...baseNode },
      { id: 'synth', position: { x: 510, y: 70 }, data: { label: 'Synthesize' }, ...filledNode(CORAL) },
      { id: 'out', position: { x: 670, y: 70 }, data: { label: 'Output' }, ...filledNode(TEAL) },
    ],
    edges: [
      { id: 'e1', source: 'in', target: 'orch', ...edgeLight },
      { id: 'e2', source: 'orch', target: 'w1', ...edgeActive(TEAL) },
      { id: 'e3', source: 'orch', target: 'w2', ...edgeActive(TEAL) },
      { id: 'e4', source: 'orch', target: 'w3', ...edgeActive(TEAL) },
      { id: 'e5', source: 'w1', target: 'synth', ...edgeLight },
      { id: 'e6', source: 'w2', target: 'synth', ...edgeLight },
      { id: 'e7', source: 'w3', target: 'synth', ...edgeLight },
      { id: 'e8', source: 'synth', target: 'out', ...edgeLight },
    ],
  },
  {
    label: 'Evaluator-Optimizer',
    description: 'Generate, evaluate, refine in a loop',
    height: 140,
    nodes: [
      { id: 'in', position: { x: 0, y: 40 }, data: { label: 'Input' }, ...filledNode(NAVY) },
      { id: 'gen', position: { x: 155, y: 40 }, data: { label: 'Generate' }, ...baseNode },
      { id: 'eval', position: { x: 355, y: 40 }, data: { label: 'Evaluate' }, ...filledNode(TEAL) },
      { id: 'out', position: { x: 555, y: 40 }, data: { label: 'Output' }, ...filledNode(CORAL) },
    ],
    edges: [
      { id: 'e1', source: 'in', target: 'gen', ...edgeLight },
      { id: 'e2', source: 'gen', target: 'eval', ...edgeActive(TEAL) },
      {
        id: 'e3', source: 'eval', target: 'gen', type: 'default',
        label: 'refine',
        labelStyle: { fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fill: CORAL },
        style: { stroke: CORAL, strokeWidth: 1.5, strokeDasharray: '5 3' },
        animated: true,
      },
      {
        id: 'e4', source: 'eval', target: 'out', ...edgeLight,
        label: 'pass',
        labelStyle: { fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fill: TEAL },
      },
    ],
  },
];

export default function WorkflowPatterns() {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const current = patterns[active];

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@xyflow/react@12/dist/style.css';
    document.head.appendChild(link);
    setReady(true);
    return () => { document.head.removeChild(link); };
  }, []);

  if (!ready) return null;

  return (
    <div style={{ margin: '2rem 0 2.5rem' }}>
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${MARBLE}`, overflowX: 'auto' }}>
        {patterns.map((p, i) => (
          <button
            key={p.label}
            onClick={() => setActive(i)}
            style={{
              padding: '10px 14px',
              fontFamily: "'Chiron Go Round TC', system-ui, sans-serif",
              fontSize: '0.75rem',
              fontWeight: i === active ? 600 : 400,
              color: i === active ? NAVY : INK_MUTED,
              background: 'transparent',
              border: 'none',
              borderBottom: i === active ? `2px solid ${TEAL}` : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: -1,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div
        key={active}
        style={{
          background: '#ffffff',
          border: `1px solid ${MARBLE}`,
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '14px 20px 0', fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.8125rem', color: INK_MUTED, fontStyle: 'italic' }}>
          {current.description}
        </div>
        <div style={{ height: current.height + 80, width: '100%' }}>
          <ReactFlow
            nodes={current.nodes} edges={current.edges} fitView fitViewOptions={{ padding: 0.3 }}
            nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
            panOnDrag={false} zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false}
            preventScrolling={false} proOptions={{ hideAttribution: true }}
          >
            <Background color="#f7f6f4" gap={20} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
