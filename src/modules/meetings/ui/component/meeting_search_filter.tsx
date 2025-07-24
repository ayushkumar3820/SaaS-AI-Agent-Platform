import { Input } from "@/components/ui/input";

import { SearchIcon } from "lucide-react";
import { useMeetingsFilter } from "../../hooks/use-Meetings-filter";

export const MeetingSearchFilter = () => {
  const [filter, setFilter] = useMeetingsFilter();

  return (
    <>
      <div className="relative">
        <Input
          className="h-9 bg-white w-[200px] pl-7"
          placeholder="Filter by Name"
          value={filter.search}
          onChange={(e) => setFilter({ search: e.target.value })}
        />
        <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2" />
      </div>
    </>
  );
};
