import { db } from '@/db';
import { agents, meeting } from '@/db/schema';
import { auth } from '@/lib/auth';
import { polarClient } from '@/lib/polar';
import { MAX_FREE_AGENT, MAX_FREE_MEETING } from '@/modules/premuin/constant';

import { initTRPC, TRPCError } from '@trpc/server';
import { count, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { cache } from 'react';

export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  return { 
    auth: session,
  };
});

// Avoid exporting the entire t-object
const t = initTRPC.context<typeof createTRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

// Fixed protectedProcedure - corrected the logic
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  // Get session from context that was created in createTRPCContext
  const session = ctx.auth;

  // Throw error if NO session (opposite of your original logic)
  if (!session?.user) {
    throw new TRPCError({ 
      code: "UNAUTHORIZED", 
      message: "You must be logged in to access this resource" 
    });
  }

  return next({
    ctx: {
      ...ctx,
      auth: session,
    }
  });
});

export const premiumProcedure = (entity: "meeting" | "agents") => {
  return protectedProcedure.use(async ({ ctx, next }) => {
    const customer = await polarClient.customers.getExternal({
      externalId: ctx.auth.user.id
    });
    
    const [userMeetings] = await db.select({
      count: count(meeting.id),
    }).from(meeting).where(eq(meeting.userId, ctx.auth.user.id));

    const [userAgents] = await db.select({
      count: count(agents.id),
    }).from(agents).where(eq(agents.userId, ctx.auth.user.id));

    const isPremium = customer.activeSubscriptions?.length > 0;
    const isFreeAgentLimitReached = userAgents.count >= MAX_FREE_AGENT;
    const isFreeMeetingLimitReached = userMeetings.count >= MAX_FREE_MEETING;
    const shouldThrowMeetingError = entity === "meeting" && isFreeMeetingLimitReached && !isPremium;
    const shouldThrowAgentsError = entity === "agents" && isFreeAgentLimitReached && !isPremium;

    if (shouldThrowMeetingError) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You have reached the free meeting limit. Upgrade to premium to create more meetings."
      });
    }
    
    if (shouldThrowAgentsError) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You have reached the free agent limit. Upgrade to premium to create more agents."
      });
    }

    return next({ 
      ctx: { 
        ...ctx, 
        customer 
      } 
    });
  });
};
