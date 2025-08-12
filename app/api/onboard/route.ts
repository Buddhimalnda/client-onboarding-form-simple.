// app/api/onboarding/route.ts
import { onboardingSchema } from '@/lib/schemas/onboarding';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for the incoming data

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the data
    const validatedData = onboardingSchema.parse(body);
    
    // Log the received data (in production, you might want to save to database)
    console.log('Received onboarding form submission:', {
      timestamp: new Date().toISOString(),
      data: validatedData,
    });

    // Simulate processing time (optional - remove in production)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notifications
    // 3. Create user account
    // 4. Trigger workflows
    
    // For now, we'll just return success
    return NextResponse.json(
      {
        success: true,
        message: "Onboarding form submitted successfully!",
        data: {
          id: `onboard_${Date.now()}`, // Generate a simple ID
          submittedAt: new Date().toISOString(),
          status: "received",
        },
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error processing onboarding form:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again.",
        error: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { message: "Method not allowed. Use POST to submit form data." },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: "Method not allowed. Use POST to submit form data." },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: "Method not allowed. Use POST to submit form data." },
    { status: 405 }
  );
}