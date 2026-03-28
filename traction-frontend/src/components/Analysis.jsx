export default function Analysis({ text, color }) {
  if (!text) return null;
  return (
    <div style={{ fontSize: 13, lineHeight: 1.75, color: "var(--t2)" }}>
      {text.split("\n").map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**"))
          return (
            <h4 key={i} style={{ fontFamily: "var(--fd)", color: color || "var(--t1)", margin: "18px 0 8px", fontSize: 14, fontWeight: 700 }}>
              {line.replace(/\*\*/g, "")}
            </h4>
          );
        if (line.match(/\*\*.+\*\*/)) {
          const pts = line.split("**");
          return (
            <p key={i} style={{ margin: "5px 0" }}>
              {pts.map((x, j) =>
                j % 2 === 1 ? (
                  <strong key={j} style={{ color: "var(--t1)" }}>
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
            <div key={i} style={{ paddingLeft: 14, margin: "3px 0", position: "relative" }}>
              <span style={{ position: "absolute", left: 0, color: color || "var(--t3)" }}>·</span>
              {line.replace(/^[-•]\s*/, "")}
            </div>
          );
        if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
        return (
          <p key={i} style={{ margin: "5px 0" }}>
            {line}
          </p>
        );
      })}
    </div>
  );
}
