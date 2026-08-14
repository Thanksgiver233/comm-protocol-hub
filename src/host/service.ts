import { Service } from "@deepseek-ai/cordis";
import type { Context } from "@deepseek-ai/cordis";
import { z } from "@deepseek-ai/schemastery";

import type { ProtocolEntry, QueryResult, BrowseResult } from "../types.js";
import * as tnData from "../data/tn_protocols.json" assert { type: "json" };
import * as ntnData from "../data/ntn_protocols.json" assert { type: "json" };
import * as holoData from "../data/holographic_protocols.json" assert { type: "json" };
import * as nearData from "../data/near_field_protocols.json" assert { type: "json" };
import * as farData from "../data/far_field_protocols.json" assert { type: "json" };
import * as hybridData from "../data/hybrid_protocols.json" assert { type: "json" };
import * as safetyData from "../data/safety_protocols.json" assert { type: "json" };
import * as miscData from "../data/misc_protocols.json" assert { type: "json" };

const ALL_PROTOCOLS: ProtocolEntry[] = [
  ...tnData.default,
  ...ntnData.default,
  ...holoData.default,
  ...nearData.default,
  ...farData.default,
  ...hybridData.default,
  ...safetyData.default,
  ...miscData.default,
];

const CATEGORY_LABELS: Record<string, string> = {
  TN: "地面网络 (TN)",
  NTN: "非地面网络 (NTN)",
  HOLOGRAPHIC: "全息通信",
  NEAR_FIELD: "近场通信",
  FAR_FIELD: "远场通信",
  HYBRID: "近远场混合通信",
  SAFETY: "安全通信",
  MISC: "通用协议",
};

export const Config = z.object({
  enabled: z.boolean().default(true),
  maxResults: z.number().int().min(5).max(200).default(50),
});

export class CommProtocolService extends Service {
  static Config = Config;

  constructor(ctx: Context, config: z.infer<typeof Config>) {
    super(ctx, "commProtocolService");
  }

  async [Service.init](): Promise<void> {
    this.ctx.log.info(`comm-protocol-hub loaded ${ALL_PROTOCOLS.length} protocols`);
  }

  queryProtocol(query: string): QueryResult {
    const q = query.trim().toLowerCase();
    if (!q) return this._fullResult();

    const results = ALL_PROTOCOLS.filter((p) => {
      const search = `${p.id} ${p.name} ${p.category} ${p.subcategory} ${p.description} ${p.keyFeatures.join(" ")}`.toLowerCase();
      return (
        search.includes(q) ||
        q.split(/\s+/).every((term) => search.includes(term))
      );
    });

    const categoryCounts: Record<string, number> = {};
    for (const e of results) {
      categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
    }

    return {
      total: results.length,
      entries: results.slice(0, this.config.maxResults),
      categoryCounts,
    };
  }

  browseByCategory(): BrowseResult {
    const byCategory: Record<string, ProtocolEntry[]> = {};
    for (const p of ALL_PROTOCOLS) {
      if (!byCategory[p.category]) byCategory[p.category] = [];
      byCategory[p.category].push(p);
    }

    return {
      categories: (Object.keys(CATEGORY_LABELS) as string[]).map((key) => ({
        key: key as ProtocolEntry["category"],
        label: CATEGORY_LABELS[key] || key,
        count: byCategory[key]?.length || 0,
        entries: byCategory[key] || [],
      })),
    };
  }

  getProtocolById(id: string): ProtocolEntry | null {
    return ALL_PROTOCOLS.find((p) => p.id === id) || null;
  }

  getAllProtocols(): ProtocolEntry[] {
    return ALL_PROTOCOLS;
  }

  private _fullResult(): QueryResult {
    const categoryCounts: Record<string, number> = {};
    for (const p of ALL_PROTOCOLS) {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    }
    return {
      total: ALL_PROTOCOLS.length,
      entries: ALL_PROTOCOLS.slice(0, this.config.maxResults),
      categoryCounts,
    };
  }
}
