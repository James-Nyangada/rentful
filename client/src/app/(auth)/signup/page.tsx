"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormData, signupSchema } from "@/lib/schemas";
import { useAuth } from "../authProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";

const SignupPage = () => {
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "tenant",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await register(data);
      router.push(`/verify?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="text-2xl font-bold mb-2 text-center">Create an Account</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Join us today!
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField
              name="name"
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
            />
            <CustomFormField
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
            />
            <CustomFormField
              name="phoneNumber"
              label="Phone Number"
              type="text"
              placeholder="Enter your phone number (optional)"
            />
            <CustomFormField
              name="password"
              label="Password"
              type="password"
              placeholder="Create a password"
            />
            <CustomFormField
              name="role"
              label="I am a..."
              type="select"
              options={[
                { value: "tenant", label: "Tenant" },
                { value: "manager", label: "Manager" },
              ]}
            />

            <Button
              type="submit"
              className="auth-button mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">Already have an account? </span>
          <Link
            href="/signin"
            className="text-primary-700 font-medium hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
