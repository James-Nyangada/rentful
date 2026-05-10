"use client";

import React, { useRef, useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star, Home, Key, Building2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Grace Muthoni",
    role: "Home Buyer",
    category: "buyer",
    location: "Lavington",
    rating: 5,
    text: "The entire experience was seamless from start to finish. I found my dream home in Lavington within two weeks. The team's knowledge of the area and their professionalism made all the difference. I couldn't be happier with my new home.",
    icon: Home,
  },
  {
    name: "David Ochieng",
    role: "Home Buyer",
    category: "buyer",
    location: "Kilimani",
    rating: 5,
    text: "As a first-time buyer, I was nervous about the process, but the team walked me through every step with patience and expertise. They helped me find a beautiful apartment in Kilimani that was well within my budget. Truly exceptional service.",
    icon: Home,
  },
  {
    name: "Amina Hassan",
    role: "Tenant",
    category: "renter",
    location: "Westlands",
    rating: 5,
    text: "Finding a quality rental in Westlands used to be stressful until I discovered this platform. The listings are accurate, the viewings were well-organised, and I moved into my new apartment within a week. Highly recommend to anyone looking to rent.",
    icon: Key,
  },
  {
    name: "Brian Kipchoge",
    role: "Tenant",
    category: "renter",
    location: "Kileleshwa",
    rating: 4,
    text: "I relocated to Nairobi for work and needed a place quickly. The platform made it incredibly easy to filter by location and budget. I secured a fantastic flat in Kileleshwa with all the amenities I needed. The process was remarkably smooth.",
    icon: Key,
  },
  {
    name: "Catherine Wanjiru",
    role: "Property Owner",
    category: "owner",
    location: "Lavington",
    rating: 5,
    text: "Since listing my properties here, I've had a steady stream of quality tenants. The management tools are intuitive and the team handles everything professionally. My occupancy rate has never been higher. An indispensable partner for any property owner.",
    icon: Building2,
  },
  {
    name: "Peter Kamau",
    role: "Property Owner",
    category: "owner",
    location: "Kilimani",
    rating: 5,
    text: "I manage multiple units in Kilimani and this platform has transformed how I operate. From tenant screening to rent collection, everything is streamlined. The exposure my listings get is unmatched. It's the best decision I've made for my portfolio.",
    icon: Building2,
  },
];

const categoryLabels: Record<string, string> = {
  buyer: "Buyers",
  renter: "Renters",
  owner: "Homeowners",
};

const TestimonialsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      // Reveal header
      gsap.from(".testimonials-heading", {
        scrollTrigger: {
          trigger: ".testimonials-heading",
          start: "top bottom-=100",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Reveal cards
      gsap.from(".testimonial-card", {
        scrollTrigger: {
          trigger: "#testimonials",
          start: "top bottom-=50",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all" // Clear GSAP styles after animation finishes
      });

      ScrollTrigger.refresh();
    });
      }, { scope: containerRef, dependencies: [activeCategory] });

  const filteredTestimonials =
    activeCategory === "all"
      ? testimonials
      : testimonials.filter((t) => t.category === activeCategory);

  return (
    <section
      id="testimonials"
      ref={containerRef}
      className="py-20 md:py-24 px-4 sm:px-8 lg:px-12 bg-gray-50 overflow-hidden"
    >
      <div className="max-w-6xl xl:max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="testimonials-heading text-center mb-10 md:mb-16 px-4">
          <span className="inline-block text-secondary font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase mb-4">
            Client Stories
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary tracking-tight uppercase leading-tight">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-foreground/70 max-w-2xl mx-auto font-medium text-base md:text-lg">
            Real experiences from buyers, renters, and homeowners who trust us with their property journey.
          </p>
        </div>

        {/* Category Filter */}
        <div className="testimonials-heading flex flex-wrap justify-center gap-2 md:gap-4 mb-12 md:mb-16 px-2">
          {["all", "buyer", "renter", "owner"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 md:px-8 py-2 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-primary border-primary text-white shadow-lg scale-105"
                  : "bg-white border-gray-200 text-gray-500 hover:border-primary hover:text-primary"
              }`}
            >
              {cat === "all" ? "All" : categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTestimonials.map((testimonial, index) => {
            const IconComponent = testimonial.icon;
            return (
              <div
                key={testimonial.name}
                className="testimonial-card group relative bg-white rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-primary/20 hover:-translate-y-1"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6">
                  <Quote className="w-6 h-6 md:w-8 md:h-8 text-secondary/30 group-hover:text-secondary/60 transition-colors duration-500" />
                </div>

                {/* Category Badge */}
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <span className="inline-flex items-center gap-1.5 bg-primary/5 text-primary rounded-lg px-2.5 py-1 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                    <IconComponent className="w-3 h-3" />
                    {testimonial.role}
                  </span>
                  <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {testimonial.location}
                  </span>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4 md:mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 md:w-4 md:h-4 ${
                        i < testimonial.rating
                          ? "text-secondary fill-secondary"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-foreground/70 font-medium leading-relaxed mb-6 md:mb-8 text-sm md:text-[15px]">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 md:gap-4 pt-5 md:pt-6 border-t border-gray-100">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center shadow-md shrink-0">
                    <span className="text-white font-black text-xs md:text-sm">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-primary font-black text-xs md:text-sm uppercase tracking-tight truncate">
                      {testimonial.name}
                    </p>
                    <p className="text-secondary font-bold text-[9px] md:text-[10px] uppercase tracking-widest truncate">
                      {testimonial.role} &middot; {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
