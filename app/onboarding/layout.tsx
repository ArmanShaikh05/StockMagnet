export const dynamic = "force-dynamic";

import { getCurrentUserDetails } from "@/actions/userActions";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUserDetails();

  if (!user) {
    return <RedirectToSignIn />;
  }

  if (user.onBoarded) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen w-full bg-main/70  flex items-center justify-center">
      {children}
    </main>
  );
};

export default layout;
