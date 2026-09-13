// Shared visual language for the exam prep tool.
//
// Styling follows the site's dominant convention: inline style objects plus
// local colour consts, rather than Tailwind (which has no config here).
//
// Motion note: the global prefers-reduced-motion block in global.css only
// zeroes CSS animation and transition durations. It does NOT reach animations
// driven by the motion library, so every animated component here reads
// useReducedMotion() and degrades explicitly.

import { motion, useReducedMotion } from 'motion/react';
import { useState, type ReactNode } from 'react';

export const INK = '#1a1915';
export const INK_LIGHT = '#3d3b35';
export const INK_MUTED = '#8a867a';
export const MARBLE = '#e8e5dd';
export const CARD = '#ffffff';
export const WARM = '#f4f3ef';
export const NAVY = '#2d4059';
export const TEAL = '#5b9ea6';
export const CORAL = '#e07a5f';
export const SAGE = '#7a9a6d';
export const GOLD = '#b8960c';

export const MONO = 'var(--font-mono, ui-monospace, monospace)';
export const DISPLAY = 'var(--font-display, system-ui)';

/** Stagger/pop pair matching the idiom already used across the site's diagrams. */
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

export const pop = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 320, damping: 26 },
  },
};

/** Variants that collapse to a plain fade when the OS asks for reduced motion. */
export function useVariants() {
  const reduced = useReducedMotion();
  if (reduced) {
    return {
      stagger: { hidden: {}, show: { transition: { staggerChildren: 0 } } },
      pop: {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.01 } },
      },
      reduced: true as const,
    };
  }
  return { stagger, pop, reduced: false as const };
}

// ------------------------------------------------------------- hover system
//
// Inline styles cannot express :hover, which is why nothing in this tool had a
// hover state. Everything interactive now runs through one of these, so the
// feedback is identical wherever you point: the surface tints, the border picks
// up the domain accent, a soft shadow appears, and it shifts a couple of pixels.
// Focus mirrors hover so keyboard users get the same affordance.

export const HOVER_MS = 130;
export const HOVER_TRANSITION = `background ${HOVER_MS}ms ease, border-color ${HOVER_MS}ms ease, box-shadow ${HOVER_MS}ms ease, color ${HOVER_MS}ms ease`;

/** Tracks pointer and keyboard focus as one "is this the live target" flag. */
export function useHover() {
  const [hovered, setHovered] = useState(false);
  const bind = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus: () => setHovered(true),
    onBlur: () => setHovered(false),
  };
  return { hovered, bind, setHovered };
}

/** A soft accent shadow at the tool's one elevation. */
export function hoverShadow(accent: string) {
  return `0 1px 6px ${accent}22`;
}

/**
 * A clickable card, row, or accordion header. One component so every large
 * surface in the tool lifts the same way.
 */
export function Pressable({
  children,
  onClick,
  accent = NAVY,
  active = false,
  disabled = false,
  as = 'button',
  ariaExpanded,
  ariaPressed,
  style,
  slide = 3,
  title,
}: {
  children: ReactNode | ((hovered: boolean) => ReactNode);
  onClick?: () => void;
  accent?: string;
  active?: boolean;
  disabled?: boolean;
  as?: 'button' | 'div';
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
  style?: React.CSSProperties;
  /** Horizontal nudge on hover; 0 for grid cells that must not move. */
  slide?: number;
  title?: string;
}) {
  const { hovered, bind } = useHover();
  const reduced = useReducedMotion();
  const hot = hovered && !disabled;

  const base: React.CSSProperties = {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    font: 'inherit',
    color: INK,
    background: active ? WARM : hot ? '#f7f9fa' : CARD,
    border: `1px solid ${active || hot ? accent : MARBLE}`,
    borderRadius: 10,
    cursor: disabled ? 'default' : 'pointer',
    transition: reduced ? 'none' : HOVER_TRANSITION,
    boxShadow: hot ? hoverShadow(accent) : 'none',
    ...style,
  };

  const content = typeof children === 'function' ? children(hot) : children;
  const Comp: any = as === 'div' ? motion.div : motion.button;

  return (
    <Comp
      {...(as === 'button' ? { type: 'button', disabled } : { role: onClick ? 'button' : undefined })}
      onClick={disabled ? undefined : onClick}
      aria-expanded={ariaExpanded}
      aria-pressed={ariaPressed}
      title={title}
      {...bind}
      whileHover={disabled || reduced || !slide ? undefined : { x: slide }}
      whileTap={disabled || reduced ? undefined : { scale: 0.995 }}
      transition={{ type: 'spring' as const, stiffness: 500, damping: 34 }}
      style={base}
    >
      {content}
    </Comp>
  );
}

/** Small pill control: the flag toggle, "open full width", and friends. */
export function TinyButton({
  children,
  onClick,
  accent = INK_MUTED,
  active = false,
  ariaPressed,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  accent?: string;
  active?: boolean;
  ariaPressed?: boolean;
  title?: string;
}) {
  const { hovered, bind } = useHover();
  const reduced = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={ariaPressed}
      title={title}
      {...bind}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring' as const, stiffness: 500, damping: 34 }}
      style={{
        fontFamily: MONO,
        fontSize: 11.5,
        cursor: 'pointer',
        background: active ? `${accent}14` : hovered ? `${accent}0f` : 'transparent',
        color: active || hovered ? accent : INK_MUTED,
        border: `1px solid ${active || hovered ? accent : MARBLE}`,
        borderRadius: 999,
        padding: '4px 11px',
        whiteSpace: 'nowrap',
        transition: reduced ? 'none' : HOVER_TRANSITION,
      }}
    >
      {children}
    </motion.button>
  );
}

// ------------------------------------------------------------------ pieces

export function Card({
  children,
  style,
  accent,
}: {
  children: ReactNode;
  style?: React.CSSProperties;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: CARD,
        border: `1px solid ${MARBLE}`,
        borderTop: accent ? `3px solid ${accent}` : `1px solid ${MARBLE}`,
        borderRadius: 12,
        padding: '20px 22px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Pill({
  children,
  color = INK_MUTED,
  bg,
}: {
  children: ReactNode;
  color?: string;
  bg?: string;
}) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: MONO,
        fontSize: 11,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color,
        background: bg ?? 'transparent',
        border: bg ? 'none' : `1px solid ${MARBLE}`,
        borderRadius: 999,
        padding: '3px 10px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled,
  style,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  style?: React.CSSProperties;
  title?: string;
}) {
  const { hovered, bind } = useHover();
  const reduced = useReducedMotion();
  const hot = hovered && !disabled;

  const base: React.CSSProperties = {
    fontFamily: MONO,
    fontSize: 13,
    padding: '9px 16px',
    borderRadius: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: reduced ? 'none' : HOVER_TRANSITION,
    border: '1px solid transparent',
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: hot ? '#22334a' : NAVY,
      color: '#fff',
      borderColor: hot ? '#22334a' : NAVY,
      boxShadow: hot ? hoverShadow(NAVY) : 'none',
    },
    ghost: {
      background: hot ? WARM : 'transparent',
      color: hot ? INK : INK_LIGHT,
      borderColor: hot ? INK_MUTED : MARBLE,
    },
    danger: {
      background: hot ? '#fdf2ef' : 'transparent',
      color: CORAL,
      borderColor: CORAL,
      boxShadow: hot ? hoverShadow(CORAL) : 'none',
    },
  };
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      {...bind}
      whileTap={disabled || reduced ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring' as const, stiffness: 500, damping: 34 }}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </motion.button>
  );
}

/**
 * Horizontal meter with an animated fill. Modelled on the site's existing
 * ContextMeter, which animates a motion.rect width.
 */
export function Meter({
  value,
  max = 1,
  color = TEAL,
  height = 8,
  label,
}: {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  label?: string;
}) {
  const reduced = useReducedMotion();
  const pct = Math.max(0, Math.min(1, max ? value / max : 0));
  return (
    <div>
      {label && (
        <div style={{ fontFamily: MONO, fontSize: 11, color: INK_MUTED, marginBottom: 5 }}>
          {label}
        </div>
      )}
      <div
        style={{
          height,
          background: MARBLE,
          borderRadius: height,
          overflow: 'hidden',
        }}
        role="meter"
        aria-valuenow={Math.round(pct * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          initial={reduced ? false : { width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={
            reduced ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 22 }
          }
          style={{ height: '100%', background: color, borderRadius: height }}
        />
      </div>
    </div>
  );
}

/** Section heading in the site's display face. */
export function H({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h2
        style={{
          fontFamily: DISPLAY,
          fontSize: 22,
          margin: 0,
          color: INK,
          letterSpacing: '-0.01em',
        }}
      >
        {children}
      </h2>
      {sub && (
        <p style={{ margin: '6px 0 0', fontSize: 14, color: INK_MUTED, lineHeight: 1.5 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

/** Renders `code spans` inside otherwise plain question text. */
export function RichText({ text, style }: { text: string; style?: React.CSSProperties }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <span style={style}>
      {parts.map((p, i) =>
        p.startsWith('`') && p.endsWith('`') && p.length > 2 ? (
          <code
            key={i}
            style={{
              fontFamily: MONO,
              fontSize: '0.9em',
              background: WARM,
              border: `1px solid ${MARBLE}`,
              borderRadius: 4,
              padding: '1px 5px',
            }}
          >
            {p.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </span>
  );
}
