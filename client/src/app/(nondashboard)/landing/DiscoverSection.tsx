"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const DiscoverSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      }
    });

    tl.from(".discover-heading", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    }).from(".discover-card", {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=0.2");
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="py-20 bg-white"
    >
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 text-center">
        <div className="discover-heading mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tighter uppercase mb-6">
            The Chestone Journey
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto font-medium leading-relaxed">
            Acquiring and managing luxury assets is a seamless experience with our structured solutions. From discovery to ownership, we guide you through every milestone.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {[
            {
              imageSrc: "/landing-icon-wand.png",
              title: "Discover Excellence",
              description:
                "Browse through our elite collection of properties curated for the most discerning clients.",
            },
            {
              imageSrc: "/landing-icon-calendar.png",
              title: "Secure Your Asset",
              description:
                "Once you've identified the perfect property, our streamlined acquisition process ensures a smooth transition.",
            },
            {
              imageSrc: "/landing-icon-heart.png",
              title: "Elevated Living",
              description:
                "Step into your new home and experience a standard of living defined by prestige and stability.",
            },
          ].map((card, index) => (
            <div key={index} className="discover-card">
              <DiscoverCard {...card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DiscoverCard = ({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string;
  title: string;
  description: string;
}) => (
  <div className="px-8 py-16 shadow-[0_20px_50px_-12px_rgba(10,31,59,0.1)] rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
    <div className="bg-primary p-4 rounded-2xl mb-8 h-16 w-16 mx-auto group-hover:bg-secondary transition-colors duration-300">
      <Image
        src={imageSrc}
        width={40}
        height={40}
        className="w-full h-full brightness-0 invert"
        alt={title}
      />
    </div>
    <h3 className="text-2xl font-black text-primary uppercase tracking-tight mb-4">{title}</h3>
    <p className="text-foreground/70 font-medium leading-relaxed">{description}</p>
  </div>
);

export default DiscoverSection;
