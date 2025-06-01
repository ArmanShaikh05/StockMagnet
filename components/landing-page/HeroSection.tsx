import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  ArrowRight,
  DollarSign,
  LineChart,
  Sparkle,
  SparkleIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const HeroSection = () => {
  return (
    <section className="pb-10 sm:px-6">
      <div className="">
        <div className="flex flex-col  items-center gap-6 pt-20  mx-2 md:mx-10 relative">
          <Badge variant={"secondary"}>
            <span className="mr-2 bg-main text-primary-foreground rounded-sm py-0.5 px-1.5">
              New
            </span>
            <p>Announcing our seed round →</p>
          </Badge>
          <h1 className="text-center font-semibold tracking-tight text-balance max-w-3xl md:text-7xl text-5xl sm:text-6xl">
            Smart insights for fast startups
          </h1>
          <p className="text-center text-lg text-muted-foreground sm:text-xl max-w-md">
            Providing advanced analytics solutions for businesses to make
            smarter decisions.
          </p>

          <div>
            <SignedOut>
              <Link href={"/sign-in"}>
                <Button className="">
                  <span>Get started now</span>
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href={"/dashboard"}>
                <Button className="">
                  <span>Go To Dashboard</span>
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
        <div className="flex items-center justify-center gap-12 py-6  mx-2 md:mx-10 relative">
          <div className=" flex flex-wrap  gap-y-4 justify-center gap-x-16">
            <div className="flex items-center  gap-2 justify-center">
              <Sparkle size={20} className="text-muted-foreground" />
              <span className="text-muted-foreground">Setup in 5 minutes</span>
            </div>

            <div className="flex items-center  gap-2 justify-center">
              <LineChart size={20} className="text-muted-foreground" />
              <span className="text-muted-foreground">Scales infinitely</span>
            </div>

            <div className="flex items-center  gap-2 justify-center">
              <DollarSign size={20} className="text-muted-foreground" />
              <span className="text-muted-foreground">Transparent pricing</span>
            </div>

            <SparkleIcon className="absolute left-0 -translate-x-1/2 fill-main stroke-main top-0 -translate-y-1/2" />
            <SparkleIcon className="absolute right-0 translate-x-1/2 fill-main stroke-main top-0 -translate-y-1/2" />
          </div>
        </div>
        <div className="p-16 bg-main/80 rounded-2xl max-w-7xl mx-auto">
          <Image
            src={"/hero_image.png"}
            alt="heroImage"
            width={1300}
            height={500}
            className="rounded-2xl overflow-hidden"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
