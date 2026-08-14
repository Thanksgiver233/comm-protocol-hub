import { Service } from "@deepseek-ai/cordis";
import type { Context } from "@deepseek-ai/cordis";
import { z } from "@deepseek-ai/schemastery";
import { CommProtocolService } from "./service.js";
import { registerHostTools } from "./tools.js";

export const name = "comm-protocol-hub";
export const inject = ["tools"];

export const Config = z.object({
  enabled: z.boolean().default(true),
  maxResults: z.number().int().min(5).max(200).default(50),
});

export function apply(ctx: Context, config: z.infer<typeof Config>): void {
  if (!config.enabled) return;

  const service = ctx.add(CommProtocolService, config);

  // Wait for tools to be available, then register
  ctx.effect(
    () => {
      // Register tools once the tools service is ready
      registerHostTools(ctx as Context & { get: (key: string) => CommProtocolService });
      return () => {};
    },
    "comm-protocol-tools"
  );

  // Expose service for client-side use
  ctx.set("commProtocolService", service);
}
