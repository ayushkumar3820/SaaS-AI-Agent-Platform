"use client";

import { Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/modules/dashboard/ui/componenets/dashboard_sidebar";
import DashboardNavbar from "@/modules/dashboard/ui/componenets/Dashboard-navbar";

interface Props {
  children: React.ReactNode;
}

function LoadingFallback({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      <span className="ml-2 text-sm text-gray-600">{text}</span>
    </div>
  );
}

export default function DashboardLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Suspense fallback={<LoadingFallback text="Loading sidebar..." />}>
          <DashboardSidebar />
        </Suspense>

        <main className="flex-1 flex flex-col">
          <Suspense fallback={<LoadingFallback text="Loading navbar..." />}>
            <DashboardNavbar />
          </Suspense>

          <div className="flex-1 bg-muted/40 p-6">
            <Suspense fallback={<LoadingFallback text="Loading content..." />}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
