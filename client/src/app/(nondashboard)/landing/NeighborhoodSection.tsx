"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const NeighborhoodSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const staticLocations = [
    { city: "Kilimani", coverImage: "/neighborhoods/kilimani.png" },
    { city: "Kileleshwa", coverImage: "/neighborhoods/kileleshwa.png" },
    { city: "Westlands", coverImage: "/neighborhoods/westlands.png" },
    { city: "Lavington", coverImage: "/neighborhoods/lavington.png" },
    { city: "Karen", coverImage: "/neighborhoods/karen.png" },
    { city: "Riverside Drive", coverImage: "/neighborhoods/riverside.png" },
  ];

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      tl.from(".neighborhood-heading", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }).from(
        ".neighborhood-card",
        {
          y: 50,
          opacity: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.4"
      );
    });
      }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="pt-24 pb-12 md:pb-16 px-6 sm:px-8 lg:px-12 xl:px-16 bg-white"
    >
      <div className="max-w-6xl xl:max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="neighborhood-heading text-center mb-16">
          <span className="inline-block text-secondary font-bold text-xs tracking-[0.2em] uppercase mb-4">
            Elite Regional Nodes
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight uppercase">
            Exclusive Areas
          </h2>
          <p className="mt-4 text-foreground/70 max-w-2xl mx-auto font-medium text-lg">
            Navigate Nairobi&apos;s most exclusive residential nodes. Each
            neighborhood has been curated for distinction, prestige, and
            elevated living.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {staticLocations.map((loc, index) => (
            <Link
              key={loc.city}
              href={`/search?location=${encodeURIComponent(loc.city)}`}
              scroll={false}
              className="neighborhood-card group relative overflow-hidden rounded-3xl shadow-lg cursor-pointer"
            >
              {/* Image */}
              <div className="relative w-full overflow-hidden h-[350px] lg:h-[450px]">
                {loc.coverImage ? (
                  <Image
                    src={loc.coverImage}
                    alt={`${loc.city} neighborhood`}
                    fill
                    className="object-cover object-[85%_top] group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-secondary/50" />
                  </div>
                )}

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-500" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span className="text-secondary font-bold text-xs uppercase tracking-[0.2em]">
                      Neighborhood
                    </span>
                  </div>
                  <h3 className="text-white font-black uppercase tracking-tight leading-tight text-xl lg:text-2xl">
                    {loc.city}
                  </h3>

                  {/* Hover indicator */}
                  <div className="mt-3 flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-secondary text-xs font-black uppercase tracking-widest">
                      Explore Area
                    </span>
                    <svg
                      className="w-4 h-4 text-secondary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NeighborhoodSection;
