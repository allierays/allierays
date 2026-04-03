import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  Position,
} from '@xyflow/react';
import { useEffect, useState } from 'react';

const NAVY = '#2d4059';
const TEAL = '#5b9ea6';
const CORAL = '#e07a5f';
const MARBLE = '#e2e0db';
const INK = '#1a1915';
const INK_MUTED = '#8a867a';

const questionStyle = {
  style: {
    background: '#ffffff', border: `1.5px solid ${NAVY}`, borderRadius: 6,
    padding: '10px 14px', fontSize: 12, fontFamily: "'Source Serif 4', Georgia, serif",
    color: INK, textAlign: 'center' as const, fontWeight: 600, width: 190,
  },
  sourcePosition: Position.Bottom, targetPosition: Position.Top,
};

const answerNode = (bg: string) => ({
  style: {
    background: bg, border: `1.5px solid ${bg}`, borderRadius: 6,
    padding: '10px 14px', fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
    color: '#ffffff', textAlign: 'center' as const, fontWeight: 600, width: 180,
  },
  sourcePosition: Position.Bottom, targetPosition: Position.Top,
});

const yesEdge = (c: string) => ({
  style: { stroke: c, strokeWidth: 2 }, label: 'yes',
  labelStyle: { fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fill: c, fontWeight: 600 },
  labelBgStyle: { fill: '#fcfbf9' },
});

const noEdge = {
  style: { stroke: MARBLE, strokeWidth: 1.5 }, label: 'no',
  labelStyle: { fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fill: '#b5b0a3' },
  labelBgStyle: { fill: '#fcfbf9' },
};

const nodes: Node[] = [
  { id: 'q1', position: { x: 200, y: 0 }, data: { label: 'Single LLM call + good prompting enough?' }, ...questionStyle },
  { id: 'a1', position: { x: 470, y: 0 }, data: { label: '→ Single call + RAG' }, ...answerNode(TEAL) },
  { id: 'q2', position: { x: 200, y: 100 }, data: { label: 'Steps are predictable?' }, ...questionStyle },
  { id: 'a2', position: { x: 470, y: 100 }, data: { label: '→ Chaining / Routing' }, ...answerNode(TEAL) },
  { id: 'q3', position: { x: 200, y: 200 }, data: { label: 'Tasks are independent?' }, ...questionStyle },
  { id: 'a3', position: { x: 470, y: 200 }, data: { label: '→ Parallelization' }, ...answerNode(TEAL) },
  { id: 'q4', position: { x: 200, y: 300 }, data: { label: 'Subtasks unpredictable, goal clear?' }, ...questionStyle },
  { id: 'a4', position: { x: 470, y: 300 }, data: { label: '→ Orchestrator-workers' }, ...answerNode(CORAL) },
  { id: 'q5', position: { x: 200, y: 400 }, data: { label: 'Truly open-ended?' }, ...questionStyle },
  { id: 'a5', position: { x: 470, y: 400 }, data: { label: '→ Agent' }, ...answerNode(CORAL) },
  { id: 'a6', position: { x: 200, y: 500 }, data: { label: '→ Multi-agent system' }, ...answerNode(NAVY) },
];

const edges: Edge[] = [
  { id: 'e1y', source: 'q1', target: 'a1', ...yesEdge(TEAL), sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: 'e1n', source: 'q1', target: 'q2', ...noEdge },
  { id: 'e2y', source: 'q2', target: 'a2', ...yesEdge(TEAL), sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: 'e2n', source: 'q2', target: 'q3', ...noEdge },
  { id: 'e3y', source: 'q3', target: 'a3', ...yesEdge(TEAL), sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: 'e3n', source: 'q3', target: 'q4', ...noEdge },
  { id: 'e4y', source: 'q4', target: 'a4', ...yesEdge(CORAL), sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: 'e4n', source: 'q4', target: 'q5', ...noEdge },
  { id: 'e5y', source: 'q5', target: 'a5', ...yesEdge(CORAL), sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: 'e5n', source: 'q5', target: 'a6', ...noEdge },
];

export default function DecisionFlow() {
  const [ready, setReady] = useState(false);

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
    <div style={{ margin: '2rem 0 2.5rem', background: '#ffffff', border: `1px solid ${MARBLE}`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${NAVY}, ${TEAL}, ${CORAL})` }} />
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ fontFamily: "'Chiron Go Round TC', system-ui, sans-serif", fontSize: '0.75rem', fontWeight: 600, color: NAVY, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Which pattern do you need?
        </div>
        <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.8125rem', color: INK_MUTED, fontStyle: 'italic', marginTop: 4 }}>
          Start at the top. Stop at the first "yes."
        </div>
      </div>
      <div style={{ height: 600, width: '100%' }}>
        <ReactFlow
          nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.25 }}
          nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
          panOnDrag={false} zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false}
          preventScrolling={false} proOptions={{ hideAttribution: true }}
        >
          <Background color="#f7f6f4" gap={20} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
