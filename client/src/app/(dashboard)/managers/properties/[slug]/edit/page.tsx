"use client";

import { CustomFormField } from "@/components/FormField";
import Header from "@/components/Header";
import { Form } from "@/components/ui/form";
import { EditPropertyFormData, editPropertySchema } from "@/lib/schemas";
import {
  useUpdatePropertyMutation,
  useGetPropertyQuery,
  useGetAuthUserQuery,
} from "@/state/api";
import { AmenityEnum, HighlightEnum, PropertyTypeEnum } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/(auth)/authProvider";
import Loading from "@/components/Loading";

const EditProperty = () => {
  const { slug } = useParams();

  const { data: property, isLoading: isPropertyLoading } =
    useGetPropertyQuery(slug as string);
  const [updateProperty, { isLoading: isUpdating }] =
    useUpdatePropertyMutation();

  const { data: authUser } = useGetAuthUserQuery();
  const { user: contextUser } = useAuth();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<EditPropertyFormData>({
    resolver: zodResolver(editPropertySchema),
    defaultValues: {
      name: "",
      description: "",
      pricePerMonth: 0,
      securityDeposit: 0,
      applicationFee: 0,
      isPetsAllowed: false,
      isParkingIncluded: false,
      photoUrls: undefined,
      amenities: "",
      highlights: "",
      beds: 0,
      baths: 0,
      squareFeet: 0,
      propertyType: PropertyTypeEnum.Apartment,
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      latitude: "",
      longitude: "",
    },
  });

  useEffect(() => {
    if (property) {
      form.reset({
        name: property.name,
        description: property.description,
        pricePerMonth: property.pricePerMonth,
        securityDeposit: property.securityDeposit,
        applicationFee: property.applicationFee,
        isPetsAllowed: property.isPetsAllowed,
        isParkingIncluded: property.isParkingIncluded,
        photoUrls: undefined, // Leave empty, user can upload new ones
        amenities: property.amenities.join(","),
        highlights: property.highlights.join(","),
        beds: property.beds,
        baths: property.baths,
        squareFeet: property.squareFeet,
        propertyType: property.propertyType as PropertyTypeEnum,
        address: property.location?.address || "",
        city: property.location?.city || "",
        state: property.location?.state || "",
        country: property.location?.country || "",
        postalCode: property.location?.postalCode || "",
        latitude: (property.location as any)?.coordinates?.latitude?.toString() || "",
        longitude: (property.location as any)?.coordinates?.longitude?.toString() || "",
      });
    }
  }, [property, form]);

  const onSubmit = async (data: EditPropertyFormData) => {
    setSubmitError(null);
    try {
      const managerAuthId = authUser?.userInfo?.authId || contextUser?.authId;

      if (!managerAuthId) {
        setSubmitError("No manager ID found. Please sign in again.");
        return;
      }

      if (property?.managerUserId !== managerAuthId) {
        setSubmitError("You do not have permission to edit this property.");
        return;
      }

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "photoUrls") {
          if (value && Array.isArray(value)) {
            const files = value as File[];
            files.forEach((file: File) => {
              formData.append("photos", file);
            });
          }
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      formData.append("managerUserId", managerAuthId);

      await updateProperty({ id: property!.id, formData }).unwrap();
      router.push(`/managers/properties/${slug}`);
    } catch (error: any) {
      console.error("Error updating property:", error);
      setSubmitError(
        error?.data?.message ||
          error?.message ||
          "Failed to update property. Please try again."
      );
    }
  };

  if (isPropertyLoading) return <Loading />;

  return (
    <div className="dashboard-container">
      <Header
        title="Edit Property"
        subtitle="Modify the details of your property listing"
      />
      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-10"
          >
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <CustomFormField name="name" label="Property Name" />
                <CustomFormField
                  name="description"
                  label="Description"
                  type="textarea"
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Fees */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Fees</h2>
              <CustomFormField
                name="pricePerMonth"
                label="Price per Month"
                type="number"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  name="securityDeposit"
                  label="Security Deposit"
                  type="number"
                />
                <CustomFormField
                  name="applicationFee"
                  label="Application Fee"
                  type="number"
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Property Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomFormField
                  name="beds"
                  label="Number of Beds"
                  type="number"
                />
                <CustomFormField
                  name="baths"
                  label="Number of Baths"
                  type="number"
                />
                <CustomFormField
                  name="squareFeet"
                  label="Square Feet"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
              </div>
              <div className="mt-4">
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

            <hr className="my-6 border-gray-200" />

            {/* Amenities and Highlights */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Amenities and Highlights
              </h2>
              <div className="space-y-6">
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

            <hr className="my-6 border-gray-200" />

            {/* Photos */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Photos</h2>
              <p className="text-sm text-gray-500 mb-2">
                Uploading new photos will replace all existing property photos.
                Leave this empty to keep your current photos.
              </p>
              <CustomFormField
                name="photoUrls"
                label="Upload New Photos (Optional)"
                type="file"
                accept="image/*"
              />
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Additional Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">
                Additional Information
              </h2>
              <CustomFormField name="address" label="Address" />
              <div className="flex justify-between gap-4">
                <CustomFormField name="city" label="City" className="w-full" />
                <CustomFormField
                  name="state"
                  label="State"
                  className="w-full"
                />
                <CustomFormField
                  name="postalCode"
                  label="Postal Code"
                  className="w-full"
                />
              </div>
              <CustomFormField name="country" label="Country" />
              <div className="flex justify-between gap-4 mt-4">
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
              <p className="text-sm text-gray-500 mt-2">
                If provided, these coordinates will be used to pinpoint the exact location on the map. Otherwise, the address will be used to estimate the location.
              </p>
            </div>

            <Button
              type="submit"
              className="bg-primary-700 text-white w-full mt-8"
              disabled={isUpdating}
            >
              {isUpdating ? "Saving Changes..." : "Save Changes"}
            </Button>

            {submitError && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {submitError}
              </p>
            )}

            {Object.keys(form.formState.errors).length > 0 && (
              <div className="text-red-500 text-sm mt-2">
                <p className="font-semibold">
                  Please fix the following errors:
                </p>
                <ul className="list-disc list-inside mt-1">
                  {Object.entries(form.formState.errors).map(
                    ([field, error]) => (
                      <li key={field}>
                        {field}: {(error as any)?.message}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditProperty;
