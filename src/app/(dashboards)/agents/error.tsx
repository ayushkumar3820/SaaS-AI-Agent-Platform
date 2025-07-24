"use client";

import { ErrorState } from "@/components/erro-state";



interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AgentViewError({ error, reset }: ErrorProps) {
  return (
    <>
      <ErrorState
        title="Error Loading..."
        description="This is make me error...."
      />
    </>
  );
}
