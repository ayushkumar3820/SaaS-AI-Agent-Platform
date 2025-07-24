import { Button } from "@/components/ui/button";

interface Props {
  page: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

export const DataPagination = ({ page, totalPage, onPageChange }: Props) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-sm text-accent-foreground">
        Page {page} of {totalPage || 1}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={page === 1}
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={page === totalPage || totalPage === 0}
          size="sm"
          onClick={() => onPageChange(Math.min(totalPage || 1, page + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
