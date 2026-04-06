---
title: "I Built an AI Agent That QAs Our Demos So We Don't Have To"
shortTitle: "Storylane QA Agent"
description: "An AI-powered QA tool that scrapes Storylane demos, reviews every step for grammar, messaging, and GTM alignment, and gives you a scored report. Won Most Innovative Use Case at Demo Dundies."
date: 2025-08-20
tags: [ai, automation, fastapi, playwright, presales]
image: /images/storylane-agent-icon.png
hideHeaderImage: true
---

<div style="position: relative; padding-bottom: calc(54.11% + 44px); height: 0; width: 100%; margin: 2rem 0;">
<iframe src="https://demo.go1.com/share/storylane-qa-ai-agent" title="Storylane QA Agent Demo" frameborder="0" loading="lazy" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px;"></iframe>
</div>

## 1. The Problem

At Go1, the PreSales team maintains a library of Storylane demos. Every demo walks a prospect through a product flow, step by step. Each step has a tooltip, a title, maybe a callout. Multiply that by dozens of demos across different integrations and use cases, and you've got a lot of surface area for typos, stale messaging, wrong integration mentions, and broken flows.

Manual QA on these demos is tedious. You open each one, click through every step, read every tooltip, check that the messaging matches current GTM positioning. One demo might have 30 steps. We had dozens of demos. Nobody wanted this job.

So I built an agent to do it.

## 2. What the Agent Does

You give it a Storylane URL. It does the rest.

1. **Scrapes the demo** using async Playwright. Navigates through every step, handles iframes, extracts all visible text, tooltips, and UI elements.
2. **Counts and tracks chapters and steps.** This sounds simple. It wasn't. Storylane's DOM structure nests iframes in ways that break naive selectors. I wrote 11 tests just for step counting logic.
3. **Runs each step through GPT analysis.** The AI reviews grammar, clarity, messaging consistency, integration references, and UX flow. It doesn't just flag problems. It explains why something is wrong and suggests a fix.
4. **Generates a scored report.** Quality metrics, prioritized recommendations, and a step-by-step breakdown you can hand to whoever owns the demo.

The whole process takes about a minute per demo. Manual review took 20-30 minutes.

## 3. The Hard Part: Scraping Storylane

Storylane renders demos inside nested iframes. The content you see on screen lives in a different document context than the navigation controls. A standard Playwright script that queries the top-level DOM finds nothing.

The scraper handles this with context-aware selectors. It detects whether content lives in the main frame or an iframe, switches context, and runs the appropriate queries. When a selector fails, it falls back to alternative strategies. This fallback chain is why the scraping actually works across different demo layouts, not just the happy path.

I spent more time on reliable scraping than on the AI analysis. That's usually how it goes with agent work: the intelligence is the easy part. Getting clean input is the real engineering.

## 4. Architecture

```
Storylane URL → Playwright (scrape) → GPT (analyze) → Scored Report
                     ↑                      ↑
                iframe handling         QA rubric
                fallback selectors      grammar, GTM, UX
```

**Tech stack:**
- **FastAPI** for API endpoints and backend logic
- **NiceGUI** for the interactive web UI
- **Playwright** (async) for scraping with full browser rendering
- **GPT** for content analysis against a QA rubric
- **Redis** for session storage and caching (falls back to in-memory)
- **Docker** for deployment on Fly.io

**API surface:**
- `POST /api/demo-review` — Submit a URL, get a full QA report
- `GET /demo-flow` — Get the parsed demo flow with caching
- `GET /demo-flow-steps` — Get raw extracted steps
- `GET /demo-review-json` — Export results as JSON

Every request gets its own isolated session. Multiple people can run reviews simultaneously without cross-contamination.

## 5. What It Actually Catches

Real examples from production demos:

- **Stale integration references.** A demo for Microsoft Teams mentioned Slack in step 14. Nobody noticed because nobody reads step 14 of a 28-step demo.
- **Inconsistent terminology.** "Content library" in one tooltip, "learning catalog" in another, "course collection" in a third. Same feature, three names.
- **Grammar issues in tooltips.** Sentence fragments, missing periods, inconsistent capitalization. Small stuff that adds up when a prospect clicks through 20 steps.
- **GTM misalignment.** Messaging that matched last quarter's positioning but not current. The agent flags this because it's scored against the current rubric, not muscle memory.

## 6. Results

- **75% reduction in manual QA time.** A 30-minute review becomes a 1-minute agent run plus 5 minutes reviewing the report.
- **Consistent standards.** Every demo gets reviewed against the same rubric. No variance based on who did the review or how tired they were.
- **Actionable output.** The report tells you what's wrong, why it matters, and what to change. Not just red/green scores.

## 7. What I Learned

**Session isolation matters more than you think.** The first version had a global cache. Two people reviewing different demos would see each other's results. Redis-backed sessions with automatic cleanup fixed this, but I should have designed for multi-user from day one.

**Test the scraping, not the AI.** The GPT analysis is reliable because GPT is reliable at text review. The scraping is where things break. Different demo layouts, new Storylane features, iframe nesting changes. The 11 step-counting tests exist because the counting broke three times in production.

**Presales teams will use tools that save them from grunt work.** This didn't need a dashboard or analytics or an executive summary. It needed to take a URL and return a report. Simple input, useful output.

## 8. Try It

The agent is open source.

- **GitHub**: [storylane-qa-editor-agent](https://github.com/allierays/storylane-qa-editor-agent)

This project won **Most Innovative Use Case** at Demo Dundies Season 2 and the grand prize trip to Italy. More importantly, it's still running in production. The demos are more aligned to marketing GTM standards.
