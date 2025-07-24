import { ResponsiveDialog } from "@/components/responsive_dialog";
import { AgentForm } from "./agent_form";


interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewAgentDialog = ({ open, onOpenChange }: Props) => {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleError = () => {
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      title="Create New Agent"
      description="Fill out the form below to create a new AI agent"
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
        onSuccess={handleSuccess} 
        onError={handleError}
      />
    </ResponsiveDialog>
  );
};
