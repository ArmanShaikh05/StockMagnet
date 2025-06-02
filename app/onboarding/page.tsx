import { getCurrentUserDetails } from "@/actions/userActions";
import OnboardingComponent from "@/components/onboarding/OnBoardingComponent";
import React from "react";

const OnBoarding = async () => {
  const user = await getCurrentUserDetails();
  return (
    <OnboardingComponent
      firstName={user?.firstName || ""}
      lastName={user?.lastName || ""}
      id={user?.id || ""}
    />
  );
};

export default OnBoarding;
