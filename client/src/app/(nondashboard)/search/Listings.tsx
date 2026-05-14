"use client";

import {
  useAddFavoritePropertyMutation,
  useGetAuthUserQuery,
  useGetPropertiesQuery,
  useGetTenantQuery,
  useRemoveFavoritePropertyMutation,
} from "@/state/api";
import { useAppSelector } from "@/state/redux";
import { Property } from "@/types/prismaTypes";
import Card from "@/components/Card";
import React from "react";
import CardCompact from "@/components/CardCompact";
import Loading from "@/components/Loading";

interface ListingsProps {
  initialProperties?: Property[];
}

const Listings = ({ initialProperties }: ListingsProps) => {
  const { data: authUser } = useGetAuthUserQuery();
  const { data: tenant } = useGetTenantQuery(
    authUser?.userInfo?.authId || "",
    {
      skip: !authUser?.userInfo?.authId,
    }
  );
  const [addFavorite] = useAddFavoritePropertyMutation();
  const [removeFavorite] = useRemoveFavoritePropertyMutation();
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const filters = useAppSelector((state) => state.global.filters);

  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters, {
    // If we have initial properties, we don't strictly need to show "Loading..." 
    // but RTK query will still fetch the latest.
  });

  const displayProperties = properties || initialProperties;
  const isCurrentlyLoading = isLoading && !displayProperties;

  const handleFavoriteToggle = async (propertyId: number) => {
    if (!authUser) return;

    const isFavorite = tenant?.favorites?.some(
      (fav: Property) => fav.id === propertyId
    );

    if (isFavorite) {
      await removeFavorite({
        authId: authUser.userInfo.authId,
        propertyId,
      });
    } else {
      await addFavorite({
        authId: authUser.userInfo.authId,
        propertyId,
      });
    }
  };

  if (isCurrentlyLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[60vh]">
        <Loading />
      </div>
    );
  }
  if (isError || !displayProperties) return <div className="p-10 text-center font-bold">Failed to fetch properties</div>;

  return (
    <div className="w-full h-full">
      <div className="px-4 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
        <h3 className="text-sm font-bold">
          {displayProperties.length}{" "}
          <span className="text-gray-700 font-normal">
            Places in {filters.location || "Nairobi"}
          </span>
        </h3>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayProperties?.map((property) =>
            viewMode === "grid" ? (
              <Card
                key={property.id}
                property={property}
                isFavorite={
                  tenant?.favorites?.some(
                    (fav: Property) => fav.id === property.id
                  ) || false
                }
                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                showFavoriteButton={!!authUser}
                propertyLink={`/search/${property.slug}`}
              />
            ) : (
              <CardCompact
                key={property.id}
                property={property}
                isFavorite={
                  tenant?.favorites?.some(
                    (fav: Property) => fav.id === property.id
                  ) || false
                }
                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                showFavoriteButton={!!authUser}
                propertyLink={`/search/${property.slug}`}
              />
            )
          )}
        </div>
        
        {displayProperties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <span className="text-4xl">🏠</span>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">No properties found</h3>
            <p className="text-gray-500 max-w-xs">
              We couldn&apos;t find any properties matching your current filters. Try adjusting your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;
