"use client";

import { ResponsiveDialog } from "@/components/responsive_dialog";
import { MeetingForm } from "./meeting_form";
import { useRouter } from "next/navigation";
// import { AgentForm } from "./agent_form";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewMeetingDialog = ({ open, onOpenChange }: Props) => {
  const router = useRouter();

  return (
    <>
      <ResponsiveDialog
        title="New Meeting"
        description="this form Meeting"
        open={open}
        onOpenChange={onOpenChange}
      >
        <MeetingForm
          onSuccess={(id) => {
            onOpenChange(false);
            router.push(`/meetings/${id}`);
          }}
          onError={() => onOpenChange(false)}
        />
      </ResponsiveDialog>
    </>
  );
};
