"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import {
  useGetPendingPropertiesQuery,
  useApprovePropertyMutation,
  useRejectPropertyMutation,
} from "@/state/api";
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  MapPin,
  Bed,
  Bath,
  Maximize,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatEnumString } from "@/lib/utils";

const ReviewRoom = () => {
  const {
    data: pendingProperties,
    isLoading,
    refetch,
  } = useGetPendingPropertiesQuery();
  const [approveProperty, { isLoading: isApproving }] =
    useApprovePropertyMutation();
  const [rejectProperty, { isLoading: isRejecting }] =
    useRejectPropertyMutation();
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [confirmReject, setConfirmReject] = useState<number | null>(null);

  const handleApprove = async (id: number) => {
    try {
      await approveProperty(id).unwrap();
      setSelectedProperty(null);
    } catch (error) {
      console.error("Error approving property:", error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectProperty(id).unwrap();
      setSelectedProperty(null);
      setConfirmReject(null);
    } catch (error) {
      console.error("Error rejecting property:", error);
    }
  };

  const parseSubmittedBy = (submittedBy: string | null) => {
    if (!submittedBy) return { name: "Unknown", email: "", phone: "" };
    const parts = submittedBy.split(" | ");
    return {
      name: parts[0] || "Unknown",
      email: parts[1] || "",
      phone: parts[2] || "",
    };
  };

  return (
    <div className="dashboard-container">
      <Header
        title="Review Room"
        subtitle="Review and approve pending property submissions from agents"
      />

      {/* Stats Bar */}
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600" />
          <div>
            <p className="text-2xl font-extrabold text-amber-700">
              {pendingProperties?.length || 0}
            </p>
            <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">
              Pending Review
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : !pendingProperties || pendingProperties.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">All Clear!</h3>
          <p className="text-foreground/50 max-w-md mx-auto">
            No pending property submissions. All submissions have been reviewed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pendingProperties.map((property: any) => {
            const agent = parseSubmittedBy(property.submittedBy);
            const primaryPhoto =
              property.photoUrls?.[0] || "/placeholder.jpg";
            const location = typeof property.location === "string"
              ? JSON.parse(property.location)
              : property.location;

            return (
              <div
                key={property.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={primaryPhoto}
                    alt={property.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center gap-2 text-white/90 text-xs">
                      <User className="w-3.5 h-3.5" />
                      <span className="font-medium">{agent.name}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-primary text-lg mb-1 truncate">
                    {property.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-foreground/50 text-sm mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                      {location?.address}, {location?.state}
                    </span>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 text-foreground/60 text-sm mb-4 pb-4 border-b border-gray-100">
                    <span className="flex items-center gap-1">
                      <Bed className="w-4 h-4" /> {property.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" /> {property.baths}
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" /> {property.squareFeet} ft²
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-foreground/40 uppercase tracking-wider">
                        Price
                      </p>
                      <p className="text-lg font-extrabold text-primary">
                        KES{" "}
                        {Number(property.pricePerMonth).toLocaleString()}
                        <span className="text-xs font-normal text-foreground/40">
                          /mo
                        </span>
                      </p>
                    </div>
                    <span className="text-xs font-bold text-primary/60 bg-primary/5 px-3 py-1.5 rounded-full uppercase">
                      {formatEnumString(property.propertyType)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-10 text-primary border-primary/20 hover:bg-primary/5"
                      onClick={() => {
                        setSelectedProperty(property);
                        setCurrentImageIndex(0);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1.5" /> Inspect
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={() => handleApprove(property.id)}
                      disabled={isApproving}
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-10 text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => setConfirmReject(property.id)}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Reject Confirmation */}
                {confirmReject === property.id && (
                  <div className="border-t border-red-100 bg-red-50 p-4">
                    <div className="flex items-center gap-2 text-red-600 text-sm font-medium mb-3">
                      <AlertTriangle className="w-4 h-4" />
                      Reject this listing?
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-foreground/60"
                        onClick={() => setConfirmReject(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleReject(property.id)}
                        disabled={isRejecting}
                      >
                        Confirm Reject
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Inspection Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-primary">
                  {selectedProperty.name}
                </h2>
                <p className="text-sm text-foreground/50">
                  Submitted by{" "}
                  {parseSubmittedBy(selectedProperty.submittedBy).name}
                </p>
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Gallery */}
            <div className="relative h-80 md:h-96 bg-gray-100">
              {selectedProperty.photoUrls?.length > 0 && (
                <>
                  <Image
                    src={selectedProperty.photoUrls[currentImageIndex]}
                    alt={`${selectedProperty.name} - Photo ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                  />
                  {selectedProperty.photoUrls.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev: number) =>
                            prev === 0
                              ? selectedProperty.photoUrls.length - 1
                              : prev - 1
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev: number) =>
                            prev === selectedProperty.photoUrls.length - 1
                              ? 0
                              : prev + 1
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                        {currentImageIndex + 1} /{" "}
                        {selectedProperty.photoUrls.length}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Details */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Agent Info */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h3 className="font-bold text-amber-800 text-sm uppercase tracking-wider mb-2">
                  Agent Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-amber-600 font-medium">Name:</span>{" "}
                    <span className="text-amber-900">
                      {parseSubmittedBy(selectedProperty.submittedBy).name}
                    </span>
                  </div>
                  <div>
                    <span className="text-amber-600 font-medium">Email:</span>{" "}
                    <span className="text-amber-900">
                      {parseSubmittedBy(selectedProperty.submittedBy).email}
                    </span>
                  </div>
                  <div>
                    <span className="text-amber-600 font-medium">Phone:</span>{" "}
                    <span className="text-amber-900">
                      {parseSubmittedBy(selectedProperty.submittedBy).phone ||
                        "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Bed className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-2xl font-extrabold text-primary">
                    {selectedProperty.beds}
                  </p>
                  <p className="text-xs text-foreground/50 uppercase tracking-wider">
                    Beds
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Bath className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-2xl font-extrabold text-primary">
                    {selectedProperty.baths}
                  </p>
                  <p className="text-xs text-foreground/50 uppercase tracking-wider">
                    Baths
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Maximize className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-2xl font-extrabold text-primary">
                    {selectedProperty.squareFeet}
                  </p>
                  <p className="text-xs text-foreground/50 uppercase tracking-wider">
                    Sq Ft
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold text-primary">
                    KES {Number(selectedProperty.pricePerMonth).toLocaleString()}
                  </p>
                  <p className="text-xs text-foreground/50 uppercase tracking-wider">
                    Per Month
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-primary mb-2">About</h3>
                <p className="text-foreground/70 leading-relaxed whitespace-pre-line">
                  {selectedProperty.description}
                </p>
              </div>

              {/* Location */}
              {(() => {
                const loc =
                  typeof selectedProperty.location === "string"
                    ? JSON.parse(selectedProperty.location)
                    : selectedProperty.location;
                return (
                  <div>
                    <h3 className="font-bold text-primary mb-2">Location</h3>
                    <div className="flex items-center gap-2 text-foreground/60">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {loc?.address}, {loc?.city}, {loc?.state},{" "}
                        {loc?.country}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Technical Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-foreground/40 font-medium">
                    Property Type:
                  </span>{" "}
                  <span className="text-foreground/80">
                    {formatEnumString(selectedProperty.propertyType)}
                  </span>
                </div>
                <div>
                  <span className="text-foreground/40 font-medium">
                    Listing Type:
                  </span>{" "}
                  <span className="text-foreground/80">
                    {selectedProperty.isSale ? "For Sale" : "For Rent"}
                  </span>
                </div>
                <div>
                  <span className="text-foreground/40 font-medium">
                    Pets Allowed:
                  </span>{" "}
                  <span className="text-foreground/80">
                    {selectedProperty.isPetsAllowed ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <span className="text-foreground/40 font-medium">
                    Parking:
                  </span>{" "}
                  <span className="text-foreground/80">
                    {selectedProperty.isParkingIncluded
                      ? "Included"
                      : "Not Included"}
                  </span>
                </div>
                <div>
                  <span className="text-foreground/40 font-medium">
                    Security Deposit:
                  </span>{" "}
                  <span className="text-foreground/80">
                    KES {Number(selectedProperty.securityDeposit).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-foreground/40 font-medium">
                    Application Fee:
                  </span>{" "}
                  <span className="text-foreground/80">
                    KES {Number(selectedProperty.applicationFee).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                  className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                  onClick={() => handleApprove(selectedProperty.id)}
                  disabled={isApproving}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {isApproving ? "Approving..." : "Approve & Go Live"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-12 text-red-500 border-red-200 hover:bg-red-50 font-bold"
                  onClick={() => handleReject(selectedProperty.id)}
                  disabled={isRejecting}
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  {isRejecting ? "Rejecting..." : "Reject Listing"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewRoom;
