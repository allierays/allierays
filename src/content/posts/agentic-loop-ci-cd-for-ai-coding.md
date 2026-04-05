---
title: "If You're Not Using the Ralph Loop, You Become Your Own Loop"
shortTitle: "Agentic Loop"
description: "Think of it like CI/CD for AI coding. You plan in one terminal, Ralph codes autonomously in the other."
date: 2026-01-27
tags: [agentic-loop, claude-code, ai, autonomous-coding]
image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80"
---

<div style="float: left; width: 270px; height: 480px; margin: 0.25rem 1.5rem 1rem 0; position: relative;">
<iframe src="https://www.youtube.com/embed/DYokZuLwCTw" title="Heard of RALPH yet?" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px;"></iframe>
</div>

I watched myself do the same thing three days in a row. Open Claude Code. Describe a feature. Wait. Read the output. Copy an error. Paste it back. Wait again. Fix something Claude missed. Paste the fix. Wait. Repeat until the feature worked or I gave up.

I was the loop. I was the CI/CD pipeline, the test runner, the project manager, and the retry logic. All of it, manually, in my head.

Then I found [Geoffrey Huntley's RALPH loop](https://ghuntley.com/loop/).

## The mindset shift

RALPH isn't a tool. It's a mindset. Geoffrey Huntley describes it as treating software development not as building vertically, brick by brick like Jenga, but as a continuous loop. You allocate specs, define a goal, let the loop run autonomously, watch where it breaks, engineer solutions for those failure points, and iterate. The loop does the building. You do the thinking.

The core insight: LLMs are a new form of programmable computer. You don't sit next to a computer and type each instruction one at a time. You write a program and let it run. Same principle applies here.

I took that philosophy and built [Agentic Loop](https://github.com/allierays/agentic-loop), an open source npm package that puts RALPH into practice with Claude Code, PRD-driven development, and automated verification.

## The problem nobody talks about

Everyone's excited about AI coding assistants. Fair enough. Claude Code is genuinely good at writing software. But here's what the demos skip: the human in the middle is the bottleneck.

You're the one deciding what to build next. You're the one reading test output and feeding it back. You're the one noticing when Claude went off track three changes ago. You're the one context-switching between "think about architecture" and "why is this test failing."

That's not collaboration. That's being a human middleware layer.

## What the Ralph loop actually does

The idea is simple. You plan in one terminal. Ralph executes in the other.

**Terminal 1** is where you think. You use Claude Code's plan mode to explore the codebase, talk through the feature, figure out what you actually want. Then you run `/prd` to turn that plan into a PRD with small, testable stories. Each story has clear acceptance criteria. Each one can be verified independently.

**Terminal 2** is where Ralph works. It reads the PRD, picks up the next story, spawns Claude Code, writes the code, runs the checks. If it passes, it commits and moves on. If it fails, it saves the failure context and retries with that context included.

<div style="clear: both;"></div>

<img src="/images/ralph-loop.svg" alt="The RALPH Loop: idea → PRD → code → test → fix → repeat" style="width: 100%; max-width: 100%; margin: 2rem 0; display: block;" />

That retry loop is the part that matters. When Ralph fails, it doesn't just try the same thing again. It feeds the failure back as context. Claude sees what went wrong and adjusts. Same instinct a good developer has, but automated.

## CI/CD for AI coding

<div style="float: left; width: 270px; height: 480px; margin: 0.25rem 1.5rem 1rem 0; position: relative;">
<iframe src="https://www.youtube.com/embed/JtfhOnB-rpg" title="CI/CD for AI Coding" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px;"></iframe>
</div>

Think about what CI/CD did for shipping software. Before it, you'd write code, manually test, manually deploy, and pray. CI/CD automated the verification. You still wrote the code, but the pipeline handled "did it actually work."

Ralph does the same thing for AI-generated code. Claude still writes it. But the loop handles verification: lint, tests, PRD acceptance criteria, smoke tests. You stop being the person who babysits each change and start being the person who defines what "done" means.

The shift is subtle but it changes everything. Instead of micromanaging Claude's output line by line, you invest your time in the PRD. Better stories, clearer acceptance criteria, tighter scope. The quality of your plan directly determines the quality of Ralph's output.

## The loop gets smarter

Ralph learns. When it struggles with something, you teach it with `/lesson`. Those lessons get cross-referenced during PRD generation. Next time a similar pattern comes up, Ralph already knows the approach.

You can capture your coding style with `/my-dna` so the generated code matches your conventions. You can tune timeouts and checks in config. Over time, your Ralph instance fits the way you work.

This is the part that surprised me. I expected the autonomy. I didn't expect the accumulation. Each lesson, each style preference, each config tweak compounds. My Ralph writes better code this week than last week, and I didn't change a line of the core loop.

## What I actually do now

My workflow is two terminals and a plan. I spend most of my time in Terminal 1: thinking, planning, reviewing PRDs. Terminal 2 runs in the background. I hear the commit sounds. Sometimes I check in. Mostly I don't need to.

When something goes wrong, Ralph's failure logs tell me exactly what happened. I fix the plan, not the code. I teach the lesson, not patch the symptom.

I shipped [Agentic Loop](https://github.com/allierays/agentic-loop) as an open source npm package because I think this pattern is where AI coding is headed. Not smarter models (though that helps). Better loops. Better verification. Better ways to let AI work while you think.

Read [Geoffrey Huntley's original RALPH writeup](https://ghuntley.com/loop/) for the philosophy. Then try [Agentic Loop](https://github.com/allierays/agentic-loop) to put it into practice.

Stop being the loop. Build the loop.
