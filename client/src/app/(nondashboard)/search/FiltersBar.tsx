import {
  FiltersState,
  setFilters,
  setViewMode,
  toggleFiltersFullOpen,
} from "@/state";
import { useAppSelector } from "@/state/redux";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { cleanParams, cn, formatPriceValue } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyTypeIcons } from "@/lib/constants";

const FiltersBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useAppSelector((state) => state.global.filters);
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const [searchInput, setSearchInput] = useState(filters.location);

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

  const handleFilterChange = (
    key: string,
    value: any,
    isMin: boolean | null
  ) => {
    let newValue = value;

    if (key === "priceRange" || key === "squareFeet") {
      const currentArrayRange = [...filters[key]];
      if (isMin !== null) {
        const index = isMin ? 0 : 1;
        currentArrayRange[index] = value === "any" ? null : Number(value);
      }
      newValue = currentArrayRange;
    } else if (key === "coordinates") {
      newValue = value === "any" ? [0, 0] : value.map(Number);
    } else {
      newValue = value === "any" ? "any" : value;
    }

    const newFilters = { ...filters, [key]: newValue };
    dispatch(setFilters(newFilters));
    updateURL(newFilters);
  };

  const handleLocationSearch = async () => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchInput
        )}.json?access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }&fuzzyMatch=true`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        dispatch(
          setFilters({
            location: searchInput,
            coordinates: [lng, lat],
          })
        );
      }
    } catch (err) {
      console.error("Error search location:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center w-full py-2 md:py-4 gap-2 md:gap-4">
      {/* Scrollable Filters Container */}
      <div className="flex items-center gap-2 md:gap-3 w-full overflow-x-auto pb-2 md:pb-0 scrollbar-hide px-0">
        {/* All Filters Button */}
        <Button
          variant="outline"
          className={cn(
            "flex-shrink-0 gap-2 rounded-xl border-gray-200 hover:bg-primary hover:text-white transition-all",
            isFiltersFullOpen && "bg-primary text-white border-primary"
          )}
          onClick={() => dispatch(toggleFiltersFullOpen())}
        >
          <Filter className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
        </Button>

        <div className="h-8 w-px bg-gray-100 flex-shrink-0 hidden md:block" />

        {/* Search Location */}
        <Select
          value={filters.location || "any"}
          onValueChange={(value) => handleFilterChange("location", value, null)}
        >
          <SelectTrigger className="w-auto min-w-[160px] flex-shrink-0 rounded-xl border-gray-200 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary" />
              <span className="text-xs font-bold text-primary">Location:</span>
              <SelectValue placeholder="All" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-100 shadow-xl">
            <SelectItem value="any">All Locations</SelectItem>
            <SelectItem value="Kilimani">Kilimani</SelectItem>
            <SelectItem value="Kileleshwa">Kileleshwa</SelectItem>
            <SelectItem value="Westlands">Westlands</SelectItem>
            <SelectItem value="Lavington">Lavington</SelectItem>
            <SelectItem value="Karen">Karen</SelectItem>
            <SelectItem value="Riverside Drive">Riverside Drive</SelectItem>
          </SelectContent>
        </Select>

        {/* Beds */}
        <Select
          value={filters.beds}
          onValueChange={(value) => handleFilterChange("beds", value, null)}
        >
          <SelectTrigger className="w-auto min-w-[100px] flex-shrink-0 rounded-xl border-gray-200 bg-gray-50/50">
            <SelectValue placeholder="Beds" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-100 shadow-xl">
            <SelectItem value="any">Any Beds</SelectItem>
            <SelectItem value="1">1+ Bed</SelectItem>
            <SelectItem value="2">2+ Beds</SelectItem>
            <SelectItem value="3">3+ Beds</SelectItem>
            <SelectItem value="4">4+ Beds</SelectItem>
          </SelectContent>
        </Select>

        {/* Property Type */}
        <Select
          value={filters.propertyType || "any"}
          onValueChange={(value) =>
            handleFilterChange("propertyType", value, null)
          }
        >
          <SelectTrigger className="w-auto min-w-[130px] flex-shrink-0 rounded-xl border-gray-200 bg-gray-50/50">
            <SelectValue placeholder="Home Type" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-100 shadow-xl">
            <SelectItem value="any">All Types</SelectItem>
            {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
              <SelectItem key={type} value={type}>
                <div className="flex items-center">
                  <Icon className="w-4 h-4 mr-2 text-primary/70" />
                  <span className="text-sm">{type}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* View Mode & Actions (Fixed Right on Desktop) */}
      <div className="flex items-center gap-4 flex-shrink-0 self-end md:self-center px-4 md:px-0">
        <div className="flex items-center bg-gray-100 p-1 rounded-xl">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-10 rounded-lg transition-all",
              viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-primary"
            )}
            onClick={() => dispatch(setViewMode("list"))}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-10 rounded-lg transition-all",
              viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-primary"
            )}
            onClick={() => dispatch(setViewMode("grid"))}
          >
            <Grid className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
