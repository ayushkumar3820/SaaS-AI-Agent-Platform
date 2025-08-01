import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, getTableColumns, ilike, sql, count } from "drizzle-orm";
import z from "zod";
import { agentInsertSchema, agentsUpadtedSchema,  } from "../schema";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constant";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
  // 📌 Update an agent
  update: protectedProcedure
    .input(agentsUpadtedSchema)
    .mutation(async ({ ctx, input }) => {
      const [updatedAgent] = await db
        .update(agents)
        .set(input)
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.userId, ctx.auth.user.id)
          )
        )
        .returning();

      if (!updatedAgent) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }
      return updatedAgent;
    }),

  // 📌 Remove an agent
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [removedAgent] = await db
        .delete(agents)
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.userId, ctx.auth.user.id)
          )
        )
        .returning();

      if (!removedAgent) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }

      return removedAgent;
    }),

  // 📌 Get a single agent by ID
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingData] = await db
        .select({
          meetingCount: sql<number>`5`, // TODO: Replace with real query
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.userId, ctx.auth.user.id)
          )
        );

      if (!existingData) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }

      return existingData;
    }),

  // 📌 Get all agents
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
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
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined
          )
        )
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),

  // 📌 Create a new agent
  create: premiumProcedure("agents")
    .input(agentInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input,
          instruction: input.instructions, // fix: `instruction` singular in DB
          userId: ctx.auth.user.id,
        })
        .returning();

      return createdAgent;
    }),
});