import { Button } from "@/components/ui/button";
import { AlignJustify } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const NavItem = ({ href, label }: { href: string; label: string }) => {
  return (
    <Link
      className="flex cursor-pointer items-center text-sm font-semibold capitalize"
      href={href}
      scroll={true}
    >
      {label}
    </Link>
  );
};

const Header = () => {
  return (
    <header className="w-full">
      <div className="md:mt-4">
        <div className="mx-2 md:mx-10 -x md:px-6">
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
                <NavItem href="/#about" label="about" />
                <NavItem href="/#features" label="features" />
                <NavItem href="/#faq" label="faq" />
                <NavItem href="/#pricing" label="pricing" />
              </nav>
            </div>

            <div className="flex items-center gap-10 flex-1 justify-end">
              <SignedOut>
                <div className="hidden  items-center gap-2 md:flex">
                  <Button variant={"secondary"} className="font-semibold">
                    <Link href={"/sign-in"}>Log In</Link>
                  </Button>
                  <Button variant={"default"} className="font-semibold">
                    <Link href={"/sign-up"}>Get Started</Link>
                  </Button>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="hidden  items-center gap-2 md:flex">
                  <Button variant={"default"} className="font-semibold">
                    <Link href={"/dashboard"}>Dashboard</Link>
                  </Button>
                  <UserButton />
                </div>
              </SignedIn>
            </div>

            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <AlignJustify />
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription></SheetDescription>
                  </SheetHeader>

                  <div className="py-4">
                    <nav className="flex flex-col gap-1 pt-2 px-2">
                      <Link
                        href={"/#about"}
                        className="flex w-full text-sm  cursor-pointer items-center rounded-md p-2 font-medium text-muted-foreground hover:text-foreground"
                      >
                        About
                      </Link>
                      <Link
                        href={"/#features"}
                        className="flex w-full  text-sm cursor-pointer items-center rounded-md p-2 font-medium text-muted-foreground hover:text-foreground"
                      >
                        Features
                      </Link>
                      <Link
                        href={"/"}
                        className="flex w-full  text-sm cursor-pointer items-center rounded-md p-2 font-medium text-muted-foreground hover:text-foreground"
                      >
                        Faq
                      </Link>
                      <Link
                        href={"/#pricing"}
                        scroll={true}
                        className="flex w-full  text-sm cursor-pointer items-center rounded-md p-2 font-medium text-muted-foreground hover:text-foreground"
                      >
                        Pricing
                      </Link>

                      <Button size={"lg"} className="mt-2 w-full">
                        <Link href={"/dashboard"}>Get Started</Link>
                      </Button>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
