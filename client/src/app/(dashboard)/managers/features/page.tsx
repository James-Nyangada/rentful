"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  useGetFeaturesQuery,
  useAddAmenityMutation,
  useRemoveAmenityMutation,
  useAddHighlightMutation,
  useRemoveHighlightMutation,
} from "@/state/api";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

const FeaturesPage = () => {
  const { data: features, isLoading } = useGetFeaturesQuery();
  const [addAmenity, { isLoading: isAddingAmenity }] = useAddAmenityMutation();
  const [removeAmenity] = useRemoveAmenityMutation();
  const [addHighlight, { isLoading: isAddingHighlight }] = useAddHighlightMutation();
  const [removeHighlight] = useRemoveHighlightMutation();

  const [newAmenity, setNewAmenity] = useState("");
  const [newHighlight, setNewHighlight] = useState("");

  if (isLoading) return <Loading />;

  const handleAddAmenity = async () => {
    if (newAmenity.trim()) {
      await addAmenity({ name: newAmenity.trim() });
      setNewAmenity("");
    }
  };

  const handleAddHighlight = async () => {
    if (newHighlight.trim()) {
      await addHighlight({ name: newHighlight.trim() });
      setNewHighlight("");
    }
  };

  return (
    <div className="dashboard-container">
      <Header
        title="Manage Features"
        subtitle="Add, edit, or remove amenities and highlights for properties"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Amenities Section */}
        <Card className="border-primary-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-primary-900">Amenities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="New Amenity Name"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddAmenity()}
              />
              <Button onClick={handleAddAmenity} disabled={isAddingAmenity || !newAmenity.trim()} className="bg-primary-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {features?.amenities?.map((amenity) => (
                <div key={amenity.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-100">
                  <span className="font-medium text-gray-700">{amenity.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeAmenity(amenity.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {features?.amenities?.length === 0 && (
                <p className="text-gray-500 text-center py-4">No amenities added yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Highlights Section */}
        <Card className="border-primary-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-primary-900">Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="New Highlight Name"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddHighlight()}
              />
              <Button onClick={handleAddHighlight} disabled={isAddingHighlight || !newHighlight.trim()} className="bg-primary-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {features?.highlights?.map((highlight) => (
                <div key={highlight.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-100">
                  <span className="font-medium text-gray-700">{highlight.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeHighlight(highlight.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {features?.highlights?.length === 0 && (
                <p className="text-gray-500 text-center py-4">No highlights added yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeaturesPage;
