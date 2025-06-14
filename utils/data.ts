import type {
  BranchesType,
  InvoiceTableType,
  PricingDataType,
  TaxesType,
} from "@/types/types";

export const InvoicesData: InvoiceTableType[] = [
  {
    id: 1,
    customer: "Ravi Kumar",
    date: "2025-05-20",
    brand: "Samsung",
    quantity: 2,
    amount: 48000,
    status: "Full-Paid",
    product: {
      id: "prd001",
      image: "/stock.png",
      name: "Galaxy A54",
      category: "Smartphone",
    },
    mobile: "9876543210",
    payment: "UPI",
    gstBill: true,
  },
  {
    id: 2,
    customer: "Anjali Mehta",
    date: "2025-05-18",
    brand: "Apple",
    quantity: 1,
    amount: 75000,
    status: "Credited",
    product: {
      id: "prd002",
      image: "/stock.png",
      name: "iPhone 14",
      category: "Smartphone",
    },
    mobile: "9123456780",
    payment: "Bank",
    gstBill: false,
  },
  {
    id: 3,
    customer: "Mohit Sharma",
    date: "2025-05-15",
    brand: "Sony",
    quantity: 3,
    amount: 36000,
    status: "Not-Paid",
    product: {
      id: "prd003",
      image: "/stock.png",
      name: "Sony WH-1000XM4",
      category: "Headphones",
    },
    mobile: "9812345678",
    payment: "Cash",
    gstBill: true,
  },
  {
    id: 4,
    customer: "Sneha Agarwal",
    date: "2025-05-10",
    brand: "HP",
    quantity: 1,
    amount: 65000,
    status: "Full-Paid",
    product: {
      id: "prd004",
      image: "/stock.png",
      name: "HP Pavilion 15",
      category: "Laptop",
    },
    mobile: "9988776655",
    payment: "UPI",
    gstBill: true,
  },
  {
    id: 5,
    customer: "Amit Joshi",
    date: "2025-05-08",
    brand: "Lenovo",
    quantity: 2,
    amount: 88000,
    status: "Credited",
    product: {
      id: "prd005",
      image: "/stock.png",
      name: "Lenovo ThinkPad X1",
      category: "Laptop",
    },
    mobile: "9001122334",
    payment: "Bank",
    gstBill: false,
  },
  {
    id: 6,
    customer: "Anjali Mehta",
    date: "2025-05-18",
    brand: "Apple",
    quantity: 1,
    amount: 75000,
    status: "Credited",
    product: {
      id: "prd002",
      image: "/stock.png",
      name: "iPhone 14",
      category: "Smartphone",
    },
    mobile: "9123456780",
    payment: "Bank",
    gstBill: false,
  },
];

export const mockBranches: BranchesType[] = [
  {
    id: "branch_001",
    branchName: "Downtown HQ",
    branchAddress: "123 Main Street, New York, NY 10001",
    branchImage: "/features.png",
    createdAt: "2025-05-01T10:30:00Z",

    isPrimaryBranch: true,
  },
  {
    id: "branch_002",
    branchName: "Westside Office",
    branchAddress: "456 Sunset Blvd, Los Angeles, CA 90028",
    branchImage: "/features.png",
    createdAt: "2025-04-25T14:00:00Z",

    isPrimaryBranch: false,
  },
  {
    id: "branch_003",
    branchName: "Midtown Center",
    branchAddress: "789 Broadway, Chicago, IL 60610",
    branchImage: "/features.png",
    createdAt: "2025-03-15T09:15:00Z",

    isPrimaryBranch: false,
  },
  {
    id: "branch_004",
    branchName: "Tech Hub",
    branchAddress: "101 Silicon Avenue, San Jose, CA 95110",
    branchImage: "/features.png",
    createdAt: "2025-02-20T13:45:00Z",

    isPrimaryBranch: false,
  },
  {
    id: "branch_005",
    branchName: "East Bay Office",
    branchAddress: "202 Lakeside Dr, Oakland, CA 94612",
    branchImage: "/features.png",
    createdAt: "2025-01-10T11:20:00Z",

    isPrimaryBranch: false,
  },
];

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
