---
title: "Run the Dumb Baseline First"
shortTitle: "The Dumb Baseline"
description: "One number justified most of the agent architecture built in the last two years. Princeton re-ran it. The pipeline was GPT-4 all along, the baseline was understated, and the chart inverts."
date: 2026-08-30
tags: [evals, agents, applied-ai, benchmarks]
---

I build agent systems for a living, and for about two years I carried a number around in my head that made that feel obviously worth doing.

The number is 95.1%. Andrew Ng put it in a March 2024 letter: GPT-3.5 solves 48.1% of HumanEval zero shot, GPT-4 solves 67.0%, and GPT-3.5 wrapped in an agentic workflow reaches up to 95.1%. The conclusion everyone drew, including me, was that the jump from GPT-3.5 to GPT-4 is dwarfed by how you wrap the model. Architecture beats model. Twenty-eight points of headroom sitting in the scaffolding.

I have used that number. It has been in slides I have shown to people deciding whether to fund this kind of work. So when I went looking for the paper behind it, I was not expecting what I found, which is that there isn't one. Ng cited no source. The figure traces to a result reported in the LDB paper for LDB combined with Reflexion, labelled GPT-3.5.

Kapoor and colleagues at Princeton re-ran those published HumanEval agents, five times each, across all 164 tasks. Three things went wrong at once.

**The number does not reproduce.** 95.1% reported, 88.9% measured, across a range of 86.6 to 91.5.

**The pipeline was not running GPT-3.5.** The generated program from the Reflexion repository relies on GPT-4 for code generation. The authors acknowledged this and said they would update the paper. So the headline was never a weak model beating a strong one. It was GPT-4 with scaffolding on top.

**The baseline was understated.** The same paper reported zero-shot GPT-4 at 75.0%. Princeton measured 89.6%.

Put the reproduced numbers next to the ones in the chart and the whole thing inverts.

| | As cited | Reproduced |
|---|---|---|
| GPT-4, zero shot | 67.0% | **89.6%** |
| The agentic pipeline | 95.1% | **88.9%** |
| Gap | +28 points for architecture | none, the ranges overlap |

The scaffolded pipeline is not ahead of the bare model. It is behind it, and the confidence intervals overlap enough that the honest reading is no measurable difference.

## It was not one bad paper

This is the part that changed how I work, rather than just how I cite.

Princeton did not stop at reproducing one result. They looked at the HumanEval leaderboard as a whole and built a set of baselines that are not architectures at all:

- **Zero shot.** The model, nothing else.
- **Retry.** Call at temperature 0, up to five times, on test failure. This works because models are not actually deterministic at temperature 0.
- **Warming.** The same, but raising temperature from 0 to 0.5 across attempts.
- **Escalation.** Start on a cheap model, move to a more expensive one only when the cheap one fails.

Warming was statistically indistinguishable from the best-performing published agent architecture. Not close to it. Indistinguishable from it. And no paper proposing an architecture had tested against it, because nobody thought to.

Escalation strictly beat one published agent on accuracy at under half the cost.

Meanwhile the architectures those baselines were matching cost between 50% and fifty times more to run. Cost was not a top-line metric in any of the papers, which is how a fifty-fold difference went unremarked for two years.

Their line for why this happens is the one I keep coming back to: accuracy alone cannot identify progress, because accuracy can be improved by scientifically meaningless methods such as retrying. Coding benchmarks hand you a correctness signal in the form of test cases, so you can sample until something passes. AlphaCode went from near zero to over 15% with a thousand retries, and past 30% with a million. There is seemingly no limit to the amount of inference compute that can buy you accuracy.

Which means any leaderboard without a cost axis is partly ranking spend.

## What this does not mean

It does not mean scaffolding is worthless, and I want to be careful here because the overcorrection is its own mistake.

HumanEval is 164 problems, heavily represented in pretraining data, and it hands the agent its own test cases. It was close to saturated when these agents were built. There was not much room for an architecture to demonstrate anything. Kapoor and colleagues flag this themselves and say System 2 techniques may well be useful on harder tasks than HumanEval contains.

On harder benchmarks, scaffolding does move results. Reporting on SWE-bench Pro puts three agent systems running the same underlying model at 50.2% to 55.4%, so about five points of spread from scaffold choice alone. That is real. It is also an order of magnitude smaller than twenty-eight points, and the same reporting notes the gains shrinking in relative terms as models get stronger.

Reflection and tool use are still worth reaching for. Just not because of this number. The reason to give a critic the ability to run tests is that it grounds the critique in execution feedback instead of the model's opinion of its own work, and that argument never depended on 95.1%.

## What I changed

Three things, and none of them are clever.

**I run the boring version first.** Before crediting any pattern, retry-with-temperature gets its shot. If that closes the gap, I did not need reflection, and reflection costs more calls, more latency, and more code that somebody has to maintain at two in the morning.

**I stole escalation outright.** Start cheap, escalate on failure. It is a cost strategy that happens to raise accuracy, which is the reverse of the usual trade, and I have no idea why it is not the default.

**I report cost next to accuracy.** Every time. A quality number with no cost attached is not a result anybody can act on, and it is the specific omission that let this go unchallenged.

## The part that stings

The advice that would have caught all of this came from the same person as the number.

Ng's most repeated practical guidance is that a disciplined process for evals and error analysis is the single biggest predictor of how fast a team improves an agent. Measure before you promote. Compare against a baseline. He has a name for shipping an agentic system without ever measuring the zero-shot call it replaced: the missing baseline.

The benchmark claim that made the architectural advice famous is the part that failed. The methodological advice is the part that held. If anyone had followed it, including me, we would have found this two years ago.

So: run the dumb baseline first. Not because architecture never helps, but because you cannot tell whether it helped without one.
