
"use client"

import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandItem, 
 
} from "@/components/ui/command";
import { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DashboardCommand({ open, setOpen }: Props) {
  return (
    <>
    {/* // <CommandResponserDialog open={open} onOpenChange={setOpen} modal={false} className="w-full max-w-md"> */}
    
      <CommandInput placeholder="Find a meeting and agents" />
      <CommandList className="max-h-[400px] overflow-y-auto">
        <CommandItem>
          Test
        </CommandItem>
      </CommandList>
    {/* // </CommandResponserDialog> */}
    </>
  );
}