"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Search, ChevronDown, MapPin, Home, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyTypeEnum } from "@/lib/constants";
import { setFilters } from "@/state";

const SearchComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchTab, setSearchTab] = useState<"sale" | "rent">("sale");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("any");
  const [beds, setBeds] = useState("any");

  const handleSearch = async () => {
    let coordinates: [number, number] = [36.8219, -1.2921]; // Default Nairobi

    if (location.trim()) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            location
          )}.json?access_token=${
            process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
          }&fuzzyMatch=true`
        );
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          coordinates = [lat, lng];
        }
      } catch (error) {
        console.error("Error geocoding location:", error);
      }
    }

    const filters = {
      location: location || "Nairobi",
      propertyType: propertyType === "any" ? "any" : propertyType,
      beds: beds === "any" ? "any" : beds,
      coordinates,
    };

    dispatch(setFilters(filters));

    const params = new URLSearchParams({
      location: filters.location,
      propertyType: filters.propertyType,
      beds: filters.beds,
      lat: coordinates[0].toString(),
      lng: coordinates[1].toString(),
    });

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Tabs */}
      <div className="flex">
        <button
          onClick={() => setSearchTab("sale")}
          className={`px-8 py-3 rounded-tl-xl font-semibold transition-all ${
            searchTab === "sale"
              ? "bg-[#D2E030] text-black"
              : "bg-white/90 text-gray-700 hover:bg-white"
          }`}
        >
          For Sale
        </button>
        <button
          onClick={() => setSearchTab("rent")}
          className={`px-8 py-3 rounded-tr-xl font-semibold transition-all ${
            searchTab === "rent"
              ? "bg-[#D2E030] text-black"
              : "bg-white/90 text-gray-700 hover:bg-white"
          }`}
        >
          For Rent
        </button>
      </div>

      {/* Main Search Bar */}
      <div className="bg-white rounded-b-xl rounded-tr-xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row items-end gap-4 w-full">
        {/* Location */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-bold text-gray-800 mb-2 text-left">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Enter location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-100 h-12 rounded-lg"
            />
          </div>
        </div>

        {/* Property Type */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-bold text-gray-800 mb-2 text-left">
            Property Type
          </label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="bg-gray-50 border-gray-100 h-12 rounded-lg">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-gray-400" />
                <SelectValue placeholder="All Types" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="any">All Types</SelectItem>
              {Object.values(PropertyTypeEnum).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-bold text-gray-800 mb-2 text-left">
            Bedrooms
          </label>
          <Select value={beds} onValueChange={setBeds}>
            <SelectTrigger className="bg-gray-50 border-gray-100 h-12 rounded-lg">
              <div className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-gray-400" />
                <SelectValue placeholder="Any Beds" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="any">Any Beds</SelectItem>
              <SelectItem value="1">1+ Bed</SelectItem>
              <SelectItem value="2">2+ Beds</SelectItem>
              <SelectItem value="3">3+ Beds</SelectItem>
              <SelectItem value="4">4+ Beds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="bg-[#D2E030] hover:bg-[#b8c52a] text-black font-bold h-12 px-10 rounded-lg w-full md:w-auto transition-all"
        >
          Search <Search className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default SearchComponent;
