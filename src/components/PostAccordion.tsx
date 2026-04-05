import { useState, useEffect } from 'react';

interface Post {
  id: string;
  title: string;
  shortTitle?: string;
  description: string;
  date: string;
  image?: string;
  tags?: string[];
  readingTime?: string;
}

interface Props {
  posts: Post[];
}

export default function PostAccordion({ posts }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (posts.length === 0) return null;

  // Mobile: vertical stack of cards
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        {posts.map((post) => (
          <a
            key={post.id}
            href={`/posts/${post.id}`}
            style={{
              display: 'block',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              textDecoration: 'none',
              height: '200px',
              background: post.image ? undefined : '#1e2a4a',
            }}
          >
            {post.image && (
              <img
                src={post.image}
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(30,42,74,0.95) 0%, rgba(30,42,74,0.6) 60%, rgba(30,42,74,0.15) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <time
                  style={{
                    fontFamily: "'Chiron Go Round TC', system-ui, sans-serif",
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.8)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {post.date}
                </time>
                {post.readingTime && (
                  <>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>·</span>
                    <span style={{ fontFamily: "'Chiron Go Round TC', system-ui, sans-serif", fontSize: '0.7rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>
                      {post.readingTime}
                    </span>
                  </>
                )}
              </div>
              <h3
                style={{
                  fontFamily: "'Chiron Go Round TC', system-ui, sans-serif",
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  margin: '0.2rem 0 0.35rem',
                  lineHeight: 1.25,
                  letterSpacing: '0.01em',
                }}
              >
                {post.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Chiron Go Round TC', system-ui, sans-serif",
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1.5,
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {post.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    );
  }

  // Desktop: horizontal accordion
  return (
    <div style={{ display: 'flex', gap: '6px', height: '100%', minHeight: '480px', width: '100%' }}>
      {posts.map((post, index) => {
        const isActive = index === activeIndex;
        return (
          <a
            key={post.id}
            href={`/posts/${post.id}`}
            onMouseEnter={() => { setActiveIndex(index); setHoveredIndex(index); }}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              flex: isActive ? 4 : 0.5,
              transition: 'flex 0.5s cubic-bezier(0.23, 1, 0.32, 1), transform 0.3s ease, box-shadow 0.3s ease',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              textDecoration: 'none',
              minWidth: 0,
              background: post.image ? undefined : '#1e2a4a',
              transform: hoveredIndex === index && isActive ? 'translateY(-3px)' : 'translateY(0)',
              boxShadow: hoveredIndex === index && isActive ? '0 8px 30px rgba(0,0,0,0.25)' : 'none',
            }}
          >
            {/* Background image */}
            {post.image && (
              <img
                src={post.image}
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}

            {/* Gradient overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: isActive
                  ? 'linear-gradient(to top, rgba(30,42,74,0.95) 0%, rgba(30,42,74,0.7) 55%, rgba(30,42,74,0.15) 100%)'
                  : 'rgba(30,42,74,0.75)',
                transition: 'background 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              }}
            />

            {/* Collapsed: vertical title */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isActive ? 0 : 1,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  transform: 'rotate(180deg)',
                  fontFamily: "'Chiron Go Round TC', system-ui, sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.85)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxHeight: '100%',
                  padding: '1rem 0',
                }}
              >
                {post.shortTitle || post.title}
              </span>
            </div>

            {/* Expanded: full content */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '2rem',
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s',
                pointerEvents: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <time
                  style={{
                    fontFamily: "'Chiron Go Round TC', system-ui, sans-serif",
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.9)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {post.date}
                </time>
                {post.readingTime && (
                  <>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>·</span>
                    <span style={{ fontFamily: "'Chiron Go Round TC', system-ui, sans-serif", fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>
                      {post.readingTime}
                    </span>
                  </>
                )}
              </div>
              <h3
                style={{
                  fontFamily: "'Chiron Go Round TC', system-ui, sans-serif",
                  fontSize: '1.375rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  margin: '0.25rem 0 0.5rem',
                  lineHeight: 1.25,
                  letterSpacing: '0.01em',
                }}
              >
                {post.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Chiron Go Round TC', system-ui, sans-serif",
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.95)',
                  lineHeight: 1.6,
                  margin: '0 0 0.75rem',
                }}
              >
                {post.description}
              </p>
              <span
                style={{
                  fontFamily: "'Chiron Go Round TC', system-ui, sans-serif",
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.9)',
                  letterSpacing: '0.02em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                Read <span style={{ transition: 'transform 0.2s ease', display: 'inline-block' }}>→</span>
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
