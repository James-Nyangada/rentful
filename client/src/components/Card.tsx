import { Bath, Bed, Heart, House } from "lucide-react";
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
    property.photoUrls?.[0] || "/placeholder_1.png"
  );

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 w-full mb-6 border border-gray-100 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={imgSrc}
          alt={property.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc("/placeholder_1.png")}
        />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-2">
            {property.isPetsAllowed && (
              <span className="bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm pointer-events-auto">
                Pets OK
              </span>
            )}
            {property.isParkingIncluded && (
              <span className="bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm pointer-events-auto">
                Parking
              </span>
            )}
          </div>
          <span className={`${(property as any).isSale ? "bg-secondary" : "bg-primary"} text-white text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg shadow-xl pointer-events-auto`}>
            {(property as any).isSale ? "Sale" : "Rent"}
          </span>
        </div>

        {showFavoriteButton && (
          <button
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2.5 cursor-pointer shadow-lg transition-all hover:scale-110 active:scale-90 z-10"
            onClick={onFavoriteToggle}
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
              }`}
            />
          </button>
        )}

        {/* Property Features Overlay */}
        <div className="absolute bottom-4 left-4 flex gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-primary px-2.5 py-1.5 rounded-xl shadow-sm border border-white/20">
            <Bed className="w-3.5 h-3.5 text-primary/70" />
            <span className="text-[11px] font-bold">{property.beds}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-primary px-2.5 py-1.5 rounded-xl shadow-sm border border-white/20">
            <Bath className="w-3.5 h-3.5 text-primary/70" />
            <span className="text-[11px] font-bold">{property.baths}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-primary px-2.5 py-1.5 rounded-xl shadow-sm border border-white/20">
            <House className="w-3.5 h-3.5 text-primary/70" />
            <span className="text-[11px] font-bold whitespace-nowrap">
              {property.squareFeet} <span className="text-[9px] font-medium opacity-70">sq ft</span>
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-1">
          <h2 className="text-lg md:text-xl font-bold text-primary line-clamp-1 flex-1">
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
          <div className="text-right flex-shrink-0">
            <p className="text-xl font-black text-secondary tracking-tight leading-none">
              kes {property.pricePerMonth.toLocaleString()}
            </p>
            <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest block mt-1">
              {(property as any).isSale ? "Full Price" : "Per Month"}
            </span>
          </div>
        </div>

        <p className="text-foreground/60 text-sm font-medium line-clamp-2">
          {property?.location?.address}, {property?.location?.city}
        </p>
      </div>
    </div>
  );
};

export default Card;
