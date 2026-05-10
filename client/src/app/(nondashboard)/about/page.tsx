"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Home, Key, Building2, UserCircle2, ArrowRight } from "lucide-react";
import FooterSection from "../landing/FooterSection";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      gsap.from(".about-hero-text", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
        stagger: 0.2
      });

      gsap.from(".about-vision", {
        scrollTrigger: {
          trigger: ".about-vision",
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 1,
      });

      gsap.utils.toArray(".scroll-animate").forEach((section: any) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
          },
          y: 50,
          opacity: 0,
          duration: 1,
        });
      });
    });
      }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[450px] flex items-center justify-center overflow-hidden">
        <Image
          src="/about/about_hero_bg.png"
          alt="Luxury property background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/40"></div>
        <div className="relative z-10 text-center text-white mt-10 px-4">
          <div className="about-hero-text text-xs font-black mb-6 uppercase tracking-[0.3em] text-secondary">
            Home &gt; Pages &gt; About Us
          </div>
          <h1 className="about-hero-text text-6xl md:text-8xl font-black tracking-tighter uppercase drop-shadow-2xl">
            Our Legacy
          </h1>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="about-vision bg-background py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-primary leading-tight font-bold">
            &quot;The definitive gateway to luxury real estate Nairobi and structured real estate solutions for property management Lavington.&quot;
          </h2>
        </div>
      </section>
      {/* Elegance Section 1 */}
      <section className="scroll-animate max-w-6xl mx-auto py-32 px-6 grid md:grid-cols-2 gap-20 items-center">
        <div className="relative h-[500px] w-full hidden md:block">
          <div className="absolute left-0 bottom-0 w-3/4 h-[75%] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/about/about_elegance_1.png"
              alt="Luxury Estate"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 top-0 w-[60%] h-[55%] rounded-3xl overflow-hidden border-[12px] border-white shadow-2xl z-10">
            <Image
              src="/about/about_elegance_2.png"
              alt="Modern Living"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute top-[45%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-[0_20px_50px_-12px_rgba(10,31,59,0.3)] flex flex-col gap-3 min-w-[220px] z-20 border border-gray-50">
            <p className="text-xs font-black text-primary uppercase tracking-widest">Premium Selection</p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-primary border-2 border-white overflow-hidden relative">
                    <Image src={`/about/about_family.png`} alt="Client" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="bg-secondary text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center shadow-sm">
                 ★ 4.9
              </div>
            </div>
          </div>
        </div>
        <div className="block md:hidden h-[350px] relative rounded-3xl overflow-hidden mb-12 shadow-xl">
            <Image src="/about/about_elegance_1.png" alt="Luxury House" fill className="object-cover" />
        </div>
        <div>
          <h2 className="text-4xl md:text-6xl font-black text-primary leading-[1.1] mb-10 tracking-tighter uppercase">
            Embrace the Pinnacle of Living
          </h2>
          <p className="text-foreground/80 mb-10 text-xl leading-relaxed font-medium">
            At Chestone Properties, we believe real estate is more than just square footage—it&apos;s the foundation of your legacy. We curate only the most exceptional properties for our discerning clientele.
          </p>
          <ul className="space-y-6 mb-10">
            {['Elite Asset Management', 'Strategic Global Locations', 'Bespoke Architectural Designs'].map((item, idx) => (
              <li key={idx} className="flex items-center text-primary font-black text-lg tracking-tight">
                <CheckCircle2 className="w-7 h-7 text-secondary mr-4" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="scroll-animate bg-gray-50 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
             <span className="inline-block bg-primary/10 text-primary px-6 py-2 rounded-full text-xs font-black mb-6 tracking-[0.2em] uppercase border border-primary/5">
               The Chestone Standard
             </span>
             <h2 className="text-5xl md:text-7xl font-black text-primary tracking-tighter uppercase">Real Estate Investment Nairobi</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-0 items-stretch bg-white rounded-[3rem] overflow-hidden shadow-[0_30px_100px_-20px_rgba(10,31,59,0.15)] border border-gray-100">
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
                      To empower property owners and investors
through a high-velocity, data-driven listing
ecosystem. We are committed to de-risking the
real estate journey by providing verified, elite
property solutions that prioritize stability,
integrity, and seamless acquisition in Nairobis
most exclusive residential nodes.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-3">Our Vision</h4>
                    <p className="text-primary font-bold text-lg leading-relaxed">
                      To be the definitive gateway for structured real estate in East Africa, recognized for asset de-risking for Nairobi property investors and setting the gold standard in premium property inventory.
                    </p>
                  </div>
                </div>

                <button className="bg-primary text-secondary font-black px-10 py-5 rounded-2xl hover:bg-primary/95 transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-widest text-sm w-fit">
                  Explore Our Heritage
                </button>
             </div>
             <div className="relative h-full min-h-[500px] w-full">
                <Image src="/about/about_mission.png" alt="Excellence" fill className="object-cover" />
                <div className="absolute inset-0 bg-primary/10"></div>
             </div>
          </div>
        </div>
      </section>

      {/* Elegance Section 2 */}
      <section className="scroll-animate max-w-6xl mx-auto py-32 px-6 grid md:grid-cols-2 gap-20 items-center">
        <div className="relative h-[550px] w-full hidden md:block order-2 md:order-1">
           <div className="absolute left-0 top-0 w-[50%] h-[65%] rounded-3xl overflow-hidden shadow-2xl z-20 border-[8px] border-white">
             <Image src="/about/about_elegance_3.png" alt="Architecture" fill className="object-cover" />
           </div>
           <div className="absolute right-0 bottom-0 w-[65%] h-[60%] rounded-3xl overflow-hidden shadow-2xl z-10">
             <Image src="/about/about_elegance_1.png" alt="Estate" fill className="object-cover" />
           </div>
           <div className="absolute top-0 right-0 w-[40%] h-[30%] rounded-3xl overflow-hidden shadow-xl">
             <Image src="/about/about_elegance_2.png" alt="Interior" fill className="object-cover" />
           </div>
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-[0_25px_60px_-15px_rgba(10,31,59,0.25)] flex flex-col gap-3 min-w-[240px] z-30 border border-gray-50">
            <p className="text-xs font-black text-primary uppercase tracking-widest">Global Network</p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-primary border-2 border-white overflow-hidden relative">
                    <Image src={`/about/about_family.png`} alt="Client" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="bg-secondary text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center shadow-sm">
                 ★ 5.0
              </div>
            </div>
          </div>
        </div>
        <div className="block md:hidden h-[350px] relative rounded-3xl overflow-hidden mb-12 order-2 shadow-xl">
            <Image src="/about/about_elegance_3.png" alt="Modern Architecture" fill className="object-cover" />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-4xl md:text-6xl font-black text-primary leading-[1.1] mb-12 tracking-tighter uppercase">
            Best real estate agents for Westlands luxury homes
          </h2>
          
          <div className="space-y-10 mb-12">
            <div className="flex gap-6 group">
               <div className="bg-primary/5 p-4 rounded-2xl h-16 w-16 flex items-center justify-center shrink-0 group-hover:bg-secondary transition-colors duration-300 shadow-sm border border-primary/5">
                  <span className="text-primary group-hover:text-white font-black text-2xl transition-colors">★</span>
               </div>
               <div>
                  <h4 className="text-2xl font-black text-primary mb-2 uppercase tracking-tight">Global Elite Agents</h4>
                  <p className="text-foreground/70 leading-relaxed font-medium text-lg">Our network of global agents ensures you find the perfect property anywhere in the world.</p>
               </div>
            </div>
            <div className="flex gap-6 group">
               <div className="bg-primary/5 p-4 rounded-2xl h-16 w-16 flex items-center justify-center shrink-0 group-hover:bg-secondary transition-colors duration-300 shadow-sm border border-primary/5">
                  <span className="text-primary group-hover:text-white font-black text-2xl transition-colors">✨</span>
               </div>
               <div>
                  <h4 className="text-2xl font-black text-primary mb-2 uppercase tracking-tight">Reimagined Horizons</h4>
                  <p className="text-foreground/70 leading-relaxed font-medium text-lg">We focus on properties that offer innovative and inspiring living spaces.</p>
               </div>
            </div>
            <div className="flex gap-6 group">
               <div className="bg-primary/5 p-4 rounded-2xl h-16 w-16 flex items-center justify-center shrink-0 group-hover:bg-secondary transition-colors duration-300 shadow-sm border border-primary/5">
                  <span className="text-primary group-hover:text-white font-black text-2xl transition-colors">📍</span>
               </div>
               <div>
                  <h4 className="text-2xl font-black text-primary mb-2 uppercase tracking-tight">Unrivaled Locations</h4>
                  <p className="text-foreground/70 leading-relaxed font-medium text-lg">Our exclusive properties are situated in the most desirable and prime locations.</p>
               </div>
            </div>
          </div>

          <button className="bg-secondary text-white font-black px-10 py-5 rounded-2xl hover:bg-secondary/90 transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-widest text-sm">
            Discover Exclusivity
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="scroll-animate bg-gray-50 py-32 px-6">
         <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20 max-w-3xl mx-auto">
              <span className="inline-block bg-primary text-secondary px-6 py-2 rounded-full text-xs font-black mb-6 tracking-[0.2em] uppercase shadow-lg">
                The Chestone Properties Edge
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-primary tracking-tighter uppercase leading-[1.1]">
                Master Your Lifestyle with Intelligence
              </h2>
            </div>

            <div className="grid lg:grid-cols-12 gap-10 items-stretch">
               <div className="lg:col-span-4 relative rounded-[3rem] overflow-hidden h-[500px] lg:h-auto hidden md:block shadow-2xl">
                  <Image src="/about/about_interior.png" alt="Luxury Interior" fill className="object-cover" />
                  <div className="absolute inset-0 bg-primary/10"></div>
               </div>
               
               <div className="lg:col-span-8 grid sm:grid-cols-2 gap-8">
                  {/* Card 1 */}
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                     <div className="bg-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                        <Home className="text-primary group-hover:text-secondary w-8 h-8 transition-colors" />
                     </div>
                     <h4 className="text-2xl font-black text-primary mb-4 uppercase tracking-tight">Acquisition</h4>
                     <p className="text-foreground/70 mb-8 leading-relaxed font-medium">
                        Find your dream home with our extensive listings and expert guidance every step of the way.
                     </p>
                     <Link href="#" className="inline-flex items-center text-sm font-black text-primary hover:text-secondary transition-colors uppercase tracking-widest">
                        Case Studies <ArrowRight className="w-5 h-5 ml-3" />
                     </Link>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                     <div className="bg-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                        <Key className="text-primary group-hover:text-secondary w-8 h-8 transition-colors" />
                     </div>
                     <h4 className="text-2xl font-black text-primary mb-4 uppercase tracking-tight">Divestment</h4>
                     <p className="text-foreground/70 mb-8 leading-relaxed font-medium">
                        Get the best value for your property and learn how to buy property in Lavington safely with our strategic marketing and negotiation skills.
                     </p>
                     <Link href="#" className="inline-flex items-center text-sm font-black text-primary hover:text-secondary transition-colors uppercase tracking-widest">
                        Market Analysis <ArrowRight className="w-5 h-5 ml-3" />
                     </Link>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                     <div className="bg-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                        <Home className="text-primary group-hover:text-secondary w-8 h-8 transition-colors" />
                     </div>
                     <h4 className="text-2xl font-black text-primary mb-4 uppercase tracking-tight">Leasing</h4>
                     <p className="text-foreground/70 mb-8 leading-relaxed font-medium">
                        Discover a wide range of rental properties that suit your lifestyle and budget perfectly.
                     </p>
                     <Link href="#" className="inline-flex items-center text-sm font-black text-primary hover:text-secondary transition-colors uppercase tracking-widest">
                        Browse Listings <ArrowRight className="w-5 h-5 ml-3" />
                     </Link>
                  </div>
                  {/* Card 4 */}
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                     <div className="bg-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                        <Building2 className="text-primary group-hover:text-secondary w-8 h-8 transition-colors" />
                     </div>
                     <h4 className="text-2xl font-black text-primary mb-4 uppercase tracking-tight">Management</h4>
                     <p className="text-foreground/70 mb-8 leading-relaxed font-medium">
                        Ensure your properties are well-maintained and profitable with our comprehensive services.
                     </p>
                     <Link href="#" className="inline-flex items-center text-sm font-black text-primary hover:text-secondary transition-colors uppercase tracking-widest">
                        Service Menu <ArrowRight className="w-5 h-5 ml-3" />
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Dream Team Section */}
      <section className="scroll-animate py-32 px-6 bg-white">
         <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-black text-primary mb-24 tracking-tighter uppercase">The Chestone Properties Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
               {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center group">
                     <div className="w-full aspect-[4/5] bg-gray-50 rounded-3xl mb-6 relative overflow-hidden shadow-lg border border-gray-100 group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                        <Image src={`/about/about_family.png`} alt="Elite Agent" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                     </div>
                     <h4 className="text-xl font-black text-primary uppercase tracking-tight">Chestone Properties Advisor</h4>
                     <p className="text-xs text-secondary font-black tracking-[0.2em] uppercase mt-2">Senior Partner</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Testimonial Section */}
      <section className="scroll-animate bg-gray-50 py-32 px-6">
         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
            <div>
               <h2 className="text-5xl md:text-7xl font-black text-primary leading-[1.1] mb-12 tracking-tighter uppercase">A Legacy of Satisfaction</h2>
               <div className="relative w-full h-[450px] rounded-[3rem] overflow-hidden shadow-2xl">
                  <Image src="/about/about_family.png" alt="Happy Clients" fill className="object-cover" />
                  <div className="absolute inset-0 bg-primary/10"></div>
               </div>
            </div>
            <div className="bg-white p-12 md:p-20 rounded-[3rem] shadow-[0_40px_120px_-30px_rgba(10,31,59,0.1)] border border-gray-50 relative">
               <div className="text-secondary/20 text-9xl font-serif leading-none absolute -top-5 left-10">&quot;</div>
               <p className="text-primary text-xl md:text-2xl font-bold leading-relaxed mb-12 italic relative z-10">
                  &ldquo;Chestone Properties transformed our vision of home ownership. Their professionalism and deep understanding of the luxury market in Kenya are unparalleled. We didn&apos;t just find a house; we secured a sanctuary.&rdquo;
               </p>
               <div className="flex items-center justify-between border-t border-gray-100 pt-10">
                  <div className="flex items-center gap-5">
                     <div className="w-16 h-16 rounded-full overflow-hidden relative border-2 border-secondary shadow-lg">
                        <Image src="/about/about_family.png" alt="Client Avatar" fill className="object-cover" />
                     </div>
                     <div>
                        <h4 className="font-black text-primary text-xl uppercase tracking-tighter">David Omari</h4>
                        <p className="text-xs text-secondary font-black tracking-widest uppercase">Verified Collector</p>
                     </div>
                  </div>
                  <div className="font-black text-2xl text-primary/10 tracking-tighter hidden sm:block">
                    Chestone Properties ELITE
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="scroll-animate py-24 px-6 bg-white">
         <div className="max-w-6xl mx-auto bg-primary rounded-[3.5rem] p-16 md:p-28 relative overflow-hidden shadow-[0_50px_120px_-20px_rgba(10,31,59,0.4)]">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary opacity-5 rounded-full transform translate-x-1/3 -translate-y-1/3 border-[60px] border-white"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white opacity-5 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
               <div className="flex flex-col gap-4">
                 <span className="text-secondary font-black tracking-[0.4em] uppercase text-xs">Ready for Excellence?</span>
                 <h2 className="text-4xl md:text-6xl font-black text-white leading-tight max-w-xl tracking-tighter uppercase">
                    Step Into Your Future with Chestone Properties
                 </h2>
               </div>
               <button type="button" className="bg-secondary text-primary font-black px-12 py-6 rounded-2xl hover:bg-white hover:text-primary transition-all whitespace-nowrap text-lg shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-widest">
                  Secure Your Asset
               </button>
            </div>
         </div>
      </section>

      <FooterSection />
    </div>
  );
}
