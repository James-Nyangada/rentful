import { Bath, Bed, Heart, House, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Card = ({
  property,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
}: CardProps) => {
  const [imgSrc, setImgSrc] = useState(
    property.photoUrls?.[0] || "/placeholder.jpg"
  );

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full mb-5">
      <div className="relative">
        <div className="w-full h-48 relative">
          <Image
            src={imgSrc}
            alt={property.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc("/placeholder.jpg")}
          />
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {property.isPetsAllowed && (
            <span className="bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-full">
              Pets Allowed
            </span>
          )}
          {property.isParkingIncluded && (
            <span className="bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-full">
              Parking Included
            </span>
          )}
        </div>
        {showFavoriteButton && (
          <button
            className="absolute bottom-4 right-4 bg-white hover:bg-white/90 rounded-full p-2 cursor-pointer"
            onClick={onFavoriteToggle}
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
              }`}
            />
          </button>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-1 text-primary">
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
        <p className="text-foreground/70 mb-2 text-sm font-medium">
          {property?.location?.address}, {property?.location?.city}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center mb-2">
            <Star className="w-4 h-4 text-secondary fill-secondary mr-1" />
            <span className="font-bold text-primary">
              {property.averageRating.toFixed(1)}
            </span>
            <span className="text-foreground/60 text-xs ml-1 font-medium">
              ({property.numberOfReviews} Reviews)
            </span>
          </div>
          <p className="text-xl font-black text-secondary mb-3 tracking-tighter">
            kes {property.pricePerMonth.toLocaleString()}{" "}
            <span className="text-foreground/60 text-sm font-bold"> /month</span>
          </p>
        </div>
        <hr className="border-gray-100" />
        <div className="flex justify-between items-center gap-4 text-primary font-bold mt-5">
          <span className="flex items-center text-sm">
            <Bed className="w-5 h-5 mr-2 text-primary" />
            {property.beds} Bed
          </span>
          <span className="flex items-center text-sm">
            <Bath className="w-5 h-5 mr-2 text-primary" />
            {property.baths} Bath
          </span>
          <span className="flex items-center text-sm">
            <House className="w-5 h-5 mr-2 text-primary" />
            {property.squareFeet} sq ft
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
