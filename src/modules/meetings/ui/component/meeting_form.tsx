import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { MeetingInsertSchema } from "../../schema";
import { MeetingGetOne } from "../../types";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { NewAgentDialog } from "@/modules/agents/ui/component/newAgentDigalogs";


interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onError?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = ({
  onSuccess,
  onError,
  initialValues,
}: MeetingFormProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [newOpenDialog, setNewOpenDialog] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({ pageSize: 100, search: agentSearch })
  );

  const createMeeting = useMutation(
    trpc.meeting.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.meeting.getMany.queryOptions({}));
        toast.success("Meeting created successfully");
        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(error.message);
        onError?.();
      },
    })
  );

  const updateMeeting = useMutation(
    trpc.meeting.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.meeting.getMany.queryOptions({}));
        toast.success("Meeting updated successfully");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
        onError?.();
      },
    })
  );

  const form = useForm<z.infer<typeof MeetingInsertSchema>>({
    resolver: zodResolver(MeetingInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof MeetingInsertSchema>) => {
    if (isEdit) {
      updateMeeting.mutate({ ...values, id: initialValues.id });
    } else {
      createMeeting.mutate(values);
    }
  };

  return (
    <>
      <NewAgentDialog open={newOpenDialog} onOpenChange={setNewOpenDialog} />
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Meeting Name Field */}
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter the meeting name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Agent Select Field */}
          <FormField
            name="agentId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={
                      (agents.data?.items ?? []).map((agent) => ({
                        id: agent.id,
                        value: agent.id,
                        children: (
                          <div className="flex items-center gap-x-3">
                            <GeneratedAvatar
                              seed={agent.name}
                              variant="botttsNeutral"
                              className="size-8 border"
                            />
                            <span>{agent.name}</span>
                          </div>
                        ),
                      })) || []
                    }
                    value={field.value}
                    onSelect={field.onChange}
                    onSearch={setAgentSearch}
                    placeholder="Select an agent"
                  />
                </FormControl>
                <FormDescription>
                  Not finding what you are looking for?{" "}
                  <button
                    type="button"
                    className="text-primary underline"
                    onClick={() => setNewOpenDialog(true)}
                  >
                    Create a new agent
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isEdit ? "Update Meeting" : "Create Meeting"}
            </Button>

            {onError && (
              <Button
                variant="ghost"
                disabled={isPending}
                type="button"
                onClick={onError}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
};
