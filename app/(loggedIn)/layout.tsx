export const dynamic = "force-dynamic";

import {
  getAllBranchesOfUser,
  getPrimaryBranchOfUser,
} from "@/actions/branchActions";
import { getCurrentUserDetails } from "@/actions/userActions";
import AppSidebar from "@/components/common/AppSidebar";
import BranchInitializer from "@/components/common/BranchInitializer";
import DashboardHeader from "@/components/common/DashboardHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RedirectToSignIn } from "@clerk/nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const user = await getCurrentUserDetails();
  if (!user) {
    return <RedirectToSignIn />;
  }

  if (!user.onBoarded) {
    redirect("/onboarding");
  }

  const allBranches = await getAllBranchesOfUser();
  const branch = await getPrimaryBranchOfUser(user.clerkUserId);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      {/* Hardcoding it that the user will always have a primary branhc */}
      <BranchInitializer initialBranch={branch!} />
      <AppSidebar allBranches={allBranches.data || []} />
      <main className="w-full min-h-screen py-4 px-0">
        <DashboardHeader subscription={user.subscription} />
        <div className="w-full p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default layout;
