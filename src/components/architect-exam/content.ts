// The Claude Certified Architect Professional (CCAR-P) practice exam's facts
// and copy, as plain data.
//
// This file stays dependency-free (no JSX, no React) so the page component
// and any script can read it. The question bank lives in ./questions.ts.
//
// Exam facts come from Anthropic's Exam Guide v1.0 (effective July 2026) and
// the Partner Academy certification FAQ. Where a fact comes from candidates
// rather than the guide, the copy says so. Nothing here reproduces live exam
// content.

export type DomainId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const GUIDE = {
  // Teal on pale teal: the same family as the site's action gradient, so the
  // card reads as native rather than as a third palette.
  accent: { bg: '#E3EEF0', color: '#35656E' },
};

// Numbers the practice test uses to mirror the real form.
export const EXAM = {
  code: 'CCAR-P',
  items: 63,
  minutes: 120,
  scaleMin: 100,
  scaleMax: 1000,
  cutScore: 720,
};

export interface Domain {
  id: DomainId;
  title: string;
  short: string;
  weight: number;
  /** The weight applied to a 63-item form, rounded to sum to 63. */
  items: number;
  /** What the items in this domain actually test, in one line. */
  tests: string;
  accent: string;
}

export const DOMAINS: Domain[] = [
  {
    id: 1,
    title: 'Solution Design & Architecture',
    short: 'Solution design',
    weight: 17,
    items: 11,
    tests:
      'Pick the simplest architecture that meets the constraint: one call, a workflow, or an agent. Know when a second agent earns its keep.',
    accent: '#2d4059',
  },
  {
    id: 2,
    title: 'Claude Models, Prompting & Context Engineering',
    short: 'Models & prompting',
    weight: 13,
    items: 8,
    tests:
      'Choose the model, shape the prompt, manage the window. Cache and tune effort before switching models. Keep big data out of the context.',
    accent: '#5b9ea6',
  },
  {
    id: 3,
    title: 'Integration',
    short: 'Integration',
    weight: 19,
    items: 12,
    tests:
      'The heaviest domain. Least privilege for tools, auth boundaries, retrieval matched to the data, observability at scale, and MCP versus a direct call versus agent-to-agent.',
    accent: '#e07a5f',
  },
  {
    id: 4,
    title: 'Evaluation, Testing & Optimization',
    short: 'Evaluation',
    weight: 16,
    items: 10,
    tests:
      'Define good as a number, prove a change helped before shipping it, find the layer that broke, and cut cost with the free levers first.',
    accent: '#7a9a6d',
  },
  {
    id: 5,
    title: 'Governance, Safety & Risk Management',
    short: 'Governance & safety',
    weight: 14,
    items: 9,
    tests:
      'Guardrails at the right layer, named failure modes, where the human gate goes, and what each regulation and deployment path demands.',
    accent: '#8b6f9e',
  },
  {
    id: 6,
    title: 'Stakeholder Communication & Lifecycle Management',
    short: 'Stakeholders & lifecycle',
    weight: 14,
    items: 9,
    tests:
      'Discovery before design, decision records, service levels for a non-deterministic system, and a handoff that survives you leaving.',
    accent: '#b8960c',
  },
  {
    id: 7,
    title: 'Developer Productivity & Operational Enablement',
    short: 'Developer enablement',
    weight: 7,
    items: 4,
    tests:
      'The lightest domain. Team setup for an AI coding tool, enforced versus advisory, unattended runs, and triaging a broken session.',
    accent: '#4a7c8c',
  },
];

export const DOMAIN_BY_ID: Record<DomainId, Domain> = Object.fromEntries(
  DOMAINS.map((d) => [d.id, d]),
) as Record<DomainId, Domain>;

export const DISCLAIMER =
  'This guide and practice test are unofficial and not affiliated with or endorsed by Anthropic. The questions are original, written against the public exam guide and its blueprint objectives. None reproduce live exam content, which is confidential under the candidate NDA. No practice set guarantees a pass.';
