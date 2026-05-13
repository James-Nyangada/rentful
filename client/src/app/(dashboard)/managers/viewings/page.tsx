"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  useGetAuthUserQuery,
  useGetManagerPropertiesQuery,
  useGetManagerViewingsQuery,
  useSetAvailabilityMutation,
  useGetAvailabilityQuery,
} from "@/state/api";
import { useAuth } from "@/app/(auth)/authProvider";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const AvailabilityDialog = ({ propertyId, propertyName, isOpen, onClose }: any) => {
  const { data: availability, isLoading } = useGetAvailabilityQuery(propertyId, { skip: !isOpen });
  const [setAvailability, { isLoading: isUpdating }] = useSetAvailabilityMutation();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  useEffect(() => {
    if (availability) {
      setSelectedDates(availability.map((d: string) => new Date(d)));
    }
  }, [availability]);

  const handleSave = async () => {
    const dates = selectedDates.map((d) => d.toISOString());
    await setAvailability({ propertyId, dates });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary-900 font-bold">Update Availability: {propertyName}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={setSelectedDates as any}
              className="rounded-md border"
            />
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="w-full bg-[#EFBF04] text-white hover:bg-[#d6ab03]"
            >
              {isUpdating ? "Saving..." : "Save Dates"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ManagerViewings = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const { user: contextUser } = useAuth();
  const managerAuthId = authUser?.userInfo?.authId || contextUser?.authId || "";

  const { data: managerProperties, isLoading: isPropsLoading } = useGetManagerPropertiesQuery(managerAuthId, {
    skip: !managerAuthId,
  });

  const { data: viewings, isLoading: isViewingsLoading } = useGetManagerViewingsQuery();

  const [selectedProperty, setSelectedProperty] = useState<{id: number, name: string} | null>(null);

  if (isPropsLoading || isViewingsLoading) return <Loading />;

  // Sort viewings by date descending
  const sortedViewings = viewings ? [...viewings].sort((a, b) => new Date(b.viewingDate).getTime() - new Date(a.viewingDate).getTime()) : [];

  return (
    <div className="dashboard-container">
      <Header
        title="Viewings & Availability"
        subtitle="Manage your property availability and pending tenant viewings"
      />
      
      <div className="mt-8 space-y-10">
        <section>
          <h2 className="text-xl font-bold mb-4 text-primary-900">Pending Viewings</h2>
          <div className="rounded-md border border-primary-200 bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-primary-50">
                <TableRow>
                  <TableHead className="font-semibold text-primary-800">Tenant Name</TableHead>
                  <TableHead className="font-semibold text-primary-800">Email</TableHead>
                  <TableHead className="font-semibold text-primary-800">Phone</TableHead>
                  <TableHead className="font-semibold text-primary-800">Property</TableHead>
                  <TableHead className="font-semibold text-primary-800">Viewing Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedViewings.length > 0 ? (
                  sortedViewings.map((viewing) => (
                    <TableRow key={viewing.id}>
                      <TableCell className="font-medium text-primary-900">{viewing.name}</TableCell>
                      <TableCell>
                        <a href={`mailto:${viewing.email}`} className="text-blue-600 hover:underline">
                          {viewing.email}
                        </a>
                      </TableCell>
                      <TableCell className="text-primary-700">{viewing.phone}</TableCell>
                      <TableCell className="text-primary-700">{viewing.propertyName}</TableCell>
                      <TableCell className="text-primary-700">{format(new Date(viewing.viewingDate), "PPP")}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-primary-600">
                      No viewings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-primary-900">Manage Availability</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managerProperties?.map((property) => (
              <Card key={property.id} className="border-primary-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-primary-800">{property.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSelectedProperty({ id: property.id, name: property.name })}
                  >
                    Update Availability
                  </Button>
                </CardContent>
              </Card>
            ))}
            {managerProperties?.length === 0 && (
              <p className="text-primary-600">No properties found.</p>
            )}
          </div>
        </section>
      </div>


      {selectedProperty && (
        <AvailabilityDialog
          propertyId={selectedProperty.id}
          propertyName={selectedProperty.name}
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default ManagerViewings;
