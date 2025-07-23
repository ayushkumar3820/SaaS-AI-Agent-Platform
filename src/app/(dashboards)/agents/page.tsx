import {
  AgentView,
  AgentViewError,
  AgentViewLoading,
} from "@/modules/Agents/ui/view/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AgentListHeader } from "@/modules/Agents/ui/component/agent-list-header";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/modules/Agents/params";

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function AgentsPage({ searchParams }: Props) {
  const filters = await loadSearchParams(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // prefetch data on server
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
      page: filters.page !== undefined ? Number(filters.page) : undefined,
    })
  );

  return (
    <>
      <AgentListHeader />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentViewLoading />}>
          <ErrorBoundary fallback={<AgentViewError />}>
            <AgentView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
