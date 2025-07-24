"use client";

import { ErrorState } from "@/components/erro-state";
import { EmptyState } from "@/components/error-empty";
import { LoadingState } from "@/components/loading-state";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../component/columns"; // ✅ make sure columns.tsx is present in the same folder
import { useRouter } from "next/navigation";
import { useMeetingsFilter } from "../../hooks/use-Meetings-filter";
import { DataPagination } from "../component/data_pagination";
import { DataTable } from "@/modules/agents/ui/component/data-table";

export const MeetingView = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [filter, setFilter] = useMeetingsFilter();

  const { data } = useSuspenseQuery(
    trpc.meeting.getMany.queryOptions({
      ...filter,
      page: Number(filter.page),
    })
  );

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      {data.items.length > 0 ? (
        <>
          <DataTable
            data={data.items}
            columns={columns}
            onRowClick={(row) => router.push(`/meetings/${row.id}`)}
          />
          <DataPagination
            page={Number(filter.page)}
            totalPage={data.totalPages}
            onPageChange={(page) => setFilter({ page:page.toString() })}
          />
        </>
      ) : (
        <EmptyState
          title="Create your first meeting"
          description="Create a meeting to join your meetings. Each agent will follow your instructions and can interact with participants during the call."
        />
      )}
    </div>
  );
};

export const MeetingViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meetings"
      description="This may take a few seconds..."
    />
  );
};

export const MeetingViewError = () => {
  return (
    <ErrorState
      title="Error Loading..."
      description="An error occurred while loading meetings."
    />
  );
};
