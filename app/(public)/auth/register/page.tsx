"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/hooks/useAlert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthService } from "@/lib/services/auth.service";
import { RegisterRequest } from "@/utils/types/auth";

const formSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastname: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." }),
  email: z
    .string()
    .min(2, { message: "Email must be at least 2 characters." })
    .email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(20, { message: "Password must be at most 20 characters." }),
  nic: z.string().min(10, { message: "NIC must be at least 10 characters." }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters." })
    .optional()
    .or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  branch: z.string().optional().or(z.literal("")),
  role: z.enum(["USER", "ADMIN", "MODERATOR"]),
});

const Register = () => {
  // 1. Define a form schema.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      nic: "",
      phone: "",
      address: "",
      branch: "",
      role: "USER",
    },
  });

  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const alert = useAlert();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);

    try {
      if (submitBtnRef.current) {
        submitBtnRef.current.disabled = true;
      } else {
        setError("Submit button is not found");
        setLoading(false);
        return;
      }

      // Prepare registration data
      const registerData: RegisterRequest = {
        firstname: values.firstname,
        lastname: values.lastname,
        username: values.username,
        email: values.email,
        password: values.password,
        nic: values.nic,
        phone: values.phone || "",
        address: values.address || "",
        branch: values.branch || "",
        role: values.role,
        loginType: "EMAIL",
        recaptchaToken: "", // Add reCAPTCHA if needed
      };

      const response = await AuthService.register(registerData);

      if (response) {
        alert.success(
          "Registration Successful",
          "Account created successfully! Please check your email for verification.",
          8000
        );

        // Navigate to login or dashboard based on your flow
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError("Registration failed");
        alert.error(
          "Registration Failed",
          "Failed to create account. Please try again.",
          5000
        );
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
      alert.error("Registration Failed", errorMessage, 5000);

      if (submitBtnRef.current) {
        submitBtnRef.current.disabled = false;
      }
    }
    setLoading(false);
  }

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      alert.info(
        "Coming soon",
        "Google registration will be available soon...",
        5000
      );
    } catch (error) {
      console.error(error);
      setError("Google registration failed");
      alert.error("Registration Failed", "Google registration failed", 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-primary py-8">
      <div className="m-3 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-primary-foreground mb-4">
          Join Us Today!
        </h1>
        <p className="text-primary-foreground text-lg mb-8">
          Create your account to get started
        </p>

        {error && (
          <Label className="mb-4 text-red-300 bg-red-900/20 px-3 py-2 rounded">
            {error}
          </Label>
        )}

        <div className="bg-secondary p-8 rounded-lg shadow-lg sm:w-[500px] max-sm:w-full text-black">
          <h2 className="text-2xl font-bold mb-6">Create Account</h2>
          <p className="text-red-600">{error}</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          {...field}
                          className="text-dark"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          {...field}
                          className="text-dark"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe"
                        {...field}
                        className="text-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                        className="text-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="text-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* NIC */}
              <FormField
                control={form.control}
                name="nic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIC Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456789V"
                        {...field}
                        className="text-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone and Role */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+94 70 123 4567"
                          {...field}
                          className="text-dark"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-dark">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="MODERATOR">Moderator</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main Street, Colombo"
                        {...field}
                        className="text-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Branch */}
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Colombo Branch"
                        {...field}
                        className="text-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full text-light"
                variant="default"
                disabled={loading}
                ref={submitBtnRef}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          <div className="my-6 flex justify-between items-center">
            <Button
              variant="link"
              className="p-0 h-auto text-sm text-muted-foreground hover:text-primary"
              onClick={() => router.push("/auth/login")}
            >
              Already have an account? Login
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              className="text-primary"
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <GoogleIcon className="mr-2 h-5 w-5" />
              Sign up with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
