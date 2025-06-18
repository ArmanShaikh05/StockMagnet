import type { PricingDataType, TaxesType } from "@/types/types";

export const pricingData: PricingDataType[] = [
  {
    name: "Free",
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
    paymentLink: "https://buy.stripe.com/test_9AQg1X12keqzf2UfYZ",
    priceId: "price_1RL38ZPZo4NGp7MuqlyNLLVO",
  },
  {
    name: "Basic",
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
    paymentLink: "https://buy.stripe.com/test_9AQg1X12keqzf2UfYZ",
    priceId: "price_1RL38ZPZo4NGp7MuqlyNLLVO",
  },
  {
    name: "Pro",
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
    paymentLink: "https://buy.stripe.com/test_9AQg1X12keqzf2UfYZ",
    priceId: "price_1RL38ZPZo4NGp7MuqlyNLLVO",
  },
];

export const taxData: TaxesType[] = [
  {
    label: "GST@0%",
    value: 0.0,
  },
  {
    label: "IGST@0%",
    value: 0.0,
  },
  {
    label: "GST@0.25%",
    value: 0.25,
  },
  {
    label: "IGST@0.25%",
    value: 0.25,
  },
  {
    label: "GST@3%",
    value: 3.0,
  },
  {
    label: "IGST@3%",
    value: 3.0,
  },
  {
    label: "GST@5%",
    value: 5.0,
  },
  {
    label: "IGST@5%",
    value: 5.0,
  },
  {
    label: "GST@12%",
    value: 12.0,
  },
  {
    label: "IGST@12%",
    value: 12.0,
  },
  {
    label: "GST@18%",
    value: 18.0,
  },
  {
    label: "IGST@18%",
    value: 18.0,
  },
  {
    label: "GST@28%",
    value: 28.0,
  },
  {
    label: "IGST@28%",
    value: 28.0,
  },
];
