import React from "react";
import { SidebarTrigger } from "../ui/sidebar";

const DashboardHeader = () => {
  return (
    <header className="w-full  p-4  border-b sticky top-0 backdrop-blur-3xl z-50">
      <div className=" flex items-center justify-between mx-auto">
        <SidebarTrigger className="hover:bg-main-accent" />
        <p>Dashboard Header</p>
      </div>
    </header>
  );
};

export default DashboardHeader;
