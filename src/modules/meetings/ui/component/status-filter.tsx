import { CommandSelect } from "@/components/command-select";
import { MeetingStatus } from "../../types";

import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  LoaderIcon,
  VideoIcon,
} from "lucide-react";


import { useMeetingsFilter } from "../../hooks/use-Meetings-filter";

const options = [
  {
    id: MeetingStatus.upcoming,
    value: MeetingStatus.upcoming,
    children: (
      <div className="flex items-center gap-x-3">
        <ClockArrowUpIcon />
        {MeetingStatus.upcoming}
      </div>
    ),
  },
  {
    id: MeetingStatus.active,
    value: MeetingStatus.active,
    children: (
      <div className="flex items-center gap-x-3">
        <VideoIcon />
        {MeetingStatus.active}
      </div>
    ),
  },
  {
    id: MeetingStatus.completed,
    value: MeetingStatus.completed,
    children: (
      <div className="flex items-center gap-x-3">
        <CircleCheckIcon />
        {MeetingStatus.completed}
      </div>
    ),
  },
  {
    id: MeetingStatus.processing,
    value: MeetingStatus.processing,
    children: (
      <div className="flex items-center gap-x-3">
        <LoaderIcon />
        {MeetingStatus.processing}
      </div>
    ),
  },
  {
    id: MeetingStatus.cancelled,
    value: MeetingStatus.cancelled,
    children: (
      <div className="flex items-center gap-x-3">
        <CircleXIcon />
        {MeetingStatus.cancelled}
      </div>
    ),
  },
];

export const StatusFilter = () => {
   const [filter, setFilter] = useMeetingsFilter();
 

  return (
    <CommandSelect
      placeholder="Status"
      className="h-9"
      options={options}
      onSelect={(value) => setFilter({ status: value as MeetingStatus })}
      value={filter.status ?? ""}
    />
  );
};
