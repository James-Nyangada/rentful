"use client";

import Image from "next/image";
import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const CallToActionSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".cta-content", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      scale: 0.95,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative pt-24 pb-32 bg-primary overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <Image 
          src="/luxury_real_estate_pattern_1777988504847.png" 
          alt="Luxury Pattern" 
          fill 
          className="object-cover mix-blend-overlay"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary pointer-events-none"></div>
      
      <div
        className="cta-content relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-20 text-center"
      >
        <div className="flex flex-col items-center">
          <span className="text-secondary font-black text-xs tracking-[0.3em] uppercase mb-6 block">
            Elite Partnership
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tighter uppercase leading-tight">
            Structured Property <br className="hidden md:block" /> Solutions
          </h2>
          <p className="text-white/80 text-xl md:text-2xl mb-14 max-w-3xl font-medium leading-relaxed">
            Experience the pinnacle of real estate management and acquisition. Our commitment to trust and stability ensures your investments are always in elite hands.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/signup"
              className="inline-block bg-secondary text-primary rounded-xl px-12 py-5 font-black uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-2xl hover:scale-105 active:scale-95"
              scroll={false}
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="inline-block border-2 border-secondary text-secondary rounded-xl px-12 py-5 font-black uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-2xl hover:scale-105 active:scale-95"
              scroll={false}
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToActionSection;
