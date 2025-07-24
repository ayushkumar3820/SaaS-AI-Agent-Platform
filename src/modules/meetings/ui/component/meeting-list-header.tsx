import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";

import { useState } from "react";

import { NewMeetingDialog } from "./NewMeetingDigalogs";
import { StatusFilter } from "./status-filter";
import { MeetingSearchFilter } from "./Meeting_search_filter";
import { AgentIdFilter } from "./agent-id-filter";
import { useMeetingsFilter } from "../../hooks/use-Meetings-filter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DEFAULT_PAGE } from "@/constant";

export const MeetingListHeader = () => {
  const [filter, setFilter] = useMeetingsFilter();
  const [isDialog, setIsDialog] = useState(false);

  const isAnyFilterModified =
    !!filter.status || !!filter.search || !!filter.agentId;

  const onClearFilters = () => {
    setFilter({
      status: null,
      agentId: "",
      search: "",
     page: DEFAULT_PAGE.toString(),
    });
  };

  return (
    <>
      <NewMeetingDialog open={isDialog} onOpenChange={setIsDialog} />
      <div className="px-4 py-4 flex flex-col md:px-8 gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-2xl">My Meeting</h5>
          <Button onClick={() => setIsDialog(true)}>
            <PlusIcon className="mr-2" />
            New Meeting
          </Button>
        </div>
        <ScrollArea>
        
        <div className="flex flex-wrap items-center gap-3">
          <MeetingSearchFilter />
          <StatusFilter />
          <AgentIdFilter />
          {isAnyFilterModified && (
            <Button variant="outline" onClick={onClearFilters}>
              <XCircleIcon className="size-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <ScrollBar orientation="horizontal"/>
          </ScrollArea>
      </div>
    </>
  );
};
