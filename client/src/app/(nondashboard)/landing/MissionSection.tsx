import React from "react";
import Image from "next/image";

const MissionSection = () => {
  return (
    <section className="bg-background pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Mission Statement */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <span className="inline-block text-secondary font-bold text-xs tracking-[0.2em] uppercase mb-6">
            Our Mission
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-primary leading-tight font-bold">
            &quot;To empower property owners and seekers with elite, structured real estate solutions.&quot;
          </h2>
        </div>

        {/* Three Pillars */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {/* Pillar I: Market Velocity */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-full aspect-square relative rounded-2xl overflow-hidden mb-8 shadow-lg">
              <Image 
                src="/about/about_elegance_2.png" 
                alt="Market Velocity" 
                fill 
                className="object-cover editorial-warm group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <h3 className="text-xl font-playfair font-bold text-primary mb-4">I. Market Velocity</h3>
            <p className="text-foreground/80 font-inter text-sm leading-relaxed">
              We employ high-volume approaches to guarantee immediate access and movement in prime locations like Lavington and Westlands.
            </p>
          </div>

          {/* Pillar II: Inventory Integrity */}
          <div className="flex flex-col items-center text-center group">
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
              Our rigorous verification process completely de-risks acquisitions, ensuring absolute peace of mind for every transaction.
            </p>
          </div>

          {/* Pillar III: High-End Nodes */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-full aspect-square relative rounded-2xl overflow-hidden mb-8 shadow-lg">
              <Image 
                src="/about/about_elegance_3.png" 
                alt="High-End Nodes" 
                fill 
                className="object-cover editorial-warm group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <h3 className="text-xl font-playfair font-bold text-primary mb-4">III. High-End Nodes</h3>
            <p className="text-foreground/80 font-inter text-sm leading-relaxed">
              We curate a highly exclusive portfolio of the finest luxury nodes across Kenya&apos;s most sought-after neighborhoods.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
