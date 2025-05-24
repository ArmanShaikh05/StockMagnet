import AppSidebar from "@/components/common/AppSidebar";
import DashboardHeader from "@/components/common/DashboardHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="w-full min-h-screen py-4 px-0">
        <DashboardHeader />
        <div className="w-full p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default layout;
