import { auth } from "@/lib/auth";
import { CallView } from "@/modules/call/ui/views/call-views";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Use the exact same pattern as your agents page
interface Props {
  params: Promise<{ meetingId: string }>;
}

export default async function Page({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { meetingId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meeting.getOne.queryOptions({ id: meetingId })
  );

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CallView meetingId={meetingId} />
      </HydrationBoundary>
    </>
  );
}