// The official CCAR-P blueprint: seven domains, their weights, and the 38
// objectives beneath them. Weights are from the exam guide (v1.0, July 2026).
// Item counts are the weights applied to a 63-item form, rounded to sum to 63.

import type { Domain, DomainId } from './types';

export const TOTAL_ITEMS = 63;
export const TIME_LIMIT_MIN = 120;
export const CUT_SCORE = 720;
export const SCALE_MIN = 100;
export const SCALE_MAX = 1000;

export const DOMAINS: Domain[] = [
  {
    id: 1,
    title: 'Solution Design & Architecture',
    weight: 17,
    itemsOnExam: 11,
    blurb:
      'Turn an ambiguous business request into a defensible Claude architecture and say what each choice costs.',
    accent: '#2d4059',
    objectives: [
      { id: '1.1', title: 'Translate business problems into Claude-based AI solutions' },
      { id: '1.2', title: 'Design end-to-end architectures (input → processing → output → feedback loops)' },
      { id: '1.3', title: 'Select appropriate architectural patterns (workflow, agentic, augmented LLM)' },
      { id: '1.4', title: 'Design multi-agent systems and orchestration strategies' },
      { id: '1.5', title: 'Apply decomposition techniques for complex problem solving' },
      { id: '1.6', title: 'Align solutions to business value pillars (efficiency, transformation, productivity, cost, performance SLAs)' },
    ],
  },
  {
    id: 2,
    title: 'Claude Models, Prompting & Context Engineering',
    weight: 13,
    itemsOnExam: 8,
    blurb:
      'Pick the model, shape the prompt, and stop paying full price for content you send on every request.',
    accent: '#5b9ea6',
    objectives: [
      { id: '2.1', title: 'Select appropriate Claude models based on trade-offs' },
      { id: '2.2', title: 'Design system prompts, templates, and guardrails' },
      { id: '2.3', title: 'Apply prompt engineering techniques (zero-shot, few-shot, chain-of-thought)' },
      { id: '2.4', title: 'Optimize context windows and manage token usage' },
      { id: '2.5', title: 'Implement prompt reuse strategies (caching, modular prompts, Skills)' },
    ],
  },
  {
    id: 3,
    title: 'Integration',
    weight: 19,
    itemsOnExam: 12,
    blurb:
      'The heaviest domain. Tools, auth, retrieval, observability, and choosing between MCP, a plain API call, and agent-to-agent.',
    accent: '#e07a5f',
    objectives: [
      { id: '3.1', title: 'Evaluate tool or agent configuration for capability bloat' },
      { id: '3.2', title: 'Analyze authentication and authorization requirements to identify security gaps' },
      { id: '3.3', title: 'Evaluate accuracy-latency trade-offs and justify configuration decisions' },
      { id: '3.4', title: 'Analyze observability challenges and select monitoring strategies at scale' },
      { id: '3.5', title: 'Design a RAG pipeline with appropriate chunking and indexing strategies' },
      { id: '3.6', title: 'Apply retrieval strategies matched to data shape and query pattern' },
      { id: '3.7', title: 'Evaluate connection protocols and select the appropriate integration mechanism (MCP, API/CLI, agent-to-agent)' },
      { id: '3.8', title: 'Evaluate progressive discovery vs. monolithic context strategy' },
    ],
  },
  {
    id: 4,
    title: 'Evaluation, Testing & Optimization',
    weight: 16,
    itemsOnExam: 10,
    blurb:
      'Define what good looks like as a number, prove a change helped, and find the layer that broke.',
    accent: '#7a9a6d',
    objectives: [
      { id: '4.1', title: 'Define evaluation metrics (accuracy, latency, cost, safety, security)' },
      { id: '4.2', title: 'Design evaluation datasets and test frameworks using mixed methodologies' },
      { id: '4.3', title: 'Conduct A/B testing and iterative improvements' },
      { id: '4.4', title: 'Diagnose system issues (prompt failure, hallucinations, model mismatch)' },
      { id: '4.5', title: 'Optimize token usage, latency, and cost-performance trade-offs' },
      { id: '4.6', title: 'Monitor system performance using logging and observability tools' },
    ],
  },
  {
    id: 5,
    title: 'Governance, Safety & Risk Management',
    weight: 14,
    itemsOnExam: 9,
    blurb:
      'Guardrails, failure modes, where the human gate goes, and what each regulation demands of the architecture.',
    accent: '#8b6f9e',
    objectives: [
      { id: '5.1', title: 'Implement guardrails and safety controls' },
      { id: '5.2', title: 'Identify risks, limitations, and failure modes of LLM systems' },
      { id: '5.3', title: 'Apply human-in-the-loop validation strategies' },
      { id: '5.4', title: 'Ensure compliance with regulations (e.g., GDPR, HIPAA, FedRAMP)' },
      { id: '5.5', title: 'Address ethical AI considerations (bias, fairness, transparency)' },
    ],
  },
  {
    id: 6,
    title: 'Stakeholder Communication & Lifecycle Management',
    weight: 14,
    itemsOnExam: 9,
    blurb:
      'Discovery, trade-off conversations, service levels for a non-deterministic system, and the handoff.',
    accent: '#b8960c',
    objectives: [
      { id: '6.1', title: 'Conduct structured discovery and requirement gathering' },
      { id: '6.2', title: 'Communicate architectural decisions and trade-offs' },
      { id: '6.3', title: 'Manage stakeholder feedback loops and expectation alignment (including SLAs)' },
      { id: '6.4', title: 'Document architectures and provide implementation guidance' },
      { id: '6.5', title: 'Support lifecycle phases (discovery, design, handoff, monitoring, iteration)' },
    ],
  },
  {
    id: 7,
    title: 'Developer Productivity & Operational Enablement',
    weight: 7,
    itemsOnExam: 4,
    blurb:
      'The lightest domain. Configuring Claude Code for a team, AI-assisted workflows, and triaging what broke.',
    accent: '#4a7c8c',
    objectives: [
      { id: '7.1', title: 'Configure Claude tools and environments for teams (e.g., Claude Code)' },
      { id: '7.2', title: 'Improve developer workflows using AI-assisted tooling' },
      { id: '7.3', title: 'Support debugging and operational issue resolution' },
    ],
  },
];

export const DOMAIN_BY_ID: Record<DomainId, Domain> = Object.fromEntries(
  DOMAINS.map((d) => [d.id, d])
) as Record<DomainId, Domain>;

/** Recommended study order: heaviest domains first. */
export const STUDY_ORDER: DomainId[] = [3, 1, 4, 5, 6, 2, 7];
