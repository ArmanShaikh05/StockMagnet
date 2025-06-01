import React from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const FeatureCard = ({
  src = "/hero_image.png",
  title,
}: {
  src?: string;
  title: string;
}) => {
  return (
    <Card className="p-6 rounded-2xl border shadow-none">
      <CardContent>
        <div className="mb-6 w-full h-64 relative">
          <Image
            className="rounded-md object-contain"
            src={src}
            alt="feature image"
            width={400}
            height={200}
          />
        </div>
        <div className="flex justify-between items-end gap-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <Button className="size-10 shrink-0 rounded-full">
            <ArrowRight size={5} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Details = () => {
  return (
    <section className="relative bg-background py-20 sm:px-6" id="about">
      <div className="container max-w-7xl mx-auto flex flex-col gap-12">
        <div className="flex justify-between w-full flex-col lg:flex-row gap-4 lg:items-end">
          <h2 className="tracking-tight sm:text-5xl text-3xl text-balance font-semibold text-left flex-1">
            Made for modern product teams
          </h2>
          <p className="text-lg  text-muted-foreground flex-1">
            Our analytics platform is built on the strategies and insights that
            empower leading data-driven teams: deep visibility, real-time
            intelligence, and a dedication to continuous improvement.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 grid-cols-1">
          <FeatureCard title="Designed for real-time helpful data insights" />
          <FeatureCard title="Optimized for fast and flexible scheduling" />
          <FeatureCard title="Built for seamless team collaboration" />
        </div>
      </div>
    </section>
  );
};

export default Details;
