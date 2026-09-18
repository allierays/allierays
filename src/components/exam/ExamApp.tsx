// Root island for the CCAR-P prep tool.
//
// Mounted client:only="react" because every screen is derived from localStorage,
// so a server render would be structurally wrong and guaranteed to mismatch.
//
// MotionConfig reducedMotion="user" is the blanket guard: the site's global
// prefers-reduced-motion block in global.css only zeroes CSS durations, and
// does nothing for JS-driven animation. Components that need more than the
// blanket (an infinite pulse, a shake) branch on useReducedMotion explicitly.

import { useEffect, useMemo, useState } from 'react';
import { MotionConfig, motion } from 'motion/react';
import { QUESTIONS } from '../../data/exam/bank';
import type { Attempt, DomainId } from '../../data/exam/types';
import { CUT_SCORE, TOTAL_ITEMS } from '../../data/exam/domains';
import { domainReadiness, toMarkdownReport } from '../../data/exam/scoring';
import { useStore } from './useStore';
import Readiness from './Readiness';
import Study from './Study';
import Cram from './Cram';
import Drill from './Drill';
import Mock from './Mock';
import {
  Button,
  Card,
  CORAL,
  DISPLAY,
  GOLD,
  INK,
  INK_LIGHT,
  INK_MUTED,
  MARBLE,
  HOVER_TRANSITION,
  MONO,
  NAVY,
  WARM,
} from './ui';

type Mode = 'plan' | 'study' | 'cram' | 'drill' | 'mock' | 'data';

function initialDrillDomain(): DomainId | null {
  if (typeof window === 'undefined') return null;
  const value = Number(new URLSearchParams(window.location.search).get('domain'));
  return value >= 1 && value <= 7 ? value as DomainId : null;
}

function initialStudyTarget(): string | null {
  if (typeof window === 'undefined') return null;
  const value = new URLSearchParams(window.location.search).get('objective');
  return value && /^\d+\.\d+$/.test(value) ? value : null;
}

const MODES: { id: Mode; label: string }[] = [
  { id: 'plan', label: 'Plan' },
  { id: 'study', label: 'Study' },
  { id: 'cram', label: 'Cram' },
  { id: 'drill', label: 'Drill' },
  { id: 'mock', label: 'Mock exam' },
  { id: 'data', label: 'Data' },
];

export default function ExamApp() {
  const store = useStore();
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === 'undefined') return 'plan';
    const requested = new URLSearchParams(window.location.search).get('mode');
    return requested === 'drill' || requested === 'study' ? requested : 'plan';
  });
  const [drillDomain, setDrillDomain] = useState<DomainId | null>(initialDrillDomain);
  const [studyTarget, setStudyTarget] = useState<string | null>(initialStudyTarget);

  /** A missed question sends you to its objective note. */
  const goStudy = (objective: string) => {
    setStudyTarget(objective);
    setMode('study');
  };

  const bank = QUESTIONS;
  const readiness = useMemo(
    () => domainReadiness(bank, store.state.attempts),
    [bank, store.state.attempts]
  );

  // Resume an in-flight mock rather than stranding it.
  useEffect(() => {
    if (store.hydrated && store.state.activeMock) setMode('mock');
  }, [store.hydrated]);

  if (!store.hydrated) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: INK_MUTED, fontFamily: MONO }}>
        Loading…
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div style={{ maxWidth: 860, margin: '0 auto', paddingBottom: 60 }}>
        <Header />
        <ModeRail
          mode={mode}
          onChange={(m) => {
            if (store.state.activeMock && m !== 'mock') {
              // Leaving a running exam is a real decision; make it explicit.
              const ok = window.confirm(
                'A mock exam is in progress. Leaving keeps the clock running. Continue?'
              );
              if (!ok) return;
            }
            setMode(m);
            if (m !== 'drill') setDrillDomain(null);
          }}
        />

        {!store.persisting && (
          <div
            style={{
              margin: '0 0 16px',
              padding: '10px 14px',
              background: '#fdf2ef',
              border: `1px solid ${CORAL}`,
              borderRadius: 9,
              fontSize: 13,
              color: INK_LIGHT,
            }}
          >
            <strong>Not saving.</strong> This browser is blocking storage, so progress will vanish
            when the tab closes. Export from the Data tab before you leave.
          </div>
        )}

        {mode === 'plan' && (
          <Readiness
            bank={bank}
            readiness={readiness}
            mocks={store.state.mocks}
            onDrill={(d) => {
              setDrillDomain(d);
              setMode('drill');
            }}
            onMock={() => setMode('mock')}
            onStudy={(d) => {
              setStudyTarget(`${d}.1`);
              setMode('study');
            }}
          />
        )}

        {mode === 'study' && (
          <Study target={studyTarget} onClearTarget={() => setStudyTarget(null)} />
        )}

        {mode === 'cram' && <Cram />}

        {mode === 'drill' && (
          <Drill
            bank={bank}
            attempts={store.state.attempts}
            initialDomain={drillDomain}
            onAttempt={store.recordAttempt}
            onExit={() => setMode('plan')}
            onStudy={goStudy}
          />
        )}

        {mode === 'mock' && (
          <Mock
            bank={bank}
            attempts={store.state.attempts}
            active={store.state.activeMock}
            lastResult={store.state.mocks[store.state.mocks.length - 1] ?? null}
            onStart={store.startMock}
            onUpdate={store.updateMock}
            onFinish={store.finishMock}
            onAbandon={store.abandonMock}
            onAttempts={(list: Attempt[]) => list.forEach(store.recordAttempt)}
            onExit={() => setMode('plan')}
            onStudy={goStudy}
          />
        )}

        {mode === 'data' && (
          <DataPanel
            markdown={toMarkdownReport(readiness, store.state.mocks)}
            json={JSON.stringify(store.state, null, 2)}
            attempts={store.state.attempts.length}
            mocks={store.state.mocks.length}
            onReset={() => {
              if (window.confirm('Delete all attempts and mock results? This cannot be undone.')) {
                store.reset();
              }
            }}
          />
        )}
      </div>
    </MotionConfig>
  );
}

function Header() {
  return (
    <header style={{ marginBottom: 20 }}>
      <h1
        style={{
          fontFamily: DISPLAY,
          fontSize: 34,
          margin: '0 0 8px',
          lineHeight: 1.15,
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0891b2 50%, #14b8a6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Claude Certified Architect, Professional
      </h1>
      <p style={{ margin: 0, fontSize: 15, color: INK_LIGHT, lineHeight: 1.55 }}>
        {TOTAL_ITEMS} items, 120 minutes, {CUT_SCORE} to pass on a 100 to 1000 scale. Seven domains
        at fixed weights. This drills all of it and tells you where you actually stand.
      </p>
    </header>
  );
}

function ModeRail({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const [hot, setHot] = useState<Mode | null>(null);
  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        padding: 4,
        background: WARM,
        border: `1px solid ${MARBLE}`,
        borderRadius: 11,
        marginBottom: 20,
        flexWrap: 'wrap',
      }}
      role="tablist"
    >
      {MODES.map((m) => {
        const active = m.id === mode;
        return (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(m.id)}
            onMouseEnter={() => setHot(m.id)}
            onMouseLeave={() => setHot((h) => (h === m.id ? null : h))}
            onFocus={() => setHot(m.id)}
            onBlur={() => setHot((h) => (h === m.id ? null : h))}
            style={{
              position: 'relative',
              flex: '1 1 auto',
              minWidth: 90,
              padding: '9px 14px',
              background: !active && hot === m.id ? '#fff' : 'transparent',
              border: `1px solid ${!active && hot === m.id ? MARBLE : 'transparent'}`,
              borderRadius: 8,
              // The active tab is a no-op; say so rather than faking a hover.
              cursor: active ? 'default' : 'pointer',
              fontFamily: MONO,
              fontSize: 13,
              transition: HOVER_TRANSITION,
              color: active ? '#fff' : hot === m.id ? INK : INK_LIGHT,
            }}
          >
            {active && (
              <motion.div
                layoutId="exam-mode-active"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: NAVY,
                  borderRadius: 8,
                }}
              />
            )}
            <span style={{ position: 'relative' }}>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function DataPanel({
  markdown,
  json,
  attempts,
  mocks,
  onReset,
}: {
  markdown: string;
  json: string;
  attempts: number;
  mocks: number;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied('failed');
      window.setTimeout(() => setCopied(null), 2400);
    }
  };

  const download = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ccarp-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <Card>
        <div style={{ fontFamily: DISPLAY, fontSize: 19, color: INK, marginBottom: 6 }}>
          Export
        </div>
        <p style={{ margin: '0 0 14px', fontSize: 14, color: INK_MUTED, lineHeight: 1.55 }}>
          {attempts} attempt{attempts === 1 ? '' : 's'} and {mocks} mock
          {mocks === 1 ? '' : 's'} stored in this browser only. Copy the markdown into the study
          vault to keep a record of weak domains.
        </p>
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
          <Button onClick={() => copy(markdown, 'markdown')}>Copy as Markdown</Button>
          <Button variant="ghost" onClick={() => copy(json, 'json')}>
            Copy JSON
          </Button>
          <Button variant="ghost" onClick={download}>
            Download .json
          </Button>
          {copied && (
            <span
              style={{
                alignSelf: 'center',
                fontFamily: MONO,
                fontSize: 12,
                color: copied === 'failed' ? CORAL : GOLD,
              }}
            >
              {copied === 'failed' ? 'clipboard blocked, use the box below' : `${copied} copied`}
            </span>
          )}
        </div>
        <details style={{ marginTop: 14 }}>
          <summary style={{ cursor: 'pointer', fontFamily: MONO, fontSize: 12, color: INK_MUTED }}>
            Show the markdown
          </summary>
          <textarea
            readOnly
            value={markdown}
            rows={14}
            style={{
              width: '100%',
              marginTop: 9,
              fontFamily: MONO,
              fontSize: 12,
              lineHeight: 1.5,
              padding: 11,
              border: `1px solid ${MARBLE}`,
              borderRadius: 8,
              background: WARM,
              color: INK_LIGHT,
              resize: 'vertical',
            }}
          />
        </details>
      </Card>

      <Card>
        <div style={{ fontFamily: DISPLAY, fontSize: 19, color: INK, marginBottom: 6 }}>
          Start over
        </div>
        <p style={{ margin: '0 0 14px', fontSize: 14, color: INK_MUTED, lineHeight: 1.55 }}>
          Clears every attempt and mock result. Export first if you want the record.
        </p>
        <Button variant="danger" onClick={onReset}>
          Delete all progress
        </Button>
      </Card>
    </div>
  );
}
