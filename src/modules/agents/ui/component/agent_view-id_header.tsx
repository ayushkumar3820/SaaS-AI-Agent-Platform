import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ChevronRightIcon, 
  MoreVerticalIcon, 
  PencilIcon, 
  TrashIcon 
} from "lucide-react";
import Link from "next/link";

interface Props {
  agentId: string;
  agentName: string;
  onEdit: () => void;
  onRemove: () => void;
}

export const AgentIdViewHeader = ({
  agentId,
  agentName,
  onEdit,
  onRemove,
}: Props) => {
  return (
    <div className="flex items-center justify-between px-4 py-4 md:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link 
                href="/agents" 
                className="font-medium text-sm text-muted-foreground hover:text-foreground"
              >
                My Agents
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRightIcon className="size-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link 
                href={`/agents/${agentId}`}
                className="font-medium text-foreground"
              >
                {agentName}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVerticalIcon className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onEdit}>
            <PencilIcon className="mr-2 size-4" />
            Edit Agent
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={onRemove}
            className="text-destructive focus:text-destructive"
          >
            <TrashIcon className="mr-2 size-4" />
            Delete Agent
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
