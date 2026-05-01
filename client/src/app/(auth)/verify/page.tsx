"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifyFormData, verifySchema } from "@/lib/schemas";
import { useAuth } from "../authProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";

// Create a component that uses useSearchParams
const VerifyForm = () => {
  const { verifyEmail, resendCode } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push("/signin");
    }
  }, [email, router]);

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: VerifyFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      await verifyEmail(email, data.code);
      setSuccess("Email verified successfully! Redirecting...");
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to verify email");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      setError(null);
      setSuccess(null);
      await resendCode(email);
      setSuccess("Verification code resent to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    }
  };

  if (!email) return null;

  return (
    <div className="auth-card">
      <h1 className="text-2xl font-bold mb-2 text-center">Verify Email</h1>
      <p className="text-sm text-gray-500 mb-6 text-center">
        We sent a verification code to <strong>{email}</strong>
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm rounded-md">
          {success}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CustomFormField
            name="code"
            label="Verification Code"
            type="text"
            placeholder="Enter the 6-digit code"
          />

          <Button
            type="submit"
            className="auth-button mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500">Didn&apos;t receive the code? </span>
        <button
          onClick={handleResend}
          className="text-primary-700 font-medium hover:underline focus:outline-none"
        >
          Resend code
        </button>
      </div>
    </div>
  );
};

// Wrap it in a suspense boundary as required by Next.js when using useSearchParams
import { Suspense } from "react";

const VerifyPage = () => {
  return (
    <div className="auth-container">
      <Suspense fallback={<div className="auth-card">Loading...</div>}>
        <VerifyForm />
      </Suspense>
    </div>
  );
};

export default VerifyPage;
