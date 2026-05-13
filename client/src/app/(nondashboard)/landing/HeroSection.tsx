"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import SearchComponent from "./components/SearchComponent";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const HeroSection = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      gsap.from(".hero-content > *", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.2
      });
    });
      }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-start pt-32 md:pt-40 pb-24 md:pb-32 bg-primary overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/landing-splash-minimal.png"
          alt="Rentful Hero Section"
          fill
          className="object-cover object-center mix-blend-overlay"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary pointer-events-none"></div>
      
      <div
        className="hero-content relative w-full z-10 text-center"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 text-center drop-shadow-sm tracking-tighter uppercase leading-tight">
            Elevate Your Living
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 px-4">
            <Button
              onClick={() => router.push("/list-with-us")}
              className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-primary font-black rounded-xl px-10 h-16 text-lg uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              List with us <ArrowUpRight className="w-6 h-6 ml-2" />
            </Button>
            <Button
              onClick={() => router.push("/search")}
              className="w-full sm:w-auto border-2 border-secondary bg-transparent hover:bg-secondary text-secondary hover:text-primary font-black rounded-xl px-10 h-16 text-lg uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              View Listings <ArrowUpRight className="w-6 h-6 ml-2" />
            </Button>
          </div>

          <div className="mt-8 mb-10 md:mb-16">
            <SearchComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
