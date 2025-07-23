// modules/dashboard/ui/components/dashboardComment.tsx
"use client";

import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DashboardCommand({ open, setOpen }: Props) {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Find a meeting and agents..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <span>Search meetings</span>
          </CommandItem>
          <CommandItem>
            <span>Search agents</span>
          </CommandItem>
          <CommandItem>
            <span>Create new meeting</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
