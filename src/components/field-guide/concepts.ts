// Plain concept data for the ChatGPT field guide.
//
// The serializable half: name, color, icon, and the try-this prompt. The
// guide keeps its own JSX (`what`, `note`, the mock screens) and spreads these
// in by key, so a name or a color is defined in exactly one place.

export type ConceptKey =
  | 'chat'
  | 'images'
  | 'work'
  | 'projects'
  | 'scheduled'
  | 'agents'
  | 'gpts'
  | 'plugins'
  | 'skills'
  | 'sites'
  | 'codex'
  | 'compare';

export interface ConceptMeta {
  key: ConceptKey;
  name: string;
  short: string;
  bg: string;
  color: string;
  iconPath: string;
  tryThis?: string;
}

export const ICONS: Record<string, string> = {
  chat: 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155',
  work: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z',
  clock: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  users: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 1 1 5.25 0Z',
  sparkles: 'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z',
  puzzle: 'M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z',
  code: 'M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5',
  monitor:
    'M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25',
  play:
    'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z',
  globe: 'M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418',
  folder: 'M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z',
  image:
    'm2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z',
  skill:
    'm21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25',
};

// The walkthrough embedded as the guide's first tab. Left empty, that tab
// renders a placeholder rather than a broken embed.
export const WALKTHROUGH_YOUTUBE_ID = 'r1IJnz0wa-k';

// The walkthrough's chapters, mirroring the timestamps in the video's own
// YouTube description. Some chapters cover two parts of the guide, which is why
// this is its own list rather than an offset hung off each concept. Re-cut the
// video and these move: read them back off the description.

export const WALKTHROUGH_CHAPTERS: { label: string; start: number }[] = [
  { label: 'Start here', start: 0 },
  { label: 'Chat and Work', start: 10 },
  { label: 'Codex', start: 27 },
  { label: 'Web or desktop?', start: 38 },
  { label: 'Projects', start: 52 },
  { label: 'Images and Sites', start: 63 },
  { label: 'Plugins and Skills', start: 84 },
  { label: 'Workspace Agents', start: 104 },
  { label: 'Scheduled tasks and GPTs', start: 115 },
  { label: 'Recap', start: 131 },
];

// Every concept the Field Guide teaches, in rail order. `tryThis` is the
// prompt a person can paste straight into ChatGPT; concepts without one are
// orientation rather than something to go and do.
export const CONCEPT_META: Record<ConceptKey, ConceptMeta> = {
  chat: {
    key: 'chat',
    name: 'Chat',
    short: 'talk it through',
    bg: '#D3E9EE',
    color: '#35656e',
    iconPath: ICONS.chat,
    tryThis: 'Explain this policy in plain English and help me draft a response.',
  },
  work: {
    key: 'work',
    name: 'Work',
    short: 'get a deliverable',
    bg: '#fee19a',
    color: '#615D58',
    iconPath: ICONS.work,
    tryThis: "Prep me for today's meetings using Calendar: provide context, agenda items, and key decisions.",
  },
  codex: {
    key: 'codex',
    name: 'Codex',
    short: 'your desktop power tool',
    bg: '#394646',
    color: '#ffffff',
    iconPath: ICONS.code,
    tryThis:
      'What objections came up in our discovery calls this month? Turn it into a report I can rerun.',
  },
  compare: {
    key: 'compare',
    name: 'Web or Desktop?',
    short: 'which app when',
    bg: '#D3E9EE',
    color: '#2C545C',
    iconPath: ICONS.monitor,
  },
  projects: {
    key: 'projects',
    name: 'Projects',
    short: 'a home for ongoing work',
    bg: '#DED8CE',
    color: '#615D58',
    iconPath: ICONS.folder,
    tryThis:
      'Create a project for one account, add the latest QBR deck and notes, then start every account chat inside it.',
  },
  images: {
    key: 'images',
    name: 'Images',
    short: 'make visuals',
    bg: '#FEE2E2',
    color: '#B91C1C',
    iconPath: ICONS.image,
    tryThis: 'Create a simple icon for our GTM pipeline update.',
  },
  sites: {
    key: 'sites',
    name: 'Sites',
    short: 'publish a page',
    bg: '#D3E9EE',
    color: '#2C545C',
    iconPath: ICONS.globe,
    tryThis: 'Turn this Excel document into a shareable dashboard site.',
  },
  plugins: {
    key: 'plugins',
    name: 'Plugins',
    short: 'connect your tools',
    bg: '#35656e',
    color: '#ffffff',
    iconPath: ICONS.puzzle,
  },
  skills: {
    key: 'skills',
    name: 'Skills',
    short: 'reusable know-how',
    bg: '#FFDDCC',
    color: '#B05C3B',
    iconPath: ICONS.skill,
    tryThis: 'Turn a task you keep redoing the same way into a skill, then reuse it with @.',
  },
  agents: {
    key: 'agents',
    name: 'Workspace Agents',
    short: 'shared workflows',
    bg: '#DDF1DA',
    color: '#51714B',
    iconPath: ICONS.users,
    tryThis: 'On chatgpt.com, open Agents and try one your team has already published.',
  },
  scheduled: {
    key: 'scheduled',
    name: 'Scheduled tasks',
    short: 'work on repeat',
    bg: '#FFF4CE',
    color: '#615D58',
    iconPath: ICONS.clock,
    tryThis: 'Send me a weekly customer-risk summary.',
  },
  gpts: {
    key: 'gpts',
    name: 'GPTs',
    short: 'the older shortcuts',
    bg: '#FAF9F4',
    color: '#615D58',
    iconPath: ICONS.sparkles,
  },
};

// Rail order.
export const CONCEPT_ORDER_KEYS: ConceptKey[] = [
  'chat', 'work', 'codex', 'compare', 'projects', 'images',
  'sites', 'plugins', 'skills', 'agents', 'scheduled', 'gpts',
];
