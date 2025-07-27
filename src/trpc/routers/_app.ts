import { agentsRouter } from "@/modules/agents/server/procedure";
import { createTRPCRouter } from "../init";
import { MeetingRouter } from "@/modules/meetings/server/procedure";
import { premiumRouter } from "@/modules/premuin/server/procedure";

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meeting: MeetingRouter,
  premium:premiumRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
