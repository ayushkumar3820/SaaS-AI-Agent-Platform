"use client";

import {
  SidebarContent,
  SidebarFooter,
  Sidebar,
  SidebarGroupContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import DashboardUserButton from "./dashboardUserbutton";

const firstSection = [
  {
    icon: VideoIcon,
    title: "Meetings",
    href: "/meetings",
  },
  {
    icon: BotIcon,
    title: "Agents",
    href: "/agents",
  },
];

const secondSection = [
  {
    icon: StarIcon,
    title: "Upgrade",
    href: "/upgrade",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" className="flex items-center gap-2 px-2 pt-2">
          <p className="text-2xl font-semibold">Dashboard</p>
        </Link>
      </SidebarHeader>

      <div className="px-2 py-2">
        <Separator className="opacity-10 text-[#5d6B68]" />
      </div>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 hover:bg-slate-100 border border-transparent hover:border-[#5d6B68]/10 text-sidebar-accent-foreground",
                      pathname === item.href &&
                        "bg-slate-100 border-[#5d6B68]/10"
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 hover:bg-slate-100 border border-transparent hover:border-[#5d6B68]/10 text-sidebar-accent-foreground",
                      pathname === item.href &&
                        "bg-slate-100 border-[#5d6B68]/10"
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 py-2">
        <DashboardUserButton/>
      </SidebarFooter>
    </Sidebar>
  );
}