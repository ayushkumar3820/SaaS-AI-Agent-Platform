"use client";

// import { ErrorState } from "@/components/erro-state";
// import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
// import { DataTable } from "../component/data-table";
// import { columns } from "../component/columns";
// import { EmptyState } from "@/components/error-empty";
// import { useAgentsFilter } from "../../hooks/use-Agents-filter";
// import { DataPagination } from "../component/data_pagination";
import { useRouter } from "next/navigation";

export const AgentView = () => {
  const [filter, setFilter] = useAgentsFilter();
  const trpc = useTRPC();
  const router=useRouter();

  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      ...filter,
      page: Number(filter.page), 
    })
  );

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable data={data.items} columns={columns} onRowClick={(row)=>router.push(`/agents/${row.id}`)} />

      <DataPagination
        page={Number(filter.page)} 
        totalPage={data.totalPages}
        onPageChange={(page) => setFilter({ page: String(page) })}
      />

      {data.items.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call."
        />
      )}
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
      title="Error Loading..."
      description="An error occurred while loading agents."
    />
  );
};
