import { useCountUp, useInView } from '../hooks/useAnimations';

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}

export default function StatCounter({ value, suffix = '', label, delay = 0 }: StatCounterProps) {
  const { ref, inView } = useInView();
  const count = useCountUp(value, 1800, inView);

  const containerStyle: React.CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(30px)',
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
  };

  return (
    <div ref={ref} className="stat-item" style={containerStyle}>
      <div className="stat-number">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
