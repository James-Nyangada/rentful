import { Bath, Bed, Heart, House, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const CardCompact = ({
  property,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
}: CardCompactProps) => {
  const [imgSrc, setImgSrc] = useState(
    property.photoUrls?.[0] || "/placeholder.jpg"
  );

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full flex h-40 mb-5">
      <div className="relative w-1/3">
        <Image
          src={imgSrc}
          alt={property.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc("/placeholder.jpg")}
        />
        <div className="absolute bottom-2 left-2 flex gap-1 flex-col">
          {property.isPetsAllowed && (
            <span className="bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-full w-fit">
              Pets
            </span>
          )}
          {property.isParkingIncluded && (
            <span className="bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-full">
              Parking
            </span>
          )}
        </div>
      </div>
      <div className="w-2/3 p-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-bold mb-1 text-primary">
              {propertyLink ? (
                <Link
                  href={propertyLink}
                  className="hover:underline hover:text-secondary"
                  scroll={false}
                >
                  {property.name}
                </Link>
              ) : (
                property.name
              )}
            </h2>
            {showFavoriteButton && (
              <button
                className="bg-white rounded-full p-1 shadow-sm border border-gray-100"
                onClick={onFavoriteToggle}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
                  }`}
                />
              </button>
            )}
          </div>
          <p className="text-foreground/60 mb-1 text-xs font-medium">
            {property?.location?.address}, {property?.location?.city}
          </p>
          <div className="flex text-xs items-center">
            <Star className="w-3 h-3 text-secondary fill-secondary mr-1" />
            <span className="font-bold text-primary">
              {property.averageRating.toFixed(1)}
            </span>
            <span className="text-foreground/50 ml-1">
              ({property.numberOfReviews})
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs">
          <div className="flex gap-3 text-primary font-bold">
            <span className="flex items-center">
              <Bed className="w-4 h-4 mr-1 text-primary" />
              {property.beds}
            </span>
            <span className="flex items-center">
              <Bath className="w-4 h-4 mr-1 text-primary" />
              {property.baths}
            </span>
            <span className="flex items-center">
              <House className="w-4 h-4 mr-1 text-primary" />
              {property.squareFeet}
            </span>
          </div>

          <p className="text-base font-black text-secondary tracking-tighter">
            kes {property.pricePerMonth.toLocaleString()}
            <span className="text-foreground/60 text-[10px] font-bold ml-1">/mo</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardCompact;
