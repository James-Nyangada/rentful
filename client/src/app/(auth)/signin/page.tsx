"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SigninFormData, signinSchema } from "@/lib/schemas";
import { useAuth } from "../authProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";

const SigninPage = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SigninFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const user = await login(data.email, data.password);
      // The authProvider will handle redirecting based on role
    } catch (err: any) {
      if (err.message === "Please verify your email first") {
        // Redirect to verify if needed, and pass email
        router.push(`/verify?email=${encodeURIComponent(data.email)}`);
      } else {
        setError(err.message || "Failed to sign in");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="text-2xl font-bold mb-2 text-center">Welcome Back</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Sign in to your account
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
            />
            <CustomFormField
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              className="auth-button mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">Dont have an account? </span>
          <Link
            href="/signup"
            className="text-primary-700 font-medium hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
