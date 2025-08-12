"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import { auth } from "@/lib/firebase";
import { Piority, Status } from "@/config/model";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/hooks/useAlert";
const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .email({
      message: "Invalid email address.",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(20, { message: "Password must be at most 20 characters." }),
});

const Login = () => {
  // 1. Define a form schema.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
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
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
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
      const res = await auth.login(values.email, values.password);
      console.log("Login response:", res);
      if (res != null && res != undefined) {
        alert.success(
          "Success Logged",
          "You have successfully logged in. You will be redirected shortly.",
          5000
        );
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        setError("Invalid Credentials");
        alert.error("Login Failed", "Invalid Credentials", 5000);
      }
    } catch (error) {
      console.error(error);
      setError("Email is not registered");
      alert.error("Login Failed", "Email is not registered", 5000);
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
      alert.info("Coming soon", "Please wait...", 5000);
    } catch (error) {
      console.error(error);
      setError("Google login failed");
      alert.error("Login Failed", "Google login failed", 5000);
      setLoading(false);
    }
  };
  return (
    <div className="h-screen w-full flex justify-center items-center bg-primary">
      <div className="m-3 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-primary-foreground mb-4">
          Welcome Back!
        </h1>
        <p className="text-primary-foreground text-lg mb-8">
          Please login to your account
        </p>
        {error && <Label className="mb-4">{error}</Label>}
        <div className="bg-secondary p-8 rounded-lg shadow-lg sm:w-[400px] max-sm:w-full text-black">
          <h2 className="text-2xl font-bold mb-6">Login</h2>
          <p className="text-red-600">{error}</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your Password"
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
              >
                Login
              </Button>
            </form>
          </Form>
          <div className="my-6 flex justify-between items-center">
            {/* <Link href="/auth/forgot-password">Forgot Password?</Link>
            <Link href="/auth/register">Register</Link> */}
          </div>
          <Separator className="my-6" />
          <div className="flex items-center justify-center">
            {/* grid grid-cols-3 gap-4 */}
            <Button
              variant="outline"
              className=" text-primary"
              type="button"
              onClick={handleGoogleLogin}
              ref={submitBtnRef}
            >
              <GoogleIcon className="mr-2 h-5 w-5" />
              Google
            </Button>
            {/* <Button variant="outline" className="col-span-1">
              <FacebookIcon className="mr-2 h-5 w-5" />
              Facebook
            </Button>
            <Button variant="outline" className="col-span-1">
              <GithubIcon className="mr-2 h-5 w-5" />
              GitHub
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
