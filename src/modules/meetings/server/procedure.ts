import { db } from "@/db";
import {  agents, meeting } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, getTableColumns, ilike, sql, count } from "drizzle-orm";
import z from "zod";

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constant";
import { TRPCError } from "@trpc/server";
import { MeetingInsertSchema, MeetingUpdatedSchema } from "../schema";
import { MeetingStatus } from "../types";

import { generateAvatarUri } from "@/lib/avatar";
import { streamVideo } from "@/lib/stearm-vidoe";


// Helper function to get user ID from context
function getUserId(ctx: any): string {
  const userId = ctx?.auth?.user?.id;
  
  if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
  return userId;
}

export const MeetingRouter = createTRPCRouter({
  // 📌 Generate stream token
  generateToken: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = getUserId(ctx);

    await streamVideo.upsertUsers([
      {
        id: userId,
        name: ctx?.auth?.user?.name,
        role: "admin",
        image:
          ctx.auth?.user?.image ??
          generateAvatarUri({ seed: ctx.auth?.user?.name, variant: "initials" }),
      },
    ]);

    const expirationTime = Math.floor(Date.now() / 1000) + 3600;
    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamVideo.generateUserToken({
      user_id: userId,
      exp: expirationTime,
      validity_in_seconds: issuedAt,
    });

    return token;
  }),

  // 📌 Remove a meeting
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = getUserId(ctx);

      const [removedMeeting] = await db
        .delete(meeting)
        .where(and(eq(meeting.id, input.id), eq(meeting.userId, userId)))
        .returning();

      if (!removedMeeting) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" });
      }

      return removedMeeting;
    }),

  // 📌 Update a meeting
  update: protectedProcedure
    .input(MeetingUpdatedSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = getUserId(ctx);

      const [updatedMeeting] = await db
        .update(meeting)
        .set(input)
        .where(and(eq(meeting.id, input.id), eq(meeting.userId, userId)))
        .returning();

      if (!updatedMeeting) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" });
      }

      return updatedMeeting;
    }),

  // 📌 Create a meeting
  create: protectedProcedure
    .input(MeetingInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = getUserId(ctx);

      const [createdMeeting] = await db
        .insert(meeting)
        .values({
          ...input,
          userId,
        })
        .returning();

      const call = streamVideo.video.call("default", createdMeeting.id);
      await call.create({
        data: {
          created_by_id: userId,
          custom: {
            meetingId: createdMeeting.id,
            meetingName: createdMeeting.name,
          },
          settings_override: {
            transcription: {
              language: "en",
              mode: "auto-on",
              closed_caption_mode: "auto-on",
            },
            recording: {
              mode: "auto-on",
              quality: "1080p",
            },
          },
        },
      });

      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, createdMeeting.agentId));

      if (!existingAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      await streamVideo.upsertUsers([
        {
          id: existingAgent.id,
          name: existingAgent.name,
          role: "user",
          image: generateAvatarUri({
            seed: existingAgent.name,
            variant: "botttsNeutral",
          }),
        },
      ]);

      return createdMeeting;
    }),

  // 📌 Get a single meeting by ID
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = getUserId(ctx);

      const [existingMeeting] = await db
        .select({
          ...getTableColumns(meeting),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            "duration"
          ),
        })
        .from(meeting)
        .innerJoin(agents, eq(meeting.agentId, agents.id))
        .where(and(eq(meeting.id, input.id), eq(meeting.userId, userId)));

      if (!existingMeeting) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" });
      }

      return existingMeeting;
    }),

  // 📌 Get all meetings (paginated + search)
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z
          .enum([
            MeetingStatus.upcoming,
            MeetingStatus.active,
            MeetingStatus.completed,
            MeetingStatus.processing,
            MeetingStatus.cancelled,
          ])
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = getUserId(ctx);

      const { search, page, pageSize, agentId, status } = input;

      const filters = [
        eq(meeting.userId, userId),
        search ? ilike(meeting.name, `%${search}%`) : undefined,
        agentId ? eq(meeting.agentId, agentId) : undefined,
        status ? eq(meeting.status, status) : undefined,
      ].filter(Boolean);

      const data = await db
        .select({
          ...getTableColumns(meeting),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            "duration"
          ),
        })
        .from(meeting)
        .innerJoin(agents, eq(meeting.agentId, agents.id))
        .where(and(...filters))
        .orderBy(desc(meeting.createdAt), desc(meeting.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(meeting)
        .innerJoin(agents, eq(meeting.agentId, agents.id))
        .where(
          and(
            eq(meeting.userId, userId),
            search ? ilike(meeting.name, `%${search}%`) : undefined,
            agentId ? eq(meeting.agentId, agentId) : undefined,
            status ? eq(meeting.status, status) : undefined
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),
});
