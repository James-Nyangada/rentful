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
  const [searchTab, setSearchTab] = useState<"sale" | "rent">("rent");
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
      isSale: searchTab === "sale",
      coordinates,
    };

    dispatch(setFilters(filters));

    const params = new URLSearchParams({
      location: filters.location,
      propertyType: filters.propertyType,
      beds: filters.beds,
      isSale: filters.isSale.toString(),
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
          className={`px-10 py-4 rounded-tl-2xl font-bold uppercase tracking-wider transition-all ${
            searchTab === "sale"
              ? "bg-primary text-white"
              : "bg-white/80 text-primary hover:bg-white"
          }`}
        >
          Sale
        </button>
        <button
          onClick={() => setSearchTab("rent")}
          className={`px-10 py-4 rounded-tr-2xl font-bold uppercase tracking-wider transition-all ${
            searchTab === "rent"
              ? "bg-primary text-white"
              : "bg-white/80 text-primary hover:bg-white"
          }`}
        >
          Rent
        </button>
      </div>

      {/* Main Search Bar */}
      <div className="bg-white rounded-b-2xl rounded-tr-2xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-end gap-6 w-full border border-gray-100">
        {/* Location */}
        <div className="flex-1 w-full">
          <label className="block text-xs font-black uppercase tracking-widest text-primary mb-3 text-left">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              placeholder="Where are you looking?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-12 bg-gray-50 border-gray-200 h-14 rounded-xl focus:ring-secondary focus:border-secondary transition-all"
            />
          </div>
        </div>

        {/* Property Type */}
        <div className="flex-1 w-full">
          <label className="block text-xs font-black uppercase tracking-widest text-primary mb-3 text-left">
            Property Type
          </label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="bg-gray-50 border-gray-200 h-14 rounded-xl focus:ring-secondary focus:border-secondary transition-all">
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-primary" />
                <SelectValue placeholder="All Types" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-100">
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
          <label className="block text-xs font-black uppercase tracking-widest text-primary mb-3 text-left">
            Bedrooms
          </label>
          <Select value={beds} onValueChange={setBeds}>
            <SelectTrigger className="bg-gray-50 border-gray-200 h-14 rounded-xl focus:ring-secondary focus:border-secondary transition-all">
              <div className="flex items-center gap-3">
                <BedDouble className="w-5 h-5 text-primary" />
                <SelectValue placeholder="Any Beds" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-100">
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
          className="bg-secondary hover:bg-secondary/90 text-white font-black h-14 px-12 rounded-xl w-full md:w-auto transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          SEARCH <Search className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default SearchComponent;
