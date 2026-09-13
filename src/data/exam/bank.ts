// The question bank the app actually reads.
//
// `questions.ts` is generated from the study vault and must stay that way, so
// re-running the extractor never loses work. Stem rewrites live in the separate
// `stem-overrides.ts` and are merged here by question id.
//
// Why stems are rewritten at all: Anthropic's three published sample items are
// 35 to 50 word scenarios that name an actor, state a constraint, and end in a
// superlative ask ("which change best reduces risk?"). The stems harvested from
// the vault were mostly short recall prompts ("Which two statements about X are
// correct?"), which train the wrong cognitive move. Options, keys and rationales
// are untouched: only the framing changes.

import type { Question } from './types';
import { QUESTIONS as GENERATED } from './questions';
import { STEM_OVERRIDES } from './stem-overrides';

export const QUESTIONS: Question[] = GENERATED.map((q) =>
  STEM_OVERRIDES[q.id] ? { ...q, stem: STEM_OVERRIDES[q.id] } : q
);

/** How much of the bank now matches the official item shape. Shown in the UI. */
export const REWRITTEN_COUNT = GENERATED.filter((q) => STEM_OVERRIDES[q.id]).length;
