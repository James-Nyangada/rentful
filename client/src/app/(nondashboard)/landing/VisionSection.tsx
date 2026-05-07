"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const VisionSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".vision-text", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      y: 30,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="bg-white py-24 md:py-32 px-6"
    >
      <div className="max-w-5xl mx-auto text-center">
        <span className="vision-text inline-block text-secondary font-black text-xs tracking-[0.3em] uppercase mb-8">
          Our Vision
        </span>
        <h2 className="vision-text font-playfair text-3xl md:text-5xl lg:text-6xl text-primary leading-tight font-bold italic">
          &ldquo;To be the definitive gateway for structured real estate in East Africa, recognized for redefining market transparency and setting the gold standard in premium property inventory.&rdquo;
        </h2>
      </div>
    </section>
  );
};

export default VisionSection;
