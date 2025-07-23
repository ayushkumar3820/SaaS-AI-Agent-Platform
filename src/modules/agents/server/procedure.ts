import { db } from "@/db";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, getTableColumns, ilike, sql, count } from "drizzle-orm";
import z from "zod";

import { TRPCError } from "@trpc/server";
import { agents } from "@/db/schema";

export const AgentsRouter = createTRPCRouter({
  

  // 📌 Get a single agent by ID
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingData] = await db
        .select({
          meetingCount: sql<number>`5`, // TODO: Replace with real query
          ...getTableColumns(agents),
        })
        .from(agents);

      if (!existingData) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }

      return existingData;
    }),

  // 📌 Get all agents
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().min(1).max(100).default(1),
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, page, pageSize } = input;

      const data = await db
        .select({
          meetingCount: sql<number>`5`, // TODO: Replace with real query
          ...getTableColumns(agents),
        })
        .from(agents)

        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db.select({ count: count() }).from(agents);

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),
});
