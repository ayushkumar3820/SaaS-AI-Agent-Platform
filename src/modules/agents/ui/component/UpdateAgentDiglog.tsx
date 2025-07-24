
import { ResponsiveDialog } from "@/components/responsive_dialog";
import { AgentGetOne } from "../../types";
import { AgentForm } from "./agent_form";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: AgentGetOne;
}

export const UpdateAgentDialog = ({ 
  open, 
  onOpenChange, 
  initialValues 
}: Props) => {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleError = () => {
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      title="Update Agent"
      description="Edit the agent details using the form below"
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
        onSuccess={handleSuccess} 
        onError={handleError} 
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
};
