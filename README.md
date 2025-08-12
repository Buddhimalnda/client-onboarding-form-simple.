# Client Onboarding Form - Technical Assessment

A modern Next.js application for client onboarding featuring a beautiful glassmorphism design with comprehensive form validation. This project transforms a simple onboarding form into an interactive, responsive web application with advanced UI components and robust testing.

## 🎯 Project Overview

This project demonstrates modern web development practices by creating a client onboarding form that collects project requirements and client information. The application features a stunning landing page with animated backgrounds, professional form components, and seamless user experience across all devices.

### What This Project Does

1. **Landing Page**: Beautiful animated landing page with glassmorphism effects
2. **Client Onboarding**: Professional multi-step form for collecting client details
3. **Service Selection**: Interactive service selection (UI/UX, Branding, Web Dev, Mobile App)
4. **Validation**: Real-time form validation with comprehensive error handling
5. **Responsive Design**: Fully responsive design optimized for mobile and desktop
6. **Modern UX**: Calendar date picker, animated transitions, and loading states

## ✨ Features

- ✅ **Glassmorphism Design**: Modern UI with backdrop blur and transparency effects
- ✅ **Form Validation**: Zod schema validation with React Hook Form
- ✅ **shadcn/ui Components**: Professional UI components with Radix UI primitives
- ✅ **Calendar Integration**: Advanced date picker with shadcn Calendar component
- ✅ **Responsive Layout**: Mobile-first design with Tailwind CSS
- ✅ **Animation Effects**: Smooth transitions and micro-interactions
- ✅ **Testing Suite**: Comprehensive Jest unit tests (26 test cases)
- ✅ **Accessibility**: WCAG compliant with keyboard navigation
- ✅ **TypeScript**: Full type safety with TypeScript integration
- ✅ **Query Parameters**: Pre-fill form data from URL parameters
- ✅ **Dark Theme**: Beautiful dark theme with cyan/purple gradient accents

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation & Setup

1. **Clone the repository**:

```bash
git clone https://github.com/Buddhimalnda/client-onboarding-form-simple.git
cd client-onboarding-form-simple
```

2. **Install dependencies**:

```bash
# Using npm
npm install

# Using yarn (recommended)
yarn install
```

4. **Set up environment variables**:

```bash
# Copy environment template
cp .env.local.example .env.local
```

Edit `.env.local` file:

```bash
NEXT_PUBLIC_ONBOARD_URL=https://your-api-endpoint.com/api/onboard
```

5. **Run the development server**:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Testing

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test --coverage
```

## 🛠️ Tech Stack

### Core Technologies

- **Framework**: Next.js 15.4.6 (App Router with React 19)
- **Language**: TypeScript 5+ for full type safety
- **Styling**: Tailwind CSS 3.4.14 (downgraded from v4 for compatibility)
- **Form Management**: React Hook Form 7.62.0 with zodResolver
- **Validation**: Zod 4.0.17 for schema validation

### UI & Design

- **Component Library**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React for consistent iconography
- **Theme**: Custom dark theme with glassmorphism effects
- **Calendar**: react-day-picker 9.8.1 with date-fns 4.1.0
- **Animations**: CSS transitions and Tailwind animations

### Testing & Quality

- **Testing Framework**: Jest 30.0.5 with comprehensive test suite
- **Test Coverage**: 26 unit tests covering all validation scenarios
- **Code Quality**: ESLint and TypeScript strict mode
- **HTTP Client**: Native fetch API for form submissions

### Development Tools

- **Package Manager**: Yarn (recommended) or npm
- **Build Tool**: Next.js built-in Turbopack for fast development
- **Version Control**: Git with GitHub integration

## 🧪 Testing Strategy

### Jest Unit Testing

The project includes comprehensive unit tests focusing on the Zod validation schema:

```bash
# Test files location
lib/schemas/__tests__/onboarding.test.ts
```

**Test Coverage (26 Test Cases)**:

- ✅ Full name validation (length, characters, required)
- ✅ Email format validation
- ✅ Company name validation
- ✅ Services array validation (minimum selection)
- ✅ Budget validation (range, optional)
- ✅ Date validation (future dates only)
- ✅ Terms acceptance validation
- ✅ Data transformation testing

### Running Tests

```bash
# Run all tests
yarn test

# Watch mode for development
yarn test:watch

# Coverage report
yarn test --coverage

# Specific test file
yarn test onboarding.test.ts
```

### Test Examples

```typescript
describe("Onboarding Schema Validation", () => {
  it("should validate full name with proper format", () => {
    const result = onboardingSchema.safeParse({
      fullName: "John O'Connor-Smith",
      // ... other fields
    });
    expect(result.success).toBe(true);
  });
});
```

## 📋 Form Fields & Validation

| Field              | Type    | Validation Rules                                                         |
| ------------------ | ------- | ------------------------------------------------------------------------ |
| Full Name          | string  | Required, 2-80 chars, letters/spaces/'/- only                            |
| Email              | string  | Required, valid email format                                             |
| Company Name       | string  | Required, 2-100 chars                                                    |
| Services           | array   | Required, minimum 1 selection from: UI/UX, Branding, Web Dev, Mobile App |
| Budget (USD)       | number  | Optional, integer between 100-1,000,000                                  |
| Project Start Date | date    | Required, today or later                                                 |
| Accept Terms       | boolean | Required, must be checked                                                |

## 🎨 Design & Theming

### Glassmorphism Design System

- **Background**: Dark theme (#141414) with animated grid overlay
- **Glass Cards**: Backdrop blur with rgba transparency
- **Gradients**: Cyan to purple gradient accents (#06b6d4 → #d946ef)
- **Border Effects**: Subtle white borders with opacity variations

### Responsive Design

- **Mobile First**: Tailwind CSS mobile-first approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Typography**: Responsive text sizing and spacing
- **Navigation**: Adaptive navigation hiding on small screens

### shadcn/ui Components Used

```bash
# Core UI components installed
- button      # Custom styled buttons with variants
- card        # Glassmorphism container cards
- form        # React Hook Form integration
- input       # Text input with validation states
- calendar    # Date picker with popover
- popover     # Overlay containers
- checkbox    # Service selection checkboxes
- label       # Accessible form labels
- badge       # Service tags display
- alert       # Success/error messages
- separator   # Visual content dividers
```

### Custom CSS Features

```css
/* Glassmorphism effects in globals.css */
.backdrop-blur-16 {
  backdrop-filter: blur(16px);
}

/* Custom gradient backgrounds */
background: linear-gradient(45deg, #06b6d4, #d946ef);

/* Animated grid background */
animation: pulse 3s ease-in-out infinite;
```

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

## 📁 Project Structure

```
client-onboarding-form-simple/
├── 📁 app/                          # Next.js App Router
│   ├── favicon.ico                  # App favicon
│   ├── globals.css                  # Global styles with Tailwind
│   ├── layout.tsx                   # Root layout component
│   ├── page.module.css              # Page-specific styles
│   └── page.tsx                     # Main page (Landing + Form)
│
├── 📁 components/                   # React components
│   ├── 📁 onboarding/               # Onboarding-specific components
│   │   ├── OnboardingForm.tsx       # Main form with validation
│   │   ├── OnboardingFormWrapper.tsx# Suspense wrapper component
│   │   └── OnboardingLandingPage.tsx# Landing page with animations
│   ├── 📁 ui/                       # shadcn/ui components
│   │   ├── alert.tsx                # Alert messages
│   │   ├── button.tsx               # Button variants
│   │   ├── calendar.tsx             # Date picker calendar
│   │   ├── card.tsx                 # Container cards
│   │   ├── form.tsx                 # Form field components
│   │   ├── input.tsx                # Text input fields
│   │   ├── label.tsx                # Form labels
│   │   ├── popover.tsx              # Overlay containers
│   │   └── ...                      # Other UI components
│   └── theme-provider.tsx           # Theme context provider
│
├── 📁 lib/                          # Utility libraries
│   ├── 📁 schemas/                  # Zod validation schemas
│   │   ├── __tests__/               # Jest test files
│   │   │   └── onboarding.test.ts   # Schema validation tests
│   │   └── onboarding.ts            # Main validation schema
│   ├── utils.ts                     # Utility functions (cn, etc.)
│   └── ...                          # Other utility files
│
├── 📁 hooks/                        # Custom React hooks
│   └── useAlert.ts                  # Alert notification hook
│
├── 📁 public/                       # Static assets
│   ├── manifest.json               # PWA manifest
│   └── ...                         # Icons and static files
│
├── 📁 config/                       # Configuration files
│   └── 📁 model/                    # Type definitions
│       ├── index.ts                 # Exported types
│       └── ...                      # Model definitions
│
├── components.json                  # shadcn/ui configuration
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── jest.config.js                   # Jest testing configuration
├── package.json                     # Dependencies and scripts
└── README.md                        # Project documentation
```

### Key Files Explained

**Core Components**:

- `OnboardingLandingPage.tsx`: Animated landing page with glassmorphism design
- `OnboardingForm.tsx`: Main form with React Hook Form + Zod validation
- `OnboardingFormWrapper.tsx`: Suspense boundary for form loading

**Validation & Testing**:

- `lib/schemas/onboarding.ts`: Zod schema with comprehensive validation rules
- `lib/schemas/__tests__/onboarding.test.ts`: 26 unit tests covering all scenarios

**Styling & UI**:

- `app/globals.css`: Tailwind CSS with custom glassmorphism styles
- `components/ui/`: shadcn/ui components with custom styling
- `tailwind.config.ts`: Tailwind configuration with custom theme

## Assumptions

1. External API accepts JSON content type
2. Success response returns 2xx status code
3. Date picker uses native HTML date input
4. Budget field accepts whole numbers only
5. Services are predefined options (no custom input)

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Production deployment
vercel --prod
```

### Manual Deployment

```bash
# Build the application
yarn build

# Start production server
yarn start
```

## 🎯 Key Features Demonstrated

### 1. **Modern React Patterns**

- React Hook Form for performance-optimized forms
- Custom hooks for reusable logic
- Suspense boundaries for loading states
- TypeScript for type safety

### 2. **Advanced UI/UX**

- Glassmorphism design with backdrop-filter
- Smooth animations and micro-interactions
- Mobile-responsive design patterns
- Accessibility-first approach

### 3. **Professional Validation**

- Zod schema validation with custom rules
- Real-time error feedback
- Type-safe form data handling
- Comprehensive unit test coverage

### 4. **Modern Development Practices**

- Component-driven development
- Test-driven development (TDD)
- Mobile-first responsive design
- Git version control with meaningful commits

## 📖 Learning Resources

- **Next.js 15**: [Next.js Documentation](https://nextjs.org/docs)
- **React Hook Form**: [React Hook Form Guide](https://react-hook-form.com/)
- **Zod**: [Zod Documentation](https://zod.dev/)
- **shadcn/ui**: [shadcn/ui Components](https://ui.shadcn.com/)
- **Tailwind CSS**: [Tailwind Documentation](https://tailwindcss.com/docs)

## 👨‍💻 Author

**Buddhi malinda**  
GitHub: [Buddhimalnda](https://github.com/Buddhimalnda)  
Repository: [client-onboarding-form-simple](https://github.com/Buddhimalnda/client-onboarding-form-simple)
Wrbsite: [🌐](https://mrrulz.vercel.app)

---

_This project demonstrates modern web development skills including React 19, Next.js 15, TypeScript, advanced form handling, comprehensive testing, and professional UI design patterns._

## 📱 Available Scripts

```bash
# Development
yarn dev                 # Start development server (Turbopack)
yarn build              # Build for production
yarn start              # Start production server
yarn lint               # Run ESLint linter

# Testing
yarn test               # Run Jest unit tests
yarn test:watch         # Run tests in watch mode
yarn test --coverage    # Generate test coverage report

# Dependencies
yarn install           # Install all dependencies
yarn add <package>      # Add new dependency
yarn add -D <package>   # Add development dependency

# shadcn/ui Management
npx shadcn@latest init  # Initialize shadcn/ui
npx shadcn@latest add <component>  # Add UI component
npx shadcn@latest add calendar popover  # Add specific components
```

## 🌐 Browser Support

**Supported Browsers**:

- ✅ Chrome 88+ (Recommended)
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

**Features Required**:

- ES2020+ JavaScript support
- CSS Grid and Flexbox
- CSS Backdrop Filter (for glassmorphism)
- Modern fetch API

## 🔧 Configuration Files

### Tailwind CSS Configuration

```typescript
// tailwind.config.ts
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ... custom colors
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### Next.js Configuration

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbo: {
      // Turbopack configuration
    },
  },
};
```
