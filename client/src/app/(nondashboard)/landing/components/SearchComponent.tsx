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
  const [searchTab, setSearchTab] = useState<"buy" | "sell" | "rent">("buy");
  const [location, setLocation] = useState("any");
  const [propertyType, setPropertyType] = useState("any");
  const [beds, setBeds] = useState("any");

  const handleSearch = async () => {
    let coordinates: [number, number] = [36.8219, -1.2921]; // Default Nairobi

    if (location.trim() && location !== "any") {
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
      isSale: searchTab === "buy",
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
      <div className="flex w-full md:w-auto">
        <button
          onClick={() => setSearchTab("buy")}
          className={`flex-1 md:flex-none px-6 md:px-10 py-4 rounded-tl-2xl font-bold uppercase tracking-wider transition-all ${
            searchTab === "buy"
              ? "bg-primary text-white"
              : "bg-white/80 text-primary hover:bg-white"
          }`}
        >
          BUY
        </button>
        <button
          onClick={() => setSearchTab("sell")}
          className={`flex-1 md:flex-none px-6 md:px-10 py-4 font-bold uppercase tracking-wider transition-all ${
            searchTab === "sell"
              ? "bg-primary text-white"
              : "bg-white/80 text-primary hover:bg-white border-x border-white/20"
          }`}
        >
          SELL
        </button>
        <button
          onClick={() => setSearchTab("rent")}
          className={`flex-1 md:flex-none px-6 md:px-10 py-4 rounded-tr-2xl font-bold uppercase tracking-wider transition-all ${
            searchTab === "rent"
              ? "bg-primary text-white"
              : "bg-white/80 text-primary hover:bg-white"
          }`}
        >
          Rent
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-b-2xl rounded-tr-2xl p-6 md:p-8 shadow-2xl border border-gray-100 min-h-[140px] flex items-center">
        {searchTab === "sell" ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full">
            <div className="text-left">
              <h3 className="text-2xl font-black text-primary mb-2 uppercase tracking-tighter">
                List Your Property With Us
              </h3>
              <p className="text-gray-500 font-medium max-w-md">
                We provide structured property solutions to help you find the right buyer or tenant quickly.
              </p>
            </div>
            <Button
              onClick={() => router.push("/contact-us")}
              className="bg-secondary hover:bg-secondary/90 text-white font-black h-14 px-12 rounded-xl w-full md:w-auto transition-all shadow-lg hover:scale-105 active:scale-95 text-lg"
            >
              GET IN TOUCH
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-end gap-6 w-full">
            {/* Location */}
            <div className="flex-1 w-full">
              <label className="block text-xs font-black uppercase tracking-widest text-primary mb-3 text-left">
                Location
              </label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="bg-gray-50 border-gray-200 h-14 rounded-xl focus:ring-secondary focus:border-secondary transition-all">
                  <div className="flex items-center gap-3 text-primary font-bold">
                    <MapPin className="w-5 h-5 text-primary" />
                    <SelectValue placeholder="Where are you looking?" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-100">
                  <SelectItem value="any">All Locations</SelectItem>
                  <SelectItem value="Lavington">Lavington</SelectItem>
                  <SelectItem value="Westlands">Westlands</SelectItem>
                  <SelectItem value="Kileleshwa">Kileleshwa</SelectItem>
                  <SelectItem value="Kilimani">Kilimani</SelectItem>
                </SelectContent>
              </Select>
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
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
