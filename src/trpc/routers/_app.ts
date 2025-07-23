
// import { AgentsRouter } from '@/modules/Agents/server/procedure';
import {  createTRPCRouter } from '../init';
// import { MeetingRouter } from '@/modules/meetings/server/procedure';
export const appRouter = createTRPCRouter({
  // agents:AgentsRouter,
  // meeting:MeetingRouter
  
});
// export type definition of API
export type AppRouter = typeof appRouter;