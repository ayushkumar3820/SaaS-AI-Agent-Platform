import { auth } from '@/lib/auth';
import { initTRPC, TRPCError } from '@trpc/server';
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
      auth: session, // Pass the session to the context
    }
  });
});
