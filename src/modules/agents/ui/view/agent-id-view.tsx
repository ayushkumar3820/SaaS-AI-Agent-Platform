"use client";


import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useState } from "react";

import { TRPCError } from "@trpc/server";
import { AgentGetOne } from "../../types";
import { UpdateAgentDialog } from "../component/UpdateAgentDiglog";
import { AgentIdViewHeader } from "../component/agent_view-id_header";
import { ErrorState } from "@/components/erro-state";
import { useConfirm } from "../../hooks/userConfirm";

interface Props {
  agentId: string;
}

// Define the expected data type
type AgentData = AgentGetOne & {
  meetingCount: number;
};

export const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isUpdateAgentDialog, setIsUpdateAgentDialog] = useState(false);

  // Fetch agent data with proper typing
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  ) as { data: AgentData };

  // Mutation to remove agent
  const removeAgent = useMutation({
    mutationFn: async (vars: { id: string }) => {
      return await trpc.agents.remove.mutate({ id: vars.id });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
      toast.success("Agent removed successfully.");
      router.push("/agents");
    },
    onError: (error: TRPCError | Error) => {
      const errorMessage = error instanceof TRPCError 
        ? error.message 
        : error.message || "Failed to remove agent";
      toast.error(errorMessage);
    },
  });

  const [RemoveConfirmationDialog, confirmRemove] = useConfirm(
    "Remove Agent",
    "Are you sure you want to remove this agent? This action cannot be undone."
  );

  const handleRemove = async () => {
    try {
      const confirmed = await confirmRemove();
      if (confirmed) {
        await removeAgent.mutateAsync({ id: agentId });
      }
    } catch (error) {
      console.error("Error removing agent:", error);
    }
  };

  const handleEdit = () => {
    setIsUpdateAgentDialog(true);
  };

  const meetingText = data.meetingCount === 1 ? "meeting" : "meetings";

  return (
    <>
      <RemoveConfirmationDialog />
      <UpdateAgentDialog
        open={isUpdateAgentDialog} 
        onOpenChange={setIsUpdateAgentDialog} 
        initialValues={data}
      />
      
      <div className="flex px-4 py-4 md:px-8 flex-col gap-y-6">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />

        <div className="bg-background rounded-lg border shadow-sm">
          <div className="px-6 py-6 flex flex-col gap-y-6">
            <div className="flex items-center gap-x-3">
              <GeneratedAvatar
                variant="botttsNeutral"
                seed={data.name}
                className="size-12"
              />
              <h1 className="text-2xl font-semibold">{data.name}</h1>
            </div>

            <Badge
              variant="outline"
              className="flex items-center gap-x-2 w-fit"
            >
              <VideoIcon className="size-4" />
              {data.meetingCount} {meetingText}
            </Badge>

            <div className="flex flex-col gap-y-3">
              <h2 className="text-lg font-semibold">Instructions</h2>
              <p className="text-muted-foreground leading-relaxed">
                {data.instruction || "No instructions provided."}
              </p>
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
      title="Error Loading Agent"
      description="An error occurred while loading the agent. Please try refreshing the page."
    />
  );
};
