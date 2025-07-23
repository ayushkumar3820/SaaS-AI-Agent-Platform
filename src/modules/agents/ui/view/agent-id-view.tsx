"use client";

import { ErrorState } from "@/components/erro-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { AgentIdViewHeader } from "../component/agent_view-id_header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { UpdateAgentDialog } from "../component/UpdateAgentDiglog";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isUpdateAgentDialog, setIsUpdateAgentDialog] = useState(false);

  // fetch agent data
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  ) as { data: { id: string; name: string; createdAt: string; updatedAt: string; userId: string; instruction: string; meetingCount: number } };

  // mutation to remove agent
  const removeAgent = useMutation({
    mutationFn: (vars: { id: string }) => trpc.agents.remove.mutate(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
      toast.success("Agent removed successfully.");
      router.push("/agents");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [RemoveConfirmationDialog, confirmRemove] = useConfirm(
    "Remove Agent",
    "Are you sure you want to remove this agent? This action cannot be undone."
  );

  const handleRemove = async () => {
    const confirmed = await confirmRemove();
    if (confirmed) {
      await removeAgent.mutateAsync({ id: agentId });
    }
  };

  return (
   <>
    <RemoveConfirmationDialog />
    <UpdateAgentDialog open={isUpdateAgentDialog} onOpenChange={setIsUpdateAgentDialog } initialValues={data}/>
    <div className="flex px-2 py-2 md:px-8 flex-col gap-y-4">
      <AgentIdViewHeader
        agentId={agentId}
        agentName={data.name}
        onEdit={() => setIsUpdateAgentDialog(true)}
        onRemove={handleRemove}
      />

      <div className="bg-white rounded-lg border">
        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
          <div className="flex items-center justify-center gap-x-2">
            <GeneratedAvatar
              variant="botttsNeutral"
              seed={data.name}
              className="size-10"
            />
            <h2 className="text-xl font-medium">{data.name}</h2>
          </div>

          <Badge
            variant="outline"
            className="flex items-center gap-x-2 [&>svg]:size-4"
          >
            <VideoIcon />
            {data.meetingCount}{" "}
            {data.meetingCount === 1 ? "meeting" : "meetings"}
          </Badge>

          <div className="flex flex-col gap-y-2">
            <p className="text-lg font-medium">Instruction</p>
            <p className="text-neutral-800">{data.instruction}</p>
          </div>
        </div>
      </div>

     
    </div>
   </>
  );
};

export const AgentIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agent"
      description="This may take a few seconds..."
    />
  );
};

export const AgentIdViewError = () => {
  return (
    <ErrorState
      title="Error Loading"
      description="An error occurred while loading the agent."
    />
  );
};