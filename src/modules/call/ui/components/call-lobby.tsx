import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import {
  DefaultVideoPlaceholder,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { LogInIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  onJoin: () => void;
}

const DisabledVideoPreview = () => {
  const { data } = authClient.useSession();

  return (
    <DefaultVideoPlaceholder
      participant={{
        name: data?.user.name ?? "Anonymous",
        image:
          data?.user.image ??
          generateAvatarUri({
            seed: data?.user.name ?? "Anonymous",
            variant: "initials",
          }),
      }}
    />
  );
};

const AllowBrowserPermission = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <p className="text-sm text-muted-foreground">
        Please grant your browser permission to access your camera and microphone
      </p>
    </div>
  );
};

export const CallLobby = ({ onJoin }: Props) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const cameraState = useCameraState();
  const microphoneState = useMicrophoneState();

  // ✅ Fixed: Check device status instead of permission properties
  const hasCameraPermission = cameraState.status === 'enabled' || cameraState.status === 'disabled';
  const hasMicrophonePermission = microphoneState.status === 'enabled' || microphoneState.status === 'disabled';

  const hasBrowserMediaPermission =
    hasCameraPermission && hasMicrophonePermission;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 flex-col items-center justify-center gap-y-4 max-w-md w-full">
        <h2 className="text-lg font-semibold text-white mb-2">
          Set up your call before joining
        </h2>

        <div className="w-full max-w-sm">
          <VideoPreview
            DisabledVideoPreview={
              hasBrowserMediaPermission
                ? DisabledVideoPreview
                : AllowBrowserPermission
            }
          />
        </div>

        <div className="flex gap-x-2">
          <ToggleAudioPreviewButton />
          <ToggleVideoPreviewButton />
        </div>

        <div className="flex gap-x-2 justify-center w-full mt-4">
          <Button asChild variant="ghost" className="text-white border-white/20">
            <Link href="/meeting">Cancel</Link>
          </Button>
          <Button 
            onClick={onJoin}
            disabled={!hasBrowserMediaPermission}
            className="bg-primary hover:bg-primary/90"
          >
            <LogInIcon className="mr-2 size-4" />
            Join Meeting
          </Button>
        </div>
      </div>
    </div>
  );
};