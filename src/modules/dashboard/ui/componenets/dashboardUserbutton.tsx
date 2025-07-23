// modules/dashboard/ui/components/dashboardUserbutton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOutIcon, UserIcon } from "lucide-react";

export default function DashboardUserButton() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  if (!session) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-2 border rounded-lg">
      <div className="flex items-center gap-2 flex-1">
        <UserIcon className="h-4 w-4" />
        <span className="text-sm truncate">{session.user.name}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => 
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => router.push("/sign-in"),
            },
          })
        }
      >
        <LogOutIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
