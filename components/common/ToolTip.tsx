import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const ToolTip = ({ content }: { content: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info size={16} />
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs w-max max-w-xs text-balance">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ToolTip;
