"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CustomFormField } from "@/components/FormField";
import { Form } from "@/components/ui/form";
import { AgentSubmissionFormData, agentSubmissionSchema } from "@/lib/schemas";
import { useAgentSubmitPropertyMutation } from "@/state/api";
import { AmenityEnum, HighlightEnum, PropertyTypeEnum } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Upload,
  User,
  Building,
  MapPin,
  DollarSign,
  Sparkles,
} from "lucide-react";

const ListWithUs = () => {
  const [agentSubmitProperty, { isLoading: isSubmitting }] =
    useAgentSubmitPropertyMutation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<AgentSubmissionFormData>({
    resolver: zodResolver(agentSubmissionSchema),
    defaultValues: {
      agentName: "",
      agentEmail: "",
      agentPhone: "",
      name: "",
      description: "",
      pricePerMonth: 1000,
      securityDeposit: 500,
      applicationFee: 100,
      isPetsAllowed: false,
      isParkingIncluded: false,
      isSale: false,
      photoUrls: [],
      amenities: "",
      highlights: "",
      beds: 1,
      baths: 1,
      squareFeet: 1000,
      propertyType: PropertyTypeEnum.Apartment,
      address: "",
      city: "",
      state: "",
      country: "Kenya",
      postalCode: "",
      latitude: "",
      longitude: "",
    },
  });

  const onSubmit = async (data: AgentSubmissionFormData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "photoUrls") {
          const files = value as File[];
          files.forEach((file: File) => {
            formData.append("photos", file);
          });
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      await agentSubmitProperty(formData).unwrap();
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Error submitting property:", error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-4">
            Submission Received!
          </h1>
          <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
            Thank you for listing with Chestone Properties. Your property has
            been submitted for review by our management team.
          </p>
          <p className="text-sm text-foreground/50 mb-10">
            You will be notified once your listing is approved and goes live on
            our platform.
          </p>
          <Link
            href="/"
            className="inline-block text-white rounded-2xl px-10 py-4 font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            style={{ backgroundColor: "#D4AF37" }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo-rentful.png"
              alt="Chestone Properties"
              width={80}
              height={80}
              className="h-16 w-auto object-contain"
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            List With Us
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Submit your property listing to the Chestone Properties portfolio.
            Our team will review and approve your submission.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-white/50 text-sm">
            <span className="flex items-center gap-2">
              <Upload className="w-4 h-4" /> Submit Details
            </span>
            <span className="text-white/30">→</span>
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Team Review
            </span>
            <span className="text-white/30">→</span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Go Live
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 md:p-10 space-y-10"
            >
              {/* Agent Information */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-primary">
                      Your Information
                    </h2>
                    <p className="text-sm text-foreground/50">
                      Tell us about yourself
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CustomFormField
                    name="agentName"
                    label="Full Name"
                    placeholder="John Doe"
                  />
                  <CustomFormField
                    name="agentEmail"
                    label="Email Address"
                    placeholder="john@example.com"
                  />
                  <CustomFormField
                    name="agentPhone"
                    label="Phone Number"
                    placeholder="+254 700 000 000"
                  />
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Property Information */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                    <Building className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-primary">
                      Property Details
                    </h2>
                    <p className="text-sm text-foreground/50">
                      Describe the property
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <CustomFormField
                    name="name"
                    label="Property Name"
                    placeholder="e.g. Sunset Villa, Kilimani Heights"
                  />
                  <CustomFormField
                    name="description"
                    label="Description"
                    type="textarea"
                    placeholder="Describe the property, its features, neighborhood, and unique selling points..."
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CustomFormField
                      name="beds"
                      label="Bedrooms"
                      type="number"
                    />
                    <CustomFormField
                      name="baths"
                      label="Bathrooms"
                      type="number"
                    />
                    <CustomFormField
                      name="squareFeet"
                      label="Size (sq ft)"
                      type="number"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomFormField
                      name="isPetsAllowed"
                      label="Pets Allowed"
                      type="switch"
                    />
                    <CustomFormField
                      name="isParkingIncluded"
                      label="Parking Included"
                      type="switch"
                    />
                    <CustomFormField
                      name="isSale"
                      label={form.watch("isSale") ? "For Sale" : "For Rent"}
                      type="switch"
                    />
                  </div>
                  <CustomFormField
                    name="propertyType"
                    label="Property Type"
                    type="select"
                    options={Object.keys(PropertyTypeEnum).map((type) => ({
                      value: type,
                      label: type,
                    }))}
                  />
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Pricing */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-primary">Pricing</h2>
                    <p className="text-sm text-foreground/50">
                      Set the financial details
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <CustomFormField
                    name="pricePerMonth"
                    label="Price per Month (KES)"
                    type="number"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomFormField
                      name="securityDeposit"
                      label="Security Deposit (KES)"
                      type="number"
                    />
                    <CustomFormField
                      name="applicationFee"
                      label="Application Fee (KES)"
                      type="number"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Amenities & Highlights */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-primary">
                      Amenities & Highlights
                    </h2>
                    <p className="text-sm text-foreground/50">
                      What makes this property special
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <CustomFormField
                    name="amenities"
                    label="Amenities"
                    type="select"
                    options={Object.keys(AmenityEnum).map((amenity) => ({
                      value: amenity,
                      label: amenity,
                    }))}
                  />
                  <CustomFormField
                    name="highlights"
                    label="Highlights"
                    type="select"
                    options={Object.keys(HighlightEnum).map((highlight) => ({
                      value: highlight,
                      label: highlight,
                    }))}
                  />
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Photos */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-primary">
                      Property Photos
                    </h2>
                    <p className="text-sm text-foreground/50">
                      Upload high-quality photos of your property
                    </p>
                  </div>
                </div>
                <CustomFormField
                  name="photoUrls"
                  label="Photos"
                  type="file"
                  accept="image/*"
                />
                <p className="text-xs text-foreground/40 mt-2">
                  Images will be automatically branded with the Chestone
                  Properties watermark.
                </p>
              </div>

              <div className="border-t border-gray-100" />

              {/* Location */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-primary">Location</h2>
                    <p className="text-sm text-foreground/50">
                      Where is the property located?
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <CustomFormField
                    name="address"
                    label="Street Address"
                    placeholder="e.g. 123 Ngong Road"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CustomFormField
                      name="city"
                      label="City"
                      className="w-full"
                      placeholder="e.g. Nairobi"
                    />
                    <CustomFormField
                      name="state"
                      label="Area"
                      className="w-full"
                      type="select"
                      options={[
                        { value: "Lavington", label: "Lavington" },
                        { value: "Westlands", label: "Westlands" },
                        { value: "Kileleshwa", label: "Kileleshwa" },
                        { value: "Kilimani", label: "Kilimani" },
                        { value: "Karen", label: "Karen" },
                        { value: "Riverside", label: "Riverside" },
                      ]}
                    />
                    <CustomFormField
                      name="postalCode"
                      label="Postal Code"
                      className="w-full"
                      placeholder="e.g. 00100"
                    />
                  </div>
                  <CustomFormField
                    name="country"
                    label="Country"
                    placeholder="Kenya"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomFormField
                      name="latitude"
                      label="Latitude (Optional)"
                      className="w-full"
                      placeholder="e.g. -1.2921"
                    />
                    <CustomFormField
                      name="longitude"
                      label="Longitude (Optional)"
                      className="w-full"
                      placeholder="e.g. 36.8219"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-14 text-white font-bold text-base uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                  style={{ backgroundColor: "#D4AF37" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Submitting Property..."
                    : "Submit for Review"}
                </Button>

                {Object.keys(form.formState.errors).length > 0 && (
                  <div className="text-red-500 text-sm mt-4 bg-red-50 rounded-xl p-4">
                    <p className="font-semibold mb-2">
                      Please fix the following errors:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(form.formState.errors).map(
                        ([field, error]) => (
                          <li key={field}>{(error as any)?.message}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                <p className="text-center text-xs text-foreground/40 mt-4">
                  By submitting, you agree to our terms of service. All listings
                  are subject to review.
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ListWithUs;
