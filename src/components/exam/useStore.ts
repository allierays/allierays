// localStorage-backed state for the exam prep tool.
//
// The site is fully static with no adapter, so there is no server-side option.
// Every component that uses this is mounted client:only="react", which means
// there is no SSR pass to mismatch against, but reads are still guarded so a
// private window or blocked storage degrades to an in-memory session.

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  emptyState,
  STORAGE_KEY,
  STORAGE_VERSION,
  type ActiveMock,
  type Attempt,
  type MockResult,
  type StoredState,
} from '../../data/exam/types';

function read(): StoredState {
  if (typeof window === 'undefined') return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    if (parsed.version !== STORAGE_VERSION) {
      // Only one version exists so far. When a v2 lands, migrate here rather
      // than discarding: attempts are the expensive thing to lose.
      return { ...emptyState(), ...parsed, version: STORAGE_VERSION };
    }
    return { ...emptyState(), ...parsed };
  } catch {
    return emptyState();
  }
}

function write(state: StoredState): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    // Quota exceeded, or storage blocked. The session keeps working in memory.
    return false;
  }
}

export function useStore() {
  const [state, setState] = useState<StoredState>(() => emptyState());
  const [hydrated, setHydrated] = useState(false);
  const [persisting, setPersisting] = useState(true);
  const firstWrite = useRef(true);

  useEffect(() => {
    setState(read());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (firstWrite.current) {
      firstWrite.current = false;
      return;
    }
    const ok = write(state);
    setPersisting(ok);
  }, [state, hydrated]);

  const recordAttempt = useCallback((attempt: Attempt) => {
    setState((s) => ({ ...s, attempts: [...s.attempts, attempt] }));
  }, []);

  const startMock = useCallback((mock: ActiveMock) => {
    setState((s) => ({ ...s, activeMock: mock }));
  }, []);

  const updateMock = useCallback((patch: Partial<ActiveMock>) => {
    setState((s) => (s.activeMock ? { ...s, activeMock: { ...s.activeMock, ...patch } } : s));
  }, []);

  const finishMock = useCallback((result: MockResult) => {
    setState((s) => ({ ...s, activeMock: null, mocks: [...s.mocks, result] }));
  }, []);

  const abandonMock = useCallback(() => {
    setState((s) => ({ ...s, activeMock: null }));
  }, []);

  const setExamDate = useCallback((date: string | null) => {
    setState((s) => ({ ...s, examDate: date }));
  }, []);

  const toggleStudied = useCallback((objectiveId: string) => {
    setState((s) => ({
      ...s,
      studied: s.studied.includes(objectiveId)
        ? s.studied.filter((x) => x !== objectiveId)
        : [...s.studied, objectiveId],
    }));
  }, []);

  const reset = useCallback(() => {
    setState(emptyState());
  }, []);

  return {
    state,
    hydrated,
    /** False when localStorage refused the last write. */
    persisting,
    recordAttempt,
    startMock,
    updateMock,
    finishMock,
    abandonMock,
    setExamDate,
    toggleStudied,
    reset,
  };
}
