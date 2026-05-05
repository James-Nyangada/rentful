"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGetRecentPropertiesQuery } from "@/state/api";
import Card from "@/components/Card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const RecentListingsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: properties, isLoading } = useGetRecentPropertiesQuery(6);

  useGSAP(() => {
    if (!isLoading && properties && properties.length > 0) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      });

      tl.from(".recent-heading", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }).from(".recent-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      }, "-=0.4").from(".recent-button", {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, "-=0.4");
    }
  }, { scope: containerRef, dependencies: [isLoading, properties] });

  return (
    <section ref={containerRef} className="py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-gray-50">
      <div className="max-w-6xl xl:max-w-7xl mx-auto">
        <div className="recent-heading text-center mb-16">
          <span className="inline-block text-secondary font-bold text-xs tracking-[0.2em] uppercase mb-4">
            New Arrivals
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight uppercase">
            Recent Listings
          </h2>
          <p className="mt-4 text-foreground/70 max-w-2xl mx-auto font-medium text-lg">
            Explore our latest additions to the luxury portfolio. From modern apartments to sprawling estates, discover your next signature property.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {properties.map((property) => (
              <div key={property.id} className="recent-card">
                <Card
                  property={property}
                  isFavorite={false}
                  onFavoriteToggle={() => {}}
                  showFavoriteButton={false}
                  propertyLink={`/search/${property.slug}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-foreground/60 font-medium text-lg">
            No recent listings available at the moment.
          </div>
        )}

        <div className="recent-button flex justify-center mt-12">
          <Link
            href="/search"
            className="inline-block text-white rounded-2xl px-12 py-5 font-black uppercase tracking-widest transition-all shadow-[0_15px_30px_-10px_rgba(212,175,55,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(212,175,55,0.6)] hover:-translate-y-1"
            style={{ backgroundColor: "#D4AF37" }}
            scroll={false}
          >
            View More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentListingsSection;
