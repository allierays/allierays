import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { QUESTIONS } from '../../data/exam/bank';
import { DOMAINS } from '../../data/exam/domains';
import { isCorrect } from '../../data/exam/scoring';
import type { DomainId, OptionLetter } from '../../data/exam/types';
import { RichText } from '../exam/ui';

const LETTERS: OptionLetter[] = ['A', 'B', 'C', 'D', 'E'];

type Props = {
  domainId: DomainId;
  color: string;
  bg: string;
  onReview: (objective: string) => void;
};

const clean = (text: string) => text.replaceAll(` \u2014 `, ': ').replaceAll('\u2014', '-');

export default function DomainCheckpoint({ domainId, color, bg, onReview }: Props) {
  const questions = useMemo(() => {
    const domain = DOMAINS.find((item) => item.id === domainId)!;
    return domain.objectives
      .map((objective) => QUESTIONS.find((question) => question.objective === objective.id))
      .filter((question): question is NonNullable<typeof question> => Boolean(question));
  }, [domainId]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<OptionLetter[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<Array<{ objective: string; correct: boolean }>>([]);

  const question = questions[index];
  const finished = index >= questions.length;
  const correct = question ? isCorrect(question, picked) : false;

  const toggle = (letter: OptionLetter) => {
    if (revealed || !question) return;
    if (question.selectCount === 1) {
      setPicked([letter]);
      return;
    }
    setPicked((current) => current.includes(letter)
      ? current.filter((item) => item !== letter)
      : current.length < question.selectCount ? [...current, letter] : current);
  };

  const check = () => {
    if (!question || picked.length !== question.selectCount) return;
    setResults((current) => [...current, { objective: question.objective!, correct }]);
    setRevealed(true);
  };

  const next = () => {
    setIndex((current) => current + 1);
    setPicked([]);
    setRevealed(false);
  };

  const restart = () => {
    setIndex(0);
    setPicked([]);
    setRevealed(false);
    setResults([]);
  };

  if (!questions.length) return null;

  return <section className="mt-5 overflow-hidden rounded-xl border border-[#DED8CE] bg-white">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DED8CE] bg-[#FAF9F4] px-4 py-3">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color }}>Domain checkpoint</p>
        <p className="mt-1 text-[13px] text-[#637979]">One exam-style question for each objective in this domain.</p>
      </div>
      <span className="rounded-full border border-[#DED8CE] bg-white px-3 py-1 text-[12px] font-bold text-[#637979]">
        {finished ? `${results.filter((item) => item.correct).length} / ${questions.length}` : `${index + 1} / ${questions.length}`}
      </span>
    </div>

    {finished ? <div className="p-5">
      <p className="text-xl font-extrabold text-[#394646]">
        {results.filter((item) => item.correct).length === questions.length ? 'You cleared the checkpoint.' : 'Checkpoint complete.'}
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-[#637979]">
        You answered {results.filter((item) => item.correct).length} of {questions.length} correctly.
      </p>
      {results.some((item) => !item.correct) && <div className="mt-4 flex flex-wrap gap-2">
        {results.filter((item) => !item.correct).map((item) => <button key={item.objective} type="button" onClick={() => onReview(item.objective)} className="rounded-lg border border-[#DED8CE] bg-[#FAF9F4] px-3 py-2 text-[13px] font-bold text-[#394646] hover:border-[#35656E]">
          Review objective {item.objective}
        </button>)}
      </div>}
      <div className="mt-5 flex flex-wrap gap-2">
        <a href={`/exam-prep/?mode=drill&domain=${domainId}`} className="rounded-lg px-4 py-2.5 text-[13px] font-bold text-white" style={{ backgroundColor: color }}>Practice 10 more in Exam Prep</a>
        <button type="button" onClick={restart} className="rounded-lg border border-[#DED8CE] bg-white px-4 py-2.5 text-[13px] font-bold text-[#394646]">Try this checkpoint again</button>
      </div>
    </div> : <AnimatePresence mode="wait" initial={false}>
      <motion.div key={question.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }} className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full px-2.5 py-1 text-[11px] font-extrabold" style={{ color, backgroundColor: bg }}>Objective {question.objective}</span>
          <span className="text-[12px] font-semibold text-[#9A9389]">{question.selectCount === 1 ? 'Select one' : `Select ${question.selectCount}`}</span>
        </div>
        <p className="mt-4 max-w-4xl text-[15px] font-bold leading-relaxed text-[#394646]"><RichText text={clean(question.stem)} /></p>
        <div className="mt-4 grid gap-2">
          {question.options.map((option, optionIndex) => {
            const letter = LETTERS[optionIndex];
            const selected = picked.includes(letter);
            const key = revealed && question.keys.includes(letter);
            const wrong = revealed && selected && !key;
            return <button key={letter} type="button" disabled={revealed} aria-pressed={selected} onClick={() => toggle(letter)} className="flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left transition-colors" style={{ borderColor: key ? '#5D7D52' : wrong ? '#B91C1C' : selected ? color : '#DED8CE', backgroundColor: key ? '#F1F7EF' : wrong ? '#FFF7F7' : selected ? bg : 'white' }}>
              <span className="mt-0.5 text-[12px] font-extrabold" style={{ color: key ? '#5D7D52' : wrong ? '#B91C1C' : selected ? color : '#9A9389' }}>{letter}</span>
              <span className="text-[14px] leading-relaxed text-[#394646]"><RichText text={clean(option)} /></span>
            </button>;
          })}
        </div>

        {revealed && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 overflow-hidden rounded-lg border px-4 py-3" style={{ borderColor: correct ? '#BDD3B5' : '#F3CACA', backgroundColor: correct ? '#F6FAF4' : '#FFF7F7' }} aria-live="polite">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.08em]" style={{ color: correct ? '#4C6942' : '#B91C1C' }}>{correct ? 'Correct' : 'Not quite'}</p>
          <p className="mt-2 text-[14px] leading-relaxed text-[#394646]"><RichText text={clean(question.rationale)} /></p>
          {!correct && <button type="button" onClick={() => onReview(question.objective!)} className="mt-3 text-[13px] font-extrabold underline underline-offset-2" style={{ color }}>Review objective {question.objective}</button>}
        </motion.div>}

        <div className="mt-5 flex justify-end">
          {!revealed ? <button type="button" onClick={check} disabled={picked.length !== question.selectCount} className="rounded-lg px-4 py-2.5 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40" style={{ backgroundColor: color }}>Check answer</button> : <button type="button" onClick={next} className="rounded-lg px-4 py-2.5 text-[13px] font-bold text-white" style={{ backgroundColor: color }}>{index === questions.length - 1 ? 'See results' : 'Next question'}</button>}
        </div>
      </motion.div>
    </AnimatePresence>}
  </section>;
}
