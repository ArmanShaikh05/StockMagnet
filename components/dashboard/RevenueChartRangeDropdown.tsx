import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type RangeOption = "This Week" | "This Month" | "This Year";

const RevenueChartRangeDropdown = ({
  range,
  setRange,
}: {
  range: string;
  setRange: Dispatch<SetStateAction<RangeOption>>;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{range}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Range</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={range}
          onValueChange={(value) => setRange(value as RangeOption)}
        >
          <DropdownMenuRadioItem value="This Week">
            This Week
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="This Month">
            This Month
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="This Year">
            This Year
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RevenueChartRangeDropdown;
