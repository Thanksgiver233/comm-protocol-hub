import React, { useState, useMemo } from "react";
import type { ProtocolEntry } from "../types.js";

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; icon: string; label: string }> = {
  TN: { color: "#1a73e8", bg: "#e8f0fe", icon: "📡", label: "地面网络 (TN)" },
  NTN: { color: "#7c3aed", bg: "#f3e8ff", icon: "🛰️", label: "非地面网络 (NTN)" },
  HOLOGRAPHIC: { color: "#059669", bg: "#e6f7f1", icon: "🔮", label: "全息通信" },
  NEAR_FIELD: { color: "#dc2626", bg: "#fee2e2", icon: "📶", label: "近场通信" },
  FAR_FIELD: { color: "#d97706", bg: "#fef3c7", icon: "📻", label: "远场通信" },
  HYBRID: { color: "#0891b2", bg: "#cffafe", icon: "🔀", label: "近远场混合" },
  SAFETY: { color: "#be185d", bg: "#fce7f3", icon: "🛡️", label: "安全通信" },
  MISC: { color: "#6b7280", bg: "#f3f4f6", icon: "📋", label: "通用协议" },
};

interface ProtocolPanelProps {
  entries?: ProtocolEntry[];
  title?: string;
}

export function ProtocolPanel({ entries, title = "3GPP 通信协议库" }: ProtocolPanelProps): JSX.Element {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const map: Record<string, ProtocolEntry[]> = {};
    for (const e of entries || []) {
      if (!map[e.category]) map[e.category] = [];
      map[e.category].push(e);
    }
    return Object.entries(map).map(([key, items]) => ({
      key,
      count: items.length,
      config: CATEGORY_CONFIG[key] || { color: "#6b7280", bg: "#f3f4f6", icon: "📋", label: key },
    }));
  }, [entries]);

  const filtered = useMemo(() => {
    let list = entries || [];
    if (selectedCategory) {
      list = list.filter((e) => e.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.id.toLowerCase().includes(q) ||
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.subcategory.toLowerCase().includes(q) ||
          e.keyFeatures.some((f) => f.toLowerCase().includes(q))
      );
    }
    return list;
  }, [entries, selectedCategory, search]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.headerIcon}>{title.includes("全息") ? "🔮" : title.includes("NTN") ? "🛰️" : "📡"}</span>
        <h2 style={styles.headerTitle}>{title}</h2>
        <span style={styles.headerCount}>{entries?.length || 0} 条协议</span>
      </div>

      <div style={styles.searchRow}>
        <input
          style={styles.searchInput}
          placeholder="搜索协议编号、名称、关键词..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          style={{ ...styles.clearBtn, ...(search ? {} : styles.clearBtnDisabled) }}
          onClick={() => setSearch("")}
          disabled={!search}
        >
          ✕
        </button>
      </div>

      <div style={styles.categoryRow}>
        <button
          style={{
            ...styles.catBtn,
            ...(selectedCategory === null ? styles.catBtnActive : {}),
          }}
          onClick={() => setSelectedCategory(null)}
        >
          全部 ({entries?.length || 0})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.key}
            style={{
              ...styles.catBtn,
              ...(selectedCategory === cat.key ? { background: cat.config.color, color: "#fff" } : {}),
            }}
            onClick={() => setSelectedCategory(selectedCategory === cat.key ? null : cat.key)}
          >
            {cat.config.icon} {cat.config.label} ({cat.count})
          </button>
        ))}
      </div>

      <div style={styles.resultsInfo}>
        显示 {filtered.length} / {entries?.length || 0} 条协议
      </div>

      <div style={styles.list}>
        {filtered.length === 0 ? (
          <div style={styles.empty}>未找到匹配的协议</div>
        ) : (
          filtered.map((entry) => (
            <ProtocolCard
              key={entry.id}
              entry={entry}
              expanded={expandedId === entry.id}
              onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface ProtocolCardProps {
  entry: ProtocolEntry;
  expanded: boolean;
  onToggle: () => void;
}

function ProtocolCard({ entry, expanded, onToggle }: ProtocolCardProps): JSX.Element {
  const config = CATEGORY_CONFIG[entry.category] || { color: "#6b7280", bg: "#f3f4f6", icon: "📋", label: entry.category };

  return (
    <div
      style={{
        ...styles.card,
        borderLeft: `3px solid ${config.color}`,
      }}
      onClick={onToggle}
    >
      <div style={styles.cardHeader}>
        <span style={styles.cardId}>{entry.id}</span>
        <span
          style={{
            ...styles.catTag,
            background: config.bg,
            color: config.color,
          }}
        >
          {config.icon} {entry.category}
        </span>
        <span style={styles.cardRelease}>{entry.release}</span>
      </div>
      <div style={styles.cardName}>{entry.name}</div>
      <div style={styles.cardSub}>{entry.subcategory}</div>
      {expanded && (
        <div style={styles.cardBody}>
          <p style={styles.cardDesc}>{entry.description}</p>
          {entry.keyFeatures.length > 0 && (
            <div style={styles.featuresRow}>
              <span style={styles.featuresLabel}>关键特性：</span>
              {entry.keyFeatures.map((f) => (
                <span key={f} style={styles.featureTag}>
                  {f}
                </span>
              ))}
            </div>
          )}
          {entry.url && (
            <a href={entry.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
              3GPP 官方文档 →
            </a>
          )}
        </div>
      )}
      <div style={styles.cardExpand}>{expanded ? "▲" : "▼"}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "12px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: "13px",
    color: "#1f2937",
    maxWidth: "100%",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingBottom: "8px",
    borderBottom: "1px solid #e5e7eb",
  },
  headerIcon: { fontSize: "18px" },
  headerTitle: { margin: 0, fontSize: "15px", fontWeight: 600, color: "#111827" },
  headerCount: {
    marginLeft: "auto",
    fontSize: "11px",
    color: "#6b7280",
    background: "#f3f4f6",
    padding: "2px 8px",
    borderRadius: "10px",
  },
  searchRow: {
    display: "flex",
    gap: "4px",
    position: "relative",
  },
  searchInput: {
    flex: 1,
    padding: "7px 10px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    background: "#fafafa",
  },
  clearBtn: {
    position: "absolute",
    right: "6px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    color: "#9ca3af",
    padding: "2px 4px",
  },
  clearBtnDisabled: { cursor: "default", opacity: 0.4 },
  categoryRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
  },
  catBtn: {
    padding: "4px 10px",
    border: "1px solid #d1d5db",
    borderRadius: "14px",
    fontSize: "11px",
    cursor: "pointer",
    background: "#fff",
    color: "#374151",
    whiteSpace: "nowrap",
    transition: "all 0.15s",
  },
  catBtnActive: {
    color: "#fff",
    border: "1px solid transparent",
  },
  resultsInfo: {
    fontSize: "11px",
    color: "#6b7280",
    paddingBottom: "4px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    maxHeight: "400px",
    overflowY: "auto",
    paddingRight: "2px",
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "8px 10px",
    cursor: "pointer",
    position: "relative",
    transition: "box-shadow 0.15s",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "3px",
    flexWrap: "wrap",
  },
  cardId: {
    fontSize: "11px",
    fontFamily: "monospace",
    color: "#6b7280",
    background: "#f9fafb",
    padding: "1px 5px",
    borderRadius: "3px",
  },
  catTag: {
    fontSize: "10px",
    padding: "1px 6px",
    borderRadius: "10px",
    fontWeight: 500,
  },
  cardRelease: {
    marginLeft: "auto",
    fontSize: "10px",
    color: "#9ca3af",
  },
  cardName: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#111827",
    marginBottom: "2px",
  },
  cardSub: {
    fontSize: "11px",
    color: "#6b7280",
  },
  cardBody: {
    marginTop: "8px",
    paddingTop: "8px",
    borderTop: "1px solid #f3f4f6",
  },
  cardDesc: {
    fontSize: "12px",
    color: "#4b5563",
    margin: "0 0 6px 0",
    lineHeight: "1.5",
  },
  featuresRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    alignItems: "flex-start",
  },
  featuresLabel: {
    fontSize: "11px",
    color: "#6b7280",
    fontWeight: 500,
  },
  featureTag: {
    fontSize: "10px",
    background: "#f3f4f6",
    color: "#374151",
    padding: "1px 6px",
    borderRadius: "3px",
  },
  link: {
    display: "inline-block",
    fontSize: "11px",
    color: "#2563eb",
    textDecoration: "none",
    marginTop: "4px",
  },
  cardExpand: {
    position: "absolute",
    top: "8px",
    right: "8px",
    fontSize: "10px",
    color: "#9ca3af",
  },
  empty: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "13px",
    padding: "20px 0",
  },
};
