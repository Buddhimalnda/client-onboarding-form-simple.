"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";
import {
  onboardingSchema,
  transformOnboardingData,
  type OnboardingFormData,
} from "@/lib/schemas/onboarding";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Status } from "@/config/model";
import { useAlert } from "@/hooks/useAlert";
import { useAppDispatch } from "@/store/hooks";
import { CheckCircle2, Loader2 } from "lucide-react";

const serviceOptions = ["UI/UX", "Branding", "Web Dev", "Mobile App"] as const;

export default function OnboardingForm({ onBack }: { onBack: () => void }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<OnboardingFormData | null>(
    null
  );
  const searchParams = useSearchParams();

  // alert
  const alert = useAlert();
  // Memoized service options
  const servicesList = useMemo(() => [...serviceOptions], []);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      companyName: "",
      services: [],
      budgetUsd: undefined,
      projectStartDate: "",
      acceptTerms: false,
    },
  });

  // Pre-fill from query parameters
  useEffect(() => {
    const service = searchParams.get("service");
    const email = searchParams.get("email");
    const company = searchParams.get("company");
    const name = searchParams.get("name");

    if (service && serviceOptions.includes(service as any)) {
      form.setValue("services", [service as (typeof serviceOptions)[number]]);
    }
    if (email) {
      form.setValue("email", email);
    }
    if (company) {
      form.setValue("companyName", company);
    }
    if (name) {
      form.setValue("fullName", name);
    }
  }, [searchParams, form]);

  const handleSubmit = useCallback(
    async (data: OnboardingFormData) => {
      setLoading(true);

      try {
        const transformedData = transformOnboardingData(data);
        const onboardUrl = process.env.NEXT_PUBLIC_ONBOARD_URL;

        if (!onboardUrl) {
          throw new Error("Onboarding URL not configured");
        }

        const response = await fetch(onboardUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transformedData),
        });

        if (!response.ok) {
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }

        setSubmittedData(transformedData);
        setSubmitSuccess(true);

        alert.success("Success", "Onboarding form submitted successfully!");

        form.reset();
      } catch (error: any) {
        alert.error(
          "Error",
          error.message || "An unexpected error occurred. Please try again."
        );
        console.error("Error submitting onboarding form:", error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, form, alert]
  );

  const handleNewSubmission = useCallback(() => {
    setSubmitSuccess(false);
    setSubmittedData(null);
    form.reset();
  }, [form]);

  // Get today's date in YYYY-MM-DD format for min date
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  if (submitSuccess && submittedData) {
    return (
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <Card
          className="w-full max-w-md mx-auto border-white/10 shadow-2xl animate-fade-in"
          style={{
            backdropFilter: "blur(16px)",
            background: "rgba(255, 255, 255, 0.05)",
          }}
        >
          <CardHeader className="border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              <div>
                <CardTitle
                  className="text-3xl font-bold"
                  style={{
                    background: "linear-gradient(45deg, #06b6d4, #d946ef)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Success!
                </CardTitle>
                <CardDescription className="text-gray-300 mt-1">
                  Your onboarding form has been submitted successfully.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <Label className="text-white font-semibold text-base mb-4 block">
                  Submission Summary
                </Label>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-cyan-400 font-medium">Name:</Label>
                    <span className="text-gray-300">
                      {submittedData.fullName}
                    </span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between items-center">
                    <Label className="text-cyan-400 font-medium">Email:</Label>
                    <span className="text-gray-300">{submittedData.email}</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between items-center">
                    <Label className="text-cyan-400 font-medium">
                      Company:
                    </Label>
                    <span className="text-gray-300">
                      {submittedData.companyName}
                    </span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between items-start">
                    <Label className="text-cyan-400 font-medium">
                      Services:
                    </Label>
                    <div className="flex flex-wrap gap-1 max-w-48">
                      {submittedData.services.map((service) => (
                        <Badge
                          key={service}
                          variant="secondary"
                          className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {submittedData.budgetUsd && (
                    <>
                      <Separator className="bg-white/10" />
                      <div className="flex justify-between items-center">
                        <Label className="text-cyan-400 font-medium">
                          Budget:
                        </Label>
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 text-emerald-300"
                        >
                          ${submittedData.budgetUsd.toLocaleString()}
                        </Badge>
                      </div>
                    </>
                  )}
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between items-center">
                    <Label className="text-cyan-400 font-medium">
                      Start Date:
                    </Label>
                    <span className="text-gray-300">
                      {submittedData.projectStartDate}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleNewSubmission}
                className="w-full text-white border-0 hover:scale-105 transition-all duration-300"
                style={{
                  background: "linear-gradient(45deg, #06b6d4, #d946ef)",
                }}
                size="lg"
              >
                Submit Another Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
      <Card
        className="w-full max-w-2xl mx-auto border-white/10 shadow-2xl animate-fade-in"
        style={{
          backdropFilter: "blur(16px)",
          background: "rgba(255, 255, 255, 0.05)",
        }}
      >
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              onReset={() => form.reset()}
              className="space-y-6"
            >
              {/* Personal Information Section */}
              <div className="space-y-4">
                <Label className="text-white font-semibold text-lg">
                  Personal Information
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your full name"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 h-11"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email address"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 h-11"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Company Information Section */}
              <div className="space-y-4">
                <Label className="text-white font-semibold text-lg">
                  Company Information
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          Company Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your company name"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 h-11"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budgetUsd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200 font-medium">
                          Budget (USD)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="100"
                            max="1000000"
                            step="1"
                            placeholder="Optional - minimum $100"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 h-11"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === "" ? undefined : Number(value)
                              );
                            }}
                            value={field.value || ""}
                          />
                        </FormControl>
                        {/* <FormDescription className="text-gray-400">
                          This helps us recommend the best solution for your
                          needs.
                        </FormDescription> */}
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Project Details Section */}
              <div className="space-y-4">
                <Label className="text-white font-semibold text-lg">
                  Project Details
                </Label>

                <FormField
                  control={form.control}
                  name="projectStartDate"
                  render={({ field }) => (
                    <FormItem className="max-w-sm">
                      <FormLabel className="text-gray-200 font-medium">
                        Project Start Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          min={today}
                          className="bg-white/10 border-white/20 text-white focus:border-cyan-400 focus:ring-cyan-400/20 h-11 [&::-webkit-calendar-picker-indicator]:invert"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        When would you like to start the project?
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="services"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-gray-200 font-medium text-base">
                        Services Interested In
                      </FormLabel>
                      <FormDescription className="text-gray-400 mb-4">
                        Select all services that apply to your project.
                      </FormDescription>
                      <div className="grid grid-cols-2 gap-4">
                        {servicesList.map((service) => (
                          <FormField
                            key={service}
                            control={form.control}
                            name="services"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={service}
                                  className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(service)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              service,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== service
                                              )
                                            );
                                      }}
                                      className="border-white/30 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:text-white"
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-medium text-gray-200 cursor-pointer">
                                    {service}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="bg-white/10" />

              {/* Terms and Conditions */}
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-white/30 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:text-white mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="text-white font-medium cursor-pointer">
                          I accept the terms and conditions
                        </FormLabel>
                        <AlertDescription className="text-gray-400">
                          You agree to our Terms of Service and Privacy Policy.
                          We'll use this information to provide you with the
                          best possible service.
                        </AlertDescription>
                      </div>
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 items-center pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
                  size="lg"
                  onClick={() => onBack()}
                >
                  Back
                </Button>
                <Button
                  type="reset"
                  variant="destructive"
                  className="w-full sm:w-auto bg-red-900/5 border-white/20 text-gray-300  hover:text-white transition-all duration-300"
                  size="lg"
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto text-white border-0 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-48"
                  style={{
                    background: loading
                      ? "rgba(255, 255, 255, 0.1)"
                      : "linear-gradient(45deg, #06b6d4, #d946ef)",
                  }}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
