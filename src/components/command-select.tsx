import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ChevronsUpDownIcon } from "lucide-react";
import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Command,
} from "./ui/command";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "./ui/dialog";

interface Props {
  options: Array<{
    id: string;
    value: string;
    children: ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value: string;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  isSearchable = false,
  className,
}: Props) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const handleOpenChange = (open: boolean) => {
    onSearch?.("");
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-9 justify-between font-normal px-2",
            !selectedOption && "text-muted-foreground",
            className
          )}
        >
          <div>{selectedOption?.children ?? placeholder}</div>
          <ChevronsUpDownIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="p-0">
        <Command>
          {isSearchable && (
            <CommandInput
              placeholder="Search..."
              onValueChange={(val) => onSearch?.(val)}
            />
          )}
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No options found
            </span>
          </CommandEmpty>
          <CommandList>
            {options.map((option) => (
              <CommandItem
                key={option.id}
                onSelect={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
              >
                {option.children}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
