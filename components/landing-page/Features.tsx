import { Brain, ChartBar, LayoutDashboard, Zap } from "lucide-react";
import React from "react";
import { Card } from "../ui/card";
import Image from "next/image";

const SmallFeatureCrad = ({
  Icon,
  title,
  description,
}: {
  Icon: React.ElementType;
  title: string;
  description: string;
}) => {
  return (
    <Card className="rounded-2xl p-6 flex flex-col gap-2 border shadow-none">
      <div className="items-center gap-2 flex">
        <Icon className="h-5 w-5" />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm">{description}</p>
    </Card>
  );
};

const Features = () => {
  return (
    <section className="relative overflow-hidden bg-background py-20">
      <div className="container max-w-7xl mx-auto  flex gap-20 flex-col lg:flex-row lg:items-end">
        <div className="flex-1 flex flex-col gap-7">
          <div className="flex  flex-col gap-2">
            <span className="font-bold text-main text-left ">Features</span>
            <h1 className=" sm:text-5xl text-3xl tracking-tight text-balance font-semibold">
              Turn your data into Actionable Insights
            </h1>
          </div>

          <p className="text-muted-foreground text-lg flex-1">
            Empower your business with real-time analytics, advanced reporting,
            and intuitive data dashboards.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <SmallFeatureCrad
              Icon={Zap}
              title="Real-Time Tracking"
              description="Monitor key performance indicators across channels."
            />
            <SmallFeatureCrad
              Icon={Brain}
              title="Predictive Insights"
              description="Leverage AI-powered customer predictions."
            />
            <SmallFeatureCrad
              Icon={LayoutDashboard}
              title="Custom Dashboards"
              description="Create personalized visualizations that matter."
            />
            <SmallFeatureCrad
              Icon={ChartBar}
              title="Advanced Reports"
              description="Generate detailed reports with just one click."
            />
          </div>
        </div>

        <div className="relative flex-1 bg-main rounded-2xl p-10 flex justify-center items-center">
          <Image
            src={"/features.png"}
            alt="features image"
            height={500}
            width={500}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
