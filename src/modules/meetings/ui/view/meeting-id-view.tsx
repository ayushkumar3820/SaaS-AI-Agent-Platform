"use client";

import { ErrorState } from "@/components/erro-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../component/meeting_view-id_header";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "../component/updateMeetingDigalogs copy";
import { useState } from "react";
import { UpcomingState } from "../component/upcomin-state";
import { ActiveState } from "../component/active-state ";
import { ProcessState } from "../component/processing-State";

interface Props {
  meetingId: string;
}

export const MeetingIDView = ({ meetingId }: Props) => {
  const [updateMeetingDialog, setUpdateMeetingDialog] = useState(false);
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery(
    trpc.meeting.getOne.queryOptions({ id: meetingId })
  );

  const [_, confirmRemove] = useConfirm(
    "Are you sure?",
    "The following action will remove this meeting"
  );

  const removeMeeting = useMutation(
    trpc.meeting.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["meeting.getMany"] });
        router.push("/meetings");
      },
    })
  );

  const handleRemoveMeeting = async () => {
    const ok = await confirmRemove();

    if (!ok) {
      return;
    }

    await removeMeeting.mutateAsync({ id: meetingId });
  };

  const isUpcoming = data.status === "upcoming";
  const isActive = data.status === "active";
  const isCompleted = data.status === "completed";
  const isProcessing = data.status === "processing";
  const isCancelled = data.status === "cancelled";

  return (
    <>
      <UpdateMeetingDialog
        open={updateMeetingDialog}
        onOpenChange={setUpdateMeetingDialog}
        initialValue={data}
      />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => setUpdateMeetingDialog(true)}
          onRemove={handleRemoveMeeting}
        />
        {isCancelled && <div>Cancelled</div>}
        {isProcessing && <ProcessState />}
        <UpcomingState
          meetingId={meetingId}
          onCancelMeeting={() => {}}
          isCancelling={false}
        />

        {isActive && <ActiveState meetingId={meetingId} />}
        {isCompleted && <div>Completed</div>}
      </div>
    </>
  );
};

export const MeetingIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meeting"
      description="This may take a few seconds..."
    />
  );
};

export const MeetingIdViewError = () => {
  return (
    <ErrorState
      title="Error Loading"
      description="An error occurred while loading meeting."
    />
  );
};
