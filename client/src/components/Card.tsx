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
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 w-full mb-6 border border-gray-100 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={imgSrc}
          alt={property.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc("/placeholder.jpg")}
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
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2.5 cursor-pointer shadow-lg transition-all hover:scale-110 active:scale-90"
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

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-1.5 text-primary font-bold mb-4">
          <div className="flex flex-col items-center p-1.5 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
            <Bed className="w-4 h-4 mb-1 text-primary/70" />
            <span className="text-[10px]">{property.beds} Bed</span>
          </div>
          <div className="flex flex-col items-center p-1.5 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
            <Bath className="w-4 h-4 mb-1 text-primary/70" />
            <span className="text-[10px]">{property.baths} Bath</span>
          </div>
          <div className="flex flex-col items-center p-1.5 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
            <House className="w-4 h-4 mb-1 text-primary/70" />
            <span className="text-[10px] whitespace-nowrap">{property.squareFeet} sq ft</span>
          </div>
        </div>

        <div className="mb-3">
          <h2 className="text-lg md:text-xl font-bold mb-1 text-primary line-clamp-1">
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
          <p className="text-foreground/60 text-sm font-medium line-clamp-2 mb-4">
            {property?.location?.address}, {property?.location?.city}
          </p>
        </div>

        <div className="flex flex-wrap justify-between items-end gap-2">
          <div className="text-left w-full">
            <p className="text-xl font-black text-secondary tracking-tighter leading-none">
              kes {property.pricePerMonth.toLocaleString()}
            </p>
            <span className="text-foreground/40 text-[10px] font-black uppercase tracking-widest">
              {(property as any).isSale ? "Full Price" : "Per Month"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
