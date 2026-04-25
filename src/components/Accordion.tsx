import { useState } from 'react';

interface AccordionItem {
  title: string;
  content: string;
  language?: string;
}

interface Props {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

const NAVY = '#2d4059';
const NAVY_DARK = '#1e2a4a';
const TEAL = '#5b9ea6';
const TEAL_DARK = '#4a8891';
const MARBLE = '#e8e5dd';
const INK_LIGHT = '#3d3b35';
const INK_MUTED = '#8a867a';
const BG_WARM = '#f4f3ef';

export default function Accordion({ items, allowMultiple = false }: Props) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const copy = (content: string, index: number) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <div style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {items.map((item, i) => {
        const isOpen = openIndices.has(i);
        const isHovered = hoveredIndex === i;
        return (
          <div key={i} style={{
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: isHovered
              ? '0 4px 12px rgba(45,64,89,0.25)'
              : '0 1px 3px rgba(0,0,0,0.06)',
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
            transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
          }}>
            <button
              onClick={() => toggle(i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 20px',
                background: isHovered
                  ? `linear-gradient(135deg, ${NAVY_DARK} 0%, ${TEAL_DARK} 100%)`
                  : `linear-gradient(135deg, ${NAVY} 0%, ${TEAL} 100%)`,
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#ffffff',
                letterSpacing: '0.02em',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  transition: 'transform 0.2s ease',
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  fontSize: '0.625rem',
                  color: 'rgba(255,255,255,0.7)',
                  flexShrink: 0,
                }}
              >
                ▶
              </span>
              {item.title}
            </button>
            <div
              style={{
                maxHeight: isOpen ? '2000px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
              }}
            >
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => copy(item.content, i)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '4px 10px',
                    background: '#ffffff',
                    border: `1px solid ${MARBLE}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.6875rem',
                    color: copiedIndex === i ? '#2d8a4e' : INK_MUTED,
                    letterSpacing: '0.02em',
                    transition: 'color 0.2s ease, border-color 0.2s ease',
                    zIndex: 1,
                  }}
                >
                  {copiedIndex === i ? 'copied' : 'copy'}
                </button>
                <pre
                  style={{
                    margin: 0,
                    padding: '16px 20px',
                    paddingRight: '80px',
                    background: BG_WARM,
                    color: INK_LIGHT,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.8125rem',
                    lineHeight: 1.8,
                    overflowX: 'auto',
                    borderRadius: 0,
                    border: 'none',
                  }}
                >
                  <code style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: 'inherit',
                    color: 'inherit',
                  }}>
                    {item.content}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
