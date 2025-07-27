import { db } from "@/db";
import { agents, meeting } from "@/db/schema";
import { OpenAI } from "openai";
import { CallSessionStartedEvent, CallSessionParticipantLeftEvent } from "@stream-io/video-react-sdk";
import { NextRequest, NextResponse } from "next/server";
import { and, eq, not } from "drizzle-orm";

import { MessageNewEvent } from "@stream-io/node-sdk";
import { streamChat } from "@/lib/stream-chat";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { generateAvatarUri } from "@/lib/avatar";
import { streamVideo } from "@/lib/stearm-vidoe";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

function verifySignatureWithSDK(body: string, signature: string): boolean {
    try {
        return streamVideo.verifyWebhook(body, signature);
    } catch (error) {
        console.error("Webhook verification failed:", error);
        return false;
    }
}

export async function POST(req: NextRequest) {
    try {
        const signature = req.headers.get("x-signature");
        const apiKey = req.headers.get("x-api-key");

        // Validate required headers
        if (!signature || !apiKey) {
            return NextResponse.json(
                { error: "Missing signature or API key" }, 
                { status: 400 }
            );
        }

        // Get request body
        const body = await req.text();

        // Verify webhook signature
        if (!verifySignatureWithSDK(body, signature)) {
            return NextResponse.json(
                { error: "Invalid credentials" }, 
                { status: 401 }
            );
        }

        // Parse JSON payload
        let payload: unknown;
        try {
            payload = JSON.parse(body) as Record<string, unknown>;
        } catch (parseError) {
            console.error("JSON parse error:", parseError);
            return NextResponse.json(
                { error: "Invalid JSON" }, 
                { status: 400 }
            );
        }

        // Get event type and validate
        const eventType = (payload as Record<string, string>)?.type;
        
        if (eventType === "call.session_started") {
            const event = payload as CallSessionStartedEvent;
            const meetingId = event.call.custom?.meetingId;

            if (!meetingId) {
                return NextResponse.json(
                    { error: "Missing meeting ID" }, 
                    { status: 400 }
                );
            }

            // Find existing meeting
            const [existingMeeting] = await db
                .select()
                .from(meeting)
                .where(
                    and(
                        eq(meeting.id, meetingId),
                        not(eq(meeting.status, "completed")),
                        not(eq(meeting.status, "active")),
                        not(eq(meeting.status, "cancelled")),
                        not(eq(meeting.status, "processing"))
                    )
                );

            if (!existingMeeting) {
                return NextResponse.json(
                    { error: "Meeting not found or invalid status" }, 
                    { status: 404 }
                );
            }

            // Update meeting status to active
            await db
                .update(meeting)
                .set({
                    status: "active",
                    startedAt: new Date()
                })
                .where(eq(meeting.id, existingMeeting.id));

            // Find the agent for this meeting
            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(eq(agents.id, existingMeeting.agentId));

            if (!existingAgent) {
                return NextResponse.json(
                    { error: "Agent not found for this meeting" }, 
                    { status: 404 }
                );
            }

            // Initialize Stream Video call and connect OpenAI
            const call = streamVideo.video.call("default", meetingId);
            
            // Connect OpenAI to the call
            const realtimeClient = await streamVideo.video.connectOpenAi({
                call,
                openAiApiKey: process.env.OPENAI_API_KEY!,
                agentUserId: existingAgent.id
            });

            console.log("Meeting started successfully:", {
                meetingId,
                agentId: existingAgent.id,
                startedAt: new Date().toISOString()
            });

            // Update session with agent instructions
            realtimeClient.updateSession({
                instructions: existingAgent.instruction
            });

            return NextResponse.json(
                { 
                    success: true, 
                    message: "Meeting started successfully",
                    meetingId,
                    agentId: existingAgent.id
                }, 
                { status: 200 }
            );

        } else if (eventType === "call.session_participant_left") {
            const event = payload as CallSessionParticipantLeftEvent;
            const meetingId = event.call_cid.split(":")[1];

            if (!meetingId) {
                return NextResponse.json(
                    { error: "Meeting ID not found" }, 
                    { status: 400 }
                );
            }

            // Find the meeting
            const [existingMeeting] = await db
                .select()
                .from(meeting)
                .where(eq(meeting.id, meetingId));

            if (!existingMeeting) {
                return NextResponse.json(
                    { error: "Meeting not found" }, 
                    { status: 404 }
                );
            }

            // Update meeting status to completed when participant leaves
            await db
                .update(meeting)
                .set({
                    status: "completed",
                    endedAt: new Date()
                })
                .where(eq(meeting.id, meetingId));

            console.log("Meeting ended - participant left:", {
                meetingId,
                endedAt: new Date().toISOString()
            });

            return NextResponse.json(
                { 
                    success: true, 
                    message: "Participant left event processed",
                    meetingId
                }, 
                { status: 200 }
            );

        } else if (eventType === "message.new") {
            const event = payload as MessageNewEvent;
            const userId = event.user?.id;
            const channelId = event.channel_id;
            const text = event.message?.text;

            if (!userId || !channelId || !text) {
                return NextResponse.json(
                    { 
                        error: "Missing required fields",
                    }, 
                    { status: 400 }
                );
            }

            // Find existing meeting
            const [existingMeeting] = await db
                .select()
                .from(meeting)
                .where(
                    and(
                        eq(meeting.id, channelId),
                        eq(meeting.status, "completed")
                    )
                );

            if (!existingMeeting) {
                return NextResponse.json(
                    { error: "Meeting not found or invalid status" }, 
                    { status: 404 }
                );
            }

            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(eq(agents.id, existingMeeting.agentId));

            if (!existingAgent) {
                return NextResponse.json(
                    { error: "Agent not found" }, 
                    { status: 404 }
                );
            }

            if (userId !== existingAgent.id) {
                const instructions = `
You are an AI assistant helping the user revisit a recently completed meeting.
Below is a summary of the meeting, generated from the transcript:

${existingMeeting.summary}

The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:

${existingAgent.instruction}

The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
Always base your responses on the meeting summary above.

You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.

If the summary does not contain enough information to answer a question, politely let the user know.

Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
`;

                const channel = streamChat.channel("messaging", channelId);
                await channel.watch();
                
                const previousMessages = channel.state.messages
                    .slice(-5)
                    .filter((msg) => msg.text && msg.text.trim() !== "")
                    .map<ChatCompletionMessageParam>((message) => ({
                        role: message.user?.id === existingAgent.id ? "assistant" : "user",
                        content: message.text || ""
                    }));

                const gptResponse = await openaiClient.chat.completions.create({
                    messages: [
                        { role: "system", content: instructions },
                        ...previousMessages,
                        { role: "user", content: text }
                    ],
                    model: "gpt-4o"
                });

                const gptResponseText = gptResponse.choices[0].message.content;
                
                if (!gptResponseText) {
                    return NextResponse.json(
                        { error: "No response from GPT" }, 
                        { status: 400 }
                    );
                }

                const avatarUrl = generateAvatarUri({
                    seed: existingAgent.id,
                    variant: "botttsNeutral"
                });

                await streamChat.upsertUsers([{
                    id: existingAgent.id,
                    name: existingAgent.name,
                    image: avatarUrl
                }]);

                await channel.sendMessage({
                    text: gptResponseText,
                    user: {
                        id: existingAgent.id,
                        name: existingAgent.name,
                        image: avatarUrl
                    }
                });

                return NextResponse.json(
                    { 
                        success: true, 
                        message: "Message processed successfully"
                    }, 
                    { status: 200 }
                );
            }

        } else {
            return NextResponse.json(
                { error: "Unsupported event type" }, 
                { status: 400 }
            );
        }

    } catch (error) {
        console.error("Webhook handler error:", error);
        return NextResponse.json(
            { error: "Internal server error" }, 
            { status: 500 }
        );
    }
}
