import { useId } from "react";

/** Same mark as landing + favicon; unique gradient id per instance for DOM safety. */
export default function TractionLogo({ size = 30, style, className }) {
  const uid = useId().replace(/:/g, "");
  const gid = `traction-logo-grad-${uid}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      style={{ flexShrink: 0, display: "block", ...style }}
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="#818cf8" />
          <stop offset="1" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill={`url(#${gid})`} />
      <path d="M12 13h16v3H22.5v12h-5V16H12v-3z" fill="#fff" />
      <path d="M28 27l-4-4.5h3l4 4.5h-3z" fill="#fff" opacity="0.6" />
      <path d="M13 27l3-3h2.5l-3 3H13z" fill="#fff" opacity="0.4" />
    </svg>
  );
}
