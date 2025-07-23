"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaGoogle, FaGithub } from "react-icons/fa";

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

// ===> Auth client instance (e.g., Inngest or Supabase wrapper)
import { authClient } from "@/lib/auth-client";

// 👉 Zod schema for validation
const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignInView() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setError(error.message || "Invalid credentials. Please try again.");
      } else if (data) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSocials = async (provider: "google" | "github") => {
    setError("");
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        setError(error.message || `Failed to sign in with ${provider}`);
      }
    } catch (err) {
      console.error("Social sign-in error:", err);
      setError("Something went wrong with social login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="flex w-full max-w-4xl shadow-lg rounded-xl overflow-hidden mb-6">
        {/* Left sign-in form */}
        <div className="flex-1 bg-white p-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-2">
              Welcome back
            </h1>
            <p className="text-center text-gray-500 mb-6">
              Login to your account
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Email field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="test@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password field */}
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
                        />
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

                {/* Submit button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>

                {/* Divider */}
                <div className="text-center text-sm relative my-6">
                  <span className="bg-white px-2 text-gray-500 z-10 relative">
                    Or continue with
                  </span>
                  <div className="absolute inset-x-0 top-1/2 border-t border-gray-300" />
                </div>

                {/* Social logins */}
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

                {/* Link to sign-up */}
                <p className="text-center text-sm mt-6">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </div>

        {/* Brand sidebar */}
        <div className="flex-1 bg-green-700 text-white flex flex-col justify-center items-center p-8">
          <Image
            src="/logo.svg"
            alt="Meet.AI"
            width={60}
            height={60}
            className="mb-4"
          />
          <p className="text-lg font-semibold">Meet.AI</p>
        </div>
      </div>

      {/* Terms & Privacy */}
      <div className="text-muted-foreground text-xs text-center max-w-md">
        <p>
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-blue-500 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-500 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
