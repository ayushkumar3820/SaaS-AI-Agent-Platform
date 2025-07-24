import { GeneratedAvatar } from "@/components/generated-avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { agentInsertSchema } from "../../schema";
import { AgentGetOne } from "../../types";

interface AgentFormProps {
  onSuccess?: () => void;
  onError?: () => void;
  initialValues?: AgentGetOne;
}

export const AgentForm = ({
  onSuccess,
  onError,
  initialValues,
}: AgentFormProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));

        if (initialValues?.id) {
          queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id })
          );
        }

        toast.success("Agent created successfully!");
        onSuccess?.();
      },

      onError: (error: TRPCError | Error) => {
        const errorMessage = error instanceof TRPCError 
          ? error.message 
          : error.message || "Failed to create agent";
        toast.error(errorMessage);
        onError?.();
      },
    })
  );

  const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));

        if (initialValues?.id) {
          queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id })
          );
        }

        toast.success("Agent updated successfully!");
        onSuccess?.();
      },

      onError: (error: TRPCError | Error) => {
        const errorMessage = error instanceof TRPCError 
          ? error.message 
          : error.message || "Failed to update agent";
        toast.error(errorMessage);
        onError?.();
      },
    })
  );

  const form = useForm<z.infer<typeof agentInsertSchema>>({
    resolver: zodResolver(agentInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instruction ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createAgent.isPending || updateAgent.isPending;

  const onSubmit = (values: z.infer<typeof agentInsertSchema>) => {
    if (isEdit && initialValues?.id) {
      updateAgent.mutate({ ...values, id: initialValues.id });
    } else {
      createAgent.mutate(values);
    }
  };

  const handleCancel = () => {
    form.reset();
    onError?.();
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-center">
          <GeneratedAvatar
            seed={form.watch("name") || "default"}
            variant="botttsNeutral"
            className="border size-16"
          />
        </div>

        {/* Name Field */}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Enter the agent's name"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Instructions Field */}
        <FormField
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Provide instructions for the agent"
                  className="min-h-[100px] resize-none"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending 
              ? (isEdit ? "Updating..." : "Creating...") 
              : (isEdit ? "Update Agent" : "Create Agent")
            }
          </Button>

          <Button
            variant="outline"
            disabled={isPending}
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
