import { useTRPC } from "@/trpc/client";
import { 
  StreamVideoClient,
  Call,
  CallingState
} from "@stream-io/video-react-sdk";
import { 
  StreamCall, 
  StreamVideoProvider 
} from "@stream-io/video-react-sdk";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { CallUI } from "./call-ui";

interface Props {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string;
}

export const CallConnect = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage,
}: Props) => {
  const trpc = useTRPC();

  const { mutateAsync: generateToken } = useMutation(
    trpc.meeting.generateToken.mutationOptions()
  );

  const [client, setClient] = useState<StreamVideoClient>();
  const [call, setCall] = useState<Call>();

  // Create StreamVideoClient when component mounts
  useEffect(() => {
    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY as string,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
      tokenProvider: generateToken,
    });

    setClient(_client);

    return () => {
      _client.disconnectUser();
      setClient(undefined);
    };
  }, [userId, userName, userImage, generateToken]);

  // Join call when client is ready
  useEffect(() => {
    if (!client) return;

    const _call = client.call("default", meetingId);
    _call.camera.disable();
    _call.microphone.disable();
    setCall(_call);

    return () => {
      if (_call.state.callingState !== CallingState.LEFT) {
        _call.leave();
        _call.endCall();
        setCall(undefined);
      }
    };
  }, [client, meetingId]);

  if (!client || !call) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <StreamVideoProvider client={client}>
      <StreamCall call={call}>
        <CallUI meetingName={meetingName}/>
      </StreamCall>
    </StreamVideoProvider>
  );
};