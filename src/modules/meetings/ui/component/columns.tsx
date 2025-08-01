"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MeetingGetMany } from "../../types";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  CornerDownRightIcon,
  LoaderIcon,
  ClockFadingIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
// import humanizeDuration from "humanize-duration";
import { cn, formatDuration } from "@/lib/utils";
import { format } from "date-fns";



const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
};

const statusColorMap = {
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  processing: "bg-gray-500/20 text-gray-800 border-gray-800/5",
  cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
};

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <div className="font-semibold capitalize">{row.original.name}</div>

        <div className="flex items-center gap-x-2">
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={row.original.agent.name}
            className="size-6"
          />
          <span className="font-semibold capitalize">
            {row.original.agent.name}
          </span>
        </div>

        <span className="text-sm text-muted-foreground">
          {row.original.startedAt
            ? format(new Date(row.original.startedAt), "MMM d")
            : ""}
        </span>

        <div className="flex items-center gap-x-2">
          <CornerDownRightIcon className="size-3 text-muted-foreground" />
          <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
            {/* {row.original.instruction} */}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const Icon =
        statusIconMap[row.original.status as keyof typeof statusIconMap];
      const color =
        statusColorMap[row.original.status as keyof typeof statusColorMap];

      return (
        <Badge
          variant="outline"
          className={cn(
            "flex items-center gap-x-2 [&>svg]:size-4",
            color
          )}
        >
          <Icon
            className={cn(
              row.original.status === "processing" && "animate-spin"
            )}
          />
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="capitalize [&>svg]:size-4 flex items-center gap-x-2"
      >
        <ClockFadingIcon className="text-blue-600" />
        {row.original.duration
          ? formatDuration(row.original.duration)
          : "No Duration"}
      </Badge>
    ),
  },
];
