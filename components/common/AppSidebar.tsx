"use client";

import {
  Check,
  ChevronsUpDown,
  GalleryVerticalEnd,
  GitFork,
  LayoutDashboard,
  Package,
  ReceiptText,
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
    title: "Branches",
    url: "/branches",
    icon: GitFork,
  },
];

const AppSidebar = () => {
  const { open } = useSidebar();
  const pathName = usePathname();

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
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Documentation</span>
                    <span>v1.0.1</span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width]"
              >
                <DropdownMenuItem key="1.0.1">
                  v1.0.1
                  <Check className="ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuItem key="1.1.0-alpha">
                  v1.1.0-alpha
                </DropdownMenuItem>
                <DropdownMenuItem key="2.0.0-beta1">
                  v2.0.0-beta1
                </DropdownMenuItem>
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
