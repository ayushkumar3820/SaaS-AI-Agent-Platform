import { ResponsiveDialog } from "@/components/responsive_dialog";
import { MeetingForm } from "./meeting_form";
import { useRouter } from "next/navigation";
import { Value } from "@radix-ui/react-select";
import { MeetingGetOne } from "../../types";
// import { AgentForm } from "./agent_form";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue:MeetingGetOne;
}

export const UpdateMeetingDialog = ({ open, onOpenChange,initialValue }: Props) => {
  const router = useRouter();

  return (
    <>
      <ResponsiveDialog
        title="edit Meeting"
        description="this form  edit Meeting"
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
