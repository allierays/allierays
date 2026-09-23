// The Claude Certified Architect Professional (CCAR-P) study guide: every
// exam fact and every line of the overview copy, as plain data.
//
// This file stays dependency-free (no JSX, no React) so the page component
// and any script can read it. The question bank lives in ./questions.ts.
//
// Exam facts come from Anthropic's Exam Guide v1.0 (effective July 2026) and
// the Partner Academy certification FAQ. Where a fact comes from candidates
// rather than the guide (the matching item type, the 75% rule of thumb), the
// copy says so. Nothing here reproduces live exam content.

export type DomainId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const GUIDE = {
  slug: 'claude-architect-professional-practice-exam',
  kicker: 'Study guide',
  title: 'The Claude Certified Architect Professional exam, and a practice test for it',
  lede:
    'I passed the Claude Certified Architect Professional (CCAR-P) exam in September 2026. There is no official practice exam, so here is what the exam is, how its questions work, and 63 practice items written to match.',
  // Teal on pale teal: the same family as the site's action gradient, so the
  // card reads as native rather than as a third palette.
  accent: { bg: '#E3EEF0', color: '#35656E' },
  readMinutes: 4,
};

// The page's sections, in order. The sidebar lists these; each id is the
// anchor.
export const SECTIONS = [
  { id: 'overview', label: 'What the exam is' },
  { id: 'blueprint', label: 'The seven domains' },
  { id: 'shape', label: 'How questions are shaped' },
  { id: 'quiz', label: 'Practice test' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

// Numbers the practice test uses to mirror the real form.
export const EXAM = {
  code: 'CCAR-P',
  items: 63,
  minutes: 120,
  scaleMin: 100,
  scaleMax: 1000,
  cutScore: 720,
};

export const OVERVIEW = {
  title: 'A partner-track credential for people who design Claude systems end to end',
  body: [
    'It certifies that you can design, build, and run production Claude systems: model and architecture choice, prompt and context engineering, enterprise integration, and evaluation, security, and governance built into the design. It is the second tier of the Architect track, with no prerequisites.',
    'It is built for architects, AI engineers, and tech leads who already ship LLM systems. Anthropic recommends three years of architecture and six months of production LLM work, but the score alone decides.',
  ],
};

export const AT_A_GLANCE: { label: string; value: string }[] = [
  { label: 'Items', value: '63, multiple-choice and multiple-response. Each item says how many to select.' },
  { label: 'Time', value: '120 minutes. Under two minutes per item.' },
  { label: 'Passing score', value: '720 scaled, on 100 to 1,000. Criterion-referenced, not curved.' },
  { label: 'Score report', value: 'Pass or fail, scaled score, and percent-correct per domain.' },
  { label: 'Fee', value: '$175 USD, less partner-tier discounts.' },
  { label: 'Validity', value: '12 months. Renewal is a free, non-proctored assessment.' },
  { label: 'Delivery', value: 'Pearson VUE, online or test center. Closed book, one monitor, photo ID.' },
  { label: 'Eligibility', value: 'Claude Partner Network employees, with a company email.' },
  { label: 'Retakes', value: 'Wait 14, 30, then 90 days. Four attempts per rolling year.' },
];

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

export const SHAPE = {
  title: 'Situational judgment, item by item',
  body: [
    'Every item is a situation: a team, a system, a symptom or a constraint, then which change BEST fixes it, what to do FIRST, or which design is MOST appropriate. Several options are defensible. You pick the best one.',
    'It tests judgment more than API mechanics. Distractors are real techniques at the wrong layer, and the constant clauses (model unchanged, latency unchanged) tell you which layers to rule out.',
  ],
};

export const FORMATS: { name: string; detail: string }[] = [
  {
    name: 'Multiple choice',
    detail: 'Four options, one correct. Most of the exam.',
  },
  {
    name: 'Multiple response',
    detail: 'Usually two of five. The item says how many. Assume no partial credit.',
  },
  {
    name: 'Scenario matching',
    detail: 'Short scenarios, one shared option set, options can repeat. Reported by candidates, not in the guide.',
  },
];

// The distractor patterns. Naming them is most of the trick to reading an
// item quickly.
export const TELLS: { name: string; example: string }[] = [
  { name: 'Over-built', example: 'A multi-agent system for three fixed steps.' },
  { name: 'Wrong layer', example: 'A bigger model for an authorization or freshness problem.' },
  { name: 'Compensating control', example: 'Log or confirm instead of removing the capability.' },
  { name: 'Lossy shortcut', example: 'Truncate the document. Cap output tokens.' },
  { name: 'Wrong metric', example: 'Better quality when the scenario asked for latency.' },
  { name: 'Prompt as enforcement', example: 'A prompt sentence where a deny rule, sandbox, or human gate is needed.' },
  { name: 'Skipped measurement', example: 'Ship and watch for complaints. Pick the model before defining success.' },
];

export const RIGHT_ANSWER =
  'The best answer is usually the simplest design that meets the stated constraint, at the layer where the problem lives, with a measurement attached.';

export const DISCLAIMER =
  'This guide and practice test are unofficial and not affiliated with or endorsed by Anthropic. The questions are original, written against the public exam guide and its blueprint objectives. None reproduce live exam content, which is confidential under the candidate NDA. No practice set guarantees a pass.';

export const SOURCES: { label: string; href: string }[] = [
  {
    label: 'CCAR-P Exam Guide v1.0 (PDF)',
    href: 'https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2F6nizmqk8tpzpfjvt6qmmav7rh%2Fpublic%2F1783542810%2FClaude+Certified+Architect+%E2%80%93+Professional+Exam+Guide.pdf',
  },
  {
    label: 'Prep learning path on the Partner Academy',
    href: 'https://anthropic-partners.skilljar.com/path/claude-certified-architect-professional',
  },
  {
    label: 'Certification FAQ',
    href: 'https://anthropic-partners.skilljar.com/page/faq-certifications',
  },
  {
    label: 'Partner certifications hub',
    href: 'https://anthropic-partners.skilljar.com/page/partner-certifications',
  },
  {
    label: 'Pearson VUE: Anthropic exams',
    href: 'https://www.pearsonvue.com/us/en/anthropic.html',
  },
];
