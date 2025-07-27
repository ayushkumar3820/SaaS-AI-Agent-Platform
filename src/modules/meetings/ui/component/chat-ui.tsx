import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Channel as StreamChannel } from "stream-chat";
import { 
  Chat, 
  Channel, 
  Window, 
  MessageList, 
  useCreateChatClient, 
  Thread
} from "stream-chat-react";

interface Props {
    meetingId: string;
    meetingName: string;
    userId: string;
    userName: string;
    userImage: string | null | undefined;
}

export const ChatUI = ({ meetingId, meetingName, userId, userName, userImage }: Props) => {
    const trpc = useTRPC();
    const { mutateAsync: generateChatToken } = useMutation(trpc.meeting.generateChatToken.mutationOptions());

    const [channel, setChannel] = useState<StreamChannel>();

    const client = useCreateChatClient({
        apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
        tokenOrProvider: generateChatToken,
        userData: {
            id: userId,
            name: userName,
            image: userImage ?? undefined
        }
    });

    useEffect(() => {
        if (!client) return;

        const newChannel = client.channel("messaging", meetingId, {
            members: [userId]
        });
        setChannel(newChannel);

    }, [client, meetingId, meetingName, userId]);

    if (!client) {
        return (
            <LoadingState
                title="Loading..." 
                description="Please wait while we load the chat"
            />
        );
    }

    return (
        <div className="bg-white rounded-lg border overflow-hidden">
            <Chat client={client}>
                <Channel channel={channel}>
                    <Window>
                        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-23rem)] border-b">
                            <MessageList />
                        </div>
                        <MessageList/>

                    </Window>
                    <Thread/>
                </Channel>
            </Chat>
        </div>
    );
};
