"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Home, Key, ArrowRight, Building2, Zap, ShieldCheck } from "lucide-react";
import FooterSection from "../landing/FooterSection";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const areas = [
  {
    city: "Kilimani",
    tagline: "Contemporary Living, Prime Address",
    description:
      "Sitting at the crossroads of convenience and sophistication, Kilimani is a fast-growing residential area with a thriving restaurant scene, boutique shops, and a growing skyline of luxury apartments.",
    highlights: ["Trendy Restaurants", "Boutique Living", "Growing Skyline"],
    coverImage: "/neighborhoods/kilimani.png",
  },
  {
    city: "Kileleshwa",
    tagline: "Where Tranquility Meets Convenience",
    description:
      "A leafy, upmarket neighbourhood favoured by professionals and young families, Kileleshwa combines a peaceful suburban atmosphere with easy access to Westlands and the city centre.",
    highlights: ["Quiet Streets", "Modern Apartments", "Central Access"],
    coverImage: "/neighborhoods/kileleshwa.png",
  },
  {
    city: "Westlands",
    tagline: "The Heartbeat of Urban Luxury",
    description:
      "Nairobi's premier commercial and lifestyle hub, Westlands offers a dynamic blend of modern high-rise living, world-class dining, and vibrant nightlife—all within minutes of the CBD.",
    highlights: ["Prime Location", "Modern High-Rises", "Vibrant Lifestyle"],
    coverImage: "/neighborhoods/westlands.png",
  },
  {
    city: "Lavington",
    tagline: "Serene Living, Elevated Standards",
    description:
      "One of Nairobi's most prestigious residential neighbourhoods, Lavington is known for its tree-lined avenues, spacious compounds, and proximity to top-tier international schools and shopping centres.",
    highlights: ["Gated Communities", "Lush Gardens", "Family-Friendly"],
    coverImage: "/neighborhoods/lavington.png",
  },
  {
    city: "Karen",
    tagline: "Estate Living, Timeless Prestige",
    description:
      "Named after Karen Blixen, this exclusive suburb offers sprawling estates, equestrian culture, and a countryside feel just minutes from the city. Karen is the gold standard for luxury living in Nairobi.",
    highlights: ["Sprawling Estates", "Equestrian Culture", "Privacy"],
    coverImage: "/neighborhoods/karen.png",
  },
  {
    city: "Riverside Drive",
    tagline: "Prestige Along the River",
    description:
      "One of Nairobi's most iconic addresses, Riverside Drive is home to embassies, international organisations, and premium residences. Its central location and lush surroundings make it ideal for discerning professionals.",
    highlights: ["Diplomatic Zone", "Central Location", "Premium Residences"],
    coverImage: "/neighborhoods/riverside.png",
  },
];

export default function ExclusiveAreasPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      gsap.from(".areas-hero-text", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
        stagger: 0.2,
      });

      gsap.utils.toArray(".area-card").forEach((card: any) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
          },
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      });

      const pillarTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".pillars-section",
          start: "top 95%",
        },
      });

      pillarTl.from(".pillar-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

      gsap.from(".mission-content", {
        scrollTrigger: {
          trigger: ".mission-section",
          start: "top 95%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      ScrollTrigger.refresh();
    });
        },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[450px] flex items-center justify-center overflow-hidden">
        <Image
          src="/about/about_hero_bg.png"
          alt="Exclusive Areas background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/50"></div>
        <div className="relative z-10 text-center text-white mt-10 px-4">
          <div className="areas-hero-text text-xs font-black mb-6 uppercase tracking-[0.3em] text-secondary">
            Home &gt; Exclusive Areas
          </div>
          <h1 className="areas-hero-text text-6xl md:text-8xl font-black tracking-tighter uppercase drop-shadow-2xl">
            Exclusive Areas
          </h1>
          <p className="areas-hero-text mt-6 text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Explore Nairobi&apos;s most coveted neighbourhoods. Buy or rent in
            the areas that define elevated living.
          </p>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="pillars-section py-24 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-6xl xl:max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-secondary font-bold text-xs tracking-[0.2em] uppercase mb-4">
              The Chestone Edge
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight uppercase">
              Why Choose Chestone
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Pillar I */}
            <div className="pillar-card group bg-gray-50 rounded-[2.5rem] p-8 md:p-10 border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/5 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
              <div className="relative z-10">
                <div className="bg-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-300">
                  <Zap className="text-primary group-hover:text-secondary w-8 h-8 transition-colors duration-300" />
                </div>
                <span className="text-secondary font-black text-[10px] tracking-[0.3em] uppercase mb-3 block">
                  Pillar I
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-primary tracking-tighter uppercase mb-6 leading-tight">
                  Market Velocity & Property Management Lavington
                </h3>
                <p className="text-foreground/70 text-lg leading-relaxed font-medium">
                  We leverage a high-volume approach and expert property management Lavington to ensure our clients have immediate access to the most sought-after high-end residential nodes.
                </p>
              </div>
            </div>

            {/* Pillar II */}
            <div className="pillar-card group bg-gray-50 rounded-[2.5rem] p-8 md:p-10 border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
              <div className="relative z-10">
                <div className="bg-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-300">
                  <ShieldCheck className="text-primary group-hover:text-secondary w-8 h-8 transition-colors duration-300" />
                </div>
                <span className="text-secondary font-black text-[10px] tracking-[0.3em] uppercase mb-3 block">
                  Pillar II
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-primary tracking-tighter uppercase mb-6 leading-tight">
                  Inventory Integrity & Asset De-risking
                </h3>
                <p className="text-foreground/70 text-lg leading-relaxed font-medium">
                  Every listing in the Chestone portfolio undergoes a rigorous verification process, ensuring absolute asset de-risking for Nairobi property investors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-section bg-gray-50 py-24 md:py-32 px-6">
        <div className="max-w-6xl xl:max-w-7xl mx-auto">
          <div className="mission-content grid md:grid-cols-2 gap-0 items-stretch bg-white rounded-[3rem] overflow-hidden shadow-[0_30px_100px_-20px_rgba(10,31,59,0.15)] border border-gray-100">
            <div className="p-12 md:p-20 flex flex-col justify-center">
              <h3 className="text-3xl font-black text-primary mb-8 uppercase tracking-tight leading-none border-l-8 border-secondary pl-6">
                Path to Real Estate Excellence
              </h3>
              <p className="text-foreground/70 mb-10 text-lg leading-relaxed font-medium">
                We are dedicated to redefining the real estate experience by providing unparalleled service, expert guidance, and access to the finest properties globally.
              </p>
              
              <div className="space-y-8 mb-12">
                <div>
                  <h4 className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-3">Our Mission</h4>
                  <p className="text-primary font-bold text-lg leading-relaxed">
                    To empower property owners and investors through a high-velocity, data-driven listing ecosystem. We are committed to de-risking the real estate journey by providing verified, elite property solutions that prioritize stability, integrity, and seamless acquisition in Nairobi&apos;s most exclusive residential nodes.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-3">Our Vision</h4>
                  <p className="text-primary font-bold text-lg leading-relaxed">
                    To be the definitive gateway for structured real estate in East Africa, recognized for redefining market transparency and setting the gold standard in premium property inventory.
                  </p>
                </div>
              </div>

              <Link
                href="/about"
                className="bg-primary text-secondary font-black px-10 py-5 rounded-2xl hover:bg-primary/95 transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-widest text-sm w-fit"
              >
                Explore Our Heritage
              </Link>
            </div>
            <div className="relative h-full min-h-[400px] md:min-h-[500px] w-full">
              <Image src="/about/about_mission.png" alt="Excellence" fill className="object-cover" />
              <div className="absolute inset-0 bg-primary/10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas Grid */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-6xl xl:max-w-7xl mx-auto flex flex-col gap-12">
          {areas.map((area, index) => {
            const isReversed = index % 2 !== 0;
            return (
              <div
                key={area.city}
                className={`area-card grid md:grid-cols-2 gap-0 items-stretch bg-white rounded-[3rem] overflow-hidden shadow-[0_30px_100px_-20px_rgba(10,31,59,0.12)] border border-gray-100 ${
                  isReversed ? "md:direction-rtl" : ""
                }`}
              >
                {/* Image Side */}
                <div
                  className={`relative min-h-[300px] md:min-h-[420px] w-full group ${
                    isReversed ? "md:order-2" : ""
                  }`}
                >
                  <Image
                    src={area.coverImage}
                    alt={`${area.city} neighbourhood`}
                    fill
                    className="object-cover object-[85%_top] group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-primary/10"></div>

                  {/* Location Badge */}
                  <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span className="text-primary font-black text-xs uppercase tracking-widest">
                      {area.city}
                    </span>
                  </div>
                </div>

                {/* Content Side */}
                <div
                  className={`p-8 md:p-10 lg:p-12 flex flex-col justify-center ${
                    isReversed ? "md:order-1" : ""
                  }`}
                >
                  <span className="text-secondary font-black text-[10px] tracking-[0.3em] uppercase mb-4 block">
                    {area.tagline}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tighter uppercase leading-[1.1] mb-6">
                    {area.city}
                  </h2>
                  <p className="text-foreground/70 text-lg leading-relaxed font-medium mb-8">
                    {area.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-3 mb-10">
                    {area.highlights.map((h) => (
                      <span
                        key={h}
                        className="inline-flex items-center bg-primary/5 text-primary text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-lg border border-primary/10"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Rent / Buy Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={`/search?location=${encodeURIComponent(
                        area.city
                      )}&isSale=false`}
                      className="inline-flex items-center justify-center gap-3 bg-primary text-white font-black px-8 py-5 rounded-2xl hover:bg-primary/90 transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-widest text-sm"
                    >
                      <Key className="w-5 h-5 text-secondary" />
                      Rent in {area.city}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                    <Link
                      href={`/search?location=${encodeURIComponent(
                        area.city
                      )}&isSale=true`}
                      className="inline-flex items-center justify-center gap-3 border-2 border-primary text-primary font-black px-8 py-5 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95 uppercase tracking-widest text-sm"
                    >
                      <Home className="w-5 h-5" />
                      Buy in {area.city}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto bg-primary rounded-[3.5rem] p-16 md:p-28 relative overflow-hidden shadow-[0_50px_120px_-20px_rgba(10,31,59,0.4)]">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary opacity-5 rounded-full transform translate-x-1/3 -translate-y-1/3 border-[60px] border-white"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white opacity-5 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col gap-4">
              <span className="text-secondary font-black tracking-[0.4em] uppercase text-xs">
                Can&apos;t Find Your Area?
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight max-w-xl tracking-tighter uppercase">
                Let Us Find Your Perfect Property
              </h2>
            </div>
            <Link
              href="/contact-us"
              className="bg-secondary text-primary font-black px-12 py-6 rounded-2xl hover:bg-white hover:text-primary transition-all whitespace-nowrap text-lg shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-widest"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
