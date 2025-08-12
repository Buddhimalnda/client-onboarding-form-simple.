import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ChangeEvent,
} from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Home, User, Search, MessageCircle, LucideIcon } from "lucide-react";
import {
  OnboardingFormData,
  onboardingSchema,
  transformOnboardingData,
} from "@/lib/schemas/onboarding";
import OnboardingFormWrapper from "./OnboardingFormWrapper";
import { Button } from "../ui/button";

const serviceOptions = ["UI/UX", "Branding", "Web Dev", "Mobile App"] as const;
type ServiceOption = (typeof serviceOptions)[number];

// Form state type
interface FormState {
  fullName: string;
  email: string;
  companyName: string;
  services: string[];
  budgetUsd: number | undefined;
  projectStartDate: string;
  acceptTerms: boolean;
}

// Navigation item type
interface NavigationItem {
  icon: LucideIcon;
  label: string;
}

// Component Props Types
interface ServiceCheckboxProps {
  service: ServiceOption;
  checked: boolean;
  onChange: (service: ServiceOption, checked: boolean) => void;
}

interface FormInputProps {
  label: string;
  type?: "text" | "email" | "number" | "date";
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface SuccessPageProps {
  submittedData: OnboardingFormData;
  handleNewSubmission: () => void;
}

// Background Components
const AnimatedGrid: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className="absolute inset-0 opacity-10 md:opacity-20">
      <div className="grid grid-cols-10 md:grid-cols-20 gap-1 h-full w-full">
        {Array.from({ length: isMobile ? 200 : 400 }, (_, i) => (
          <div
            key={i}
            className="border border-cyan-500/20"
            style={{
              animation: `pulse ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${(i % 20) * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const GradientOverlay: React.FC = () => {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: "",
      }}
    />
  );
};

const DecorativeElements: React.FC = () => {
  return (
    <>
      <div className="absolute top-5 md:top-10 left-5 md:left-10 w-16 h-16 md:w-32 md:h-32 rounded-full bg-white opacity-10" />
      <div className="absolute bottom-10 md:bottom-20 right-10 md:right-20 w-12 h-12 md:w-24 md:h-24 rounded-lg bg-cyan-500 opacity-10 rotate-45" />
    </>
  );
};

// Navigation Component
const SideNavigation: React.FC = () => {
  const navigationItems: NavigationItem[] = [
    { icon: Home, label: "Home" },
    { icon: User, label: "User" },
    { icon: Search, label: "Search" },
    { icon: MessageCircle, label: "Messages" },
  ];

  return (
    <div className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 space-y-4 md:space-y-8 z-20 hidden sm:flex sm:flex-col">
      {navigationItems.map(({ icon: Icon, label }, index) => (
        <div
          key={index}
          className="p-2 md:p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer group"
          title={label}
        >
          <Icon className="w-4 h-4 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
        </div>
      ))}
    </div>
  );
};

// About Section Component
const AboutSection: React.FC = () => {
  return (
    <div className="absolute left-4 md:left-8 bottom-4 md:bottom-8 max-w-xs md:max-w-sm z-20">
      <div
        style={{
          backdropFilter: "blur(16px)",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "16px md:24px",
        }}
        className="transform hover:scale-105 transition-all duration-300 p-4 md:p-6"
      >
        <h2 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-4">About Us</h2>
        <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s,
        </p>
        <button className="px-4 md:px-6 py-2 md:py-3 bg-white/20 text-white rounded-lg backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all hover:scale-105 text-sm md:text-base">
          Find Us
        </button>
      </div>
    </div>
  );
};

// Header Component
const Header = ({ onAction }: { onAction: () => void }) => {
  return (
    <div className="flex items-center justify-center flex-col transform text-center z-20 px-4 md:px-0">
      <h1
        className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 animate-pulse text-center leading-tight"
        style={{
          fontFamily: "monospace",
          letterSpacing: "1px",
          background: "linear-gradient(45deg, #06b6d4, #d946ef)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Do you want to Onboard
      </h1>
      {/* <p className="text-xl text-gray-300 animate-fade-in">Fill this form</p> */}
      {/* btn for onboard */}
      <Button
        onClick={onAction}
        className="mt-4 bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 px-6 md:px-8 py-2 md:py-3 text-sm md:text-base"
      >
        Get Started
      </Button>
    </div>
  );
};

// Main Component
const OnboardingLandingPage: React.FC = () => {
  const [onBoarding, setOnBoarding] = useState(false);

  return (
    <div
      className="min-h-screen overflow-hidden relative flex items-center justify-center p-4 md:p-0"
      style={{ backgroundColor: "#141414" }}
    >
      <AnimatedGrid />
      <GradientOverlay />
      <DecorativeElements />
      <SideNavigation />
      {!onBoarding && (
        <AboutSection />
      )}

      {onBoarding ? (
        <OnboardingFormWrapper onBack={() => setOnBoarding(false)} />
      ) : (
        <Header onAction={() => setOnBoarding(true)} />
      )}
    </div>
  );
};

export default OnboardingLandingPage;
