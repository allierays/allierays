const display = "'Chiron Go Round TC', system-ui, sans-serif";
const INK = '#1a1a1a';
const INK_MUTED = '#8a867a';

interface ToolHeaderProps {
  name: string;
  maker: string;
  icon: string;
  color: string;
  isClaudeIcon?: boolean;
}

export default function ToolHeader({ name, maker, icon, color, isClaudeIcon }: ToolHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      margin: '0.5rem 0 1rem',
      padding: '16px 20px',
      background: '#fafaf7',
      borderRadius: 8,
      borderLeft: `4px solid ${color}`,
    }}>
      {isClaudeIcon ? (
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: '#f0ebe3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M16 4L18 13L27 11L20 16L27 21L18 19L16 28L14 19L5 21L12 16L5 11L14 13Z" fill={color} />
          </svg>
        </div>
      ) : (
        <img
          src={icon}
          alt=""
          style={{
            width: 48,
            height: 48,
            maxWidth: 'none',
            borderRadius: 12,
            objectFit: 'cover',
            flexShrink: 0,
            // neutralise the .prose img rules meant for content images
            margin: 0,
            float: 'none',
            border: 'none',
            boxShadow: 'none',
          }}
        />
      )}
      <div>
        <div style={{ fontFamily: display, fontSize: '1.25rem', fontWeight: 800, color: INK }}>
          {name}
        </div>
        <div style={{ fontFamily: display, fontSize: '0.8rem', color: INK_MUTED }}>
          {maker}
        </div>
      </div>
    </div>
  );
}
