"use client";

import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import PlanBadge from "./PlanBadge";
import { useEffect, useState } from "react";

const DashboardHeader = ({ subscription }: { subscription: string }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true); // Ensures rendering only after client mount
  }, []);
  return (
    <header className="w-full  p-4  border-b sticky top-0 backdrop-blur-3xl z-50">
      <div className=" flex items-center justify-between mx-auto">
        <SidebarTrigger className="hover:bg-main-accent" />
        <div className="flex w-max gap-4 items-center">
          <PlanBadge plan={subscription} />

          {isMounted ? (
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "2.3rem",
                    height: "2.3rem",
                  },
                },
              }}
            />
          ) : (
            <Skeleton className="w-[2.3rem] h-[2.3rem] rounded-full" />
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
