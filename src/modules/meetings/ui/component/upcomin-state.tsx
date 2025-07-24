import { EmptyState } from "@/components/error-empty";
import { Button } from "@/components/ui/button";
import { BanIcon, VideoIcon } from "lucide-react";
import Link from "next/link";

interface Props{
    meetingId:string;
    onCancelMeeting:()=>void;
    isCancelling:boolean;
}

export const UpcomingState = ({onCancelMeeting
    ,isCancelling,meetingId
}:Props) => {
  return (
    <>
      <div className="bg-muted rounded-2xl px-4 py-5  flex flex-col gap-y-8  items-center justify-center">
        <EmptyState
          image="/upcoming.svg"
          title="Not started Yet"
          description="Once you  start  this meeting ,a summary  will appear  here"
        />
        <div className="flex flex-col-revere  lg:flex-row lg:justify-center items-center gap-2  w-full">
            <Button variant={"secondary"} className="w-full lg:w-auto" onClick={onCancelMeeting} disabled={isCancelling}>
                <BanIcon>
                    Cancel Meeting
                </BanIcon>
            </Button>
            <Button disabled={isCancelling} asChild className="w-full lg:w-auto">
                <BanIcon  >
                    <Link href={`/call/${meetingId}`}>
                    <VideoIcon/>
                    Start Meeting
                    </Link>
                </BanIcon>
            </Button>
        </div>
      </div>
    </>
  );
};
