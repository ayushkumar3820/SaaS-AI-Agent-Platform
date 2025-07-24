import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const DataPagination = ({ page, totalPages, onPageChange }: Props) => {
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages || totalPages === 0;
  const displayTotalPages = totalPages || 1;

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2">
      <div className="text-sm text-muted-foreground">
        Page {page} of {displayTotalPages}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isFirstPage}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          <ChevronLeftIcon className="size-4 mr-1" />
          Previous
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          disabled={isLastPage}
          onClick={() => onPageChange(Math.min(displayTotalPages, page + 1))}
        >
          Next
          <ChevronRightIcon className="size-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
