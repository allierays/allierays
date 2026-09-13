import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CONCEPT_META,
  ICONS,
  WALKTHROUGH_CHAPTERS,
  WALKTHROUGH_YOUTUBE_ID,
  type ConceptKey,
} from './concepts';

// The ChatGPT/Codex field guide — pick a part on the left, and the stage shows
// a mock of the real ChatGPT screen with that feature highlighted. Minimal
// copy; the moving pictures carry the explanation.
//
// Ported from the internal version I built for a company rollout. Two changes:
// the tab lived in the URL there (?tab=agents, so any view was shareable) and
// lives in component state here, because a blog post is one page; and every
// company-specific example is now a generic one.

// Cross-links between tabs — "Workspace Agents" on the compare tab, "set up the
// desktop app" on the Codex overview — go through this rather than a router.
const Nav = createContext<(tab: RailKey, recipe?: string) => void>(() => {});

type SurfaceState = 'yes' | 'partial' | 'soon' | 'no';

interface Concept {
  key: ConceptKey;
  name: string;
  short: string;
  bg: string;
  color: string;
  iconPath: string;
  what: ReactNode;
  web?: { state: SurfaceState; note: string };
  desktop?: { state: SurfaceState; note: string };
  /** The practical aside: what this means once you are actually using it. */
  note?: ReactNode;
  tryThis?: string;
  bestFor: string[];
  notFor: string[];
  // "Learn more" row: href = external (OpenAI docs, chatgpt.com), to = internal route
  links?: { label: string; href: string }[];
}


const CONCEPTS: Concept[] = [
  {
    ...CONCEPT_META.chat,
    what: 'One of the two modes on the Chat / Work toggle at the top of ChatGPT. This is the basic conversation: ask, get an answer, keep going.',
    web: { state: 'yes', note: 'the Chat / Work toggle, up top' },
    desktop: { state: 'yes', note: 'the Chat / Work toggle, up top' },
    bestFor: ['Quick questions and brainstorms', 'Wording a tricky message', 'Making sense of something you paste in'],
    notFor: ['A polished deliverable: use Work', 'Something you repeat weekly: schedule it', 'Digging through your own systems: use Codex'],
    links: [{ label: 'OpenAI guide: using ChatGPT', href: 'https://learn.chatgpt.com/docs/use-chatgpt' }],
  },
  {
    ...CONCEPT_META.work,
    what: 'The other side of that same toggle, still ChatGPT, not a separate app. Give it a goal and get a finished result to review: a deck, a report, a plan.',
    web: { state: 'yes', note: 'flip the toggle to Work' },
    desktop: { state: 'yes', note: 'flip the toggle to Work' },
    note: 'Use Work when the answer is a document you will send: a deck, report, brief, or email pulled from your apps. If you are building something you will keep, switch to Codex.',
    bestFor: ['Decks, reports, briefs, and plans', 'Pulling scattered files and apps into one result', 'Anything with a finished form you review'],
    notFor: ['A quick back-and-forth: use Chat', 'A process the whole team runs: publish an agent', 'Building something you keep, or research across your systems: use Codex'],
    links: [{ label: 'OpenAI: ChatGPT Work and Codex', href: 'https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex' }],
  },
  {
    ...CONCEPT_META.codex,
    what: 'A separate product, not the Chat / Work toggle. On the web it has its own home at chatgpt.com/codex; in the desktop app you switch to it from the product picker (ChatGPT to Codex). Hands-on and not just for engineers: it digs through your company data with plugins and builds things you keep: sites, dashboards, tools.',
    web: { state: 'yes', note: 'chatgpt.com/codex' },
    desktop: { state: 'yes', note: 'the product picker' },
    note: 'Use Codex when the answer is something you keep and run: a site, dashboard, tool, or research across your systems. For a one-off document to send, Work is simpler. Desktop bonus: connect your AI note taker from its settings, and Codex can answer from your meetings too.',
    bestFor: ['Research across your systems: library, calls, files', 'Building something you keep: a site, a dashboard, a tool', 'Jobs that run themselves on a schedule'],
    notFor: ['A one-off deck or doc: Work is simpler', 'A process the whole team should run: publish an agent'],
    links: [{ label: 'Open Codex', href: 'https://chatgpt.com/codex' }],
  },
  {
    ...CONCEPT_META.compare,
    what: 'Same login, two apps, and you lose nothing by starting on the web: chatgpt.com works on any computer with nothing to install, and it is the only home of Workspace Agents and GPTs. The desktop app adds the powers that need your computer: working with your local files and using your installed apps. Chat, Work, Codex, and Sites live in both.',
    web: { state: 'yes', note: 'the default; nothing to install' },
    desktop: { state: 'yes', note: 'adds your local files and apps' },
    note: 'Rule of thumb: use Codex in the desktop app for local development, and use the web for things you want to share with a team: it is the only home of Workspace Agents and GPTs, and everything there opens by link. Sites now work in both apps, so build one wherever you are. One catch: skills install separately on each app and do not sync.',
    bestFor: [],
    notFor: [],
    links: [
      { label: 'OpenAI: the new desktop app', href: 'https://help.openai.com/en/articles/20001276-moving-to-the-new-chatgpt-desktop-app' },
    ],
  },
  {
    ...CONCEPT_META.projects,
    what: 'Folders for your chats, with shared context. Give a project its files and instructions once, and every chat inside starts already knowing them: no re-uploading the deck or re-explaining the account. Projects live in the sidebar on web and desktop.',
    web: { state: 'yes', note: 'Projects in the sidebar' },
    desktop: { state: 'yes', note: 'Projects in the sidebar' },
    note: 'Make one project per account, deal, or initiative and drop the core documents in once. You can also share a project with teammates so everyone chats against the same files and instructions: theirs show up under "Shared with you" on your Projects page.',
    bestFor: ['Ongoing work that spans many chats', 'Keeping files and instructions attached to one topic', 'Working from the same context as your teammates'],
    notFor: ['A process others run on demand: publish an agent', 'Know-how you want in every chat everywhere: that is a skill'],
    links: [{ label: 'Open your Projects page', href: 'https://chatgpt.com/projects' }],
  },
  {
    ...CONCEPT_META.images,
    what: 'Just ask for a picture, in plain words, in any chat: icons, mockups, diagrams, slide art. This works on web and desktop. To get your brand colors without asking each time, install a branding skill.',
    web: { state: 'yes', note: 'ask in any chat' },
    desktop: { state: 'yes', note: 'ask in any chat' },
    note: 'Write a skill that names your brand colors once, and every image request comes out on-brand automatically. Skills do not sync between apps, so install it on both the web and desktop app if you use both.',
    bestFor: ['Icons, mockups, and slide visuals', 'Quick concepts before briefing design', 'Editing an image you upload'],
    notFor: ['Precise text inside images: still hit and miss', 'Pixel-perfect final artwork: still ask marketing in #ask-marketing'],
    links: [{ label: 'Open your Skills page', href: 'https://chatgpt.com/skills' }],
  },
  {
    ...CONCEPT_META.sites,
    what: 'Turn your ideas into live websites you share by link: a one-pager, a live dashboard, a small internal site. Open Sites in the sidebar on the web or desktop app, hit Create, and describe what you want.',
    web: { state: 'yes', note: 'Sites in the sidebar' },
    desktop: { state: 'yes', note: 'Sites in the sidebar' },
    note: 'Reach for a Site when teammates should open something by link, not download a file: a dashboard or internal one-pager that stays live.',
    bestFor: ['A shareable one-pager or dashboard', 'Something people open by link, always current', 'A quick internal site with no hosting to set up'],
    notFor: ['A document to send: use Work', 'A public marketing site: still ask marketing'],
  },
  {
    ...CONCEPT_META.plugins,
    what: 'Add-ons that let ChatGPT and Codex work with other tools. Public ones cover everyday apps like Outlook, Slack, and spreadsheets; internal ones plug in your own data.',
    web: { state: 'yes', note: 'the Plugins page' },
    desktop: { state: 'yes', note: 'the Plugins page' },
    note: 'The two worth building first are the ones nobody else can give you: your content library and your call recordings. Everything else is already a public plugin.',
    bestFor: ['Letting AI work in your everyday tools', 'Answers grounded in your own content and calls'],
    notFor: ['General knowledge questions: plain Chat', 'Data outside the systems they connect'],
  },
  {
    ...CONCEPT_META.skills,
    what: 'Saved instructions that teach the AI how your team does something: your brand voice, your deal-summary format, a task you do the same way each time. Install one others built, or create your own, then call it in any chat by typing @ its name. Available on web and desktop; each app needs its own install.',
    web: { state: 'yes', note: 'chatgpt.com/skills, then @ it' },
    desktop: { state: 'yes', note: 'installed locally, separate from web' },
    note: 'Installing a skill on chatgpt.com does not put it on your desktop app: workspace skills and local skills are separate paths. On the desktop app, skills are installed locally on your machine, so install the skill again there (or via a plugin that bundles it) before you can @ it. The full distribution model is in the OpenAI doc below.',
    bestFor: ['Reusing team know-how in any chat', 'Bottling a task you repeat the same way', 'Consistent brand voice and formats'],
    notFor: ['Connecting to systems: that is a plugin', 'A whole workflow to run: that is an agent'],
    links: [
      { label: 'Create your own skill', href: 'https://learn.chatgpt.com/docs/build-skills' },
      { label: 'OpenAI: skill distribution and administration', href: 'https://learn.chatgpt.com/docs/enterprise/skills' },
      { label: 'Open your Skills page', href: 'https://chatgpt.com/skills' },
    ],
  },
  {
    ...CONCEPT_META.agents,
    what: 'Build a workflow once and the whole team runs the exact same process, wherever they already are: @ the agent on chatgpt.com, or deploy it to Slack as a ChatGPT Agent and @ it right in the channel. Same process, same result, no app switching.',
    web: { state: 'yes', note: 'via Agents or @AgentName' },
    desktop: { state: 'no', note: 'not on desktop, use the web app or Slack' },
    note: 'If your workspace has the ChatGPT Agents app in Slack, deploy your agent to a channel and teammates run it with @, no setup on their end. That is the difference between a workflow people could run and one they actually do.',
    bestFor: ['One process many people run', 'Keeping team output consistent', 'Handing a proven workflow to new teammates', 'Living in Slack: deploy it as a ChatGPT Agent'],
    notFor: ['The desktop app: agents only run on chatgpt.com or in Slack', 'Personal one-off tasks: use Work', 'Workflows you have not proven yet: run them in Work first'],
    links: [{ label: 'Open the Agents page', href: 'https://chatgpt.com/agents' }, { label: 'OpenAI: ChatGPT Agents in Slack', href: 'https://help.openai.com/en/articles/20001199-chatgpt-agents-app-in-slack' }, { label: 'OpenAI: introducing workspace agents', href: 'https://openai.com/index/introducing-workspace-agents-in-chatgpt/' }],
  },
  {
    ...CONCEPT_META.scheduled,
    what: 'Everything on a timer, in one place: reminders, recurring reports, and monitors that only ping you when something changed.',
    desktop: { state: 'yes', note: 'Scheduled in the sidebar' },
    web: { state: 'yes', note: 'create from Chat or Work' },
    note: 'Tasks keep the powers of where you made them: Work tasks use your connected apps, Codex tasks can work in local projects.',
    bestFor: ['Weekly summaries and digests', 'Watching something for changes', 'Reports you rebuild by hand today'],
    notFor: ['One-off tasks: just run them once', 'Team-wide routines: agents are shareable', 'Anything you want to tweak every single run'],
    links: [{ label: 'OpenAI docs: scheduled tasks', href: 'https://learn.chatgpt.com/docs/automations' }],
  },
  {
    ...CONCEPT_META.gpts,
    what: 'GPTs are versions of ChatGPT set up for a specific job, with their own instructions and files. They are the older way to share a helper, but existing ones still work fine.',
    web: { state: 'yes', note: 'in the sidebar' },
    desktop: { state: 'no', note: 'not on desktop, use the web app' },
    bestFor: ['Helpers colleagues already built', 'A saved persona or tone for chatting'],
    notFor: ['New team workflows: build a Workspace Agent', 'Anything needing your own data: plugins and Codex'],
    links: [{ label: 'Open GPTs', href: 'https://chatgpt.com/gpts' }],
  },
];

// --- Mock screens ------------------------------------------------------------

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};
const pop = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 320, damping: 26 } },
};

function Frame({ kind, children }: { kind: 'web' | 'desktop'; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-[#D3E9EE] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center px-4 h-9 bg-[#C7D1D1] border-b border-[#C7D1D1]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEE2E2]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEE19A]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#DDF1DA]" />
        </div>
        {kind === 'web' ? (
          <span className="mx-auto flex items-center gap-1.5 bg-white border border-[#C7D1D1] rounded-full px-3 py-0.5 text-[11px] font-medium text-[#637979]">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            chatgpt.com
          </span>
        ) : (
          <span className="mx-auto text-[11px] font-semibold text-[#637979]">ChatGPT · Desktop app</span>
        )}
        {/* Balance the traffic lights so the center label is truly centered */}
        <div className="w-[42px]" />
      </div>
      <div className="p-5 h-[250px] relative overflow-hidden">{children}</div>
    </div>
  );
}

function Highlight({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-2xl ring-2 ring-[#35656e] shadow-[0_0_0_5px_rgba(53,101,110,0.14)] ${className}`}>
      {children}
    </div>
  );
}

function ChatMock() {
  return (
    <DesktopFrame toggleActive="chat">
      <motion.div variants={stagger} initial="hidden" animate="show" className="h-full flex flex-col items-center justify-center gap-5">
        <motion.p variants={pop} className="text-[18px] font-semibold text-[#394646] tracking-tight">
          What&apos;s on your mind today?
        </motion.p>
        <motion.div variants={pop} className="w-full max-w-[400px]">
          <Highlight className="rounded-full">
            <div className="h-11 rounded-full bg-white border border-[#C7D1D1] flex items-center gap-2.5 px-4 text-[13px]">
              <span className="text-[#637979] text-lg leading-none font-light">+</span>
              <span className="text-[#9A9389]">Message ChatGPT</span>
              <motion.span
                className="inline-block w-[2px] h-4 bg-[#35656e]"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              />
              <span className="ml-auto flex items-center gap-2">
                <span className="text-[11px] text-[#9A9389] font-medium">Instant</span>
                <svg className="w-3.5 h-3.5 text-[#637979]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                </svg>
                <span className="w-6 h-6 rounded-full bg-[#394646] flex items-center justify-center gap-[2px]">
                  <span className="w-[2px] h-2 rounded bg-white" />
                  <span className="w-[2px] h-3 rounded bg-white" />
                  <span className="w-[2px] h-2 rounded bg-white" />
                </span>
              </span>
            </div>
          </Highlight>
        </motion.div>
      </motion.div>
    </DesktopFrame>
  );
}

function WorkToggle({ active }: { active: 'chat' | 'work' }) {
  return (
    <div className="w-max rounded-full bg-[#C7D1D1] p-1 flex text-[12px] font-semibold">
      <span className={`px-3.5 py-1 rounded-full ${active === 'chat' ? 'bg-white shadow text-[#394646]' : 'text-[#637979]'}`}>
        Chat
      </span>
      <span className={`px-3.5 py-1 rounded-full ${active === 'work' ? 'bg-[#fee19a] text-[#615D58]' : 'text-[#637979]'}`}>
        Work
      </span>
    </div>
  );
}

// Mirrors the real desktop app: sidebar with the ChatGPT/Codex product picker,
// a Plugins entry, Projects/Recents, and the Chat | Work toggle top center.
function DesktopFrame({
  toggleActive,
  highlightToggle = false,
  pickerOpen = false,
  pickerLabel = 'ChatGPT',
  highlightPicker = false,
  highlightPlugins = false,
  highlightScheduled = false,
  highlightSites = false,
  children,
}: {
  toggleActive?: 'chat' | 'work';
  highlightToggle?: boolean;
  pickerOpen?: boolean;
  pickerLabel?: string;
  highlightPicker?: boolean;
  highlightPlugins?: boolean;
  highlightScheduled?: boolean;
  highlightSites?: boolean;
  children: ReactNode;
}) {
  const sitesIcon = 'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z';
  return (
    <div className="rounded-xl border border-[#D3E9EE] bg-white shadow-sm overflow-hidden">
      <div className="flex h-[300px]">
        <div className="w-44 flex-shrink-0 bg-[#FAF9F4] border-r border-[#FAF9F4] p-3 relative hidden sm:block">
          <div className="flex gap-1.5 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEE2E2]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEE19A]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#DDF1DA]" />
          </div>
          <div className={highlightPicker ? 'inline-block rounded-lg ring-2 ring-[#35656e] shadow-[0_0_0_5px_rgba(53,101,110,0.14)]' : 'inline-block'}>
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[13px] font-bold text-[#394646] ${
                pickerOpen || highlightPicker ? 'bg-white border border-[#FAF9F4] shadow-sm' : ''
              }`}
            >
              {pickerLabel}
              <svg className="w-3 h-3 text-[#637979]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {pickerOpen && (
            <motion.div
              variants={pop}
              initial="hidden"
              animate="show"
              className="absolute left-3 top-[74px] z-10 w-[200px] bg-white rounded-xl border border-[#FAF9F4] shadow-xl overflow-hidden"
            >
              <div className="px-3 py-2 flex items-start justify-between gap-2">
                <div>
                  <p className="text-[12px] font-bold text-[#394646] leading-tight">ChatGPT</p>
                  <p className="text-[10px] text-[#9A9389] leading-tight">Create, learn, and explore</p>
                </div>
                <svg className="w-3.5 h-3.5 text-[#394646] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <Highlight className="rounded-none">
                <div className="px-3 py-2 bg-[#394646]">
                  <p className="text-[12px] font-bold text-white leading-tight">Codex</p>
                  <p className="text-[10px] text-white/70 leading-tight">Build, debug, and ship</p>
                </div>
              </Highlight>
            </motion.div>
          )}
          <div className="mt-3 space-y-0.5">
            <div className="px-2 py-1 flex items-center gap-1.5 text-[12px] font-medium text-[#637979]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
              </svg>
              New chat
            </div>
            {highlightSites ? (
              <Highlight className="rounded-lg">
                <div className="rounded-lg bg-white px-2 py-1.5 flex items-center gap-1.5 text-[12px] font-bold text-[#35656e]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={sitesIcon} />
                  </svg>
                  Sites
                </div>
              </Highlight>
            ) : (
              <div className="px-2 py-1 flex items-center gap-1.5 text-[12px] font-medium text-[#637979]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={sitesIcon} />
                </svg>
                Sites
              </div>
            )}
            <div className="px-2 py-1 flex items-center gap-1.5 text-[12px] font-medium text-[#637979]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
              Projects
            </div>
            {highlightScheduled ? (
              <Highlight className="rounded-lg">
                <div className="rounded-lg bg-white px-2 py-1.5 flex items-center gap-1.5 text-[12px] font-bold text-[#35656e]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.clock} />
                  </svg>
                  Scheduled
                </div>
              </Highlight>
            ) : (
              <div className="px-2 py-1 flex items-center gap-1.5 text-[12px] font-medium text-[#637979]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.clock} />
                </svg>
                Scheduled
              </div>
            )}
            {highlightPlugins ? (
              <Highlight className="rounded-lg">
                <div className="rounded-lg bg-white px-2 py-1.5 flex items-center gap-1.5 text-[12px] font-bold text-[#35656e]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364" />
                  </svg>
                  Plugins
                </div>
              </Highlight>
            ) : (
              <div className="px-2 py-1 flex items-center gap-1.5 text-[12px] font-medium text-[#637979]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364" />
                </svg>
                Plugins
              </div>
            )}
          </div>
          <p className="mt-2.5 px-2 text-[10px] font-semibold text-[#9A9389]">Recents</p>
          <div className="mt-1.5 px-2 space-y-2">
            <div className="h-1.5 w-24 rounded bg-[#FAF9F4]" />
            <div className="h-1.5 w-28 rounded bg-[#FAF9F4]" />
            <div className="h-1.5 w-20 rounded bg-[#FAF9F4]" />
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-12 flex items-center justify-center flex-shrink-0">
            {toggleActive &&
              (highlightToggle ? (
                <Highlight className="rounded-full">
                  <WorkToggle active={toggleActive} />
                </Highlight>
              ) : (
                <WorkToggle active={toggleActive} />
              ))}
          </div>
          <div className="flex-1 px-4 pb-4 relative overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}

const WORK_SUGGESTIONS = [
  {
    label: 'Create a file or build a site',
    iconPath:
      'M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
  },
  {
    label: 'Research and plan next steps',
    iconPath:
      'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25',
  },
  { label: 'Automate routine and recurring work', iconPath: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
];

function WorkMock() {
  return (
    <DesktopFrame toggleActive="work" highlightToggle>
      <motion.div variants={stagger} initial="hidden" animate="show" className="h-full flex flex-col items-center justify-center gap-3">
        <motion.p variants={pop} className="text-[18px] font-semibold text-[#394646] tracking-tight">
          What should we work on?
        </motion.p>
        <motion.div variants={pop} className="w-full max-w-[420px]">
          <Highlight className="rounded-2xl">
            <div className="rounded-2xl bg-white border border-[#C7D1D1] px-4 pt-3 pb-2.5">
              <p className="text-[13px] text-[#9A9389] flex items-center">
                Work with ChatGPT
                <motion.span
                  className="ml-0.5 inline-block w-[2px] h-4 bg-[#35656e]"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1.1, repeat: Infinity }}
                />
              </p>
              <div className="flex items-center mt-2">
                <span className="text-[#637979] text-lg leading-none font-light">+</span>
                <span className="ml-auto flex items-center gap-2">
                  <span className="text-[11px] text-[#637979] font-medium">
                    5.6 Sol <span className="text-[#9A9389]">Medium</span>
                  </span>
                  <svg className="w-3 h-3 text-[#9A9389]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  <svg className="w-3.5 h-3.5 text-[#637979]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                  </svg>
                  <span className="w-6 h-6 rounded-full bg-[#394646] flex items-center justify-center gap-[2px]">
                    <span className="w-[2px] h-2 rounded bg-white" />
                    <span className="w-[2px] h-3 rounded bg-white" />
                    <span className="w-[2px] h-2 rounded bg-white" />
                  </span>
                </span>
              </div>
            </div>
          </Highlight>
        </motion.div>
        <motion.div variants={pop} className="w-full max-w-[420px] flex items-center gap-2 rounded-full bg-[#FAF9F4] px-3.5 py-1.5 text-[11px] font-medium text-[#637979]">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
          </svg>
          Choose project
          <span className="flex gap-1 ml-2">
            <span className="w-3 h-3 rounded-sm bg-[#35656E]" />
            <span className="w-3 h-3 rounded-sm bg-[#B91C1C]" />
            <span className="w-3 h-3 rounded-sm bg-[#51714B]" />
          </span>
          Plugins
        </motion.div>
        <div className="w-full max-w-[420px] space-y-1">
          {WORK_SUGGESTIONS.map((item) => (
            <motion.div key={item.label} variants={pop} className="flex items-center gap-2 px-2 text-[12px] text-[#637979]">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.iconPath} />
              </svg>
              {item.label}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DesktopFrame>
  );
}

const SCHEDULED_SUGGESTIONS = [
  { name: 'Daily brief', when: 'Weekdays at 8:00 AM', desc: 'Your calendar, unread email, and priorities', color: '#35656e' },
  { name: 'Weekly review', when: 'Fridays at 4:00 PM', desc: 'Recent work into a Friday status update', color: '#615D58' },
  { name: 'Follow-up monitor', when: 'Weekdays at 9:00 AM', desc: 'Flags anything that needs your attention', color: '#51714B' },
];

function ScheduledMock() {
  return (
    <DesktopFrame highlightScheduled>
      <motion.div variants={stagger} initial="hidden" animate="show" className="h-full pt-1">
        <motion.div variants={pop} className="flex items-center justify-between gap-3 mb-1.5">
          <div>
            <p className="text-[15px] font-extrabold text-[#394646] leading-tight">Scheduled tasks</p>
            <p className="text-[10px] text-[#9A9389]">Schedule tasks, set reminders, or monitor for updates</p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-[#394646] text-white text-[11px] font-bold">Create</span>
        </motion.div>
        <motion.div variants={pop} className="h-7 rounded-full border border-[#C7D1D1] bg-white flex items-center px-3 text-[11px] text-[#9A9389] mb-2.5">
          Search scheduled tasks
        </motion.div>
        <div className="space-y-1.5">
          {SCHEDULED_SUGGESTIONS.map((task) => (
            <motion.div key={task.name} variants={pop} className="flex items-start gap-2.5 rounded-lg bg-white border border-[#C7D1D1] px-3 py-2">
              <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: task.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.clock} />
              </svg>
              <div className="min-w-0">
                <p className="text-[12px] leading-tight">
                  <span className="font-bold text-[#394646]">{task.name}</span>{' '}
                  <span className="text-[#9A9389]">{task.when}</span>
                </p>
                <p className="text-[10px] text-[#9A9389] truncate">{task.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DesktopFrame>
  );
}

const AGENT_CARDS = [
  { name: 'Brand Agent', desc: 'Turn inputs into on-brand materials.', author: 'A teammate', emoji: '🖼️' },
  { name: 'Meeting Recap', desc: 'Summarizes calls and meeting notes into recaps', author: 'A teammate', emoji: '🗂️' },
  { name: 'Sales Assistant', desc: 'Build account context and keep deal work moving.', author: 'A teammate', emoji: '⭐' },
];

function AgentsMock() {
  return (
    <Frame kind="web">
      <motion.div variants={stagger} initial="hidden" animate="show" className="flex h-full gap-3.5">
        {/* Sidebar with the team's published agents */}
        <div className="w-32 flex-shrink-0 rounded-lg bg-[#FAF9F4] p-2.5 hidden sm:block">
          <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A9389] mb-2">Agents</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm leading-none">🖼️</span>
              <span className="text-[10px] font-medium text-[#394646] leading-tight">Brand Agent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm leading-none">🗂️</span>
              <span className="text-[10px] font-medium text-[#394646] leading-tight">Meeting Recap</span>
            </div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <svg className="w-3.5 h-3.5 text-[#637979]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.users} />
              </svg>
              <span className="text-[10px] font-medium text-[#637979]">Browse agents</span>
            </div>
          </div>
        </div>

        {/* The Agents directory page */}
        <div className="flex-1 min-w-0 flex flex-col">
          <motion.div variants={pop} className="flex items-center justify-between gap-2 mb-2">
            <div>
              <p className="text-[15px] font-extrabold text-[#394646] leading-tight">Agents</p>
              <p className="text-[10px] text-[#9A9389]">Keep work moving 24/7 with agents</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-[#394646] text-white text-[11px] font-bold">Create</span>
          </motion.div>
          <motion.div variants={pop} className="flex items-center gap-2 mb-2.5 text-[11px] font-semibold text-[#9A9389]">
            <span>Recently used</span>
            <span>Built by me</span>
            <Highlight className="rounded-full">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#DDF1DA] text-[#51714B] font-bold">
                Team directory
              </span>
            </Highlight>
          </motion.div>
          <div className="grid grid-cols-3 gap-2 flex-1">
            {AGENT_CARDS.map((agent) => (
              <motion.div key={agent.name} variants={pop} className="rounded-xl border border-[#C7D1D1] bg-white p-2.5 flex flex-col gap-1.5">
                <span className="text-[22px] leading-none">{agent.emoji}</span>
                <p className="text-[11px] font-bold text-[#394646] leading-tight">{agent.name}</p>
                <p className="text-[9px] text-[#9A9389] leading-snug">{agent.desc}</p>
                <p className="text-[8px] text-[#9A9389] mt-auto">{agent.author}</p>
              </motion.div>
            ))}
          </div>
          <motion.p variants={pop} className="text-[10px] font-semibold text-[#637979] mt-2 text-center">
            Or type <span className="text-[#51714B] font-bold">@AgentName</span> in any conversation
          </motion.p>
        </div>
      </motion.div>
    </Frame>
  );
}

const ICON_CUBE = 'm21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9';

const GPT_CARDS = [
  { rank: 1, name: 'Commercial Account Scout', by: 'By a teammate · 13' },
  { rank: 2, name: 'Employer Brand', by: 'By community builder · 134' },
  { rank: 3, name: 'Brand Guidelines', by: 'By a teammate · 8' },
  { rank: 4, name: 'Interview Question Assistant', by: 'By community builder · 54' },
];

const PROJECT_ROWS = [
  { name: 'Acme renewal', modified: 'Today', shared: true },
  { name: 'FY27 planning', modified: 'Aug 21', shared: false },
  { name: 'personal', modified: 'Jul 29', shared: false },
];

function ProjectsMock() {
  return (
    <Frame kind="web">
      <motion.div variants={stagger} initial="hidden" animate="show" className="flex h-full gap-3.5">
        {/* Sidebar with Projects entry highlighted */}
        <div className="w-28 flex-shrink-0 rounded-lg bg-[#FAF9F4] p-2.5 hidden sm:block">
          <div className="space-y-1">
            <div className="px-1.5 py-1 flex items-center gap-1.5 text-[11px] font-medium text-[#637979]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
              </svg>
              New chat
            </div>
            <Highlight className="rounded-lg">
              <div className="rounded-lg bg-white px-1.5 py-1.5 flex items-center gap-1.5 text-[11px] font-bold text-[#35656e]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.folder} />
                </svg>
                Projects
              </div>
            </Highlight>
            <div className="px-1.5 py-1 flex items-center gap-1.5 text-[11px] font-medium text-[#637979]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.clock} />
              </svg>
              Scheduled
            </div>
          </div>
        </div>

        {/* Projects page */}
        <div className="flex-1 min-w-0 flex flex-col">
          <motion.div variants={pop} className="flex items-center justify-between gap-2">
            <p className="text-[17px] font-extrabold text-[#394646] leading-tight">Projects</p>
            <span className="flex items-center gap-1.5">
              <span className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#C7D1D1] px-2.5 py-1 text-[10px] text-[#9A9389]">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                Search projects
              </span>
              <span className="rounded-full bg-[#394646] px-3 py-1 text-[10px] font-bold text-white">New</span>
            </span>
          </motion.div>
          <motion.div variants={pop} className="mt-2 flex gap-1.5 text-[10px] font-semibold">
            <span className="px-2.5 py-1 rounded-full text-[#637979]">All</span>
            <span className="px-2.5 py-1 rounded-full bg-[#FAF9F4] text-[#394646]">Created by you</span>
            <span className="px-2.5 py-1 rounded-full text-[#637979]">Shared with you</span>
          </motion.div>
          <div className="mt-2 flex items-center justify-between px-1 text-[9px] font-semibold text-[#9A9389]">
            <span>Name</span>
            <span>Modified</span>
          </div>
          <div className="mt-1 space-y-1">
            {PROJECT_ROWS.map((p) => (
              <motion.div key={p.name} variants={pop} className="flex items-center gap-2 rounded-lg bg-[#FAF9F4] px-2 py-1.5">
                <span className="w-6 h-6 rounded-md bg-[#DED8CE] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#615D58]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.folder} />
                  </svg>
                </span>
                <span className="text-[11px] font-bold text-[#394646] truncate">{p.name}</span>
                {p.shared && (
                  <span className="text-[8.5px] font-bold text-[#51714B] bg-[#DDF1DA] rounded-full px-1.5 py-0.5">shared</span>
                )}
                <span className="ml-auto text-[9.5px] text-[#9A9389] [font-variant-numeric:tabular-nums]">{p.modified}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </Frame>
  );
}

function GptsMock() {
  return (
    <Frame kind="web">
      <motion.div variants={stagger} initial="hidden" animate="show" className="flex h-full gap-3.5">
        {/* Sidebar with GPTs entry highlighted */}
        <div className="w-28 flex-shrink-0 rounded-lg bg-[#FAF9F4] p-2.5 hidden sm:block">
          <div className="space-y-1">
            <div className="px-1.5 py-1 flex items-center gap-1.5 text-[11px] font-medium text-[#637979]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.clock} />
              </svg>
              Scheduled
            </div>
            <div className="px-1.5 py-1 flex items-center gap-1.5 text-[11px] font-medium text-[#637979]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364" />
              </svg>
              Plugins
            </div>
            <Highlight className="rounded-lg">
              <div className="rounded-lg bg-white px-1.5 py-1.5 flex items-center gap-1.5 text-[11px] font-bold text-[#35656e]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={ICON_CUBE} />
                </svg>
                GPTs
              </div>
            </Highlight>
          </div>
        </div>

        {/* Explore GPTs page */}
        <div className="flex-1 min-w-0 flex flex-col">
          <motion.p variants={pop} className="text-[17px] font-extrabold text-[#394646] text-center leading-tight">
            GPTs
          </motion.p>
          <motion.div variants={pop} className="mt-1.5 mx-auto w-full max-w-[380px] flex items-center gap-1.5 rounded-lg bg-[#FAF9F4] px-2.5 py-1.5 text-[10px] text-[#637979]">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
            Your admin has disabled third-party GPTs. Only workspace GPTs are available.
          </motion.div>
          <motion.div variants={pop} className="mt-2">
            <p className="text-[12px] font-extrabold text-[#394646] leading-tight">Popular in your workspace</p>
            <p className="text-[9px] text-[#9A9389]">Most popular GPTs in your workspace</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-1.5">
            {GPT_CARDS.map((gpt) => (
              <motion.div key={gpt.name} variants={pop} className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-bold text-[#637979] [font-variant-numeric:tabular-nums]">{gpt.rank}</span>
                <span className="w-7 h-7 rounded-full bg-[#C7D1D1] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#637979]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={ICON_CUBE} />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-[10.5px] font-bold text-[#394646] leading-tight truncate">{gpt.name}</span>
                  <span className="block text-[9px] text-[#9A9389] leading-tight truncate">{gpt.by}</span>
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </Frame>
  );
}

const INSTALLED_PLUGIN_COLORS = ['#51714B', '#DAAB4F', '#9A9389', '#35656e', '#B05C3B'];

const INTERNAL_PLUGINS = [
  { name: 'Content Library', desc: 'Search your content library with AI enriched metadata' },
  { name: 'Call Recordings', desc: 'Search calls and transcripts' },
];

function PluginsMock() {
  return (
    <DesktopFrame highlightPlugins>
      <motion.div variants={stagger} initial="hidden" animate="show" className="h-full pt-0.5">
        <motion.div variants={pop} className="mb-2">
          <p className="text-[15px] font-extrabold text-[#394646] leading-tight">Plugins</p>
          <p className="text-[10px] text-[#9A9389]">Work with ChatGPT across your favorite tools</p>
        </motion.div>
        <motion.div variants={pop} className="mb-2">
          <p className="text-[10px] font-bold text-[#394646] mb-1">Installed</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Highlight className="rounded-lg">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white border border-[#C7D1D1]">
                <span className="w-4 h-4 rounded bg-[#0f6cbd] flex items-center justify-center text-white text-[9px] font-extrabold">O</span>
                <span className="text-[10px] font-bold text-[#394646]">Outlook</span>
              </span>
            </Highlight>
            <Highlight className="rounded-lg">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white border border-[#C7D1D1]">
                <span className="w-4 h-4 rounded bg-[#611f69] flex items-center justify-center text-white text-[9px] font-extrabold">#</span>
                <span className="text-[10px] font-bold text-[#394646]">Slack</span>
              </span>
            </Highlight>
            {INSTALLED_PLUGIN_COLORS.map((color) => (
              <span key={color} className="w-6 h-6 rounded-lg border border-black/5" style={{ backgroundColor: color }} />
            ))}
          </div>
        </motion.div>
        <motion.div variants={pop} className="flex items-center gap-1.5 mb-2 text-[11px] font-semibold text-[#9A9389]">
          <span className="px-2 py-0.5">Public</span>
          <Highlight className="rounded-full">
            <span className="inline-flex px-2.5 py-0.5 rounded-full bg-[#DDF1DA] text-[#51714B] font-bold">Internal</span>
          </Highlight>
          <span className="px-2 py-0.5">Personal</span>
        </motion.div>
        <div className="space-y-1.5">
          {INTERNAL_PLUGINS.map((plugin) => (
            <motion.div key={plugin.name} variants={pop} className="flex items-center gap-2.5 rounded-lg bg-white border border-[#C7D1D1] px-3 py-2">
              <span className="w-7 h-7 rounded-lg bg-[#35656e] flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.puzzle} />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-bold text-[#394646] leading-tight">{plugin.name}</span>
                <span className="block text-[10px] text-[#9A9389] leading-tight truncate">{plugin.desc}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#51714B]">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Installed
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DesktopFrame>
  );
}

function CodexMock() {
  const cards = [
    {
      label: 'Explore and understand code',
      color: '#35656E',
      iconPath: 'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z',
    },
    {
      label: 'Build a new feature, app, or tool',
      color: '#9A9389',
      iconPath:
        'M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.286c.886.849 1.062 1.024 2.25 2.25l3.286-3.276c.259.734.398 1.524.398 2.342Z',
    },
    {
      label: 'Review code and suggest changes',
      color: '#51714B',
      iconPath:
        'M4.5 12c0-1.232.046-2.453.138-3.662a4.006 4.006 0 0 1 3.7-3.7 48.678 48.678 0 0 1 7.324 0 4.006 4.006 0 0 1 3.7 3.7c.017.22.032.441.046.662M4.5 12l-3-3m3 3 3-3m12 3c0 1.232-.046 2.453-.138 3.662a4.006 4.006 0 0 1-3.7 3.7 48.657 48.657 0 0 1-7.324 0 4.006 4.006 0 0 1-3.7-3.7c-.017-.22-.032-.441-.046-.662M19.5 12l-3 3m3-3 3 3',
    },
    {
      label: 'Fix issues and failures',
      color: '#B05C3B',
      iconPath:
        'M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M8.683 5a3.73 3.73 0 0 1 1.183-1.612 2.706 2.706 0 0 1 4.268 0A3.73 3.73 0 0 1 15.317 5',
    },
  ];
  return (
    <DesktopFrame pickerLabel="Codex" highlightPicker>
      <motion.div variants={stagger} initial="hidden" animate="show" className="h-full flex flex-col justify-center gap-3">
        <motion.p variants={pop} className="text-[18px] font-semibold text-[#394646] tracking-tight text-center">
          What should we build?
        </motion.p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {cards.map((card) => (
            <motion.div key={card.label} variants={pop} className="rounded-xl border border-[#C7D1D1] bg-white p-2.5">
              <svg className="w-4 h-4 mb-1.5" style={{ color: card.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={card.iconPath} />
              </svg>
              <p className="text-[10px] font-semibold text-[#394646] leading-tight">{card.label}</p>
            </motion.div>
          ))}
        </div>
        <motion.div variants={pop} className="rounded-2xl bg-white border border-[#C7D1D1] px-4 pt-2.5 pb-2">
          <p className="text-[13px] text-[#9A9389] flex items-center">
            Do anything
            <motion.span
              className="ml-0.5 inline-block w-[2px] h-4 bg-[#35656e]"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
          </p>
          <div className="flex items-center mt-1.5 text-[11px] text-[#637979]">
            <span className="text-lg leading-none font-light">+</span>
            <span className="ml-3 font-medium">Ask for approval</span>
            <span className="ml-auto flex items-center gap-2">
              <span className="font-medium">
                5.6 Sol <span className="text-[#9A9389]">Medium</span>
              </span>
              <svg className="w-3 h-3 text-[#9A9389]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              <span className="w-6 h-6 rounded-full bg-[#394646] flex items-center justify-center gap-[2px]">
                <span className="w-[2px] h-2 rounded bg-white" />
                <span className="w-[2px] h-3 rounded bg-white" />
                <span className="w-[2px] h-2 rounded bg-white" />
              </span>
            </span>
          </div>
        </motion.div>
      </motion.div>
    </DesktopFrame>
  );
}

const INSTALLED_SKILLS = [
  { name: 'Image Gen', desc: 'Generate or edit images', emoji: '🏞️' },
  { name: 'OpenAI Docs', desc: 'Reference OpenAI docs', emoji: '📖' },
  { name: 'Skill Creator', desc: 'Create or update a skill', emoji: '✏️' },
  { name: 'Review Agent', desc: 'Find actionable bugs in code changes', emoji: '🐞' },
  { name: 'brand-kit', desc: 'Applies your official brand colors', emoji: '🎨' },
  { name: 'Skill Installer', desc: 'Install curated skills', emoji: '🧩' },
];

function SkillsMock() {
  return (
    <DesktopFrame highlightPlugins>
      <motion.div variants={stagger} initial="hidden" animate="show" className="h-full pt-0.5">
        <motion.div variants={pop} className="flex items-start justify-between gap-3 mb-1.5">
          <div className="rounded-full bg-[#C7D1D1] p-0.5 flex text-[11px] font-semibold">
            <span className="px-2.5 py-0.5 rounded-full text-[#637979]">Plugins</span>
            <Highlight className="rounded-full">
              <span className="px-2.5 py-0.5 rounded-full bg-white text-[#394646] font-bold">Skills</span>
            </Highlight>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-[#394646] text-white text-[11px] font-bold">Create</span>
        </motion.div>
        <motion.div variants={pop} className="mb-1.5">
          <p className="text-[15px] font-extrabold text-[#394646] leading-tight">Skills</p>
          <p className="text-[10px] text-[#9A9389]">Extend ChatGPT with task-specific skills</p>
        </motion.div>
        <motion.div variants={pop} className="h-6 rounded-full border border-[#C7D1D1] bg-white flex items-center px-3 text-[10px] text-[#9A9389] mb-2">
          Search skills
        </motion.div>
        <motion.p variants={pop} className="text-[10px] font-bold text-[#394646] mb-1">
          Installed
        </motion.p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {INSTALLED_SKILLS.map((skill) => (
            <motion.div key={skill.name} variants={pop} className="flex items-center gap-2 min-w-0">
              <span className="w-6 h-6 rounded-md bg-[#FAF9F4] flex items-center justify-center text-[13px] leading-none flex-shrink-0">
                {skill.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10.5px] font-bold text-[#394646] leading-tight truncate">{skill.name}</span>
                <span className="block text-[9px] text-[#9A9389] leading-tight truncate">{skill.desc}</span>
              </span>
              <svg className="w-3 h-3 text-[#C7D1D1] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DesktopFrame>
  );
}

function FunnelArt({ branded }: { branded: boolean }) {
  return (
    <svg viewBox="0 0 100 90" className="w-full h-full rounded-lg" role="img" aria-label={branded ? 'On-brand icon' : 'Generic icon'}>
      <rect width="100" height="90" rx="8" fill={branded ? '#D3E9EE' : '#FAF9F4'} />
      <polygon points="20,18 80,18 65,38 35,38" fill={branded ? '#35656e' : '#9A9389'} />
      <polygon points="35,42 65,42 57,60 43,60" fill={branded ? '#35656E' : '#C7D1D1'} />
      <polygon points="43,64 57,64 53,78 47,78" fill={branded ? '#fee19a' : '#D3E9EE'} />
    </svg>
  );
}

function ImagesMock() {
  return (
    <Frame kind="web">
      <motion.div variants={stagger} initial="hidden" animate="show" className="h-full flex flex-col justify-center gap-3.5">
        <motion.div variants={pop} className="w-full max-w-[400px] mx-auto rounded-full bg-white border border-[#C7D1D1] shadow-sm flex items-center gap-2.5 px-4 py-2.5">
          <span className="text-[#637979] text-lg leading-none font-light">+</span>
          <span className="text-[13px] text-[#394646] font-medium">
            make me an icon for the pipeline update
            <motion.span
              className="ml-0.5 inline-block w-[2px] h-4 bg-[#35656e] align-middle"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
          </span>
          <span className="ml-auto w-6 h-6 rounded-full bg-[#394646] flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0-6.75 6.75M12 4.5l6.75 6.75" />
            </svg>
          </span>
        </motion.div>
        <div className="flex items-stretch justify-center gap-4">
          <motion.div variants={pop} className="w-36 rounded-xl bg-white border border-[#C7D1D1] p-2">
            <div className="h-24">
              <FunnelArt branded={false} />
            </div>
            <p className="text-[10px] font-semibold text-[#9A9389] text-center mt-1.5">Without the skill</p>
          </motion.div>
          <motion.div variants={pop} className="self-center text-[#9A9389]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </motion.div>
          <motion.div variants={pop}>
            <Highlight className="rounded-xl">
              <div className="w-36 rounded-xl bg-white p-2">
                <div className="h-24">
                  <FunnelArt branded />
                </div>
                <p className="text-[10px] font-bold text-[#51714B] text-center mt-1.5 flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  brand-kit on
                </p>
              </div>
            </Highlight>
          </motion.div>
        </div>
        <motion.p variants={pop} className="text-[11px] font-semibold text-[#637979] text-center">
          Same ask. The brand-kit skill puts it in your colors.
        </motion.p>
      </motion.div>
    </Frame>
  );
}

function SitesMock() {
  return (
    <DesktopFrame highlightSites>
      <motion.div variants={stagger} initial="hidden" animate="show" className="h-full flex flex-col justify-center gap-2 w-full max-w-[400px] mx-auto">
        <motion.div variants={pop} className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[15px] font-bold text-[#394646] leading-tight">Sites</p>
            <p className="text-[10px] text-[#9A9389]">Turn your ideas into live websites</p>
          </div>
          <span className="rounded-full bg-[#394646] text-white text-[10px] font-semibold px-2.5 py-1">Create</span>
        </motion.div>
        <motion.div variants={pop} className="flex items-center gap-2 rounded-full bg-white border border-[#C7D1D1] px-3 py-1">
          <svg className="w-3 h-3 text-[#9A9389]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <span className="text-[11px] text-[#9A9389]">Search sites</span>
        </motion.div>
        <motion.div variants={pop} className="w-full">
          <Highlight className="rounded-xl">
            <div className="rounded-xl bg-white overflow-hidden">
              <div className="flex items-center gap-2 px-3 h-7 bg-[#C7D1D1] border-b border-[#C7D1D1]">
                <span className="flex items-center gap-1.5 bg-white border border-[#C7D1D1] rounded-full px-2.5 py-0.5 text-[10px] font-medium text-[#637979]">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  shareable link
                </span>
                <span className="ml-auto text-[9px] font-semibold text-[#51714B] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#51714B]" />
                  Live
                </span>
              </div>
              <div className="p-2.5">
                <p className="text-[12px] font-bold text-[#394646]">Team Budget</p>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {[
                    { k: 'Budget', v: '$50k' },
                    { k: 'Spent', v: '$32k' },
                    { k: 'Left', v: '$18k' },
                  ].map((s) => (
                    <div key={s.k} className="rounded-lg bg-[#FAF9F4] border border-[#FAF9F4] px-2 py-1.5">
                      <p className="text-[8px] font-semibold text-[#9A9389] uppercase tracking-wide">{s.k}</p>
                      <p className="text-[13px] font-bold text-[#2C545C]">{s.v}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-end gap-1 h-6">
                  {[40, 62, 48, 74, 58, 88, 70].map((h, i) => (
                    <span key={i} className="flex-1 rounded-sm bg-[#D3E9EE]" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </Highlight>
        </motion.div>
      </motion.div>
    </DesktopFrame>
  );
}

const COMPARE_WEB_ITEMS = [
  { label: 'Chat, Work, and Codex', has: true },
  { label: 'Sites', has: true },
  { label: 'Workspace Agents', has: true },
  { label: 'GPTs', has: true },
  { label: 'Your local files and apps', has: false },
];

const COMPARE_DESKTOP_ITEMS = [
  { label: 'Chat, Work, and Codex', has: true },
  { label: 'Sites', has: true },
  { label: 'Your local files and apps', has: true },
  { label: 'Workspace Agents', has: false },
  { label: 'GPTs', has: false },
];

function CompareChecklist({ title, items }: { title: string; items: { label: string; has: boolean }[] }) {
  return (
    <div className="h-full flex flex-col justify-center gap-1.5 max-w-[240px] mx-auto">
      <motion.p variants={pop} className="text-[13px] font-extrabold text-[#394646] mb-1">
        {title}
      </motion.p>
      {items.map((item) => (
        <motion.div key={item.label} variants={pop} className="flex items-center gap-2">
          {item.has ? (
            <svg className="w-3.5 h-3.5 text-[#51714B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-[#C7D1D1] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className={`text-[12px] leading-tight ${item.has ? 'font-semibold text-[#394646]' : 'text-[#9A9389]'}`}>
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function CompareMock() {
  const [focus, setFocus] = useState<'web' | 'desktop' | null>(null);
  const detail = focus === 'web'
    ? 'Start on the web when you want the simplest setup or need to share an Agent or GPT.'
    : 'Open the desktop app when the job needs files or apps on your computer.';

  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#637979]">
        Choose a view
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setFocus((current) => current === 'web' ? null : 'web')}
          aria-pressed={focus === 'web'}
          className={`rounded-xl text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35656E] focus-visible:ring-offset-2 ${
            focus === 'web' ? 'ring-2 ring-[#35656E] shadow-md -translate-y-0.5' : focus === 'desktop' ? 'opacity-55' : 'hover:-translate-y-0.5 hover:shadow-md'
          }`}
        >
          <Frame kind="web">
            <motion.div variants={stagger} initial="hidden" animate="show" className="h-full">
              <CompareChecklist title="Web: works everywhere" items={COMPARE_WEB_ITEMS} />
            </motion.div>
          </Frame>
        </button>
        <button
          type="button"
          onClick={() => setFocus((current) => current === 'desktop' ? null : 'desktop')}
          aria-pressed={focus === 'desktop'}
          className={`rounded-xl text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35656E] focus-visible:ring-offset-2 ${
            focus === 'desktop' ? 'ring-2 ring-[#35656E] shadow-md -translate-y-0.5' : focus === 'web' ? 'opacity-55' : 'hover:-translate-y-0.5 hover:shadow-md'
          }`}
        >
          <Frame kind="desktop">
            <motion.div variants={stagger} initial="hidden" animate="show" className="h-full">
              <CompareChecklist title="Desktop: the power tools" items={COMPARE_DESKTOP_ITEMS} />
            </motion.div>
          </Frame>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {focus && (
          <motion.div
            key={focus}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-3 flex items-start justify-between gap-3 rounded-xl bg-[#D3E9EE] px-4 py-3 text-[13px] font-semibold leading-snug text-[#2C545C]"
          >
            <span>{detail}</span>
            <button type="button" onClick={() => setFocus(null)} className="flex-shrink-0 font-bold underline underline-offset-2">
              Compare both
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MOCKS: Record<ConceptKey, () => ReactNode> = {
  chat: () => <ChatMock />,
  images: () => <ImagesMock />,
  work: () => <WorkMock />,
  projects: () => <ProjectsMock />,
  sites: () => <SitesMock />,
  scheduled: () => <ScheduledMock />,
  agents: () => <AgentsMock />,
  plugins: () => <PluginsMock />,
  skills: () => <SkillsMock />,
  codex: () => <CodexMock />,
  gpts: () => <GptsMock />,
  compare: () => <CompareMock />,
};

// --- Explorer ----------------------------------------------------------------

// One availability line per card: scope (which app) plus the how, stated once.
// Replaces the old "where to open" pill + separate Web/Desktop chips, which
// said the same thing two or three times over.
function availabilityText(concept: Concept): string {
  const web = concept.web;
  const desktop = concept.desktop;
  const webOk = web?.state === 'yes';
  const desktopOk = desktop?.state === 'yes';
  if (webOk && desktopOk) {
    if (web.note === desktop.note) return `Web or desktop: ${web.note}`;
    return `Web (${web.note}) or desktop (${desktop.note})`;
  }
  if (webOk) {
    // When a concept is missing from the desktop app, say so right in the
    // chip instead of leaving people to discover it by hunting.
    if (desktop?.state === 'no' && desktop.note) return `Web only: ${web.note} (${desktop.note})`;
    return `Web only: ${web.note}`;
  }
  if (desktopOk) return `Desktop only: ${desktop.note}`;
  return `Rolling out: ${web?.note ?? desktop?.note ?? 'check back soon'}`;
}

function AvailabilityChip({ concept }: { concept: Concept }) {
  return (
    <span
      className="inline-flex items-start gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold leading-snug"
      style={{ backgroundColor: concept.bg, color: concept.color }}
    >
      <svg className="w-3.5 h-3.5 flex-shrink-0 mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
      </svg>
      {availabilityText(concept)}
    </span>
  );
}

// Shown only on the Web or Desktop tab: how Chat, Work, and Codex differ
// between the two apps, plus what only exists in each.
const COMPARE_ROWS = [
  {
    key: 'chat',
    name: 'Chat',
    bg: '#D3E9EE',
    color: '#35656e',
    iconPath: ICONS.chat,
    forWhat: 'Quick questions and thinking out loud',
    web: 'The full experience.',
    desktop: 'Identical. Use whichever is open.',
  },
  {
    key: 'work',
    name: 'Work',
    bg: '#fee19a',
    color: '#615D58',
    iconPath: ICONS.work,
    forWhat: 'A finished deliverable to review',
    web: 'Works with your connected cloud apps; Work chats sync across both.',
    desktop: 'Same, plus your computer: local files and installed apps.',
  },
  {
    key: 'codex',
    name: 'Codex',
    bg: '#394646',
    color: '#ffffff',
    iconPath: ICONS.code,
    forWhat: 'Research across your systems, and building things you keep',
    web: 'chatgpt.com/codex; everything runs in the cloud.',
    desktop: 'The product picker; can also work in local folders and connect your meeting notes.',
  },
];

const ONLY_HERE: {
  title: string;
  bg: string;
  border: string;
  color: string;
  items: { name: string; why: string; tab?: ConceptKey }[];
}[] = [
  {
    title: 'Only on the web app',
    bg: '#DDF1DA',
    border: '#DDF1DA',
    color: '#51714B',
    items: [
      { name: 'Workspace Agents', why: 'run a proven team process, same result every time', tab: 'agents' },
      { name: 'GPTs', why: 'helpers colleagues already built', tab: 'gpts' },
    ],
  },
  {
    title: 'Only on the desktop app',
    bg: '#D3E9EE',
    border: '#D3E9EE',
    color: '#2C545C',
    items: [
      { name: 'Your files and apps', why: 'Work and Codex can use what is on your computer' },
      { name: 'Your meeting notes', why: 'connect an AI note taker from Codex settings so it answers from your meetings', tab: 'codex' },
    ],
  },
  {
    title: 'On both, installed twice',
    bg: '#FFDDCC',
    border: '#FFDDCC',
    color: '#B05C3B',
    items: [
      { name: 'Skills', why: 'reusable know-how in any chat; they do not sync, so install on each app', tab: 'skills' },
    ],
  },
];

function WebDesktopCompare() {
  const go = useContext(Nav);
  const [selectedMode, setSelectedMode] = useState(COMPARE_ROWS[0].key);
  const selected = COMPARE_ROWS.find((row) => row.key === selectedMode) ?? COMPARE_ROWS[0];

  return (
    <div className="mt-4">
      <div className="mb-3 flex flex-wrap gap-2" role="tablist" aria-label="Compare Chat, Work, and Codex">
        {COMPARE_ROWS.map((row) => {
          const active = row.key === selectedMode;
          return (
            <button
              key={row.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedMode(row.key)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35656E] focus-visible:ring-offset-2 ${
                active ? 'border-transparent shadow-sm' : 'border-[#DED8CE] bg-white text-[#394646] hover:border-[#35656E] hover:-translate-y-px'
              }`}
              style={active ? { backgroundColor: row.bg, color: row.color } : undefined}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={row.iconPath} />
              </svg>
              {row.name}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="grid overflow-hidden rounded-xl border border-[#C7D1D1] md:grid-cols-[220px_1fr_1fr]"
          role="tabpanel"
        >
          <div className="bg-[#FAF9F4] p-4">
            <span className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: selected.bg }}>
                <svg className="h-5 w-5" style={{ color: selected.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={selected.iconPath} />
                </svg>
              </span>
              <span>
                <span className="block text-[14px] font-extrabold text-[#394646]">{selected.name}</span>
                <span className="block text-[11px] leading-tight text-[#637979]">{selected.forWhat}</span>
              </span>
            </span>
          </div>
          <div className="border-t border-[#C7D1D1] p-4 md:border-l md:border-t-0">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#637979]">Web app</p>
            <p className="text-[13px] leading-snug text-[#394646]">{selected.web}</p>
          </div>
          <div className="border-t border-[#C7D1D1] p-4 md:border-l md:border-t-0">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#637979]">Desktop app</p>
            <p className="text-[13px] leading-snug text-[#394646]">{selected.desktop}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="grid sm:grid-cols-3 gap-3 mt-3">
        {ONLY_HERE.map((card) => (
          <div key={card.title} className="rounded-xl border p-3.5" style={{ backgroundColor: card.bg, borderColor: card.border }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5" style={{ color: card.color }}>
              {card.title}
            </p>
            <div className="space-y-1.5">
              {card.items.map((item) => (
                <p key={item.name} className="text-[13px] text-[#394646] leading-snug">
                  {item.tab ? (
                    <button
                      type="button"
                      onClick={() => go(item.tab!)}
                      className="font-bold underline underline-offset-2"
                      style={{ color: card.color }}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <span className="font-bold text-[#394646]">{item.name}</span>
                  )}
                  : {item.why}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Shown only on the Scheduled tasks and Workspace Agents tabs, where the
// two are most often mixed up.
// Agents tab only: what happens to connected apps when you share an agent.
function AgentSharingCard() {
  return (
    <div className="mt-4 rounded-xl border border-[#C7D1D1] bg-[#FAF9F4] p-4 md:p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#51714B] mb-2">
        Sharing your agent
      </p>
      <p className="text-sm text-[#394646] leading-relaxed">
        When your agent uses a connected app like Outlook, the builder asks which account the agent
        should use. Pick <span className="font-bold">End-user account</span>: each person who runs
        the agent authenticates with their own account the first time they use it. That is what
        makes the agent shareable: it acts as whoever is running it, never as you, so teammates only
        ever see their own mail, calendar, and files.
      </p>
      <img
        src="/images/field-guide/agent-end-user-account.png"
        alt="The agent builder asking which account the agent should use, with End-user account selected over Agent-owned account"
        loading="lazy"
        className="mt-3 w-full rounded-lg border border-[#ded8ce] bg-white"
      />
      <p className="text-[12px] text-[#637979] mt-2 leading-relaxed">
        Agent-owned account is the opposite: one shared login for everyone who runs the agent. Only
        pick it for a team-owned account, never for anything tied to a person&apos;s own data.
      </p>
    </div>
  );
}

function ConfusedCard() {
  return (
    <div className="mt-4 rounded-xl border border-[#C7D1D1] bg-[#FAF9F4] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#35656E] mb-2">
        Easily confused
      </p>
      <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-center text-sm text-[#394646]">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-[#615D58] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.clock} />
          </svg>
          <span>
            <span className="font-bold text-[#394646]">Scheduled task:</span> your personal routine, on a timer, results come to you.
          </span>
        </div>
        <span className="hidden sm:flex w-8 h-8 rounded-full bg-white border border-[#C7D1D1] items-center justify-center text-[10px] font-extrabold text-[#637979]">
          vs
        </span>
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-[#51714B] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.users} />
          </svg>
          <span>
            <span className="font-bold text-[#394646]">Workspace Agent:</span> the team&apos;s shared recipe, anyone runs it with @, included on the web app.
          </span>
        </div>
      </div>
      <p className="text-[12px] text-[#637979] mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1">
        <span className="font-semibold text-[#394646]">A meeting recap:</span>
        just for you
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: '#fee19a', color: '#615D58' }}>Work</span>
        · every week
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: '#FFF4CE', color: '#615D58' }}>Scheduled task</span>
        · whole team
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: '#DDF1DA', color: '#51714B' }}>Workspace Agent</span>
      </p>
    </div>
  );
}

// The green "Best for" / red "Skip it for" grid, shared by the standard tabs
// and the Codex overview.
function BestSkipGrid({ concept, className = 'mt-4' }: { concept: Concept; className?: string }) {
  return (
    <div className={`grid md:grid-cols-2 gap-3 ${className}`}>
      <div className="bg-[#DDF1DA] border border-[#DDF1DA] rounded-xl p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#51714B] mb-2">Best for</p>
        <ul className="space-y-1.5">
          {concept.bestFor.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-[#394646] leading-snug">
              <svg className="w-4 h-4 text-[#51714B] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-[#FEE2E2] border border-[#FEE2E2] rounded-xl p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#B91C1C] mb-2">Skip it for</p>
        <ul className="space-y-1.5">
          {concept.notFor.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-[#394646] leading-snug">
              <svg className="w-4 h-4 text-[#B91C1C] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// The "Learn more" row. The internal-route variant went with the port: every
// link that survived anonymization points at OpenAI's own docs.
function LearnMoreLinks({
  links,
  className = 'mt-4',
}: {
  links: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-1.5 ${className}`}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#35656E] hover:underline"
        >
          {link.label}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      ))}
    </div>
  );
}

// --- Codex deep dive ---------------------------------------------------------
// Codex is the tab people underuse. Instead of one flat card it opens a sub-tab
// strip: an overview, a full desktop setup walkthrough, and copy-paste recipes
// aimed at non-technical people (decks, spreadsheets, sites, your own data).

const CODEX_ICONS = {
  overview: ICONS.sparkles,
  setup: ICONS.monitor,
  deck: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
  spreadsheet: 'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z',
  site: ICONS.globe,
  data: ICONS.puzzle,
  file: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z',
  make: 'm16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10',
  arrow: 'M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3',
};

interface CodexRecipe {
  key: 'deck' | 'spreadsheet' | 'site' | 'data';
  color: string;
  iconPath: string;
  headline: string;
  blurb: string;
  inputs: string[];
  output: { name: string; tag: string };
  // Optional skill applied during the run, shown as a chip on the Codex node.
  skill?: string;
  prompt: string;
  youGet: string[];
  tip: ReactNode;
  links?: { label: string; href: string }[];
}

const CODEX_RECIPES: CodexRecipe[] = [
  {
    key: 'deck',
    color: '#B05C3B',
    iconPath: CODEX_ICONS.deck,
    headline: 'Turn a folder of notes into a PowerPoint',
    blurb: 'Drop your notes, data, and any old deck into a folder, point Codex at it, and get a .pptx you open and edit in PowerPoint.',
    inputs: ['meeting-notes.docx', 'q3-data.xlsx'],
    output: { name: 'q3-review.pptx', tag: 'PowerPoint' },
    skill: 'brand-kit',
    prompt: 'Use @Presentations to turn the files in this folder into a team deck. Match the structure and branding of last-quarter.pptx if it is there.',
    youGet: ['An editable .pptx saved in your folder', 'A slide plan it shows before building', 'Charts built from your spreadsheet'],
    tip: 'Install a brand skill, or drop a company template in the folder, so slides come out on-brand.',
    links: [{ label: 'OpenAI: make a slide deck with Codex', href: 'https://learn.chatgpt.com/use-cases/generate-slide-decks' }],
  },
  {
    key: 'spreadsheet',
    color: '#51714B',
    iconPath: CODEX_ICONS.spreadsheet,
    headline: 'Tidy a messy spreadsheet, get a clean report',
    blurb: 'Point Codex at a messy .xlsx or .csv and it will de-duplicate, fix the columns, pivot, and hand back a clean file.',
    inputs: ['sales-export.csv'],
    output: { name: 'clean-report.xlsx', tag: 'Excel' },
    prompt: 'Clean up sales-export.csv: remove duplicates, standardize the date and region columns, then add a pivot of revenue by region and save it as a new .xlsx.',
    youGet: ['A cleaned file saved next to the original', 'A short note on what it changed', 'A pivot or chart when you ask for one'],
    tip: 'Keep it on "Ask for approval" the first few runs so you see each change before it saves.',
  },
  {
    key: 'site',
    color: '#2C545C',
    iconPath: CODEX_ICONS.site,
    headline: 'Publish a live page from your files',
    blurb: 'Codex can turn a spreadsheet or a folder of content into a live site you share by link. Works on the web and desktop app; the desktop app is the one that can read a folder on your computer.',
    inputs: ['budget.xlsx'],
    output: { name: 'Team dashboard', tag: 'live link' },
    skill: 'brand-kit',
    prompt: 'Turn budget.xlsx in this folder into a shareable dashboard site with the current numbers.',
    youGet: ['A live page teammates open by link', 'No hosting to set up', 'It refreshes when you ask'],
    tip: 'New to Sites? The Sites part of this guide walks through it; this is the Codex on-ramp.',
  },
  {
    key: 'data',
    color: '#35656e',
    iconPath: CODEX_ICONS.data,
    headline: 'Answer from your own calls, library, and meetings',
    blurb: 'Turn on the plugins for your own systems — the content library, the call recorder — and connect your AI note taker from desktop settings, so Codex answers from real company data, not just what it was trained on.',
    inputs: ['Content library', 'Call recordings', 'Meeting notes'],
    output: { name: 'Objections report', tag: 'from your data' },
    prompt: 'What objections came up in our discovery calls this month? Turn it into a report I can rerun.',
    youGet: ['Answers grounded in your own library and calls', 'Your own meetings, via a notes plugin', 'A report you can save and rerun'],
    tip: 'This is the step most teams skip, and it is the one that makes the difference. A model with no access to your systems is a very good intern on their first day.',
    links: [{ label: 'Open Codex', href: 'https://chatgpt.com/codex' }],
  },
];

const SETUP_STEPS = [
  { n: 1, title: 'Get the desktop app', body: 'Download ChatGPT for Mac or Windows and sign in with your work login.' },
  { n: 2, title: 'Switch to Codex', body: 'Top-left, open the product picker (it says ChatGPT) and choose Codex.' },
  { n: 3, title: 'Point it at a folder', body: 'Add a project and pick a folder on your computer. On a Mac it will ask you to allow Desktop or Downloads the first time.' },
  { n: 4, title: 'Choose how much to approve', body: '"Ask for approval" checks with you before it changes anything; "Approve for me" runs and only pauses on risky steps. Start with Ask for approval.' },
  { n: 5, title: 'Give it a job', body: 'Describe what you want in plain words. It plans, works, and saves real files back into your folder.' },
];

const CODEX_TABS: { key: string; label: string; iconPath: string }[] = [
  { key: 'overview', label: 'Overview', iconPath: CODEX_ICONS.overview },
  { key: 'setup', label: 'Set up desktop', iconPath: CODEX_ICONS.setup },
  { key: 'deck', label: 'Build a deck', iconPath: CODEX_ICONS.deck },
  { key: 'spreadsheet', label: 'Clean a spreadsheet', iconPath: CODEX_ICONS.spreadsheet },
  { key: 'site', label: 'Make a site', iconPath: CODEX_ICONS.site },
  { key: 'data', label: 'Connect your data', iconPath: CODEX_ICONS.data },
];

// A copy-paste prompt with a working Copy button, so recipes are one click to try.
function PromptBox({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-[#C7D1D1] bg-[#FAF9F4] px-4 py-3">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#637979]">Paste this</p>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard?.writeText(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          }}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#35656E] hover:underline"
        >
          {copied ? 'Copied' : 'Copy'}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            {copied ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
            )}
          </svg>
        </button>
      </div>
      <p className="text-[13px] text-[#394646] leading-relaxed font-medium">&ldquo;{text}&rdquo;</p>
    </div>
  );
}

// Small input files -> Codex -> output file flow, tinted per recipe.
function CodexRecipeFlow({ recipe }: { recipe: CodexRecipe }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="rounded-xl border border-[#C7D1D1] bg-[#FAF9F4] p-4">
      <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
        <div className="flex flex-col gap-1.5">
          {recipe.inputs.map((inp) => (
            <motion.span
              key={inp}
              variants={pop}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#C7D1D1] px-2.5 py-1.5 text-[11px] font-semibold text-[#394646]"
            >
              <svg className="w-3.5 h-3.5 text-[#9A9389] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={CODEX_ICONS.file} />
              </svg>
              {inp}
            </motion.span>
          ))}
        </div>
        <motion.svg variants={pop} className="w-4 h-4 text-[#C7D1D1] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={CODEX_ICONS.arrow} />
        </motion.svg>
        <motion.div variants={pop} className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#394646] px-3 py-2 text-[12px] font-bold text-white">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.code} />
            </svg>
            Codex
          </span>
          {recipe.skill && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white border border-[#C7D1D1] px-2 py-0.5 text-[10px] font-bold text-[#394646]">
              <span className="text-[11px] leading-none">🎨</span>
              {recipe.skill}
            </span>
          )}
        </motion.div>
        <motion.svg variants={pop} className="w-4 h-4 text-[#C7D1D1] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={CODEX_ICONS.arrow} />
        </motion.svg>
        <motion.div variants={pop} className="flex-shrink-0">
          <Highlight className="rounded-xl">
            <div className="rounded-xl bg-white px-3 py-2 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" style={{ color: recipe.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={recipe.iconPath} />
              </svg>
              <span className="min-w-0">
                <span className="block text-[12px] font-bold text-[#394646] leading-tight">{recipe.output.name}</span>
                <span className="block text-[9px] font-bold uppercase tracking-wide" style={{ color: recipe.color }}>
                  {recipe.output.tag}
                </span>
              </span>
            </div>
          </Highlight>
        </motion.div>
      </div>
    </motion.div>
  );
}

function CodexOverview({ concept }: { concept: Concept }) {
  const go = useContext(Nav);
  const tiles = [
    { iconPath: CODEX_ICONS.file, title: 'It sees your files', body: 'Point it at a folder and it reads what is inside.' },
    { iconPath: CODEX_ICONS.make, title: 'It makes real files', body: 'Decks, spreadsheets, docs, even live sites, saved to your computer.' },
    { iconPath: ICONS.clock, title: 'It keeps working', body: 'Give it a job and it plans, works, and checks itself.' },
  ];
  return (
    <div className="space-y-4">
      <p className="text-[15px] text-[#394646] leading-relaxed">
        <span className="font-extrabold text-[#394646]">Not just for engineers.</span> Codex is the most hands-on part of
        ChatGPT: on the desktop app it opens the files on your computer, builds real documents you keep, and keeps working on
        its own. Live on the web for everything else; open the desktop app when the job touches your files.
      </p>
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid sm:grid-cols-3 gap-3">
        {tiles.map((t) => (
          <motion.div key={t.title} variants={pop} className="rounded-xl border border-[#C7D1D1] bg-[#FAF9F4] p-4">
            <span className="w-8 h-8 rounded-lg bg-[#394646] flex items-center justify-center mb-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={t.iconPath} />
              </svg>
            </span>
            <p className="text-[13px] font-bold text-[#394646] leading-tight">{t.title}</p>
            <p className="text-[12px] text-[#637979] leading-snug mt-1">{t.body}</p>
          </motion.div>
        ))}
      </motion.div>
      <BestSkipGrid concept={concept} className="" />
      <p className="text-[13px] text-[#637979]">
        New to Codex?{' '}
        <button type="button" onClick={() => go('codex', 'setup')} className="font-bold text-[#35656E] hover:underline">
          Set up the desktop app
        </button>{' '}
        first, then work through a recipe.
      </p>
    </div>
  );
}

function CodexSetup() {
  const [done, setDone] = useState<number[]>([]);
  const toggle = (step: number) => {
    setDone((current) => current.includes(step) ? current.filter((item) => item !== step) : [...current, step]);
  };

  return (
    <div className="space-y-4">
      <p className="text-[15px] text-[#394646] leading-relaxed">
        <span className="font-extrabold text-[#394646]">The first ten minutes.</span> Codex lives in the desktop app. Here is
        the whole setup, once.
      </p>
      <div className="flex items-center justify-between gap-3 text-[12px] font-bold text-[#637979]">
        <span>{done.length} of {SETUP_STEPS.length} complete</span>
        {done.length > 0 && (
          <button type="button" onClick={() => setDone([])} className="text-[#35656E] hover:underline">
            Reset
          </button>
        )}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#E9E5DD]" aria-hidden="true">
        <div className="h-full rounded-full bg-[#51714B] transition-all" style={{ width: `${(done.length / SETUP_STEPS.length) * 100}%` }} />
      </div>
      <motion.ol variants={stagger} initial="hidden" animate="show" className="space-y-2.5">
        {SETUP_STEPS.map((s) => (
          <motion.li key={s.n} variants={pop}>
            <button
              type="button"
              onClick={() => toggle(s.n)}
              aria-pressed={done.includes(s.n)}
              className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35656E] focus-visible:ring-offset-2 ${
                done.includes(s.n) ? 'border-[#BBD8B6] bg-[#DDF1DA]' : 'border-[#C7D1D1] bg-[#FAF9F4] hover:border-[#35656E] hover:-translate-y-px hover:shadow-sm'
              }`}
            >
              <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold ${done.includes(s.n) ? 'bg-[#51714B] text-white' : 'bg-[#394646] text-white'}`}>
                {done.includes(s.n) ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : s.n}
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-bold leading-tight text-[#394646]">{s.title}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-[#637979]">{s.body}</span>
              </span>
            </button>
          </motion.li>
        ))}
      </motion.ol>
      <LearnMoreLinks
        links={[{ label: 'OpenAI: get the desktop app', href: 'https://help.openai.com/en/articles/20001276-moving-to-the-new-chatgpt-desktop-app' }]}
        className=""
      />
    </div>
  );
}

function CodexRecipeView({ recipe }: { recipe: CodexRecipe }) {
  return (
    <div className="space-y-4">
      <p className="text-[15px] text-[#394646] leading-relaxed">
        <span className="font-extrabold text-[#394646]">{recipe.headline}.</span> {recipe.blurb}
      </p>
      <CodexRecipeFlow recipe={recipe} />
      <PromptBox text={recipe.prompt} />
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-[#DDF1DA] border border-[#DDF1DA] rounded-xl p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#51714B] mb-2">What you get</p>
          <ul className="space-y-1.5">
            {recipe.youGet.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#394646] leading-snug">
                <svg className="w-4 h-4 text-[#51714B] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-[#394646] font-medium bg-[#fee19a]/30 border border-[#fee19a] rounded-xl px-4 py-3 leading-relaxed">
          {recipe.tip}
        </p>
      </div>
      {recipe.links && recipe.links.length > 0 && <LearnMoreLinks links={recipe.links} className="" />}
    </div>
  );
}

function CodexDeepDive({
  concept,
  active,
  setActive,
}: {
  concept: Concept;
  active: string;
  setActive: (key: string) => void;
}) {
  const recipe = CODEX_RECIPES.find((r) => r.key === active);

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {CODEX_TABS.map((t) => {
          const on = t.key === active;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={`relative flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-bold transition-colors ${
                on ? '' : 'bg-white border border-[#DED8CE]'
              }`}
            >
              {on && (
                <motion.div
                  layoutId="codex-recipe-active"
                  className="absolute inset-0 rounded-full bg-[#394646]"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <svg className="relative w-4 h-4" style={{ color: on ? '#ffffff' : '#637979' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={t.iconPath} />
              </svg>
              <span className="relative" style={{ color: on ? '#ffffff' : '#394646' }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
          >
            {active === 'overview' ? (
              <CodexOverview concept={concept} />
            ) : active === 'setup' ? (
              <CodexSetup />
            ) : recipe ? (
              <CodexRecipeView recipe={recipe} />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// The stage: the mock screen for the selected part, then everything written
// about it. The rail owns which part is selected and hands it down.
function ConceptExplorer({
  concept,
  recipe,
  setRecipe,
}: {
  concept: Concept;
  recipe: string;
  setRecipe: (key: string) => void;
}) {
  return (
    <div>
      {/* Stage */}
      <div className="min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={concept.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {MOCKS[concept.key]()}
            <div className="mt-4">
              <p className="text-[15px] text-[#394646] leading-relaxed">
                <span className="font-extrabold text-[#394646]">{concept.name}.</span> {concept.what}
              </p>
              <div className="mt-3">
                <AvailabilityChip concept={concept} />
              </div>
              {concept.key === 'compare' ? (
                <WebDesktopCompare />
              ) : concept.key === 'codex' ? (
                <CodexDeepDive concept={concept} active={recipe} setActive={setRecipe} />
              ) : (
                <BestSkipGrid concept={concept} />
              )}
              {concept.key !== 'codex' && (concept.tryThis || concept.note) && (
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  {concept.tryThis && <PromptBox text={concept.tryThis} />}
                  {concept.note && (
                    <p className="text-sm text-[#394646] font-medium bg-[#fee19a]/30 border border-[#fee19a] rounded-xl px-4 py-3 leading-relaxed">
                      {concept.note}
                    </p>
                  )}
                </div>
              )}
              {concept.key === 'agents' && <AgentSharingCard />}
              {concept.key !== 'codex' && concept.links && concept.links.length > 0 && (
                <LearnMoreLinks links={concept.links} />
              )}
              {(concept.key === 'scheduled' || concept.key === 'agents') && <ConfusedCard />}
            </div>
            <ChapterVideo concept={concept} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const CHAPTER_START_BY_CONCEPT: Record<ConceptKey, number> = {
  chat: 10,
  work: 10,
  codex: 27,
  compare: 38,
  projects: 52,
  images: 63,
  sites: 63,
  plugins: 84,
  skills: 84,
  agents: 104,
  scheduled: 115,
  gpts: 115,
};

function ChapterVideo({ concept }: { concept: Concept }) {
  const start = CHAPTER_START_BY_CONCEPT[concept.key];
  const chapter = WALKTHROUGH_CHAPTERS.find((item) => item.start === start);

  return (
    <section className="mt-5 border-t border-[#ded8ce] pt-5" aria-label={`${concept.name} video chapter`}>
      <p className="mb-3 text-[15px] font-bold text-[#637979]">
        {formatOffset(start)} {chapter?.label}
      </p>
      <div
        className="w-full overflow-hidden rounded-xl border border-[#ded8ce] bg-[#FAF9F4]"
        style={{ aspectRatio: '16 / 9' }}
      >
        {WALKTHROUGH_YOUTUBE_ID ? (
          <iframe
            key={`${concept.key}-${start}`}
            src={`https://www.youtube.com/embed/${WALKTHROUGH_YOUTUBE_ID}?rel=0&start=${start}`}
            title={`${chapter?.label ?? concept.name} chapter of the ChatGPT field guide`}
            className="h-full w-full"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-[13px] font-bold text-[#637979]">
            Walkthrough coming shortly
          </div>
        )}
      </div>
    </section>
  );
}

// The overview sits on the rail as the first tab. It gives readers the context
// for the guide and keeps the walkthrough with the introduction it supports.
type RailKey = ConceptKey | 'overview';

const OVERVIEW_TAB = {
  key: 'overview' as const,
  name: 'Overview',
  short: 'start here',
  bg: '#FFF4CE',
  color: '#615D58',
  iconPath: ICONS.play,
};

const RAIL: { key: RailKey; name: string; short: string; bg: string; color: string; iconPath: string }[] = [
  OVERVIEW_TAB,
  ...CONCEPTS,
];

// Chapter offsets are stored in seconds; people read them as 1:24.
function formatOffset(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

// The guide introduction and walkthrough live together. YouTube honours
// ?start= on the embed, so one video serves every chapter.
function GuideOverview() {
  const [chapter, setChapter] = useState<number | null>(null);
  const start = chapter ?? undefined;

  return (
    <div className="w-full min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#637979]">Overview</p>
      <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#394646]">
        A 101 field guide to Chat, Work, and Codex
      </h2>
      <div
        className="mt-4 w-full overflow-hidden rounded-xl border border-[#ded8ce] bg-[#FAF9F4]"
        style={{ aspectRatio: '16 / 9' }}
      >
        {WALKTHROUGH_YOUTUBE_ID ? (
          <iframe
            key={chapter ?? 'start'}
            src={`https://www.youtube.com/embed/${WALKTHROUGH_YOUTUBE_ID}?rel=0${start !== undefined ? `&start=${start}` : ''}`}
            title="ChatGPT field guide walkthrough"
            className="h-full w-full"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          // No id yet. A placeholder is better than an iframe that renders as a
          // grey box with no explanation.
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center">
            <svg className="h-8 w-8 text-[#9A9389]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
              <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.play} />
            </svg>
            <p className="text-[13px] font-bold text-[#394646]">Walkthrough coming shortly</p>
            <p className="text-[12px] text-[#637979]">
              Set <span className="font-mono">WALKTHROUGH_YOUTUBE_ID</span> in concepts.ts to the video id.
            </p>
          </div>
        )}
      </div>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-[#637979]">Chapters</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {WALKTHROUGH_CHAPTERS.map((c) => {
          const active = c.start === chapter;
          return (
            <button
              key={c.start}
              type="button"
              onClick={() => setChapter(c.start)}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                active ? 'border-transparent' : 'border-[#ded8ce] bg-white text-[#394646] hover:border-[#35656E]'
              }`}
              style={active ? { backgroundColor: OVERVIEW_TAB.bg, color: OVERVIEW_TAB.color } : undefined}
            >
              <span className={active ? '' : 'text-[#637979]'}>{formatOffset(c.start)}</span>
              {c.label}
            </button>
          );
        })}
      </div>
      <div className="mt-7 space-y-3 text-[16px] leading-relaxed text-[#394646]">
        <p>
          Chat, Work, and Codex give knowledge workers three ways to get things done with AI, all through a visual
          interface. The hard part is knowing which one to use, where to find it, and what the tools around it are for.
        </p>
        <p>
          I made this 101 field guide for people who want to use ChatGPT and Codex without working from a command line.
          It covers twelve parts of the interfaces, with a mock screen for each, a plain-English explanation of what it
          is for, and advice on when to use it and when to skip it. Most sections also include a prompt you can paste in
          and try.
        </p>
        <p>
          It began as the companion to a live rollout at work. You can watch the full walkthrough in under three
          minutes, use the chapter chips to move around, or jump straight to the part that has been getting in your
          way. The Codex section includes an overview, desktop setup, and four useful recipes.
        </p>
      </div>
    </div>
  );
}

// The field guide as one self-contained block: the rail on the left, the
// stage on the right.
export default function FieldGuide() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  // The overview opens first so readers get the map before choosing a part.
  const [selected, setSelected] = useState<RailKey>('overview');
  // Codex is the one part with sub-tabs. Its state lives up here so a
  // cross-link can land on a specific recipe, not just the Codex overview.
  const [recipe, setRecipe] = useState('overview');
  const concept = CONCEPTS.find((c) => c.key === selected);

  const go = (tab: RailKey, nextRecipe = 'overview') => {
    setSelected(tab);
    setRecipe(nextRecipe);
  };

  useEffect(() => {
    if (!isFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    const exitOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFullscreen(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', exitOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', exitOnEscape);
    };
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen((current) => !current);
  };

  return (
    <Nav.Provider value={go}>
    <div
      className={`fg-scope ${isFullscreen ? 'fg-scope--fullscreen' : ''}`}
      style={isFullscreen ? {
        position: 'fixed',
        inset: 0,
        zIndex: 2147483647,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100dvh',
        maxWidth: 'none',
        margin: 0,
        overflow: 'hidden',
        border: 0,
        borderRadius: 0,
        background: '#ffffff',
      } : undefined}
    >
      <div
        className="fg-toolbar mb-4 flex justify-end"
        style={isFullscreen ? {
          position: 'absolute',
          top: 24,
          right: 24,
          zIndex: 1,
          marginBottom: 0,
        } : undefined}
      >
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit full screen' : 'Expand guide to full screen'}
          className="inline-flex items-center gap-2 rounded-lg border border-[#ded8ce] bg-white px-3 py-2 text-[13px] font-bold text-[#394646] transition-colors hover:border-[#35656E]"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={isFullscreen
                ? 'M9 9 4.5 4.5M4.5 4.5v3.75m0-3.75h3.75M15 9l4.5-4.5m0 0v3.75m0-3.75h-3.75M9 15l-4.5 4.5m0 0v-3.75m0 3.75h3.75M15 15l4.5 4.5m0 0v-3.75m0 3.75h-3.75'
                : 'M8.25 3.75h-4.5v4.5M15.75 3.75h4.5v4.5M8.25 20.25h-4.5v-4.5M15.75 20.25h4.5v-4.5'}
            />
          </svg>
          {isFullscreen ? 'Exit full screen' : 'Full screen'}
        </button>
      </div>
      <div
        className="fg-guide-body grid items-start gap-5 lg:grid-cols-[280px_1fr]"
        style={isFullscreen ? {
          flex: '1 1 auto',
          minHeight: 0,
          overflowX: 'hidden',
          overflowY: 'auto',
        } : undefined}
      >
      {/* Selector rail */}
      <div className="hidden lg:flex flex-col gap-1">
        {RAIL.map((c) => {
          const active = c.key === selected;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => go(c.key)}
              aria-pressed={active}
              className="group relative flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all hover:bg-[#FAF9F4] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35656E] focus-visible:ring-offset-2"
            >
              {active && (
                <motion.div
                  layoutId="field-guide-active"
                  className="absolute inset-0 rounded-xl"
                  style={{ backgroundColor: c.bg }}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span
                className="relative w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: active ? 'rgba(255,255,255,0.35)' : c.bg }}
              >
                <svg
                  className="w-5 h-5"
                  style={{ color: c.color }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={c.iconPath} />
                </svg>
              </span>
              <span className="relative min-w-0">
                <span className="block font-bold text-sm" style={{ color: active ? c.color : '#394646' }}>
                  {c.name}
                </span>
                <span className="block text-xs" style={{ color: active ? c.color : '#637979' }}>
                  {c.short}
                </span>
              </span>
              <svg className={`relative ml-auto h-4 w-4 flex-shrink-0 text-[#637979] transition-all ${active ? 'opacity-70' : 'translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
              </svg>
            </button>
          );
        })}
      </div>

      {/* Mobile selector */}
      <div className="lg:hidden -mx-2 px-2 flex gap-2 overflow-x-auto pb-1">
        {RAIL.map((c) => {
          const active = c.key === selected;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => go(c.key)}
              aria-pressed={active}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-bold border transition-all ${active ? '' : 'border-[#ded8ce] text-[#394646] bg-white'}`}
              style={active ? { backgroundColor: c.bg, color: c.color, borderColor: 'transparent' } : undefined}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={c.iconPath} />
              </svg>
              {c.name}
            </button>
          );
        })}
      </div>

      {concept ? (
        <ConceptExplorer concept={concept} recipe={recipe} setRecipe={setRecipe} />
      ) : (
        <GuideOverview />
      )}
      </div>
    </div>
    </Nav.Provider>
  );
}
