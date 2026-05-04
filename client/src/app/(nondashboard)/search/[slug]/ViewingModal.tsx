"use client";

import { useCreateBookingMutation, useGetAvailabilityQuery } from "@/state/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import Loading from "@/components/Loading";

export const ViewingModal = ({ propertyId, isOpen, onClose }: any) => {
  const { data: availability, isLoading: isAvailabilityLoading } = useGetAvailabilityQuery(propertyId, { skip: !isOpen });
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const [date, setDate] = useState<Date | undefined>();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  // Map backend string dates to timestamps for easy comparison
  const availableDatesStr = availability || [];
  const availableTimeStamps = new Set(availableDatesStr.map((d: string) => new Date(d).setHours(0,0,0,0)));

  const isDateDisabled = (dateToCheck: Date) => {
    // Return true to DISABLE the date if it's NOT in our set
    const timeStampToCheck = new Date(dateToCheck).setHours(0,0,0,0);
    return !availableTimeStamps.has(timeStampToCheck);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error("Please select a date.");
      return;
    }
    
    try {
      await createBooking({
        propertyId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        viewingDate: date.toISOString(),
      }).unwrap();
      
      toast.success("Viewing request sent successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to book viewing.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary-900">Book a Viewing</DialogTitle>
        </DialogHeader>
        
        {isAvailabilityLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            
            <div className="space-y-2 flex flex-col items-center">
              <Label className="self-start">Select Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={isDateDisabled}
                className="rounded-md border mx-auto"
              />
            </div>

            <Button
              type="submit"
              disabled={isBooking || !date}
              className="w-full bg-[#EFBF04] text-white hover:bg-[#d6ab03] font-semibold"
            >
              {isBooking ? "Booking..." : "Confirm Booking"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
