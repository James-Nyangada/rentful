import React, { Suspense } from "react";
import SearchClient from "./SearchClient";
import Listings from "./Listings";
import Loading from "@/components/Loading";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

async function getProperties(searchParams: { [key: string]: string | undefined }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";
  
  const urlParams = new URLSearchParams();
  
  if (searchParams.location) urlParams.append("location", searchParams.location);
  if (searchParams.priceRange) {
    const range = searchParams.priceRange.split(",");
    if (range[0]) urlParams.append("priceMin", range[0]);
    if (range[1]) urlParams.append("priceMax", range[1]);
  }
  if (searchParams.beds) urlParams.append("beds", searchParams.beds);
  if (searchParams.baths) urlParams.append("baths", searchParams.baths);
  if (searchParams.propertyType) urlParams.append("propertyType", searchParams.propertyType);
  if (searchParams.squareFeet) {
    const range = searchParams.squareFeet.split(",");
    if (range[0]) urlParams.append("squareFeetMin", range[0]);
    if (range[1]) urlParams.append("squareFeetMax", range[1]);
  }
  if (searchParams.amenities) urlParams.append("amenities", searchParams.amenities);
  if (searchParams.availableFrom) urlParams.append("availableFrom", searchParams.availableFrom);
  if (searchParams.isSale !== undefined) {
    urlParams.append("isSale", searchParams.isSale);
  } else if (searchParams.type === "buy") {
    urlParams.append("isSale", "true");
  } else if (searchParams.type === "rent") {
    urlParams.append("isSale", "false");
  }

  if (searchParams.coordinates) {
    const coords = searchParams.coordinates.split(",");
    if (coords[0]) urlParams.append("longitude", coords[0]);
    if (coords[1]) urlParams.append("latitude", coords[1]);
  }

  try {
    const response = await fetch(`${baseUrl}/properties?${urlParams.toString()}`, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error("Failed to fetch properties on server:", error);
    return [];
  }
}

async function ListingsContainer({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const initialProperties = await getProperties(searchParams);
  return <Listings initialProperties={initialProperties} />;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const resolvedParams = await searchParams;

  return (
    <SearchClient>
      <Suspense fallback={<Loading />}>
        <ListingsContainer searchParams={resolvedParams} />
      </Suspense>
    </SearchClient>
  );
};

export default SearchPage;
