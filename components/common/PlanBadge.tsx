import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";
import { Badge } from "../ui/badge";

const PlanBadge = ({ plan }: { plan: string }) => {
  const planName =
    plan === "ProPlan" ? "Pro" : plan === "BasicPlan" ? "Basic" : "Free";

  return (
    <Badge
      variant={"outline"}
      className={cn(
        "ml-2 bg-linear-to-r from-amber-100 to-amber-200 border-amber-300 hidden sm:flex flex-row items-center",
        planName === "Free" && "from-red-100 to-red-200 border-red-300"
      )}
    >
      <Crown
        className={cn(
          "w-3 h-3 mr-1 text-amber-600",
          planName === "Free" && "text-red-600"
        )}
      />
      {planName}
    </Badge>
  );
};

export default PlanBadge;
