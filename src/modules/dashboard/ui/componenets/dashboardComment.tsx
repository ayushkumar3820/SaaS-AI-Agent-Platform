// modules/dashboard/ui/components/dashboardCommand.tsx
"use client";

import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CalendarIcon, UserIcon, PlusIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DashboardCommand({ open, setOpen }: Props) {
  const trpc = useTRPC();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: meetings } = useQuery(trpc.meeting.getMany.queryOptions({ 
    search, 
    pageSize: 100 
  }));
  
  const { data: agents } = useQuery(trpc.agents.getMany.queryOptions({ 
    search, 
    pageSize: 100 
  }));

  const handleSelectMeeting = (meetingId: string) => {
    router.push(`/meetings/${meetingId}`);
    setOpen(false);
  };

  const handleSelectAgent = (agentId: string) => {
    router.push(`/agents/${agentId}`);
    setOpen(false);
  };

  const handleCreateMeeting = () => {
    router.push('/meetings/new');
    setOpen(false);
  };

  return (
    <CommandDialog shouldFilter={false} open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Find a meeting or agent..." 
        value={search} 
        onValueChange={(value) => setSearch(value)} 
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {/* Meetings Group */}
        {meetings?.items && meetings.items.length > 0 && (
          <CommandGroup heading="Meetings">
            {meetings.items.map((meeting) => (
              <CommandItem
                key={meeting.id}
                onSelect={() => handleSelectMeeting(meeting.id)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>{meeting.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Agents Group */}
        {agents?.items && agents.items.length > 0 && (
          <CommandGroup heading="Agents">
            {agents.items.map((agent) => (
              <CommandItem
                key={agent.id}
                onSelect={() => handleSelectAgent(agent.id)}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                <span>{agent.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Suggestions Group */}
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={handleCreateMeeting}>
            <PlusIcon className="mr-2 h-4 w-4" />
            <span>Create new meeting</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
