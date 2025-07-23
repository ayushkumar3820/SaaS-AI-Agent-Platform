"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardNavbar from "@/modules/dashboard/ui/componenets/Dashboard-navbar";
import DashboardSidebar from "@/modules/dashboard/ui/componenets/dashboard_sidebar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <DashboardSidebar />
        
        {/* Mobile overlay */}
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
        
        <main className="flex-1 flex flex-col min-w-0">
          <DashboardNavbar />
          <div className="flex-1 bg-muted/40 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;