import { useId } from 'react';

type Props = {
  percent: number;
  size?: number;
  stroke?: number;
  label?: string;
};

export function ProgressRing({ percent, size = 160, stroke = 14, label }: Props) {
  const gradientId = useId();
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, percent));
  const offset = circumference * (1 - clamped);
  const displayPercent = Math.round(clamped * 100);

  return (
    <div
      className="flex flex-col items-center"
      role="img"
      aria-label={`${label ?? 'Progress'}: ${displayPercent}%`}
    >
      <svg width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6B5BD1" />
            <stop offset="100%" stopColor="#A7D7C5" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(107, 91, 209, 0.12)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.36em"
          fontFamily="Fraunces, Playfair Display, Georgia, serif"
          fontSize={size * 0.26}
          fontWeight={600}
          fill="currentColor"
        >
          {displayPercent}%
        </text>
      </svg>
      {label && (
        <div className="text-xs uppercase tracking-[0.18em] text-muted mt-3">
          {label}
        </div>
      )}
    </div>
  );
}
