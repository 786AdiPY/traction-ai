/** Inline styles for `Analysis.jsx` (rendered markdown-like analysis text). */
export const analysisStyles = {
  container: { fontSize: 13, lineHeight: 1.75, color: "var(--t2)" },
  sectionTitle: (color) => ({
    fontFamily: "var(--fd)",
    color: color || "var(--t1)",
    margin: "18px 0 8px",
    fontSize: 14,
    fontWeight: 700,
  }),
  paragraph: { margin: "5px 0" },
  strong: { color: "var(--t1)" },
  bulletRow: { paddingLeft: 14, margin: "3px 0", position: "relative" },
  bulletDot: (color) => ({ position: "absolute", left: 0, color: color || "var(--t3)" }),
  spacer: { height: 6 },
};
