import z from "zod";

export const MeetingInsertSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  instructions: z.string().min(1, { message: "Instructions are required" }),
  agentId: z.string().min(1, { message: "Agent ID is required" }),
});

export const MeetingUpdatedSchema = MeetingInsertSchema.extend({
  id: z.string().min(1, { message: "Id is required" }),
});
