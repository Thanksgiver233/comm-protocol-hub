import type { ClientContext } from "@deepseek-ai/dsh-client-runtime/client";
import type {} from "@deepseek-ai/dsh-client-ui-conversation/client";
import React from "react";

export const inject = ["slots"];

export function apply(ctx: ClientContext): void {
  // Protocol panel registered as a conversation slot renderer
  ctx.slots.register(
    {
      name: "comm-protocol-panel",
      scope: "conversation",
      priority: 10,
      children: {},
    },
    (props) => {
      const { ProtocolPanel } = require("./panel.js");
      return React.createElement(ProtocolPanel, props);
    }
  );

  // Protocol node for inline display
  ctx.slots.register(
    {
      name: "comm-protocol-node",
      scope: "conversation",
      priority: 5,
      children: {},
    },
    (props) => {
      const { ProtocolNode } = require("./node.js");
      return React.createElement(ProtocolNode, props);
    }
  );
}
