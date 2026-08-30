// Shared by /projects and the llms.txt indexes, so they cannot drift apart.
// Dates are when each repo was started. Newest first.

export interface Project {
  title: string;
  date: string;
  stack: string;
  repo: string;
  body: string;
}

export const projects: Project[] = [
  {
    title: 'Amplify',
    date: 'February 2026',
    stack: 'TypeScript · Claude API · Remotion · ElevenLabs',
    repo: 'amplify',
    body: 'Your AI confidant for storytelling. A CLI tool and MCP server that lives in an Obsidian vault. Captures daily moments, identifies the 5-second shift, finds connections across your experiences, and builds a pattern map that visualizes how your life relates over time. Synthesizes research into lessons, challenges your thinking with honest feedback, and turns stories into videos, articles, carousels, and diagrams. The full content flywheel: from living your life to publishing what you learned.',
  },
  {
    title: 'Ethos Academy',
    date: 'February 2026',
    stack: 'Python · Claude API · Neo4j · React',
    repo: 'ethos-academy',
    body: "Every agent learns capability. Few develop character. Ethos Academy scores AI agent messages for honesty, accuracy, and intent across 12 behavioral traits in three dimensions: integrity, logic, and empathy. Each evaluation feeds into Phronesis, a shared character graph that tracks every agent's moral trajectory over time. 214 behavioral indicators mapped to Anthropic's constitutional value hierarchy. Three surfaces: a character development UI, an MCP server with 24 tools, and a REST API with 37 endpoints.",
  },
  {
    title: 'Agentic Loop',
    date: 'December 2025',
    stack: 'Node.js · Claude Code · CLI',
    repo: 'agentic-loop',
    body: 'Autonomous AI coding toolkit for Claude Code. You describe what you want to build. Claude writes a PRD with small, testable stories. Ralph executes each story automatically, coding, testing, and committing in a loop until everything passes. Two-terminal workflow: one for planning and generating PRDs, one for autonomous execution. The loop gets smarter over time through lessons you teach it, your coding DNA profile, and a styleguide that keeps UI consistent.',
  },
  {
    title: 'Ollama Wellness',
    date: 'October 2025',
    stack: 'Python · FastAPI · Redis · RedisVL · Ollama · LangGraph',
    repo: 'ollama-wellness',
    body: 'Can AI agents be intelligent without memory? A side-by-side comparison of stateless and stateful Agentic RAG using Apple Health data. The stateless agent forgets everything between messages. The stateful agent, powered by Redis, stores conversation history, user goals, and tool usage patterns through vector search. Built with Ollama running Qwen 2.5 7B locally. Your health data never leaves your machine.',
  },
  {
    title: 'Storylane QA Editor Agent',
    date: 'July 2025',
    stack: 'Python · FastAPI · NiceGUI · Playwright · OpenAI',
    repo: 'storylane-qa-editor-agent',
    body: 'AI-powered QA tool for reviewing Storylane product demos. Scrapes demo pages with Playwright, then runs each step through GPT for grammar, best practices, and GTM alignment checks. Built for PreSales teams who maintain dozens of demos and need consistent quality without manual review. Multi-user session isolation, real-time progress tracking, and an interactive chat interface for follow-up questions.',
  },
];
