import React from "react";
// import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const BranchesLoading = () => {
  return (
    <div className="grid gird-cols-1 sm:grid-cols-2 w-full gap-10 lg:grid-cols-3">
      {Array.from({ length: 4 }).map((item, index) => (
        // <Card key={index}>
        //   <CardContent className="h-max">
        //     <Skeleton className="w-full h-[200px]" />
        //     <Skeleton className="mt-4 w-[50%] h-4" />
        //     <Skeleton className="mt-4 w-[95%] h-6" />
        //     <Skeleton className="mt-16 w-[30%] h-4" />
        //   </CardContent>
        // </Card>
        <Skeleton key={index} className="h-max w-full p-6 bg-gray-100/70">
          <Skeleton className="w-full h-[200px] bg-gray-200/80" />
          <Skeleton className="mt-4 w-[50%] h-6  bg-gray-200/80" />
          <Skeleton className="mt-4 w-[95%] h-6  bg-gray-200/80" />
          <Skeleton className="mt-16 w-[40%] h-10 bg-gray-200/80" />
        </Skeleton>
        // <Skeleton key={index} className="h-max w-full p-6 bg-main/10">
        //   <Skeleton className="w-full h-[200px] bg-main/20" />
        //   <Skeleton className="mt-4 w-[50%] h-6  bg-main/20" />
        //   <Skeleton className="mt-4 w-[95%] h-6  bg-main/20" />
        //   <Skeleton className="mt-16 w-[40%] h-10 bg-main/20" />
        // </Skeleton>
      ))}
    </div>
  );
};

export default BranchesLoading;
