import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CallEnded = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="py-6 px-8 flex flex-col items-center justify-center gap-y-6 bg-background rounded max-w-md w-full shadow-md">
        <h2 className="text-lg font-semibold text-white">
          You have ended the call
        </h2>
        <p className="text-sm text-gray-300 text-center">
          A summary of your meeting will appear here in a few minutes.
        </p>

        <Button asChild>
          <Link href="/meeting" className="w-full justify-center">
            Back to Meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
