"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaGoogle, FaGithub } from "react-icons/fa";

// UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// Auth client (e.g., Supabase/Inngest wrapper)
import { authClient } from "@/lib/auth-client";

// Zod schema
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function SignUpView() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);
    setError(null);

    try {
      await authClient.signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
          onError: ({ error }) => {
            setError(error.message || "Something went wrong. Please try again.");
          },
        }
      );
    } catch (err) {
      console.error("Sign-up error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSocials = async (provider: "google" | "github") => {
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider:provider,
        callbackURL: "/",
      });

      if (error) {
        setError(error.message || `Failed to sign in with ${provider}`);
      }
    } catch (err) {
      console.error("Social sign-up error:", err);
      setError("Social sign-up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="flex w-full max-w-4xl shadow-lg rounded-xl overflow-hidden mb-6">
        {/* Left - Sign Up Form */}
        <div className="flex-1 bg-white p-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
            <p className="text-center text-gray-500 mb-6">Sign up for a new account</p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
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
                        <Input placeholder="test@example.com" type="email" {...field} />
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
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Error Alert */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>

                {/* Divider */}
                <div className="text-center text-sm relative my-6">
                  <span className="bg-white px-2 z-10 relative text-gray-500">Or continue with</span>
                  <div className="absolute inset-x-0 top-1/2 border-t border-gray-300" />
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex justify-center items-center gap-2"
                    disabled={isLoading}
                    onClick={() => onSocials("google")}
                  >
                    <FaGoogle /> Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex justify-center items-center gap-2"
                    disabled={isLoading}
                    onClick={() => onSocials("github")}
                  >
                    <FaGithub /> GitHub
                  </Button>
                </div>

                {/* Link to sign-in */}
                <p className="text-center text-sm mt-6">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="text-blue-600 hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </div>

        {/* Right Logo Panel */}
        <div className="flex-1 bg-green-700 text-white flex flex-col justify-center items-center p-8">
          <Image src="/logo.svg" alt="Meet.AI" width={60} height={60} className="mb-4" />
          <p className="text-lg font-semibold">Meet.AI</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-muted-foreground text-xs text-center max-w-md">
        <p>
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-blue-500 hover:underline">Terms of Service</Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
