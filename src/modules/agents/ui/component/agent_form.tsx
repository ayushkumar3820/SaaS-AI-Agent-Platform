// import { GeneratedAvatar } from "@/components/generated-avatar";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { agentInsertSchema } from "@/modules/Agents/schema";
// import { AgentGetOne } from "@/modules/Agents/types";
// import { useTRPC } from "@/trpc/client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import z from "zod";

// interface AgentFormProps {
//   OnSuccess?: () => void;
//   OnError?: () => void;
//   initialValues?: AgentGetOne;
// }

// export const AgentForm = ({
//   OnSuccess,
//   OnError,
//   initialValues,
// }: AgentFormProps) => {
//   const router = useRouter();
//   const trpc = useTRPC();
//   const queryClient = useQueryClient();

//   const createAgent = useMutation(
//     trpc.agents.create.mutationOptions({
//       onSuccess: () => {
//         queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));

//         if (initialValues?.id) {
//           queryClient.invalidateQueries(
//             trpc.agents.getOne.queryOptions({ id: initialValues.id })
//           );
//         }

//         OnSuccess?.();
//       },

//       onError: (error) => {
//         toast.error(error.message);
//         OnError?.();
//       },
//     })
//   );

//     const updatedAgent = useMutation(
//     trpc.agents.update.mutationOptions({
//       onSuccess: () => {
//         queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));

//         if (initialValues?.id) {
//           queryClient.invalidateQueries(
//             trpc.agents.getOne.queryOptions({ id: initialValues.id })
//           );
//         }

//         OnSuccess?.();
//       },

//       onError: (error) => {
//         toast.error(error.message);
//         OnError?.();
//       },
//     })
//   );

//   const form = useForm<z.infer<typeof agentInsertSchema>>({
//     resolver: zodResolver(agentInsertSchema),
//     defaultValues: {
//       name: initialValues?.name ?? "",
//       instructions: initialValues?.instruction ?? "",
//     },
//   });

//   const isEdit = !!initialValues?.id;
//   const isPending = createAgent.isPending || updatedAgent.isPending;

//   const onSubmit = (values: z.infer<typeof agentInsertSchema>) => {
//     if (isEdit) {
//       updatedAgent.mutate({ ...values, id: initialValues.id });
//     } else {
//       createAgent.mutate(values);
//     }
//   };

//   return (
//     <Form {...form}>
//       <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
//         <GeneratedAvatar
//           seed={form.watch("name")}
//           variant="botttsNeutral"
//           className="border size-16"
//         />

//         {/* Name Field */}
//         <FormField
//           name="name"
//           control={form.control}
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input {...field} placeholder="Enter the agent's name" />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Instructions Field */}
//         <FormField
//           name="instructions"
//           control={form.control}
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Instructions</FormLabel>
//               <FormControl>
//                 <textarea
//                   {...field}
//                   placeholder="Provide instructions"
//                   className="w-full rounded border p-2"
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="flex gap-2">
//           <Button type="submit" disabled={isPending}>
//             {isEdit ? "Update Agent" : "Create Agent"}
//           </Button>

//           {OnError && (
//             <Button
//               variant="ghost"
//               disabled={isPending}
//               type="button"
//               onClick={OnError}
//             >
//               Cancel
//             </Button>
//           )}
//         </div>
//       </form>
//     </Form>
//   );
// };
