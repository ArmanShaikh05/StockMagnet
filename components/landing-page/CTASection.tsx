import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { SignedOut } from "@clerk/nextjs";

const CTASection = () => {
  return (
    <section className="py-20 sm:px-6">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col items-center bg-card px-10 rounded-2xl py-20 gap-x-6 md:flex-row gap-y-14 border">
          <div className="flex items-start  flex-col basis-3/5 gap-6">
            <h2 className=" text-3xl font-semibold tracking-tight text-balance sm:text-5xl max-w-2xl text-left">
              The smarter way to grow your startup
            </h2>
            <p className="text-lg text-muted-foreground  max-w-lg sm:text-xl text-left">
              Analyze with ease. Export to dashboards and custom insights 
              reports. Visualize without limits.
            </p>
            <SignedOut>
              <Button className="gap-2 font-semibold">
                <Link href={"/"}>Get Started</Link>
                <ChevronRight size={16} />
              </Button>
            </SignedOut>
          </div>

          <div className="relative  basis-2/5 bg-main rounded-2xl flex justify-center items-center h-[300px]">
            <Image
              src={"/features.png"}
              alt="cta page"
              height={300}
              width={400}
              className="rounded-2xl overflow-hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
