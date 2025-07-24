import { Input } from "@/components/ui/input";

import { SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAgentsFilter } from "../../hooks/use-Agents-filter";

export const AgentSearchFilter = () => {
  const [filter, setFilter] = useAgentsFilter();

  const handleClearSearch = () => {
    setFilter({ search: "" });
  };

  return (
    <div className="relative">
      <Input
        className="h-9 bg-background w-[200px] pl-8 pr-8"
        placeholder="Filter by name..."
        value={filter.search || ""}
        onChange={(e) => setFilter({ search: e.target.value })}
      />
      <SearchIcon className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
      
      {filter.search && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
          onClick={handleClearSearch}
        >
          <XIcon className="size-3" />
        </Button>
      )}
    </div>
  );
};
