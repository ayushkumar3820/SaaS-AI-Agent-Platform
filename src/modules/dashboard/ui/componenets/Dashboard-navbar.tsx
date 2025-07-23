// modules/dashboard/ui/components/Dashboard-navbar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelBottomCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import DashboardCommand from "./dashboardComment";
import { useEffect, useState } from "react";

export default function DashboardNavbar() {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [command, setCommand] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { 
        e.preventDefault();
        setCommand((prev) => !prev);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, []);

  return (
    <>
      <DashboardCommand open={command} setOpen={setCommand} />
      <nav className="bg-white shadow-md p-4 flex items-center gap-2">
        <Button 
          variant="outline" 
          onClick={toggleSidebar} 
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          {(state === "collapsed" || isMobile) ? 
            <PanelLeftIcon className="h-4 w-4" /> : 
            <PanelBottomCloseIcon className="h-4 w-4" />
          }
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setCommand(true)} 
          className="ml-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        >
          <SearchIcon className="h-4 w-4" />
          Search
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </Button>
      </nav>
    </>
  );
}
