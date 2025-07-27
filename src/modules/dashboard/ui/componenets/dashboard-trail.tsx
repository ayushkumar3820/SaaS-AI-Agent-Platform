import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MAX_FREE_AGENT, MAX_FREE_MEETING } from "@/modules/premuin/constant";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { RocketIcon } from "lucide-react";
import Link from "next/link";

export const DashboardTrial = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.premium.getFreeUsage.queryOptions());
  if (!data) return null;

  return (
    <div className="border border-border/10 rounded-lg">
      <div className="p-3 flex flex-col gap-y-4">
        <div className="flex item-center gap-2">
          <RocketIcon className="size-4" />
          <div className="text-sm font-medium">Free Trail</div>
          <div className="flex flex-col gap-hy-2">
            <p className="text-sm">
              {data.agentCount}/{MAX_FREE_AGENT} Agents
            </p>
            <Progress value={(data.agentCount / MAX_FREE_AGENT) * 100} />
          </div>
          <div className="flex flex-col gap-hy-2">
            <p className="text-sm">
              {data.meetingCount}/{MAX_FREE_MEETING} meeting
            </p>
            <Progress value={(data.meetingCount / MAX_FREE_MEETING) * 100} />
          </div>
        </div>
      </div>

      <Button
        asChild
        className="bg-transparent border-t border-border/10  hover:bg-white/10 rounded-to-none"
      >
        <Link href="/upgrade">Upgrade</Link>
      </Button>
    </div>
  );
};
