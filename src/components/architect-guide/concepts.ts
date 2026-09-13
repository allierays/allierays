// Plain concept data for the Applied AI architecture field guide.
//
// The serializable half: names, colors, icons, and the try-this prompt. The
// guide keeps its own JSX (the diagrams, the prose, the cards) and spreads
// these in by key, so a name or a color is defined in exactly one place.
//
// Three clusters, four concepts each. A cluster is one rail item; its concepts
// sit behind a sub-tab strip, the way the Codex guide holds its recipes.

export type ClusterKey = 'design' | 'integration' | 'evaluation';

export type ConceptKey =
  // solution design & architecture
  | 'augmented'
  | 'form'
  | 'patterns'
  | 'multiagent'
  // integration
  | 'tools'
  | 'protocols'
  | 'retrieval'
  | 'discovery'
  // evaluation, testing & optimization
  | 'criteria'
  | 'graders'
  | 'diagnose'
  | 'levers';

export interface ClusterMeta {
  key: ClusterKey;
  name: string;
  short: string;
  /** The question this cluster answers, shown above the sub-tabs. */
  question: string;
  bg: string;
  color: string;
  iconPath: string;
}

export interface ConceptMeta {
  key: ConceptKey;
  cluster: ClusterKey;
  /** Full name, used as the card headline. */
  name: string;
  /** Shorter label for the sub-tab pill. */
  label: string;
  bg: string;
  color: string;
  iconPath: string;
  /** A prompt worth pasting into Claude against your own use case. */
  tryThis?: string;
}

// Heroicons outline, 24x24, stroke-based.
export const ICONS: Record<string, string> = {
  play:
    'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z',
  squares:
    'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z',
  link:
    'M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244',
  chart:
    'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
  cube:
    'm21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25',
  fork: 'M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5',
  puzzle:
    'M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z',
  users:
    'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 1 1 5.25 0Z',
  wrench:
    'M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409',
  globe:
    'M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418',
  search: 'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z',
  folder:
    'M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z',
  check: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  scale:
    'M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z',
  monitor:
    'M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25',
  sliders:
    'M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75',
};

// Cluster palette. These accents are the ones already tuned against the site's
// warm-paper tokens, so the guide sits on the page instead of shouting at it.
const DESIGN = { bg: '#DCE3EC', color: '#2D4059' };
const INTEGRATION = { bg: '#F7DED5', color: '#A9512F' };
const EVALUATION = { bg: '#DFE8DA', color: '#4C6942' };

export const CLUSTER_META: Record<ClusterKey, ClusterMeta> = {
  design: {
    key: 'design',
    name: 'Solution Design & Architecture',
    short: 'choosing the shape',
    question: 'What shape should this be?',
    iconPath: ICONS.squares,
    ...DESIGN,
  },
  integration: {
    key: 'integration',
    name: 'Integration',
    short: 'reaching other systems',
    question: 'How does it reach the rest of the world?',
    iconPath: ICONS.link,
    ...INTEGRATION,
  },
  evaluation: {
    key: 'evaluation',
    name: 'Evaluation, Testing & Optimization',
    short: 'knowing it works',
    question: 'How do you know it works?',
    iconPath: ICONS.chart,
    ...EVALUATION,
  },
};

export const CONCEPT_META: Record<ConceptKey, ConceptMeta> = {
  augmented: {
    key: 'augmented',
    cluster: 'design',
    name: 'The augmented LLM',
    label: 'Augmented LLM',
    iconPath: ICONS.cube,
    ...DESIGN,
  },
  form: {
    key: 'form',
    cluster: 'design',
    name: 'Workflow or agent',
    label: 'Workflow or agent',
    iconPath: ICONS.fork,
    tryThis:
      'Here is a task I want to automate: [describe it]. Run it through four checks and answer each one plainly. Is the task complex enough that the steps cannot be written down in advance? Is the output valuable enough to justify extra tokens and latency? Can the model actually do it with the tools I can give it? And what does a wrong answer cost me? If any check fails, tell me which one and design the workflow instead.',
    ...DESIGN,
  },
  patterns: {
    key: 'patterns',
    cluster: 'design',
    name: 'The five workflow patterns',
    label: 'Five patterns',
    iconPath: ICONS.puzzle,
    tryThis:
      'I have a task with these steps: [list them]. Tell me which of the five workflow patterns fits best and why the other four are worse for this case. The five are prompt chaining, routing, parallelization, orchestrator-workers, and evaluator-optimizer. Do not pick the most sophisticated one. Pick the simplest one that meets the requirement, and say what I give up by choosing it.',
    ...DESIGN,
  },
  multiagent: {
    key: 'multiagent',
    cluster: 'design',
    name: 'Multi-agent and the delegation contract',
    label: 'Multi-agent',
    iconPath: ICONS.users,
    tryThis:
      'I am considering splitting this into multiple agents: [describe the work]. First tell me whether the subtasks share context or depend on each other, because if they do, one agent is the right answer. If a split is genuinely warranted, write the delegation contract for each subagent: its objective, the exact output format it must return, which tools and sources it may use, and what it must not do.',
    ...DESIGN,
  },
  tools: {
    key: 'tools',
    cluster: 'integration',
    name: 'Tools, and capability bloat',
    label: 'Tools and bloat',
    iconPath: ICONS.wrench,
    tryThis:
      'Here is my tool list with descriptions: [paste it]. For each tool, tell me whether this workflow could ever need it, and flag the ones I should delete outright rather than guard with a permission prompt. Then find tools that act on the same object and travel together, and show me how to consolidate them into one tool with an action enum.',
    ...INTEGRATION,
  },
  protocols: {
    key: 'protocols',
    cluster: 'integration',
    name: 'MCP, direct tools, or agent-to-agent',
    label: 'MCP or tools or A2A',
    iconPath: ICONS.globe,
    ...INTEGRATION,
  },
  retrieval: {
    key: 'retrieval',
    cluster: 'integration',
    name: 'Retrieval, matched to the data',
    label: 'Retrieval',
    iconPath: ICONS.search,
    tryThis:
      'My corpus is [describe the documents, roughly how many tokens, and how often they change]. My users ask questions that look like [give three real examples]. Start by telling me whether I need retrieval at all or whether the whole corpus fits in context. If I do need it, tell me whether my queries are lexical or paraphrased, and pick the retriever from that rather than from what is fashionable.',
    ...INTEGRATION,
  },
  discovery: {
    key: 'discovery',
    cluster: 'integration',
    name: 'Progressive discovery',
    label: 'Progressive discovery',
    iconPath: ICONS.folder,
    tryThis:
      'Count the tokens my tool definitions and always-loaded instructions actually occupy right now: [paste them]. Give me the number first. If it is under ten thousand tokens, tell me to leave it alone. If it is larger, tell me which mechanism to reach for and why, and which three to five tools should stay loaded on the hot path.',
    ...INTEGRATION,
  },
  criteria: {
    key: 'criteria',
    cluster: 'evaluation',
    name: 'Success criteria, as numbers',
    label: 'Success criteria',
    iconPath: ICONS.check,
    tryThis:
      'A stakeholder asked me for this: [paste the request in their words]. Turn it into success criteria I could actually fail. Each one needs a metric, a target number, and how it gets measured. Cover task fidelity, latency, and cost at minimum. Where the request is too vague to produce a number, say so and tell me the question I need to go ask.',
    ...EVALUATION,
  },
  graders: {
    key: 'graders',
    cluster: 'evaluation',
    name: 'Graders, and pass^k',
    label: 'Graders and pass^k',
    iconPath: ICONS.scale,
    tryThis:
      'Here is a task my system performs: [describe it, with one good output and one bad one]. Tell me whether to grade it with code, a human, or a model, and justify the choice by whether the output has one checkable answer. If a model grades it, write the rubric as binary pass or fail with a required critique, and tell me what I should measure to know the grader agrees with me.',
    ...EVALUATION,
  },
  diagnose: {
    key: 'diagnose',
    cluster: 'evaluation',
    name: 'Diagnose the layer that changed',
    label: 'Diagnose',
    iconPath: ICONS.monitor,
    tryThis:
      'My system started doing this: [describe the bad behavior, when it started, and what shipped around then]. Do not suggest a prompt rewrite yet. First tell me which layer to inspect and in what order, what stop_reason and the usage fields would tell me, and what single measurement would confirm or eliminate your first hypothesis.',
    ...EVALUATION,
  },
  levers: {
    key: 'levers',
    cluster: 'evaluation',
    name: 'Cost and latency levers, in order',
    label: 'Cost and latency',
    iconPath: ICONS.sliders,
    tryThis:
      'Here is my request shape and roughly what it costs: [describe the prompt, the volume, and the latency requirement]. Walk the levers in order and stop at the first one that meets my requirement: effort level, batch, prompt caching, then a smaller model. For each one you skip, say why it does not apply. Do not open with a recommendation to switch models.',
    ...EVALUATION,
  },
};

export const CLUSTER_ORDER: ClusterKey[] = ['design', 'integration', 'evaluation'];

export const CONCEPTS_BY_CLUSTER: Record<ClusterKey, ConceptKey[]> = {
  design: ['augmented', 'form', 'patterns', 'multiagent'],
  integration: ['tools', 'protocols', 'retrieval', 'discovery'],
  evaluation: ['criteria', 'graders', 'diagnose', 'levers'],
};
