import { EmptyState } from "@/components/error-empty";

export const CancelState = () => {
  return (
    <>
      <div className="bg-muted rounded-2xl px-4 py-5  flex flex-col gap-y-8  items-center justify-center">
        <EmptyState
          image="/cancel.svg"
          title="Not started Yet"
          description="Once you  start  this meeting ,a summary  will appear  here"
        />
      </div>
    </>
  );
};
