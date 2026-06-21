import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [scrolled, setScrolled] = useState(false); // true = đã scroll xuống => nút lên
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 500);

    if (scrolled) {
      // Đang ở dưới → cuộn lên đầu
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Đang ở đầu → cuộn xuống cuối
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const btnStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    zIndex: 1000,
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-color)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(49,110,101,0.4)',
    opacity: 1,
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
  };

  // Mũi tên xoay: lên (0deg) khi đã scroll, xuống (180deg) khi ở đầu trang
  const arrowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: scrolled
      ? animating ? 'translateY(-5px) rotate(0deg)' : 'translateY(0) rotate(0deg)'
      : animating ? 'translateY(5px) rotate(180deg)' : 'translateY(0) rotate(180deg)',
    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  };

  return (
    <button
      style={btnStyle}
      onClick={handleClick}
      title={scrolled ? 'Scroll to top' : 'Scroll to bottom'}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--primary-hover)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(49,110,101,0.55)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--primary-color)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(49,110,101,0.4)';
      }}
    >
      <span style={arrowStyle}>
        {/* Mũi tên lên — rotate(180deg) = mũi tên xuống */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </span>
    </button>
  );
}
