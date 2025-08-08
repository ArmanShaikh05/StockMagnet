"use client";

import {
  Check,
  ChevronsUpDown,
  GitFork,
  LayoutDashboard,
  Package,
  ReceiptText,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Branches } from "@/lib/generated/prisma";
import { useBranchStore } from "@/store/branchStore";
import { usePathname } from "next/navigation";

const navData: { title: string; url: string; icon: React.ElementType }[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Package,
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: ReceiptText,
  },
  {
    title: "Purchases",
    url: "/purchases",
    icon: ShoppingCart,
  },
  {
    title: "Branches",
    url: "/branches",
    icon: GitFork,
  },
];

const AppSidebar = ({ allBranches }: { allBranches: Branches[] }) => {
  const { open } = useSidebar();
  const pathName = usePathname();

  const { selectedBranch, setSelectedBranch } = useBranchStore();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex w-full items-center justify-center gap-4 mb-6 mt-2">
            {open && (
              <>
                <Image
                  alt="logo"
                  src="/logo.png"
                  width={40}
                  height={40}
                  placeholder="empty"
                  className="rounded-lg"
                />
                <h1 className="font-bold tracking-tighter text-lg ">
                  StockMagnet
                </h1>
              </>
            )}
          </div>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg ">
                    {selectedBranch && (
                      <Image
                        alt={selectedBranch.branchName}
                        src={selectedBranch.branchImage}
                        width={40}
                        height={40}
                        placeholder="empty"
                        className="rounded-lg w-full h-full border-main border-2 "
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">
                      {selectedBranch?.branchName}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[13rem]">
                {allBranches.map((branch, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => {
                      setSelectedBranch(branch);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        alt={branch.branchName}
                        src={branch.branchImage}
                        width={30}
                        height={30}
                        placeholder="empty"
                        className="rounded-full"
                      />
                      <span className="text-xs line-clamp-1">
                        {branch.branchName}
                      </span>
                    </div>
                    {selectedBranch?.id === branch.id && (
                      <Check className="ml-auto" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup key="Building Your Application">
          <SidebarGroupContent>
            <SidebarMenu>
              {navData.map((item) => (
                <SidebarMenuItem key={item.title} className="w-full gap-0 flex">
                  <SidebarMenuButton
                    asChild
                    isActive={pathName === item.url}
                    className="text-primary"
                  >
                    <a href={item.url} className="w-full ">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
