"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import FiltersBar from "./FiltersBar";
import FiltersFull from "./FiltersFull";
import { cleanParams, cn } from "@/lib/utils";
import { setFilters } from "@/state";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface SearchClientProps {
  children: React.ReactNode;
}

const SearchClient = ({ children }: SearchClientProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );

  useEffect(() => {
    const initialFilters = Array.from(searchParams.entries()).reduce(
      (acc: any, [key, value]) => {
        if (key === "priceRange" || key === "squareFeet") {
          acc[key] = value.split(",").map((v) => (v === "" ? null : Number(v)));
        } else if (key === "coordinates") {
          acc[key] = value.split(",").map(Number);
        } else if (key === "isSale") {
          acc[key] = value === "true";
        } else if (key === "type") {
          acc["isSale"] = value === "buy";
        } else {
          acc[key] = value === "any" ? null : value;
        }

        return acc;
      },
      {}
    );

    const cleanedFilters = cleanParams(initialFilters);
    dispatch(setFilters(cleanedFilters));
  }, [searchParams, dispatch]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      gsap.from(".search-anim", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.1
      });
    });
    
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="w-full mx-auto px-5 flex flex-col"
      style={{
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <h1 className="sr-only">Luxury Apartments & Houses for Sale in Nairobi | Chestone Properties</h1>
      <div className="search-anim w-full sticky top-0 bg-background z-20 mt-2 md:mt-4">
        <FiltersBar />
      </div>

      <div className="flex flex-col md:flex-row justify-between flex-1 overflow-hidden relative gap-3 mb-5 px-0 md:px-5">
        <div
          className={cn(
            "h-full transition-all duration-300 ease-in-out z-[60]",
            "fixed inset-0 bg-white md:relative md:bg-transparent",
            isFiltersFullOpen
              ? "translate-x-0 opacity-100 visible w-full md:w-3/12"
              : "-translate-x-full md:translate-x-0 md:w-0 opacity-0 invisible"
          )}
        >
          <FiltersFull />
        </div>

        <div className={cn(
          "search-anim flex-1 overflow-y-auto min-h-0",
          isFiltersFullOpen && "hidden md:block"
        )}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SearchClient;
