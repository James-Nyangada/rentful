"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const MissionSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      });

      tl.from(".mission-heading", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }).from(".mission-pillar", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      }, "-=0.4");
    });
      }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-background pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Mission Statement */}
        <div className="mission-heading text-center mb-24 max-w-4xl mx-auto">
          <span className="inline-block text-secondary font-bold text-xs tracking-[0.2em] uppercase mb-6">
            Our Mission
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-primary leading-tight font-bold">
            &quot;To empower property owners and investors
            through a high-velocity, data-driven listing
            ecosystem. We are committed to de-risking the
            real estate journey by providing verified, elite
            property solutions and luxury real estate Nairobi that prioritize stability,
            integrity, and seamless acquisition in high-end residential nodes.&quot;
          </h2>
        </div>

        {/* Three Pillars */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {/* Pillar I: Market Velocity */}
          <div className="mission-pillar flex flex-col items-center text-center group">
            <div className="w-full aspect-square relative rounded-2xl overflow-hidden mb-8 shadow-lg">
              <Image 
                src="/about/about_elegance_2.png" 
                alt="Market Velocity" 
                fill 
                className="object-cover editorial-warm group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <h3 className="text-xl font-playfair font-bold text-primary mb-4">I. Market Velocity & Sales</h3>
            <p className="text-foreground/80 font-inter text-sm leading-relaxed">
              We employ high-volume approaches to guarantee immediate access to apartments for sale in Lavington and Westlands commercial property.
            </p>
          </div>

          {/* Pillar II: Inventory Integrity */}
          <div className="mission-pillar flex flex-col items-center text-center group">
            <div className="w-full aspect-square relative rounded-2xl overflow-hidden mb-8 shadow-lg">
              <Image 
                src="/about/about_family.png" 
                alt="Inventory Integrity" 
                fill 
                className="object-cover editorial-warm group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <h3 className="text-xl font-playfair font-bold text-primary mb-4">II. Inventory Integrity</h3>
            <p className="text-foreground/80 font-inter text-sm leading-relaxed">
              Our rigorous verification process for verified property listings Kenya completely de-risks acquisitions, ensuring absolute peace of mind.
            </p>
          </div>

          {/* Pillar III: High-End Nodes */}
          <div className="mission-pillar flex flex-col items-center text-center group">
            <div className="w-full aspect-square relative rounded-2xl overflow-hidden mb-8 shadow-lg">
              <Image 
                src="/about/about_elegance_3.png" 
                alt="High-End Nodes" 
                fill 
                className="object-cover editorial-warm group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <h3 className="text-xl font-playfair font-bold text-primary mb-4">III. High-End Nodes & Listings</h3>
            <p className="text-foreground/80 font-inter text-sm leading-relaxed">
              We curate a highly exclusive portfolio of Kilimani luxury listings and houses for rent in Kileleshwa across Kenya&apos;s most sought-after neighborhoods.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
