import { analysisStyles as a } from "./Analysis.styles.js";

export default function Analysis({ text, color }) {
  if (!text) return null;
  return (
    <div style={a.container}>
      {text.split("\n").map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**"))
          return (
            <h4 key={i} style={a.sectionTitle(color)}>
              {line.replace(/\*\*/g, "")}
            </h4>
          );
        if (line.match(/\*\*.+\*\*/)) {
          const pts = line.split("**");
          return (
            <p key={i} style={a.paragraph}>
              {pts.map((x, j) =>
                j % 2 === 1 ? (
                  <strong key={j} style={a.strong}>
                    {x}
                  </strong>
                ) : (
                  x
                )
              )}
            </p>
          );
        }
        if (line.trim().startsWith("- ") || line.trim().startsWith("• "))
          return (
            <div key={i} style={a.bulletRow}>
              <span style={a.bulletDot(color)}>·</span>
              {line.replace(/^[-•]\s*/, "")}
            </div>
          );
        if (line.trim() === "") return <div key={i} style={a.spacer} />;
        return (
          <p key={i} style={a.paragraph}>
            {line}
          </p>
        );
      })}
    </div>
  );
}
