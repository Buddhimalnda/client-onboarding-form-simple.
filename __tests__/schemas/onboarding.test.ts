import { describe, test, expect } from '@jest/globals';
import { onboardingSchema, transformOnboardingData } from "@/lib/schemas/onboarding";

describe("Onboarding Schema Validation", () => {
  // Valid data for testing
  const validData = {
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    companyName: "Analytical Engines Ltd",
    services: ["UI/UX", "Web Dev"],
    budgetUsd: 50000,
    projectStartDate: "2025-09-01",
    acceptTerms: true,
  };

  test("validates correct data successfully", () => {
    const result = onboardingSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  describe("Full Name Validation", () => {
    test("rejects empty full name", () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        fullName: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Full name is required");
      }
    });

    test("rejects full name under 2 characters", () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        fullName: "A",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Full name must be at least 2 characters");
      }
    });

    test("rejects full name over 80 characters", () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        fullName: "A".repeat(81),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Full name must not exceed 80 characters");
      }
    });

    test("rejects invalid characters in full name", () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        fullName: "John123 Doe",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Full name can only contain letters, spaces, apostrophes, and hyphens"
        );
      }
    });

    test("accepts valid characters (letters, spaces, apostrophe, hyphen)", () => {
      const validNames = [
        "Mary O'Connor",
        "Jean-Pierre Smith",
        "Ana Maria Lopez",
        "John Doe Jr",
      ];

      validNames.forEach((name) => {
        const result = onboardingSchema.safeParse({
          ...validData,
          fullName: name,
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Email Validation", () => {
    test("rejects invalid email formats", () => {
      const invalidEmails = ["notanemail", "@domain.com", "user@", "user@domain"];
      
      invalidEmails.forEach((email) => {
        const result = onboardingSchema.safeParse({
          ...validData,
          email,
        });
        expect(result.success).toBe(false);
      });
    });

    test("accepts valid email formats", () => {
      const validEmails = [
        "user@domain.com",
        "user+tag@domain.co.uk",
        "user.name@domain-name.com",
      ];

      validEmails.forEach((email) => {
        const result = onboardingSchema.safeParse({
          ...validData,
          email,
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Company Name Validation", () => {
    test("rejects empty company name", () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        companyName: "",
      });
      expect(result.success).toBe(false);
    });

    test("rejects company name under 2 characters", () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        companyName: "A",
      });
      expect(result.success).toBe(false);
    });

    test("rejects company name over 100 characters", () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        companyName: "A".repeat(101),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Services Validation", () => {
    test("rejects empty services array", () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        services: [],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Please select at least one service");
      }
    });

    test("rejects invalid service options", () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        services: ["Invalid Service"],
      });
      expect(result.success).toBe(false);
    });

    test("accepts valid service combinations", () => {
      const validServices = [
        ["UI/UX"],
        ["Branding", "Web Dev"],
        ["UI/UX", "Branding", "Web Dev", "Mobile App"],
      ];

      validServices.forEach((services) => {
        const result = onboardingSchema.safeParse({
          ...validData,
          services,
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Budget Validation", () => {
    test("accepts undefined budget (optional field)", () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        budgetUsd: undefined,
      });
      expect(result.success).toBe(true);
    });

    test("rejects budget below minimum", () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        budgetUsd: 99,
      });
      expect(result.success).toBe(false);
    });

    test("rejects budget above maximum", () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        budgetUsd: 1000001,
      });
      expect(result.success).toBe(false);
    });

    test("accepts valid budget range", () => {
      const validBudgets = [100, 1000, 50000, 1000000];

      validBudgets.forEach((budget) => {
        const result = onboardingSchema.safeParse({
          ...validData,
          budgetUsd: budget,
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Project Start Date Validation", () => {
    test("rejects past dates", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const result = onboardingSchema.safeParse({
        ...validData,
        projectStartDate: yesterday.toISOString().split("T")[0],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Project start date must be today or later");
      }
    });

    test("accepts today's date", () => {
      const today = new Date().toISOString().split("T")[0];
      
      const result = onboardingSchema.safeParse({
        ...validData,
        projectStartDate: today,
      });
      expect(result.success).toBe(true);
    });

    test("accepts future dates", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const result = onboardingSchema.safeParse({
        ...validData,
        projectStartDate: tomorrow.toISOString().split("T")[0],
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Accept Terms Validation", () => {
    test("rejects when terms not accepted", () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        acceptTerms: false,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("You must accept the terms and conditions");
      }
    });

    test("accepts when terms are accepted", () => {
      const result = onboardingSchema.safeParse({
        ...validData,
        acceptTerms: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Data Transformation", () => {
    test("transforms empty string budget to undefined", () => {
      const dataWithEmptyBudget = {
        ...validData,
        budgetUsd: "",
      };
      
      const transformed = transformOnboardingData(dataWithEmptyBudget);
      expect(transformed.budgetUsd).toBeUndefined();
    });

    test("transforms string budget to number", () => {
      const dataWithStringBudget = {
        ...validData,
        budgetUsd: "50000",
      };
      
      const transformed = transformOnboardingData(dataWithStringBudget);
      expect(transformed.budgetUsd).toBe(50000);
      expect(typeof transformed.budgetUsd).toBe("number");
    });

    test("preserves other fields unchanged", () => {
      const transformed = transformOnboardingData(validData);
      expect(transformed.fullName).toBe(validData.fullName);
      expect(transformed.email).toBe(validData.email);
      expect(transformed.companyName).toBe(validData.companyName);
      expect(transformed.services).toEqual(validData.services);
      expect(transformed.projectStartDate).toBe(validData.projectStartDate);
      expect(transformed.acceptTerms).toBe(validData.acceptTerms);
    });
  });
});
