"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      }
    });

    tl.from(".feature-heading", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }).from(".feature-card", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=0.4");
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="py-32 px-6 sm:px-8 lg:px-12 xl:px-16 bg-white"
    >
      <div className="max-w-4xl xl:max-w-6xl mx-auto">
        <h2
          className="feature-heading text-4xl md:text-5xl font-extrabold text-center mb-20 w-full sm:w-3/4 mx-auto text-primary tracking-tight"
        >
          Discover Your Next Chapter with Our Specialized Search
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {[0, 1, 2].map((index) => (
            <div key={index} className="feature-card">
              <FeatureCard
                imageSrc={`/landing-search${3 - index}.png`}
                title={
                  [
                    "Verified Premium Listings",
                    "Intuitive Browsing Experience",
                    "Advanced Property Solutions",
                  ][index]
                }
                description={
                  [
                    "Access a curated selection of properties verified for quality and transparency.",
                    "Experience seamless navigation through our high-end rental and sale portfolios.",
                    "Leverage our advanced filtering to find the exact space that meets your lifestyle.",
                  ][index]
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string;
  title: string;
  description: string;
}) => (
  <div className="text-center group">
    <div className="p-8 rounded-2xl mb-6 flex items-center justify-center h-56 bg-gray-50 border border-gray-100 shadow-sm group-hover:shadow-md transition-all duration-300">
      <Image
        src={imageSrc}
        width={400}
        height={400}
        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        alt={title}
      />
    </div>
    <h3 className="text-2xl font-bold mb-3 text-primary">{title}</h3>
    <p className="text-foreground leading-relaxed font-medium">{description}</p>
  </div>
);

export default FeaturesSection;
