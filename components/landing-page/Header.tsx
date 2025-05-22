import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { Hamburger } from "lucide-react";

const NavItem = ({ href, label }: { href: string; label: string }) => {
  return (
    <Link
      className="flex cursor-pointer items-center text-sm font-semibold capitalize"
      href={href}
    >
      {label}
    </Link>
  );
};

const Header = () => {
  return (
    <header className="w-full">
      <div className="md:mt-4">
        <div className="mx-2 md:mx-10 -x px-6">
          <div className="flex justify-between items-center w-full py-4 border-b">

            <div className="flex-1">
              <Link href={"/"} className="flex items-center gap-3">
                <Image
                  src={"/logo.png"}
                  alt="Logo"
                  width={50}
                  height={50}
                ></Image>
                <span className="font-bold text-xl">StockMagnet</span>
              </Link>
            </div>

            <div className="flex items-center gap-6 flex-1 justify-center">
              <nav className="hidden items-center gap-10 md:flex justify-end">
                <NavItem href="/about" label="about" />
                <NavItem href="/docs" label="docs" />
                <NavItem href="/blog" label="blog" />
                <NavItem href="/pricing" label="pricing" />
              </nav>
            </div>

            <div className="flex items-center gap-10 flex-1 justify-end">
              <div className="hidden  items-center gap-2 md:flex">
                <Button variant={"secondary"} className="font-semibold">
                  <Link href={"/"}>Log In</Link>
                </Button>
                <Button variant={"default"} className="font-semibold">
                  <Link href={"/"}>Get Started</Link>
                </Button>
              </div>
            </div>

            <div className="flex md:hidden">
              <Hamburger />
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
