// The shape a lesson canvas renders.
//
// Lifted out of the exam data layer when that was removed from the site. The
// guide builds these objects itself in VisualObjectiveLesson from the copy in
// objectiveExperiences.ts, so this is a rendering contract, not stored data.

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

export interface NoteSection {
  title: string;
  kind: string;
  blocks: Block[];
}
