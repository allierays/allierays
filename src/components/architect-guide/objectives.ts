// The 38 blueprint objectives, from the CCAR-P exam guide (v1.0, July 2026).
//
// Held here rather than imported: this guide is the only thing that needs them,
// and the data layer they used to live in has been removed from the site.

export interface Objective {
  /** "3.2" */
  id: string;
  title: string;
}

/** Objectives by domain id, in the order the exam guide lists them. */
export const OBJECTIVES: Record<number, Objective[]> = {
  1: [
    { id: '1.1', title: 'Translate business problems into Claude-based AI solutions' },
    { id: '1.2', title: 'Design end-to-end architectures (input → processing → output → feedback loops)' },
    { id: '1.3', title: 'Select appropriate architectural patterns (workflow, agentic, augmented LLM)' },
    { id: '1.4', title: 'Design multi-agent systems and orchestration strategies' },
    { id: '1.5', title: 'Apply decomposition techniques for complex problem solving' },
    { id: '1.6', title: 'Align solutions to business value pillars (efficiency, transformation, productivity, cost, performance SLAs)' },
  ],
  2: [
    { id: '2.1', title: 'Select appropriate Claude models based on trade-offs' },
    { id: '2.2', title: 'Design system prompts, templates, and guardrails' },
    { id: '2.3', title: 'Apply prompt engineering techniques (zero-shot, few-shot, chain-of-thought)' },
    { id: '2.4', title: 'Optimize context windows and manage token usage' },
    { id: '2.5', title: 'Implement prompt reuse strategies (caching, modular prompts, Skills)' },
  ],
  3: [
    { id: '3.1', title: 'Evaluate tool or agent configuration for capability bloat' },
    { id: '3.2', title: 'Analyze authentication and authorization requirements to identify security gaps' },
    { id: '3.3', title: 'Evaluate accuracy-latency trade-offs and justify configuration decisions' },
    { id: '3.4', title: 'Analyze observability challenges and select monitoring strategies at scale' },
    { id: '3.5', title: 'Design a RAG pipeline with appropriate chunking and indexing strategies' },
    { id: '3.6', title: 'Apply retrieval strategies matched to data shape and query pattern' },
    { id: '3.7', title: 'Evaluate connection protocols and select the appropriate integration mechanism (MCP, API/CLI, agent-to-agent)' },
    { id: '3.8', title: 'Evaluate progressive discovery vs. monolithic context strategy' },
  ],
  4: [
    { id: '4.1', title: 'Define evaluation metrics (accuracy, latency, cost, safety, security)' },
    { id: '4.2', title: 'Design evaluation datasets and test frameworks using mixed methodologies' },
    { id: '4.3', title: 'Conduct A/B testing and iterative improvements' },
    { id: '4.4', title: 'Diagnose system issues (prompt failure, hallucinations, model mismatch)' },
    { id: '4.5', title: 'Optimize token usage, latency, and cost-performance trade-offs' },
    { id: '4.6', title: 'Monitor system performance using logging and observability tools' },
  ],
  5: [
    { id: '5.1', title: 'Implement guardrails and safety controls' },
    { id: '5.2', title: 'Identify risks, limitations, and failure modes of LLM systems' },
    { id: '5.3', title: 'Apply human-in-the-loop validation strategies' },
    { id: '5.4', title: 'Ensure compliance with regulations (e.g., GDPR, HIPAA, FedRAMP)' },
    { id: '5.5', title: 'Address ethical AI considerations (bias, fairness, transparency)' },
  ],
  6: [
    { id: '6.1', title: 'Conduct structured discovery and requirement gathering' },
    { id: '6.2', title: 'Communicate architectural decisions and trade-offs' },
    { id: '6.3', title: 'Manage stakeholder feedback loops and expectation alignment (including SLAs)' },
    { id: '6.4', title: 'Document architectures and provide implementation guidance' },
    { id: '6.5', title: 'Support lifecycle phases (discovery, design, handoff, monitoring, iteration)' },
  ],
  7: [
    { id: '7.1', title: 'Configure Claude tools and environments for teams (e.g., Claude Code)' },
    { id: '7.2', title: 'Improve developer workflows using AI-assisted tooling' },
    { id: '7.3', title: 'Support debugging and operational issue resolution' },
  ],
};

export function objectivesFor(domain: number): Objective[] {
  return OBJECTIVES[domain] ?? [];
}
