import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

import {
  MeetingView,
  MeetingViewError,
  MeetingViewLoading,
} from "@/modules/meetings/ui/view/meeting-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MeetingListHeader } from "@/modules/meetings/ui/component/meeting-list-header";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/modules/meetings/params";

interface Props{
  searchParams:Promise<SearchParams>
}

export default async function MeetingsPage({searchParams}:Props) {
  const params=await loadSearchParams(searchParams);

  // optional: check session
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();

  // ✅ prefetch meeting list
  await queryClient.prefetchQuery(
    trpc.meeting.getMany.queryOptions({...params,page: Number(params.page),})
  );

  return (
    <>
    <MeetingListHeader/>
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingViewLoading />}>
        <ErrorBoundary fallback={<MeetingViewError />}>
          <MeetingView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
    </>
  );
}
