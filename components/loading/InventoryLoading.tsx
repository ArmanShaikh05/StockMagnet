import React from "react";
import { Skeleton } from "../ui/skeleton";

const TableLoading = () => {
  return (
    <div className="w-full h-full flex flex-col gap-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 w-full md:w-[30%]">
          <Skeleton className="h-10  bg-gray-200/80 flex grow" />
          <Skeleton className="w-10 h-10 rounded-lg bg-gray-200/80" />
        </div>

        <div className="w-full flex gap-4 px-2 md:w-[40%]">
          <Skeleton className="h-10  bg-gray-200/80 flex grow md:block" />
          <Skeleton className="h-10  bg-gray-200/80 flex grow md:block" />
          <Skeleton className="h-10  bg-gray-200/80 flex grow md:block" />
        </div>
      </div>

      <Skeleton className="w-full h-[500px] bg-gray-200/80" />
    </div>
  );
};

export default TableLoading;
