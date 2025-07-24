"use client";


import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../component/data-table";
import { columns } from "../component/columns";

import { useRouter } from "next/navigation";
import { useAgentsFilter } from "../../hooks/use-Agents-filter";
import { EmptyState } from "@/components/error-empty";
import { DataPagination } from "../component/data_pagination";
import { ErrorState } from "@/components/erro-state";

export const AgentView = () => {
  const [filter, setFilter] = useAgentsFilter();
  const trpc = useTRPC();
  const router = useRouter();

  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      ...filter,
      page: Number(filter.page),
    })
  ) as { data: { items: any[]; totalPages: number } };

  const hasNoAgents = data.items.length === 0;

  const handleRowClick = (row: any) => {
    router.push(`/agents/${row.id}`);
  };

  const handlePageChange = (page: number) => {
    setFilter({ page: String(page) });
  };

  if (hasNoAgents) {
    return (
      <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call."
        />
      </div>
    );
  }

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable 
        data={data.items} 
        columns={columns} 
        onRowClick={handleRowClick} 
      />

      <DataPagination
        page={Number(filter.page)}
        totalPages={data.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export const AgentViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a few seconds..."
    />
  );
};

export const AgentViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agents"
      description="An error occurred while loading agents. Please try refreshing the page."
    />
  );
};
