import { db } from "@/db";
import { agents, meeting } from "@/db/schema";

import { CallSessionStartedEvent, CallSessionParticipantLeftEvent } from "@stream-io/video-react-sdk";
import { NextRequest, NextResponse } from "next/server";
import { and, eq, not } from "drizzle-orm";
import { streamVideo } from "@/lib/stearm-vidoe";

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
                    { error: "Agent not found for this meeting" }, 
                    { status: 404 }
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


