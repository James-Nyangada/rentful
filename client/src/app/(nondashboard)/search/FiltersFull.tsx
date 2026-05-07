import { FiltersState, initialState, setFilters } from "@/state";
import { useAppSelector } from "@/state/redux";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { cleanParams, cn, formatEnumString } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import { AmenityIcons, PropertyTypeIcons } from "@/lib/constants";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const FiltersFull = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useAppSelector((state) => state.global.filters);
  const [localFilters, setLocalFilters] = useState(initialState.filters);
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );

  const updateURL = debounce((newFilters: FiltersState) => {
    const cleanFilters = cleanParams(newFilters);
    const updatedSearchParams = new URLSearchParams();

    Object.entries(cleanFilters).forEach(([key, value]) => {
      updatedSearchParams.set(
        key,
        Array.isArray(value) ? value.join(",") : value.toString()
      );
    });

    router.push(`${pathname}?${updatedSearchParams.toString()}`);
  });

  const handleSubmit = () => {
    dispatch(setFilters(localFilters));
    updateURL(localFilters);
  };

  const handleReset = () => {
    setLocalFilters(initialState.filters);
    dispatch(setFilters(initialState.filters));
    updateURL(initialState.filters);
  };

  const handleAmenityChange = (amenity: AmenityEnum) => {
    setLocalFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleLocationSearch = async () => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          localFilters.location
        )}.json?access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }&fuzzyMatch=true`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setLocalFilters((prev) => ({
          ...prev,
          coordinates: [lng, lat],
        }));
      }
    } catch (err) {
      console.error("Error search location:", err);
    }
  };

  if (!isFiltersFullOpen) return null;

  return (
    <div className="bg-white rounded-lg px-4 h-full overflow-auto pb-10">
      <div className="flex flex-col space-y-6">
        {/* Location */}
        <div>
          <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Location</h4>
          <Select
            value={localFilters.location || "any"}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({ ...prev, location: value }))
            }
          >
            <SelectTrigger className="w-full rounded-xl border-gray-100 bg-gray-50/50 p-4 h-12">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" />
                <SelectValue placeholder="Location" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-100 shadow-2xl">
              <SelectItem value="any">All Locations</SelectItem>
              <SelectItem value="Kilimani">Kilimani</SelectItem>
              <SelectItem value="Kileleshwa">Kileleshwa</SelectItem>
              <SelectItem value="Westlands">Westlands</SelectItem>
              <SelectItem value="Lavington">Lavington</SelectItem>
              <SelectItem value="Karen">Karen</SelectItem>
              <SelectItem value="Riverside Drive">Riverside Drive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div>
          <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Property Type</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
              <div
                key={type}
                className={cn(
                  "flex flex-col items-center justify-center p-4 border rounded-2xl cursor-pointer transition-all duration-300",
                  localFilters.propertyType === type
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-gray-100 bg-white hover:border-secondary/30"
                )}
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    propertyType: type as PropertyTypeEnum,
                  }))
                }
              >
                <Icon className={cn("w-5 h-5 mb-2", localFilters.propertyType === type ? "text-primary" : "text-gray-400")} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Monthly Price (KSh)</h4>
          <Slider
            min={0}
            max={1000000}
            step={10000}
            value={[
              localFilters.priceRange[0] ?? 0,
              localFilters.priceRange[1] ?? 1000000,
            ]}
            onValueChange={(value: any) =>
              setLocalFilters((prev) => ({
                ...prev,
                priceRange: value as [number, number],
              }))
            }
          />
          <div className="flex justify-between mt-3">
            <span className="text-[10px] font-bold text-gray-400">KSh {(localFilters.priceRange[0] ?? 0).toLocaleString()}</span>
            <span className="text-[10px] font-bold text-gray-400">KSh {(localFilters.priceRange[1] ?? 1000000).toLocaleString()}</span>
          </div>
        </div>

        {/* Beds and Baths */}
        <div className="flex gap-4">
          <div className="flex-1">
            <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Beds</h4>
            <Select
              value={localFilters.beds || "any"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, beds: value }))
              }
            >
              <SelectTrigger className="w-full rounded-xl border-gray-100 bg-gray-50/50">
                <SelectValue placeholder="Beds" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-xl">
                <SelectItem value="any">Any beds</SelectItem>
                <SelectItem value="1">1+ bed</SelectItem>
                <SelectItem value="2">2+ beds</SelectItem>
                <SelectItem value="3">3+ beds</SelectItem>
                <SelectItem value="4">4+ beds</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Baths</h4>
            <Select
              value={localFilters.baths || "any"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, baths: value }))
              }
            >
              <SelectTrigger className="w-full rounded-xl border-gray-100 bg-gray-50/50">
                <SelectValue placeholder="Baths" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-xl">
                <SelectItem value="any">Any baths</SelectItem>
                <SelectItem value="1">1+ bath</SelectItem>
                <SelectItem value="2">2+ baths</SelectItem>
                <SelectItem value="3">3+ baths</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(AmenityIcons).map(([amenity, Icon]) => (
              <div
                key={amenity}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 border rounded-xl cursor-pointer transition-all",
                  localFilters.amenities.includes(amenity as AmenityEnum)
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-100 bg-white hover:border-gray-200"
                )}
                onClick={() => handleAmenityChange(amenity as AmenityEnum)}
              >
                <Icon className={cn("w-4 h-4", localFilters.amenities.includes(amenity as AmenityEnum) ? "text-primary" : "text-gray-400")} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {formatEnumString(amenity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Apply and Reset buttons */}
        <div className="flex flex-col gap-3 mt-8">
          <Button
            onClick={handleSubmit}
            className="w-full bg-primary text-secondary font-black py-6 rounded-2xl hover:bg-primary/95 transition-all shadow-lg uppercase tracking-[0.15em] text-xs"
          >
            Apply Filters
          </Button>
          <Button
            onClick={handleReset}
            variant="ghost"
            className="w-full text-gray-400 font-bold hover:text-primary transition-all uppercase tracking-widest text-[10px]"
          >
            Reset All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersFull;
