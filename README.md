# Client Onboarding Form - Technical Assessment

A Next.js application for client onboarding with React Hook Form validation using Zod. This form collects client information and project requirements for service onboarding.

## Features

- ✅ Form validation with Zod schema
- ✅ React Hook Form integration
- ✅ Inline error messages
- ✅ Accessibility (keyboard navigation, labels, focus states)
- ✅ Submit state management (disable while submitting)
- ✅ Success/error handling
- ✅ Responsive design with Tailwind CSS
- ✅ Environment variable configuration
- ✅ **Bonus**: Pre-fill from query parameters
- ✅ **Bonus**: Unit tests for Zod schema

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd client-onboarding-form-simple
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

4. Configure the onboarding endpoint in `.env.local`:

```bash
NEXT_PUBLIC_ONBOARD_URL=https://example.com/api/onboard
```

5. Run the development server:

```bash
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Form Management**: React Hook Form 7.62.0
- **Validation**: Zod 4.0.17 + @hookform/resolvers
- **Styling**: Tailwind CSS 3.4.14
- **UI Components**: Radix UI primitives
- **HTTP Client**: Native fetch API

## Form Fields & Validation

| Field              | Type    | Validation Rules                                                         |
| ------------------ | ------- | ------------------------------------------------------------------------ |
| Full Name          | string  | Required, 2-80 chars, letters/spaces/'/- only                            |
| Email              | string  | Required, valid email format                                             |
| Company Name       | string  | Required, 2-100 chars                                                    |
| Services           | array   | Required, minimum 1 selection from: UI/UX, Branding, Web Dev, Mobile App |
| Budget (USD)       | number  | Optional, integer between 100-1,000,000                                  |
| Project Start Date | date    | Required, today or later                                                 |
| Accept Terms       | boolean | Required, must be checked                                                |

## React Hook Form + Zod Integration

The form uses `zodResolver` to integrate Zod schema validation with React Hook Form:

```typescript
const form = useForm<OnboardingFormData>({
  resolver: zodResolver(onboardingSchema),
  defaultValues: {
    services: [],
    acceptTerms: false,
  },
});
```

### Key Implementation Details

1. **Schema Definition**: Located in `lib/schemas/onboarding.ts`
2. **Form Component**: `components/onboarding/OnboardingForm.tsx`
3. **Validation**: Real-time validation with inline error messages
4. **Submission**: POST to external API with proper error handling

## Environment Variables

- `NEXT_PUBLIC_ONBOARD_URL`: External API endpoint for form submission

## Form Submission

The form submits data as JSON to the configured endpoint:

```json
{
  "fullName": "Ada Lovelace",
  "email": "ada@example.com",
  "companyName": "Analytical Engines Ltd",
  "services": ["UI/UX", "Web Dev"],
  "budgetUsd": 50000,
  "projectStartDate": "2025-09-01",
  "acceptTerms": true
}
```

## Query Parameter Pre-filling (Bonus Feature)

The form supports pre-filling fields via URL query parameters:

- `?service=UI%2FUX` - Pre-selects a service (UI/UX, Branding, Web Dev, Mobile App)
- `?email=user@example.com` - Pre-fills email field
- `?company=Company%20Name` - Pre-fills company name
- `?name=John%20Doe` - Pre-fills full name

Example: `http://localhost:3000?service=UI%2FUX&email=ada@example.com&company=Tech%20Corp`

## Success & Error Handling

- **Success (2xx)**: Shows success message with submission summary
- **Error (non-2xx/network)**: Displays user-friendly error message
- **Loading State**: Submit button disabled with loading text

## Accessibility Features

- Semantic HTML with proper labels
- Keyboard navigation support
- Focus management and visible focus states
- ARIA attributes for screen readers
- Error messages associated with form fields

## Project Structure

```
components/
  onboarding/
    OnboardingForm.tsx     # Main form component
  ui/                      # Reusable UI components
lib/
  schemas/
    onboarding.ts          # Zod validation schema
app/
  page.tsx                 # Main page with onboarding form
  layout.tsx               # Root layout
```

## Assumptions

1. External API accepts JSON content type
2. Success response returns 2xx status code
3. Date picker uses native HTML date input
4. Budget field accepts whole numbers only
5. Services are predefined options (no custom input)

## Known Limitations

- External API endpoint is placeholder (returns network error)
- No file upload functionality
- Basic styling (can be enhanced for production)
- No server-side validation backup

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn test` - Run Jest unit tests
- `yarn test:watch` - Run Jest tests in watch mode

## Browser Support

- Modern browsers with ES2020+ support
- Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
