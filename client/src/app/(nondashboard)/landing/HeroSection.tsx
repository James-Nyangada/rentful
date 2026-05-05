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
    gsap.from(".hero-content > *", {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.2
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center py-24 md:h-screen md:py-0">
      <Image
        src="/landing-splash.jpg"
        alt="Chestone Properties Ltd Hero Section"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-primary/20"></div>
      <div
        className="hero-content relative w-full z-10 text-center"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-primary mb-8 text-center drop-shadow-sm tracking-tight">
            Elevate Your Living
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 px-4">
            <Button
              onClick={() => router.push("/signup")}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold rounded-lg px-8 h-14 text-lg shadow-lg transition-all"
            >
              Start Your Journey <ArrowUpRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => router.push("/search")}
              className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-white font-bold rounded-lg px-8 h-14 text-lg shadow-lg transition-all"
            >
              View Listings <ArrowUpRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="mt-8">
            <SearchComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
