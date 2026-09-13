// Structured teaching content, parsed from the study vault at extract time so
// no markdown parser has to ship to the browser.

export type Inline =
  | { t: 'text'; v: string }
  | { t: 'code'; v: string }
  | { t: 'strong'; v: string }
  | { t: 'em'; v: string };

export type Block =
  | { t: 'p'; v: Inline[] }
  | { t: 'h'; level: number; v: string }
  | { t: 'code'; lang: string; v: string }
  | { t: 'list'; ordered: boolean; items: { depth: number; v: Inline[] }[] }
  | { t: 'table'; head: Inline[][]; rows: Inline[][][] }
  | { t: 'callout'; kind: string; title: string; children: Block[] };

export type SectionKind =
  | 'abilities'
  | 'concept'
  | 'decide'
  | 'numbers'
  | 'exam'
  | 'worked'
  | 'selfcheck'
  | 'sources'
  | 'other';

export interface NoteSection {
  title: string;
  kind: SectionKind;
  blocks: Block[];
}

export interface ObjectiveNote {
  /** "3.2" */
  objective: string;
  domain: number;
  /** Objective title without the number prefix. */
  title: string;
  h1: string;
  summary: string;
  sections: NoteSection[];
}
