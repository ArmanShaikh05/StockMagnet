import React from "react";
import { Card } from "../ui/card";
import { Check, Sparkle } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const pricingData = [
  {
    name: "Basic",
    description:
      "For personal projects, startups or low-traffic basic websites.",
    price: 19,
    isMostPopular: false,
    features: [
      "Unlimited projects",
      "Unlimited storage",
      "24/7 support",
      "API access",
      "Custom branding",
    ],
  },
  {
    name: "Pro",
    description:
      "For fast growing startups and modern collaborative product teams.",
    price: 49,
    isMostPopular: true,
    features: [
      "Everything in Basic",
      "Priority support",
      "Advanced insights",
      "Custom monthly reports",
      "API Access",
    ],
  },
  {
    name: "Enterprise",
    description:
      "For big companies and enterprises with high traffic and custom needs.",
    price: 99,
    isMostPopular: false,
    features: [
      "Everything in Pro",
      "Single sign-on",
      "Custom SLA",
      "Custom integrations",
      "Custom reporting",
    ],
  },
];

const PricingCard = ({
  name,
  description,
  price,
  isMostPopular,
  features,
}: {
  name: string;
  description: string;
  price: number;
  isMostPopular: boolean;
  features: string[];
}) => {
  return (
    <Card
      className={`relative rounded-2xl  shadow-none flex flex-col justify-between py-8 px-7 gap-7 border ${
        isMostPopular && "border-main"
      }`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-2xl font-semibold text-foreground">{name}</h4>
          {isMostPopular && (
            <span className="rounded-full bg-main px-3 text-center text-sm font-semibold text-primary-foreground py-1 inline-flex items-center gap-1">
              <Sparkle size={16} className="fill-primary-foreground" />
              Popular
            </span>
          )}
        </div>
        <div>
          <span className="text-5xl font-semibold">${price}</span>
          <span className="text-muted-foreground font-semibold ml-2 text-xl">
            Monthly
          </span>
        </div>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="flex flex-col gap-8">
        <ul className="space-y-2">
          {features.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 p-1">
                <Check size={20} />
              </span>
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
        <Button className="font-semibold">
          <Link href={"/"}>Get Started</Link>
        </Button>
      </div>
    </Card>
  );
};

const Pricing = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 container">
        <div className="flex flex-col gap-2">
          <span className="font-bold text-main text-center">Pricing</span>
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-center sm:text-5xl max-w-2xl">
            Convenient pricing for companies at every stage
          </h2>
        </div>

        <p className="text-lg text-muted-foreground max-w-lg text-center sm:text-xl">
          Analyze data instantly, unlock insights with premium. Get started for
          free. Pay only for advanced features.
        </p>

        <div className=" mt-7 grid w-full grid-cols-1 lg:grid-cols-3 gap-5">
          {pricingData.map((item, index) => (
            <PricingCard
              key={index}
              name={item.name}
              description={item.description}
              price={item.price}
              isMostPopular={item.isMostPopular}
              features={item.features}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
