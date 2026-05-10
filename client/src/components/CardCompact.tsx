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
    property.photoUrls?.[0] || "/placeholder_1.png"
  );

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full flex h-40 mb-5">
      <div className="relative w-1/3">
        <Image
          src={imgSrc}
          alt={property.name}
          fill
          className="object-cover object-[85%_top]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc("/placeholder_1.png")}
        />
        <div className="absolute top-2 left-2 flex gap-1 flex-col">
          {property.isPetsAllowed && (
            <span className="bg-white/90 backdrop-blur-sm text-primary text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              Pets
            </span>
          )}
          {property.isParkingIncluded && (
            <span className="bg-white/90 backdrop-blur-sm text-primary text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              Parking
            </span>
          )}
        </div>

        <div className="absolute bottom-2 left-2 right-2 flex gap-1 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm text-primary flex items-center gap-1 px-1.5 py-1 rounded shadow-sm border border-white/20">
            <Bed className="w-2.5 h-2.5" />
            <span className="text-[9px] font-bold">{property.beds}</span>
          </div>
          <div className="bg-white/90 backdrop-blur-sm text-primary flex items-center gap-1 px-1.5 py-1 rounded shadow-sm border border-white/20">
            <Bath className="w-2.5 h-2.5" />
            <span className="text-[9px] font-bold">{property.baths}</span>
          </div>
          <div className="bg-white/90 backdrop-blur-sm text-primary flex items-center gap-1 px-1.5 py-1 rounded shadow-sm border border-white/20">
            <House className="w-2.5 h-2.5" />
            <span className="text-[9px] font-bold">{property.squareFeet}</span>
          </div>
        </div>
      </div>
      <div className="w-2/3 p-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-primary truncate">
                {propertyLink ? (
                  <Link
                    href={propertyLink}
                    className="hover:text-secondary transition-colors"
                    scroll={false}
                  >
                    {property.name}
                  </Link>
                ) : (
                  property.name
                )}
              </h2>
              <p className="text-foreground/60 text-[10px] font-medium truncate mb-1">
                {property?.location?.address}, {property?.location?.city}
              </p>
              <div className="flex text-[10px] items-center">
                <Star className="w-2.5 h-2.5 text-secondary fill-secondary mr-1" />
                <span className="font-bold text-primary">
                  {property.averageRating.toFixed(1)}
                </span>
                <span className="text-foreground/40 ml-1">
                  ({property.numberOfReviews})
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-base font-black text-secondary tracking-tighter leading-none">
                kes {property.pricePerMonth.toLocaleString()}
              </p>
              <span className="text-[8px] font-bold text-foreground/40 uppercase block mt-1">/ mo</span>
              
              {showFavoriteButton && (
                <button
                  className="mt-2 bg-white rounded-full p-1.5 shadow-sm border border-gray-100 hover:scale-110 transition-transform"
                  onClick={onFavoriteToggle}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
                    }`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center mt-auto">
          <Link
            href={propertyLink || "#"}
            className="text-[10px] font-bold text-primary hover:text-secondary transition-colors uppercase tracking-widest"
            scroll={false}
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardCompact;
