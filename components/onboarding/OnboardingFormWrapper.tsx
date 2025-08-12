"use client";

import { Suspense } from "react";
import OnboardingForm from "./OnboardingForm";

function OnboardingFormWrapper({ onBack }: { onBack: () => void }) {
  return (
    <Suspense
      fallback={
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div
            style={{
              backdropFilter: "blur(16px)",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "24px",
            }}
            className="text-center max-w-xs md:max-w-sm mx-auto"
          >
            <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-white text-sm md:text-base">Loading form...</p>
          </div>
        </div>
      }
    >
      <OnboardingForm onBack={onBack} />
    </Suspense>
  );
}

export default OnboardingFormWrapper;
