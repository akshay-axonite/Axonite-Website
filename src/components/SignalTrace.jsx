// The recurring brand motif: a nerve/circuit trace with pulse nodes,
// echoing the circuit line inside the Axonite logomark. Nodes step
// through the logo's violet → blue → cyan gradient.
import { useId } from "react";

export default function SignalTrace({ className = "", variant = "light" }) {
  const gradId = useId();
  const nodeColors =
    variant === "light"
      ? ["#9B4FC9", "#6D5BD8", "#3E5FE0", "#29B6F6"]
      : ["#1B1F52", "#1B1F52", "#1B1F52", "#1B1F52"];

  return (
    <svg
      className={className}
      viewBox="0 0 800 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9B4FC9" />
          <stop offset="50%" stopColor="#3E5FE0" />
          <stop offset="100%" stopColor="#29B6F6" />
        </linearGradient>
      </defs>
      <path
        d="M0 90 L120 90 L170 30 L260 30 L300 90 L420 90 L470 20 L560 20 L610 90 L800 90"
        stroke={variant === "light" ? `url(#${gradId})` : "#1B1F52"}
        strokeOpacity="0.4"
        strokeWidth="1.5"
        className="trace-line"
      />
      {[120, 260, 470, 610].map((cx, i) => (
        <circle
          key={cx}
          cx={cx}
          cy={i % 2 === 0 ? 90 : 20}
          r="3.2"
          fill={nodeColors[i]}
          className="trace-node"
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}
    </svg>
  );
}

