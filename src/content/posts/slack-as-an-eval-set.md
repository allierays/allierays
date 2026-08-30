---
title: "Your Experts Are Already Labeling Your Data"
shortTitle: "Slack as an Eval Set"
description: "I needed labeled relevance data to know whether our search was any good. Buying it costs six figures. Instead I wired a Slack channel into the eval loop, because the labels were already being produced there for free."
date: 2026-08-30
tags: [evals, retrieval, slack, applied-ai, self-improving-systems]
---

If you have shipped AI search and someone asks whether it is working, you need labeled relevance data to answer. A set of real questions, and for each one, a human judgment about which results were actually right.

Nobody has this. Getting it quoted comes back as six figures or six months, usually both, so it goes on the roadmap and stays there. In the meantime the system ships and you answer the question with adjectives.

I spent a while looking for a cheaper way to buy labels before noticing we were already producing them, every day, and throwing them away.

## The channel was the dataset

We have an internal Slack channel where people ask for content recommendations. Somebody posts a question like "we need something on managing hybrid teams for frontline managers in Germany," and a curator who knows the library answers with a handful of links.

That is a labeled eval case. The question is the query. The curator's links are the relevance judgments. The grading is even in there implicitly, because a curator who leads with two courses and then adds "this one is adjacent if you need more" has told you which are the strong matches and which are hedges.

Nobody set out to build a dataset. It is a byproduct of somebody doing their job well.

Two things make this better than data you would commission. The questions are real, in the words people actually use, with all the vagueness and missing context that implies. And it never goes stale, because new cases arrive every day. Static eval sets rot as the system and the catalog change underneath them. This one refreshes itself.

## The most important decision was to stay read-only

The bot in that channel captures messages and never posts. Not once.

This was the first thing I got right and it was mostly luck. The obvious move, the one I wanted to make, is to have the bot answer the question. That is the demo everyone wants to see. But the moment a bot starts answering, the curators stop. They see a response already sitting there and move on. Within a month you have a bot that is mediocre at recommendations and no more expert answers to learn from.

You cannot harvest a signal and perturb it at the same time. If you take one thing from this, take that.

So the bot forwards every message in the thread to a capture endpoint, deduplicated on the message timestamp, with a scheduled sweep that re-reads the last two days as a backstop. That backstop earned its place. Live capture silently failed in production for a while because of a configuration bug, and the sweep is what filled the gap once we noticed.

## Turning a thread into a scored case

Once a thread resolves, five things happen to it.

**Normalize.** The question becomes the asker's own text, not a cleaned-up version. The labels become the courses the curator linked, resolved from URL to catalog ID and graded by endorsement strength. Links to things not in the catalog are worth keeping separately, because a curator reaching outside the library is telling you about a content gap rather than a search failure.

**Replay.** The question goes back through the production search path over HTTP. Not by importing the search service and calling it directly. That distinction sounds pedantic and is not. Calling in-process measures your library. Calling over the same path a user hits measures what actually ships, including the middleware, the timeouts, and the swallowed exceptions.

**Score.** Recall at 30, nDCG at 10, MRR. All arithmetic, no model involved. There is exactly one judgment in the pipeline ambiguous enough to need an LLM, which is whether a miss was a vocabulary problem or a metadata problem. Everything else is deterministic, and it should be. A model grading things a function could grade is expensive theater.

**Diagnose.** When a case misses, the system re-runs the same question with every structured filter stripped out. If the curator's courses suddenly appear, the filters excluded them and the extraction over-filtered. If they still do not appear, retrieval genuinely could not find them. Those two failures need completely different fixes, and separating them automatically is the difference between a metric that tells you something broke and a metric that tells you where.

**Propose.** Here is the part I find genuinely interesting. When search misses a course the curator endorsed, the fix is usually to tag that course with the topic of the question. The reasoning is that the curator's endorsement is evidence the course belongs to that topic even when the course's own text never uses the word. Search failed because the words were not there. A human proved the words were wrong.

## Nothing applies itself

No suggestion writes to the catalog on its own. Every one goes into a review queue and waits for a person. Applied changes are append-only, stamped with their source, and reversible by reference.

And the rule I would keep even if everything else changed: **the loop never turns its own work green.**

When a fix ships and an answer improves, the nightly judge is allowed to mark that case amber at most. Something like "looks fixed, awaiting re-verification." It cannot clear the flag. Only the human who failed it originally can do that.

That constraint felt bureaucratic when I wrote it and I no longer think it is optional, for a reason I only understood later.

## Why this works, according to people who study it

I built most of this on instinct and then read the literature, which was a humbling order of operations.

The useful frame is a verification hierarchy. Self-improvement loops are grounded on something, and the something sorts into rungs: formal verifiers at the top, then execution feedback, then learned judges, then intrinsic signals, meaning a model re-reading its own output.

Loops grounded near the bottom do not work. There is a study, the Mirror Loop, that ran ten rounds of self-critique across several models and four task families and measured informational change declining by 55% across iterations, decaying to near zero by round six or seven. Ungrounded self-critique does not converge on quality. It converges on paraphrase. A single grounding intervention at round three restored forward movement, which tells you the problem was never the loop. It was what the loop was checking against.

Retrieval quality has no formal verifier. There is no test suite for "was this the right course." By the hierarchy it is exactly the class of task where self-improvement should die.

The way out is not a better judge. It is that a human expert's endorsement is a genuine grounding signal, and in most organizations that signal is already being generated somewhere as a side effect of work. You do not have to manufacture it. You have to find it and wire it in.

Which also explains the amber rule. The moment a model is allowed to clear its own flag, the loop's grounding quietly drops a rung and you are back to a system confirming itself.

## Three things I am still unsure about

**Only answered questions become cases.** If nobody could find anything, the thread dies unresolved and never enters the eval set. Those are the hardest queries in the system and they are structurally invisible to my metrics. Scores can improve while the worst cases stay exactly as bad.

**The curator is both the grader and part of the system.** They recommend what they can recall. If a curator has a blind spot, the loop encodes that blind spot into the metadata as ground truth, and nothing downstream can detect it, because the same person grades the result.

**I do not have a clean baseline.** Bug fixes shipped around the same time the loop did, so I cannot cleanly attribute improvement to one or the other. This is the exact anti-pattern the literature warns about and I walked into it anyway.

## If you want to try this

Find the channel. Almost every company has one. It might be support tickets, a customer success queue, a Discord, or an inbox. The pattern is anywhere a person asks a question and an expert answers with specific references.

Export fifty resolved threads. Run each question through your system by hand. Check whether the linked answers come back in the top ten.

That number is your baseline, and it cost you an afternoon rather than six figures. Everything above is just automating the afternoon.
