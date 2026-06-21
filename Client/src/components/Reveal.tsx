import React from 'react';
import { useInView } from '../hooks/useAnimations';

interface RevealProps {
  children: React.ReactNode;
  delay?: number; // ms
  direction?: 'up' | 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Wrapper component tạo hiệu ứng trượt lên + fade in khi scroll vào viewport
 */
export default function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className,
  style,
}: RevealProps) {
  const { ref, inView } = useInView();

  const translateMap = {
    up: 'translateY(40px)',
    left: 'translateX(-40px)',
    right: 'translateX(40px)',
  };

  const revealStyle: React.CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'translate(0, 0)' : translateMap[direction],
    transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    ...style,
  };

  return (
    <div ref={ref} className={className} style={revealStyle}>
      {children}
    </div>
  );
}
