// Types for the CCAR-P exam prep tool.
//
// The exam being modelled: 63 items, 120 minutes, scaled score 100-1000,
// cut score 720, criterion-referenced. Multiple-choice and multiple-response,
// with each item stating how many responses to select. The score report gives
// pass/fail, the scaled score, and percent-correct per domain.

export type DomainId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type OptionLetter = 'A' | 'B' | 'C' | 'D' | 'E';

/** Single-select mirrors the guide's sample items. Multi mirrors "select two". */
export type QuestionType = 'single' | 'multi';

export interface Question {
  /** Stable id derived from domain, objective and position: "d3-3_2-q1". */
  id: string;
  domain: DomainId;
  /** "3.2", or null for questions that came from a domain index page. */
  objective: string | null;
  objectiveTitle: string | null;
  type: QuestionType;
  /** How many responses to select. The real exam always states this. */
  selectCount: number;
  stem: string;
  /** Pre-shuffled at extract time; index 0 is A. */
  options: string[];
  /** Correct letters against the shuffled option order. */
  keys: OptionLetter[];
  /** Letter references inside have been rewritten to match the shuffle. */
  rationale: string;
  /** Vault file this came from, for tracing back to the study notes. */
  source: string;
}

export interface Objective {
  id: string;
  title: string;
}

export interface Domain {
  id: DomainId;
  title: string;
  /** Percentage of the exam, from the official blueprint. */
  weight: number;
  /** Items on a real 63-item form, derived from the weight. */
  itemsOnExam: number;
  blurb: string;
  accent: string;
  objectives: Objective[];
}

// ----------------------------------------------------------------- attempts

export interface Attempt {
  questionId: string;
  /** Letters the user picked. */
  picked: OptionLetter[];
  correct: boolean;
  /** Epoch ms. */
  at: number;
  /** Milliseconds spent on the item. */
  ms: number;
  /** Which mode produced the attempt. */
  mode: 'drill' | 'mock';
}

export interface MockResult {
  id: string;
  startedAt: number;
  finishedAt: number;
  /** Question ids in the order served. */
  questionIds: string[];
  /** questionId -> letters picked. Absent means unanswered. */
  answers: Record<string, OptionLetter[]>;
  flagged: string[];
  raw: number;
  total: number;
  scaled: number;
  passed: boolean;
  /** Percent correct per domain, as the real score report gives. */
  byDomain: Record<string, { correct: number; total: number }>;
  /** Whether the 120-minute clock ran out. */
  timedOut: boolean;
}

// -------------------------------------------------------------- persistence

export const STORAGE_KEY = 'ccarp-prep-v1';
export const STORAGE_VERSION = 1;

export interface StoredState {
  version: number;
  /** Every attempt, newest last. Drives the readiness estimate. */
  attempts: Attempt[];
  /** Completed mock exams, newest last. */
  mocks: MockResult[];
  /** An in-progress mock, so closing the tab does not lose it. */
  activeMock: ActiveMock | null;
  /** ISO date the user intends to sit the exam, or null. */
  examDate: string | null;
  /** Objective ids the user has ticked off in the plan. */
  studied: string[];
}

export interface ActiveMock {
  id: string;
  startedAt: number;
  /** Epoch ms when the clock expires. Survives a reload. */
  deadline: number;
  questionIds: string[];
  answers: Record<string, OptionLetter[]>;
  flagged: string[];
  index: number;
}

export function emptyState(): StoredState {
  return {
    version: STORAGE_VERSION,
    attempts: [],
    mocks: [],
    activeMock: null,
    examDate: null,
    studied: [],
  };
}
