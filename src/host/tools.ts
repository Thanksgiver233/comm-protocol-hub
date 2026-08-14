import { defineTool } from "@deepseek-ai/dsh-tools";
import type { Context, ExecAgent } from "@deepseek-ai/cordis";
import type { CommProtocolService } from "./service.js";
import type { ProtocolEntry, QueryResult } from "../types.js";

export function registerHostTools(ctx: Context & { get: (key: string) => CommProtocolService }): void {
  ctx.tools.register(
    defineTool({
      name: "comm_protocol_query",
      description:
        "查询3GPP通信协议知识库。支持按协议编号(TS xxx.xx)、关键词、分类搜索。输入 query 参数可为空（返回全量摘要）。适合查询5G NR、NTN、全息通信、近远场通信等协议详情。",
      parameters: z.object({
        query: z.string().optional().describe("搜索关键词，如 'NTN'、'TS 38.300'、'全息'、'V2X'、'安全'"),
        category: z.string().optional().describe("按分类过滤：TN|NTN|HOLOGRAPHIC|NEAR_FIELD|FAR_FIELD|HYBRID|SAFETY|MISC"),
        limit: z.number().int().min(1).max(50).default(20).describe("返回结果数量上限"),
      }),
      output: {
        schema: z.object({
          total: z.number(),
          entries: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              category: z.string(),
              subcategory: z.string(),
              release: z.string(),
              description: z.string(),
              keyFeatures: z.array(z.string()),
              url: z.string().optional(),
            })
          ),
        }),
        render: (r: QueryResult & { entries: ProtocolEntry[] }) => {
          const lines: string[] = [
            `共 ${r.total} 条匹配协议`,
            "",
          ];
          if (r.entries.length === 0) {
            lines.push("未找到匹配结果，请尝试其他关键词");
          } else {
            for (const e of r.entries) {
              lines.push(`[${e.id}] ${e.name}`);
              lines.push(`  分类: ${e.category} | ${e.subcategory} | ${e.release}`);
              lines.push(`  ${e.description}`);
              if (e.keyFeatures.length) {
                lines.push(`  特性: ${e.keyFeatures.join(" | ")}`);
              }
              if (e.url) lines.push(`  链接: ${e.url}`);
              lines.push("");
            }
          }
          return lines.join("\n");
        },
      },
      async execute(args, agent: ExecAgent) {
        const service = ctx.get("commProtocolService");
        const result = service.queryProtocol(args.query || "");
        const filtered = args.category
          ? result.entries.filter((e) => e.category === args.category)
          : result.entries;
        return {
          total: filtered.length,
          entries: filtered.slice(0, args.limit),
        };
      },
    })
  );

  ctx.tools.register(
    defineTool({
      name: "comm_protocol_browse",
      description:
        "浏览3GPP通信协议分类目录，获取各分类协议列表和统计。适合探索协议知识体系结构，了解各通信领域（TN/NTN/全息/近远场等）的协议覆盖情况。",
      parameters: z.object({
        category: z.string().optional().describe("指定分类查看：TN|NTN|HOLOGRAPHIC|NEAR_FIELD|FAR_FIELD|HYBRID|SAFETY|MISC，不传则返回全部分类概览"),
        limit: z.number().int().min(1).max(50).default(20).describe("每个分类返回数量上限"),
      }),
      output: {
        schema: z.object({
          categories: z.array(
            z.object({
              key: z.string(),
              label: z.string(),
              count: z.number(),
              entries: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  subcategory: z.string(),
                  release: z.string(),
                  description: z.string(),
                  keyFeatures: z.array(z.string()),
                })
              ),
            })
          ),
        }),
        render: (r: { categories: Array<{ key: string; label: string; count: number; entries: ProtocolEntry[] }> }) => {
          const lines: string[] = ["通信协议分类目录", "================"];
          for (const cat of r.categories) {
            lines.push(`\n【${cat.label}】 (${cat.count} 条)`);
            for (const e of cat.entries.slice(0, r.categories.length > 1 ? cat.count : 20)) {
              lines.push(`  ${e.id}  ${e.name}`);
            }
          }
          return lines.join("\n");
        },
      },
      async execute(args, agent: ExecAgent) {
        const service = ctx.get("commProtocolService");
        const result = service.browseByCategory();
        if (args.category) {
          const filtered = result.categories.filter((c) => c.key === args.category);
          return { categories: filtered.map((c) => ({ ...c, entries: c.entries.slice(0, args.limit) })) };
        }
        return {
          categories: result.categories.map((c) => ({
            ...c,
            entries: c.entries.slice(0, args.limit),
          })),
        };
      },
    })
  );

  ctx.tools.register(
    defineTool({
      name: "comm_protocol_detail",
      description:
        "获取单个3GPP协议的完整详细信息，包括协议编号、版本、描述、关键特性等。输入 protocolId 即可查询。",
      parameters: z.object({
        protocolId: z.string().describe("协议ID，如 '3gpp-ts38.300'、'3gpp-ts37.820'、'3gpp-ts38.342'"),
      }),
      output: {
        schema: z.object({
          entry: z.object({
            id: z.string(),
            name: z.string(),
            category: z.string(),
            subcategory: z.string(),
            release: z.string(),
            description: z.string(),
            keyFeatures: z.array(z.string()),
            url: z.string().optional(),
          }).nullable(),
        }),
        render: (r: { entry: ProtocolEntry | null }) => {
          if (!r.entry) return "未找到该协议，请检查 protocolId";
          const e = r.entry;
          return [
            `${e.name}`,
            `ID: ${e.id}`,
            `分类: ${e.category} | ${e.subcategory}`,
            `版本: ${e.release}`,
            `描述: ${e.description}`,
            e.keyFeatures.length ? `特性: ${e.keyFeatures.join(", ")}` : "",
            e.url ? `链接: ${e.url}` : "",
          ].filter(Boolean).join("\n");
        },
      },
      async execute(args, agent: ExecAgent) {
        const service = ctx.get("commProtocolService");
        const entry = service.getProtocolById(args.protocolId);
        return { entry };
      },
    })
  );
}
