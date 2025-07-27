"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,    
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Drawer, 
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger 
} from "@/components/ui/drawer";
import { GeneratedAvatar } from "@/components/generated-avatar";

export default function DashboardUserButton() {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const isMobile = useIsMobile();

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  if (isPending) {
    return null;
  }

  // User button content component to avoid duplication
  const UserButton = ({ className = "" }) => (
    <Button variant="ghost" className={`w-full justify-start ${className}`}>
      {data?.user?.image ? (
        <Avatar>
          <AvatarImage
            src={data?.user?.image}
            alt={data?.user?.name}
            className="w-8 h-8 rounded-full"
          />
        </Avatar>
      ) : (
        <GeneratedAvatar
          seed={data?.user?.name || "user"}
          className="size-9 mr-3"
          variant="initials"
        />
      )}

      <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
        <p className="text-sm truncate w-full">
          {data?.user?.name || "User"}
        </p>
        <p className="text-xs text-muted-foreground truncate w-full">
          {data?.user?.email || "email"}
        </p>
      </div>
      <ChevronDownIcon className="size-4 shrink-0" />
    </Button>
  );

  // Mobile drawer version
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <div className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-center bg-white/5 hover:bg-white/10 overflow-hidden">
            <UserButton />
          </div>
        </DrawerTrigger>
        <DrawerContent className="w-72">
          <DrawerHeader>
            <DrawerTitle>{data?.user?.name || "User"}</DrawerTitle>
            <DrawerDescription>{data?.user?.email || "email"}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={()=>authClient.customer.portal()}>
              <CreditCardIcon className="size-4 mr-2" />
              Billing
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
              <LogOutIcon className="size-4 mr-2" />
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop dropdown version
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-center bg-white/5 hover:bg-white/10 overflow-hidden"
      >
        <UserButton />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72" side="right">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">
              {data?.user?.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground">
              {data?.user?.email || "email"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Billing
          <CreditCardIcon className="size-4 ml-auto" />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout}>
          Logout
          <LogOutIcon className="ml-auto size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}