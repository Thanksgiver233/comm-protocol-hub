import React from "react";
import type { ProtocolEntry } from "../types.js";

interface ProtocolNodeProps {
  entry: ProtocolEntry;
}

export function ProtocolNode({ entry }: ProtocolNodeProps): JSX.Element {
  const config = CATEGORY_CONFIG[entry.category] || { color: "#6b7280", bg: "#f3f4f6", icon: "📋" };

  return (
    <div style={styles.root}>
      <div style={{ ...styles.tag, background: config.bg, color: config.color }}>
        {config.icon} {entry.category}
      </div>
      <div style={styles.title}>{entry.name}</div>
      <div style={styles.meta}>
        <span>{entry.id}</span>
        <span>·</span>
        <span>{entry.release}</span>
        <span>·</span>
        <span>{entry.subcategory}</span>
      </div>
      <p style={styles.desc}>{entry.description}</p>
      {entry.keyFeatures.length > 0 && (
        <div style={styles.features}>
          {entry.keyFeatures.map((f) => (
            <span key={f} style={styles.featureTag}>
              {f}
            </span>
          ))}
        </div>
      )}
      {entry.url && (
        <a href={entry.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
          查看官方文档 →
        </a>
      )}
    </div>
  );
}

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  TN: { color: "#1a73e8", bg: "#e8f0fe", icon: "📡" },
  NTN: { color: "#7c3aed", bg: "#f3e8ff", icon: "🛰️" },
  HOLOGRAPHIC: { color: "#059669", bg: "#e6f7f1", icon: "🔮" },
  NEAR_FIELD: { color: "#dc2626", bg: "#fee2e2", icon: "📶" },
  FAR_FIELD: { color: "#d97706", bg: "#fef3c7", icon: "📻" },
  HYBRID: { color: "#0891b2", bg: "#cffafe", icon: "🔀" },
  SAFETY: { color: "#be185d", bg: "#fce7f3", icon: "🛡️" },
  MISC: { color: "#6b7280", bg: "#f3f4f6", icon: "📋" },
};

const styles: Record<string, React.CSSProperties> = {
  root: {
    padding: "10px 12px",
    background: "#fafafa",
    border: "1px solid #e5e7eb",
    borderLeft: "3px solid #1a73e8",
    borderRadius: "6px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: "13px",
    lineHeight: "1.5",
  },
  tag: {
    display: "inline-block",
    fontSize: "10px",
    fontWeight: 600,
    padding: "1px 8px",
    borderRadius: "10px",
    marginBottom: "6px",
  },
  title: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#111827",
    margin: "0 0 4px 0",
  },
  meta: {
    fontSize: "11px",
    color: "#6b7280",
    marginBottom: "6px",
    display: "flex",
    gap: "4px",
    flexWrap: "wrap",
  },
  desc: {
    fontSize: "12px",
    color: "#4b5563",
    margin: "0 0 8px 0",
  },
  features: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    marginBottom: "6px",
  },
  featureTag: {
    fontSize: "10px",
    background: "#e5e7eb",
    color: "#374151",
    padding: "1px 6px",
    borderRadius: "3px",
  },
  link: {
    fontSize: "11px",
    color: "#2563eb",
    textDecoration: "none",
  },
};
