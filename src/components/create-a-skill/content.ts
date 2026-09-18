// "How to create a great skill": every word of the guide, as plain data.
//
// This file stays dependency-free (no JSX, no router, no motion imports) so the
// page component and the visuals can both read it without pulling anything in.
//
// Scope: this is an agent-agnostic guide grounded in the open Agent Skills
// standard, not a walkthrough of any one product's UI. The basics of what a
// skill is live in the ChatGPT & Codex Field Guide; this guide links there
// rather than repeating them.
//
// Every number carries a source. The five principles are the points on which
// ten sources agree (Anthropic's authoring guide and skill-creator, the Agent
// Skills spec at agentskills.io, OpenAI's build-skills docs, SkillsBench,
// Arize's analysis of it, PostHog, Google Cloud, Phil Schmid, Databricks).

// The hero walkthrough. A YouTube id; left empty, the hero shows a "coming
// shortly" placeholder rather than a broken embed.
export const WALKTHROUGH_YOUTUBE_ID = '';

export const GUIDE = {
  slug: 'create-a-skill',
  title: 'How to create a great skill',
  kicker: 'Guide',
  readMinutes: 8,
  lede: 'A skill is a reusable set of instructions and tools that helps an AI agent do a specific kind of work well.',
  // Generic examples of the work a team's skills take on.
  examplesIntro: 'The skills a team installs tell the agent how to:',
  examples: [
    'write in your brand voice',
    'apply your colours and type to a deck',
    'build a customer story',
    'answer a question about your product',
    'write a board-ready deal summary',
  ],
  playbook:
    'Think of it as a playbook: when you ask for something that matches, the agent follows that playbook, so the result is more consistent and can use the right tools or checks. Skills can be built in, installed for your workspace, or written by your team for the work you repeat.',
  // The Field Guide's Skills concept colours (Peach on Amber), so the guide
  // reads as part of that concept rather than a new one.
  accent: { bg: '#FFDDCC', color: '#B05C3B' },
  fieldGuide: { label: 'Skills in the Field Guide', to: '/posts/chatgpt-codex-field-guide' },
};

// The page's sections, in order. The sidebar lists these; each section's id
// is the anchor.
export const SECTIONS = [
  { id: 'what', label: 'What is a skill' },
  { id: 'why', label: 'Why skills' },
  { id: 'how', label: 'How skills work' },
  { id: 'write', label: 'Creating a skill' },
  { id: 'advanced', label: 'Advanced skill techniques' },
  { id: 'checklist', label: 'Building a skill checklist' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

// The hook, spoken at the top of "How to write a great skill". Structure: the
// common unseen mistake. Name the misconception, then the mistake is obvious.
export const HOOK = {
  title: 'Five decisions behind a great skill',
  body: [
    'Five things separate the skills people use every week from the ones that sit in the list untouched. None of them need code. Work down them as you build.',
  ],
  // The divider that opens the writing half: names the section, then lists the
  // five before any of them is unpacked.
  videoHeader: 'Create a great skill',
  videoTagline: 'five practices for building a useful, reliable skill',
  videoIconPath: 'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z',
  // The two that matter most, for the video's opening card pair.
  cards: [
    { title: 'It says when to use it', body: 'One sentence tells ChatGPT this is the job.' },
    { title: 'It says only what you know', body: 'The part ChatGPT gets wrong on its own, not a manual.' },
  ],
};

// The example SKILL.md drawn on screen in the hero and the anatomy scene.
//
// It is brand-humanizer: the same skill principle 1 quotes and the worked
// example takes apart, so the page carries one example end to end rather than
// introducing a new one at each section.
//
// `description` is the first two sentences of the skill's description. The full
// one runs to three sentences and nine lines in this card; principle 1 shows all
// three, and the third is the only part held back.
export const SAMPLE_SKILL = {
  name: 'brand-humanizer',
  description:
    'Writes marketing copy that does not read as AI-generated, without inventing facts. Use when producing or editing any customer-facing content: slide decks, PDFs, one-pagers, RFP answers, customer and prospect emails, blog posts, help centre articles, Slack posts, project updates and exec updates.',
  body: [
    'Name the source for the claim, or cut the claim.',
    'No marketing clichés. Say the specific thing instead.',
    "Another company's name only where competitors.md allows it.",
    'Run scripts/check.py before handing it over. Do not do its job by eye.',
  ],
  // Matches WORKED_EXAMPLE.tree: one folder, described the same way twice.
  files: ['SKILL.md', 'references/examples.md', 'scripts/check.py', 'references/brand-language.md'],
};

// What a skill is, and how much of it the model carries at any moment. The
// three tiers are why a skill folder can hold more than a context window and
// still cost almost nothing until it is used.
export const ANATOMY = {
  // Allie, Sep 10: the folder-versus-file point is NOT the message of this
  // section. It is a detail. The headline carries the part of the definition
  // that matters to a non-engineer: you write a skill in plain English.
  title: 'Reusable packages of instructions, written in natural language',
  body: [
    // Allie's definition (Sep 10), verbatim. Do not tidy it, including the US
    // "specialized". The paragraph below it stays agentskills.io verbatim.
    'A skill gives an AI agent reusable instructions for a specific task. You write it in plain English. No code required.',
    'At its core, a skill is a folder containing a SKILL.md file. This file includes metadata (name and description, at minimum) and instructions that tell an agent how to perform a specific task. Skills can also bundle scripts, reference materials, templates, and other resources.',
  ],
  // The video's scene header. Deliberately not SECTIONS[0].label, which drives
  // the web page's sidebar and stays sentence case there.
  videoHeader: 'What is a skill?',
  // The Field Guide's concept lockup: icon tile, name, tagline. Same cube the
  // page uses on the installable-skill cards.
  videoTagline: 'reusable instructions for one kind of work',
  videoIconPath: 'm21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
  // Restates what the tree on the right is showing, in the Field Guide's
  // "Best for" shape. Not new facts: SKILL.md is the instructions, references
  // and assets are the context, scripts are optional.
  videoListLabel: "What's inside",
  videoList: [
    'Instructions, written in plain English',
    'Context: references, templates, examples',
    'Scripts, only if it needs them',
  ],
  // The one line of body copy the video carries, under its headline. The page
  // has room for the full paragraph; the frame does not.
  videoNote: 'A great skill is not a long prompt. It is a small, testable contract for one job.',
  // Points readers at the Field Guide for the basics instead of repeating them.
  fieldGuideNote: 'New to skills? The Skills tab in the Field Guide covers what one is for, where it runs, and how to use it.',
  // The shape, as the standard publishes it at agentskills.io/home.
  tree: [
    { path: 'my-skill/', kind: 'dir' as const, depth: 0, note: '' },
    { path: 'SKILL.md', kind: 'file' as const, depth: 1, note: 'Required: metadata + instructions' },
    { path: 'scripts/', kind: 'dir' as const, depth: 1, note: 'Optional: executable code' },
    { path: 'references/', kind: 'dir' as const, depth: 1, note: 'Optional: documentation' },
    { path: 'assets/', kind: 'dir' as const, depth: 1, note: 'Optional: templates, resources' },
  ],
  note: 'Only SKILL.md is required. Everything else is there when the work needs it, which is why one skill can hold more material than a context window and still cost almost nothing until it is used.',
};

// Why anyone should bother. Straight from agentskills.io/home, with the three
// benefits in the standard's own words.
export const WHY = {
  title: 'Why skills',
  body: [
    'Agents are increasingly capable, but often do not have the context they need to do real work reliably. Skills solve that by packaging procedural knowledge, and company, team, and user specific context, into portable, version controlled folders that agents load on demand.',
  ],
  // The four core benefits, per Allie (Sep 10). Sources: agentskills.io,
  // Anthropic's engineering post and skill docs, Microsoft's agent framework
  // skills page, and Google Cloud. `short` is the video's one-liner; `body` is
  // the full description the page carries.
  items: [
    {
      key: 'context',
      title: 'Save context space',
      short: 'Loads only when it triggers',
      body: 'Progressive disclosure loads the instructions only when the skill triggers, which keeps the context window from filling up with guidance nobody is using.',
      color: '#B05C3B',
      bg: '#FFDDCC',
    },
    {
      key: 'repetition',
      title: 'Reduce repetition',
      short: 'Write it once, not in every chat',
      body: 'Define the guidelines once, in a version-controlled file, instead of typing them into every new chat.',
      color: '#35656E',
      bg: '#D3E9EE',
    },
    {
      key: 'consistency',
      title: 'Improve consistency',
      short: 'The same result every time',
      body: 'Turn a complex, recurring task into a structured, repeatable procedure that comes out the same way twice.',
      color: '#51714B',
      bg: '#DDF1DA',
    },
    {
      key: 'portable',
      title: 'Share useful workflows',
      short: 'Move or publish them when the team needs them',
      body: 'Skills use the same format across agents, but sharing and local installation differ by tool.',
      color: '#7A6636',
      bg: '#FFF4CE',
    },
  ],
  // The video's lockup and chip. "Agents are capable. They are missing your
  // context" compressed the source so hard it stopped making sense: it dropped
  // the "to do real work reliably" the whole argument rests on. The paragraph
  // and chip below are the source's two sentences, split.
  videoHeader: 'Why use skills?',
  videoTagline: 'context agents can load on demand',
  videoBody:
    "Agents are increasingly capable, but often don't have the context they need to do real work reliably.",
  videoNote:
    "Skills package procedural knowledge and your team's context into focused folders agents load on demand.",
  videoIconPath:
    'M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
  // What you actually use them for, which is the four benefits in one line.
  usage: 'You use skills to replace bloated system prompts, stop repeating instructions across chats, keep multi-step work consistent, and load context only when it is needed.',
};

// How they work. The three stages of progressive disclosure, verbatim in
// substance from agentskills.io/home; the token and line costs come from the
// specification's progressive disclosure section.
export const HOW = {
  title: 'Agents load skills through progressive disclosure',
  body: [
    'A long prompt brings every instruction into the conversation at once. Skills keep the starting context small and bring in more only when the task matches.',
    'The agent discovers a skill from its name and one-line summary, loads SKILL.md when relevant, then opens supporting files as needed.',
  ],
  stages: [
    {
      key: 'discovery',
      number: 1,
      label: 'Discovery',
      when: 'At startup',
      short: 'The name and one-line summary of available skills',
      body: 'The agent loads only the metadata of each available skill into the system prompt, just enough to know what is available.',
      cost: 'A small discovery footprint',
      share: 1,
      color: '#B05C3B',
      bg: '#FFDDCC',
    },
    {
      key: 'activation',
      number: 2,
      label: 'Activation',
      when: 'When a task matches the summary',
      short: 'The full SKILL.md, read into context',
      body: "When a task matches a skill's description, the agent reads the full SKILL.md instructions into its active context.",
      cost: 'Keep the main instructions focused',
      share: 0.55,
      color: '#35656E',
      bg: '#D3E9EE',
    },
    {
      key: 'execution',
      number: 3,
      label: 'Execution',
      when: 'Only as the work needs it',
      short: 'Reference files and scripts, only as needed',
      body: 'The agent follows the workflow, reading referenced files or running bundled scripts only as the task requires.',
      cost: 'Supporting files load only when needed',
      share: 0.22,
      color: '#51714B',
      bg: '#DDF1DA',
    },
  ],
  // The video's lockup and chip.
  videoHeader: 'How do skills work?',
  videoTagline: 'progressive disclosure means starting small, then loading more as needed',
  videoNote: "This keeps the starting context small and makes the skill's one-line summary important.",
  videoIconPath:
    'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125',
  note: 'Agents have to balance being feature-rich with staying responsive. The tiered approach is how: it reaches for the instructions the task needs instead of loading the whole library at once, so the agent stays both lightweight and specialised for the whole session.',
};

export const FORMAT_CHOICE = {
  eyebrow: 'Choose the right tool',
  title: 'Skill, workflow, or agent?',
  items: [
    {
      name: 'Skill',
      role: 'Reusable guidance',
      use: 'Use when AI should apply the same expertise to many requests.',
      example: 'Write a customer story in our house style.',
      color: '#B05C3B',
      bg: '#FFDDCC',
    },
    {
      name: 'Workflow',
      role: 'Repeatable sequence',
      use: 'Use when steps and handoffs should happen in a set order.',
      example: 'Route an approved story to web, email, and Slack.',
      color: '#35656E',
      bg: '#D3E9EE',
    },
    {
      name: 'Agent',
      role: 'Ongoing ownership',
      use: 'Use when the work needs judgment and follow-through as things change.',
      example: 'Run the launch and keep stakeholders updated.',
      color: '#51714B',
      bg: '#DDF1DA',
    },
  ],
  note: 'Agents use skills to apply expertise while they run workflows.',
};

export const SKILL_SURFACES = {
  title: 'Local and ChatGPT skills are managed separately',
  local: {
    name: 'Local',
    product: 'Codex and desktop projects',
    points: [
      'Lives in your file system or repository',
      'Can work with local files and scripts, subject to permissions',
      'Shared through files, repositories, or managed installation',
    ],
    invoke: 'Use $ to select it',
    color: '#35656E',
    bg: '#D3E9EE',
  },
  workspace: {
    name: 'ChatGPT.com',
    product: 'Share skills with your team',
    points: [
      'Publish once so teammates can discover and install it',
      'Workspace permissions control who can use it',
      'Uses uploaded files and connected sources',
    ],
    invoke: 'Use @ to select it',
    color: '#51714B',
    bg: '#DDF1DA',
  },
  note: 'Build and test locally. Publish in ChatGPT when it is ready for the team.',
};

// The open standard the folder follows. Facts from agentskills.io (the
// standard's home: spec, client showcase, GitHub) and OpenAI's build-skills
// docs, September 2026. Cite the site, not commentary about it.
export const STANDARD = {
  title: 'It follows an open standard',
  body: [
    'The layout is the Agent Skills specification, the open standard managed at agentskills.io: created by Anthropic, developed in the open on GitHub, and read by Claude, ChatGPT, and dozens of other agents.',
  ],
  required: [
    { field: 'name', rule: 'Up to 64 characters, lowercase and hyphens. Matches the folder name.' },
    { field: 'description', rule: 'Up to 1,024 characters. What it does and when to use it.' },
  ],
  optional: [
    { field: 'license', rule: 'Licence it is shared under.' },
    { field: 'compatibility', rule: 'What it needs to run.' },
    { field: 'metadata', rule: 'Version, owner, anything else.' },
    { field: 'allowed-tools', rule: 'Tools it may use without asking. Experimental.' },
  ],
  portableTitle: 'What travels, and what stays behind',
  portable: [
    { path: 'SKILL.md and the folders', note: 'Standard. Runs anywhere that reads the spec.' },
    { path: 'agents/openai.yaml', note: "OpenAI's own file. Display name, icon, invocation rules." },
    { path: 'Platform header fields', note: 'Anything a product adds beyond the spec.' },
  ],
  note: 'The standard parts travel. The platform-specific ones stay behind, which is why a skill built in one agent still works in another even though it may look a little plainer there.',
  href: 'https://agentskills.io/specification',
};

export interface Evidence {
  /** The number as people read it, e.g. "+21.5 pts". */
  figure: string;
  /** What the figure is. */
  label: string;
  /** Bar length for the chart, 0..1. */
  share: number;
  /** Sits on the bar in the accent colour when true. */
  highlight?: boolean;
}

export interface Principle {
  key: string;
  number: number;
  /** States the point, not the topic. */
  title: string;
  /** Two or three words, for the divider that lists all five. */
  label: string;
  /** The half-sentence that follows the label on the divider. */
  blurb: string;
  /** The reasoning, folded away on the page; the video speaks a summary. */
  body: string[];
  /** Three short chips. */
  rules: string[];
  /** Which visual the page and the video draw for this principle. */
  visual: 'description' | 'bars' | 'freedom' | 'loop' | 'bars-count' | 'gotchas' | 'scope';
  evidence?: { title: string; bars: Evidence[]; source: string };
  /** One line, shown under the title and spoken in the video. */
  takeaway: string;
}

// The five, per Allie (Sep 10): "keep it to the best 5". Chosen from where the
// 2026 sources converge, see RESEARCH.md. Two changes from the old set:
//
//   - "A person curates, a test gates" folded into 2, because doing the task
//     once without a skill is both how you source it and how you baseline it.
//   - "Fewer skills beat more" folded into 3: scope is a context decision.
//
// That made room for the two practices every current source has and we did
// not: sourcing from real expertise, and vetting a skill before running it.
// The five, per Allie (Sep 10), verbatim as she gave them. Framed as things you
// do, in the order you do them, rather than properties a finished skill has.
//
// Security vetting is deliberately NOT one of the five: it is about installing
// someone else's skill, not writing your own, so it lives in the install
// section instead. The research behind all of this is in RESEARCH.md.
// The five, ordered as the reader's own journey rather than as a ranking of
// what matters. They have never written a skill; these are the five questions
// they will hit, in the order they hit them:
//
//   what do I make one for -> how do I start -> will it fire -> what goes in
//   it -> is it any good
//
// Gotchas deliberately sit inside 2 rather than standing alone: you cannot
// write down a gotcha before doing the work that surfaces it, and "write down
// every correction you made" produces them where "write down the gotchas"
// only names them. Research in RESEARCH.md.
// The five, mapped onto the top-level sections of Anthropic's own authoring
// guide (platform.claude.com .../agent-skills/best-practices), which is the
// most complete statement of this that exists:
//
//   1 <- "Skill structure > Writing effective descriptions"
//   2 <- "Core principles > Concise is key" (Claude is already very smart)
//   3 <- "Skill structure > Progressive disclosure patterns"
//   4 <- "Core principles > Degrees of freedom" + "Workflows and feedback loops"
//   5 <- "Evaluation and iteration > Build evaluations first"
//
// Gotchas sit in 2 because a gotcha is the purest case of the thing that
// section is about: a fact the model would otherwise get wrong.
export const PRINCIPLES: Principle[] = [
  {
    key: 'pick',
    number: 1,
    title: 'Define one job',
    label: 'One clear job',
    blurb: 'Name the inputs, the output, and what good looks like.',
    body: [
      'Start by describing the finished result and the expertise the skill should apply. “Turn approved customer call notes into a publish-ready customer story using our template and voice guidelines” gives the skill a clear job. “Help with customer content” does not.',
      'Name the output, audience, source material, and any standard it must meet. A template, example, or short acceptance checklist makes “good” visible instead of leaving the model to guess.',
      'Keep the finish line to one coherent result. If the request produces different deliverables for different owners, split it into separate skills or let a workflow coordinate them.',
      'This result becomes the anchor for every later decision: when the skill should be used, which context it needs, which steps matter, and how you will test it.',
    ],
    rules: ['One focused job', 'Clear inputs and output', 'A testable quality bar'],
    visual: 'scope',
    evidence: {
      title: 'How much better than no skill, by how many are switched on',
      bars: [
        { figure: '+18.0 pts', label: 'One skill', share: 0.95 },
        { figure: '+19.0 pts', label: 'Two or three skills', share: 1, highlight: true },
        { figure: '+10.1 pts', label: 'Big bundles', share: 0.53 },
      ],
      source: 'Arize analysis of SkillsBench routing (2026)',
    },
    takeaway: 'A great skill starts with one job you can test.',
  },
  {
    key: 'description',
    number: 2,
    title: 'Say when to use it',
    label: 'When to use it',
    blurb: 'Give examples of requests that should and should not use the skill.',
    body: [
      'Skill Creator turns your answers into the one-line summary the agent uses to decide whether to open the skill.',
      'Give it examples in the language people actually use. “Turn these call notes into a customer story” is more useful than an internal label such as “customer content.”',
      'Include clear yes and no examples. Say which requests need this expertise, which are close but different, and when another skill or workflow is a better fit.',
      'Review the summary Skill Creator produces. It should say what the skill does and draw the boundary clearly enough that the right requests find it.',
    ],
    rules: ['Use real request language', 'Give yes and no examples', 'Check the summary it creates'],
    visual: 'description',
    takeaway: 'Clear examples teach AI when to use the skill.',
  },
  {
    key: 'short',
    number: 3,
    title: 'Add the expertise it needs',
    label: 'The right expertise',
    blurb: 'Give it the guidance, examples, and templates it cannot infer.',
    body: [
      'Give Skill Creator the expertise a capable model will not already know: your approved guidance, strong examples, templates, and important exceptions.',
      'Challenge every addition. A skill does not need an explanation of what a PDF is. It may need to know which template your team uses or which claims require a source.',
      'Attach trusted reference files when the detail matters. Tell Skill Creator which material applies to which work so it can organize the files and instructions clearly.',
      'Call out the traps you correct most often. For example, do not decide from memory whether another company is a competitor. Check the approved list.',
    ],
    rules: ['Add only expertise AI lacks', 'Provide trusted references', 'Flag important exceptions'],
    visual: 'gotchas',
    evidence: {
      title: 'How much better than no skill, by how much the skill says',
      bars: [
        { figure: '+19.0 pts', label: 'Short and specific', share: 0.88 },
        { figure: '+21.5 pts', label: 'Medium length', share: 1, highlight: true },
        { figure: '+0.7 pts', label: 'Long and thorough', share: 0.04 },
      ],
      source: 'Arize analysis of SkillsBench (Li et al., 2026)',
    },
    takeaway: 'Give it the expertise your team uses to do the job well.',
  },
  {
    key: 'steps',
    number: 4,
    title: 'Make the process reliable',
    label: 'A reliable process',
    blurb: 'Give direct steps, decision rules, tools, and checks.',
    body: [
      'The first practice defines the destination. This one explains the route. Write down the parts of the method a capable teammate could not safely infer.',
      'Put important steps in order. At each decision point, explain what to look for and which path to take instead of listing every possible situation.',
      'Name any tools or supporting files at the moment they are needed. “Check the claims guide before drafting” is more useful than “See references for details.”',
      'Add checks where an error matters: compare against the template, confirm every claim has a source, or verify required fields are present.',
    ],
    rules: ['Use direct, ordered steps', 'Explain key decisions', 'Use scripts only when needed'],
    visual: 'freedom',
    takeaway: 'Make the method clear enough to repeat, not rigid for its own sake.',
  },
  {
    key: 'test',
    number: 5,
    title: 'Test when and how it works',
    label: 'Real tests',
    blurb: 'Use evals to check whether it opens for the right requests and the work meets the bar.',
    body: [
      'Build the evaluations before writing extensive instructions. Otherwise you document the problems you imagined rather than the ones the model actually has. Run the task without a skill first, write down where it fell short, and build three scenarios that test exactly those gaps.',
      'Keep the run without the skill. It is your baseline, and the difference between the two is the only honest measure of whether the skill helped. Skills nobody edited scored below no skill at all on the benchmark; edited ones lifted the pass rate from 33.9 to 50.5 percent.',
      'Test with the requests people will really send: routine ones, awkward ones, and a few near-misses that should not trigger it at all. The near-misses are what find an over-broad description, and they have to be genuinely tempting to be worth running. Check the result, not just the reply: "the chart has labelled axes" can be graded, "the output is good" cannot.',
      'Then watch how it actually uses the skill. Does it read the files in an order you did not expect? Does it miss a reference you thought was obvious? Does it never open one at all? Each of those is a fix, and every correction you make by hand afterwards is the next line of the skill.',
    ],
    rules: ['Test requests that should trigger', 'Test near-misses that should not', 'Use evals to score the result'],
    visual: 'loop',
    evidence: {
      title: 'Average pass rate on SkillsBench',
      bars: [
        { figure: '33.9%', label: 'No skill at all', share: 0.67 },
        { figure: '50.5%', label: 'A person edited it', share: 1, highlight: true },
        { figure: '22 to 26%', label: 'The model wrote it alone', share: 0.48 },
      ],
      source: 'SkillsBench, arXiv 2602.12670',
    },
    takeaway: 'If it runs at the wrong time or misses the quality bar, it is not ready.',
  },
];

// Principle 1: examples that sharpen a vague request into a result the skill
// can reliably aim for.
export const SCOPE_EXAMPLES = [
  {
    job: 'Turn approved call notes into a publish-ready customer story using our template and voice guidelines',
    ok: true,
    why: 'The source, output, expertise, and quality bar are clear',
  },
  {
    job: 'Make our content better',
    ok: false,
    why: 'There is no output or definition of “better”',
  },
  {
    job: 'Write something from this call',
    ok: false,
    why: 'The format, audience, and finish line are missing',
  },
  {
    job: 'Create the story and run the launch',
    ok: false,
    why: 'Two outcomes need two separate pieces of work',
  },
];

// Gotchas, shown rather than described. Each pair is a reasonable assumption
// and the fact that overrides it, taken from rules that are in the skill because
// someone got them wrong first.
export const GOTCHAS = [
  {
    assume: 'That company is clearly a competitor.',
    actually: 'Some partners are described that way online. Check the approved list.',
  },
  {
    assume: 'The customer count is about 9,000.',
    actually: 'It changes. Check the source of truth, or leave the number out.',
  },
  {
    assume: 'Our product keeps customers compliant.',
    actually: 'The product provides the tools. Customers own the outcome.',
  },
];

// Principle 1's before-and-after. The good one is a real description from a
// skill in daily use, so it has been through the trigger test.
export const DESCRIPTION_COMPARE = {
  bad: {
    text: 'Helps with company documents and writing.',
    verdict: 'It either never opens, or opens for everything',
    faults: ['Says nothing about when', 'No phrases anyone says', 'Could describe a hundred skills'],
  },
  good: {
    name: 'brand-humanizer',
    segments: [
      {
        text: 'Writes marketing copy that does not read as AI-generated, without inventing facts.',
        videoText: 'Writes content that sounds human and stays factual.',
        part: 'what' as const,
      },
      {
        text: ' Use when producing or editing any customer-facing content: slide decks, PDFs, one-pagers, RFP answers, customer and prospect emails, blog posts, help centre articles, Slack posts, project updates and exec updates.',
        videoText: ' Use for decks, PDFs, emails, blog posts, Slack posts, and project updates.',
        part: 'when' as const,
      },
      {
        text: " Covers the generic AI writing tells, the marketing clichés drafts fill with, your naming and spelling, which claims need a source, how to handle another company's name, and the rules for customer-facing work.",
        videoText: ' Covers AI writing tells, brand language, claims, and competitor names.',
        part: 'scope' as const,
      },
    ],
    verdict: 'Opens for a deck, an RFP answer or a Slack post. Stays shut for code.',
  },
  partLabels: {
    what: { label: 'What it does', color: '#B05C3B', bg: '#FFDDCC' },
    when: { label: 'When to use it', color: '#35656E', bg: '#D3E9EE' },
    scope: { label: 'What it covers', color: '#51714B', bg: '#DDF1DA' },
  },
};

// Principle 4's method: the steps and decisions between request and result.
export const FREEDOM_STOPS = [
  {
    key: 'review',
    label: '1 · Review',
    give: 'Start with the source material',
    example: 'Read the call notes and story template',
    color: '#B05C3B',
    bg: '#FFDDCC',
  },
  {
    key: 'decide',
    label: '2 · Decide',
    give: 'Make the important judgment',
    example: 'Choose the strongest customer outcome',
    color: '#35656E',
    bg: '#D3E9EE',
  },
  {
    key: 'create',
    label: '3 · Create',
    give: 'Follow the agreed method',
    example: 'Draft the story using the template',
    color: '#7A6636',
    bg: '#FFF4CE',
  },
  {
    key: 'check',
    label: '4 · Check',
    give: 'Catch costly mistakes',
    example: 'Confirm claims are sourced and names are correct',
    color: '#51714B',
    bg: '#DDF1DA',
  },
];

// Principle 4's loop, in the order it runs.
export const CURATION_LOOP = [
  { key: 'trigger', label: 'When should it run?', detail: 'Requests it should and should not match' },
  { key: 'evals', label: 'Result evals', detail: 'Score facts, format, and required steps' },
  { key: 'real', label: 'Real requests', detail: 'Routine, difficult, and edge cases' },
  { key: 'fix', label: 'Fix the cause', detail: 'Update the summary, instructions, or files' },
  { key: 'again', label: 'Run again', detail: 'Compare scores with the baseline' },
];

export const CREATE_SECTION = {
  title: 'Create your own skill',
  subtitle: 'Build it locally, then share it when it is ready',
  steps: [
    'Know where it lives',
    'Create it in Codex',
    'Share it in ChatGPT.com',
  ],
};

export const RECAP = {
  title: 'A great skill is focused, useful, and tested',
  items: [
    'One focused job',
    'Clear examples for when to use it',
    'Reference files for detailed expertise',
    'A reliable process',
    'Tests for when and how it works',
  ],
  action: 'Start with $skill-creator',
  note: 'Build locally. Share when it is ready for the team.',
};

// The first practical handoff after the five principles: how a knowledge
// worker creates the folder in Codex without needing to understand its file
// structure first. Based on OpenAI's skill-creator and build-skills guidance.
export const CODEX_BUILD = {
  title: 'Build a skill in Codex',
  steps: [
    { title: 'Open Skill Creator', body: 'Enter $skill-creator in Codex.' },
    { title: 'Describe the task', body: 'Explain the repeatable job and desired result.' },
    { title: 'Give examples of when to use it', body: 'Include requests that should use the skill and close matches that should not.' },
    { title: 'Explain how the work gets done', body: 'Share the steps, decisions, required inputs, and checks.' },
    { title: 'Add supporting materials', body: 'Include trusted guidance, templates, or scripts when needed.' },
    { title: 'Test and refine', body: 'Try real requests and clarify anything it gets wrong.' },
  ],
  source: 'OpenAI: Build skills for ChatGPT and Codex',
};

// The worked example: a skill in daily use, taken apart. Line counts and file
// names are illustrative.
export const WORKED_EXAMPLE = {
  title: 'A real one, taken apart',
  intro: 'The skill from the top of this page, opened up. brand-humanizer keeps company writing from reading as AI-generated, and it shows all five principles in one folder.',
  tree: [
    { path: 'brand-humanizer/', kind: 'dir' as const },
    { path: 'SKILL.md', kind: 'file' as const, note: '140 lines. Workflow, the five nevers, the constraints' },
    { path: 'references/examples.md', kind: 'file' as const, note: 'Before and after pairs per surface' },
    { path: 'references/ai-patterns.md', kind: 'file' as const, note: 'The generic tells' },
    { path: 'references/brand-language.md', kind: 'file' as const, note: 'Clichés, keep-list, spelling' },
    { path: 'references/competitors.md', kind: 'file' as const, note: 'Which company names may appear' },
    { path: 'scripts/check.py', kind: 'file' as const, note: 'Finds the mechanical tells by string match' },
  ],
  callouts: [
    { principle: 1, title: 'The description names the jobs', body: 'Decks, RFP answers, Slack posts, exec updates: the words people use when they ask.' },
    { principle: 2, title: 'Every rule came from something going wrong', body: 'The five nevers are not general advice. Each one is there because it burned someone or created legal exposure.' },
    { principle: 3, title: 'The body is a checklist, not an essay', body: 'Seven steps it ticks off. The long material sits in four separate files.' },
    { principle: 4, title: 'Reasons, and a script for the mechanical part', body: 'Every "never" says why. check.py catches the dashes and placeholders: "run it, do not do its job by eye."' },
  ],
};

// Create, share, use. Three parts, in the order a knowledge worker actually
// meets them: make it on the web where most people already are, share it so the
// team gets it, and only then the local Codex path for people who work in a repo.
//
// The web flow was previously described as "rebuild it on the web by pasting
// your SKILL.md into @skill-creator". That is not the flow: the Skills page
// takes a file upload directly. Mechanics verified against OpenAI's Build
// skills docs, the Skills in ChatGPT help article and the OpenAI Academy
// Skills resource, September 2026.
export const INSTALL = {
  title: 'Create it, share it, use it',
  lede: "Most people should build on the web, where the team can install it with one click. Codex is the other home, for skills that need to read the files in a repo.",
  parts: [
    {
      key: 'create',
      part: 'Part A',
      title: 'Create it on the web',
      color: '#B05C3B',
      bg: '#FFDDCC',
      steps: [
        {
          title: 'Find the Skills page',
          body: 'In the ChatGPT sidebar, open Plugins, then switch to the Skills tab. It is chatgpt.com/skills directly. No Plugins in your sidebar means a workspace owner has not turned skills on yet: they are off by default.',
        },
        {
          title: 'Ask for it in a chat',
          body: 'Start a new chat and say "Build me a skill for...". Give it the job, the inputs, the steps, the output format, and the checks that matter. It writes the SKILL.md and offers to install it.',
        },
        {
          title: 'Or upload one you already have',
          body: 'On the Skills page, Create, then Upload from your computer, and pick the SKILL.md. This is how a skill you wrote in Codex gets onto the web.',
        },
        {
          title: 'Try it before you share it',
          body: 'Type @ and the name to force it. Then ask for the same task in your own words, without the @, and check it opens on its own. That second test is the one that fails.',
        },
      ],
    },
    {
      key: 'share',
      part: 'Part B',
      title: 'Share it with the team',
      color: '#35656E',
      bg: '#D3E9EE',
      steps: [
        {
          title: 'Share, or publish',
          body: 'Both sit behind the ... on the skill\'s row. Share sends it to named teammates. Publish puts it in your workspace library, where anyone can install it.',
        },
        {
          title: 'Published skills show up under Shared',
          body: 'They appear in that section of everyone\'s Skills page with a + to install. The skills your team publishes get there this way.',
        },
        {
          title: 'Write the name and description for the list',
          body: 'The Skills page shows the name and the first line of the description, and nothing else. That one line is the whole decision to install.',
        },
        {
          title: 'If the option is greyed out',
          body: 'Creating, sharing, and installing are three separate workspace permissions. Ask a workspace owner to turn on the right one.',
        },
      ],
    },
    {
      key: 'codex',
      part: 'Part C',
      title: 'Use it locally in Codex',
      color: '#51714B',
      bg: '#DDF1DA',
      steps: [
        {
          title: 'Put the folder where Codex looks',
          body: 'A skill folder in .agents/skills inside a project is available in that project. In ~/.agents/skills it is available in every project on your machine.',
        },
        {
          title: 'Or let skill-creator write it',
          body: 'Type $skill-creator. It asks what the skill does, when it should trigger, and whether it needs scripts. Instruction-only is the default and usually right.',
        },
        {
          title: 'Call it',
          body: 'Type $ and the name, or /skills to see the list. Edits are picked up as you save them; restart Codex if one is not.',
        },
        {
          title: 'Moving it to the web is a manual step',
          body: 'Codex will not upload it for you. When it is ready for the team, upload the SKILL.md on the Skills page yourself.',
        },
      ],
    },
  ],
  links: [
    { label: 'OpenAI Academy: using skills', href: 'https://openai.com/academy/skills/' },
    { label: 'OpenAI: build skills', href: 'https://learn.chatgpt.com/docs/build-skills' },
    { label: 'OpenAI: skills in ChatGPT', href: 'https://help.openai.com/en/articles/20001066-skills-in-chatgpt' },
    { label: 'Open your Skills page', href: 'https://chatgpt.com/skills' },
  ],
};

// The point people get wrong, given its own block rather than a clause in the
// lede: the two homes look like one product and are not connected.
export const HOMES = {
  title: 'One skill, two homes, and no wire between them',
  body: [
    "Uploading a skill to chatgpt.com does not put it in Codex, and a folder in Codex never shows up on the web. It is the same file format in both, so a skill moves either way in a few seconds, but nothing moves it for you. OpenAI's own wording is that skills \"don't sync across products yet\".",
  ],
  columns: [
    { key: 'web', label: 'ChatGPT', where: 'chatgpt.com', color: '#35656E', bg: '#D3E9EE' },
    { key: 'codex', label: 'Codex', where: 'your machine', color: '#51714B', bg: '#DDF1DA' },
  ],
  rows: [
    {
      label: 'Where it lives',
      web: 'Your workspace, on OpenAI\'s servers',
      codex: 'A folder on your disk, or committed to the repo',
    },
    {
      label: 'Where you find it',
      web: 'Plugins in the sidebar, Skills tab, or chatgpt.com/skills',
      codex: '/skills, or the .agents/skills folder',
    },
    { label: 'How you call it', web: 'Type @ and the name', codex: 'Type $ and the name' },
    {
      label: 'Who else gets it',
      web: 'Anyone you share it with, or the whole workspace if you publish',
      codex: 'Only you, unless the folder is committed to a repo',
    },
    {
      label: 'What it is best at',
      web: 'Chat work: decks, documents, answers, research',
      codex: 'Repo work: multi file edits, scripts, anything on disk',
    },
  ],
  note: 'So choose the home for the work, not for the habit. If the team needs it, it belongs on the web. If it needs to read the files, it belongs in Codex. If both, keep the web copy as the one people install and treat the local folder as the draft.',
};

// The Skills page, drawn rather than screenshotted: the same information, on
// brand, and with nobody's chat history in it. Names are illustrative examples
// of the skills a team might install.
export const SKILLS_PAGE = {
  url: 'chatgpt.com/skills',
  tabs: ['Plugins', 'Skills'],
  activeTab: 'Skills',
  heading: 'Skills',
  sub: "Instructions that extend ChatGPT's capabilities.",
  sidebar: ['New chat', 'Projects', 'Library', 'Plugins', 'GPTs'],
  sidebarActive: 'Plugins',
  installedLabel: 'Installed',
  installed: [
    { name: 'brand kit', what: 'Applies your brand colours and type...' },
    { name: 'Brand Humanizer', what: 'Write assets without common AI patterns' },
    { name: 'Customer Storytelling', what: 'Build focused, customer-specific stories' },
    { name: 'product knowledge', what: 'Get clear and concise explanations of the...' },
    { name: 'board ready deal summary', what: 'Generate concise, executive-level summaries...' },
    { name: 'skill-creator', what: 'Guide for creating and updating high-quality...' },
  ],
  scopes: ['Workspace', 'Personal'],
  activeScope: 'Workspace',
  sharedLabel: 'Shared with your workspace',
  shared: [
    { name: 'brand kit', what: 'Applies your brand colours and type...' },
    { name: 'Customer Reference Hub creator', what: 'Create and refresh internal customer referen...' },
    { name: 'Support Macro Writer', what: 'Draft consistent, on-brand support replies...' },
    { name: 'Content Governance', what: 'Governed language and content...' },
  ],
  callouts: [
    { key: 'tab', text: 'Open Plugins, then Skills' },
    { key: 'create', text: 'Select +, then upload the skill' },
    { key: 'shared', text: 'Publish it so teammates can install' },
  ],
  note: 'The list here reads as "Brand Humanizer" while the rest of this guide writes brand-humanizer. Both are the same skill: the hyphenated one is the name field in SKILL.md, which the spec keeps lowercase, and the pretty one is the display name set in agents/openai.yaml. If you do not set one, people see the hyphens.',
};

// Techniques for the second skill, once the basics hold. Each from the
// authoring guide or the spec; one line each.
export const ADVANCED = {
  title: 'Advanced skill techniques',
  lede: 'Patterns that turn a working skill into one that holds up under real use.',
  items: [
    { title: 'A gotchas section', body: 'The highest-value block in most skills: the environment-specific facts that defy a reasonable assumption. Not "handle errors properly" but "the users table uses soft deletes, so queries need WHERE deleted_at IS NULL". Every time you correct the model, the correction belongs here.' },
    { title: 'One skill, one job', body: 'A skill that does two things triggers for neither. Split it, and let each description say what it should not do.' },
    { title: 'A checklist the model ticks off', body: 'Put the steps in a block the model copies into its reply and works through. It stops skipping.' },
    { title: 'A script as the validator', body: 'Run it, fix what it flags, run it again. A check that should give the same answer every time belongs in code, not in prose.' },
    { title: 'Strict or flexible templates', body: 'Say which. "Use exactly this structure" and "here is a sensible default" produce very different output.' },
    { title: 'Branching workflows in their own files', body: 'When a skill has several paths, keep the decision in SKILL.md and each path in a reference file, linked one level deep.' },
    { title: 'Plan, validate, then execute', body: 'For batch or destructive jobs: write the plan to a file, check it with a script, then run it.' },
    { title: 'Trigger tests with near-misses', body: 'Twenty prompts, half that should open the skill and half that should not. The should-nots must be tempting.' },
    { title: 'Give it a face', body: 'An optional metadata file sets the display name, icon, and colour people see, and can require an explicit mention instead of auto-triggering.' },
    { title: 'Bundle as a plugin', body: 'When a skill needs a connector or travels with other skills, a plugin.json beside a skills/ folder ships them together.' },
  ],
};

// The pre-share checklist. Adapted from the authoring checklist and the
// synthesis of the sources above; ordered by how often each one is the reason
// a skill misfires.
export const CHECKLIST_TITLE = 'Building a skill checklist';

export const CHECKLIST = [
  'It is one job you have done at least twice, and the agent does it badly by default',
  'You can name the job in a sentence',
  'You did the job once yourself before writing anything',
  'Every correction you had to make by hand is written down, with its reason',
  'The gotchas live in SKILL.md, not in a reference file',
  'The description is imperative ("Use this skill when...") and says when, in the words people type',
  'The key use case comes first, and it is under 1,024 characters',
  'It says what should not trigger it',
  'The steps are in order, and it says what finished looks like',
  'The body is under 500 lines and 5,000 tokens',
  'The rest sits one level down, each pointer saying when to open it',
  'One term for each thing. No dates or "current" state',
  'You ran the task with the skill and without it, so you know what it fixes',
  'At least three real requests, including near-misses that should not trigger it',
  'You read anything you installed from outside your workspace before running it',
];

export const CLOSE = {
  title: 'Build your first version',
  body: 'Open Skill Creator and describe the thing you redo every week.',
  cta: { label: 'Skills in the Field Guide', to: '/posts/chatgpt-codex-field-guide' },
  help: 'Questions, or a skill you want a second pair of eyes on? I would love to hear about it.',
};

export const SOURCES = [
  { label: 'agentskills.io, the Agent Skills open standard', href: 'https://agentskills.io' },
  { label: 'Agent Skills specification', href: 'https://agentskills.io/specification' },
  { label: 'agentskills.io, Best practices for skill creators', href: 'https://agentskills.io/skill-creation/best-practices' },
  { label: 'agentskills.io, Optimizing skill descriptions', href: 'https://agentskills.io/skill-creation/optimizing-descriptions' },
  { label: 'agentskills.io, Evaluating skill output quality', href: 'https://agentskills.io/skill-creation/evaluating-skills' },
  { label: 'agentskills.io, Using scripts in skills', href: 'https://agentskills.io/skill-creation/using-scripts' },
  { label: 'OpenAI Academy, Using skills', href: 'https://openai.com/academy/skills/' },
  { label: 'OpenAI, Build skills for ChatGPT and Codex', href: 'https://learn.chatgpt.com/docs/build-skills' },
  { label: 'OpenAI, Skills in ChatGPT', href: 'https://help.openai.com/en/articles/20001066-skills-in-chatgpt' },
  { label: 'OpenAI, Build plugins', href: 'https://learn.chatgpt.com/docs/build-plugins' },
  { label: 'Anthropic, Equipping agents for the real world with Agent Skills', href: 'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills' },
  { label: 'Anthropic, Skill authoring best practices', href: 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices' },
  { label: 'SkillsBench (Li et al., February 2026)', href: 'https://arxiv.org/abs/2602.12670' },
  { label: 'Arize, How to write effective AI agent skills', href: 'https://arize.com/blog/how-to-write-effective-ai-agent-skills/' },
  { label: 'PostHog, Writing agent skills', href: 'https://posthog.com/newsletter/writing-agent-skills' },
  { label: 'Google Cloud, How we build, test and scale agent skills', href: 'https://cloud.google.com/blog/topics/developers-practitioners/behind-the-scenes-how-we-build-test-and-scale-google-agent-skills' },
  { label: 'Google Cloud, What are AI agent skills', href: 'https://cloud.google.com/discover/ai-agent-skills' },
  { label: 'Microsoft, Agent Framework: skills', href: 'https://learn.microsoft.com/en-us/agent-framework/agents/skills' },
  { label: 'Anthropic, Agent Skills overview', href: 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview' },
];
