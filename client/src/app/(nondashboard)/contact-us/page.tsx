"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import FooterSection from "../landing/FooterSection";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ContactUsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    propertyType: "Apartment",
    location: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, phone, email, propertyType, location, message } = formData;
    
    const text = `*New Property Request*\n\n*Name:* ${fullName}\n*Phone:* ${phone}\n*Email:* ${email}\n*Property Type:* ${propertyType}\n*Location:* ${location}\n*Message:* ${message}`;
    const whatsappUrl = `https://wa.me/254791433046?text=${encodeURIComponent(text)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      gsap.from(".contact-hero-text", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.2
      });

      gsap.from(".contact-form-element", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.5
      });
    });
      }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[450px] flex items-center justify-center overflow-hidden">
        <Image
          src="/landing-call-to-action.jpg"
          alt="Partner With Us background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/60"></div>
        <div className="relative z-10 text-center text-white mt-10 px-4">
          <div className="contact-hero-text text-xs font-black mb-6 uppercase tracking-[0.3em] text-secondary">
            Home &gt; Pages &gt; Contact Us
          </div>
          <h1 className="contact-hero-text text-6xl md:text-8xl font-black tracking-tighter uppercase drop-shadow-2xl">
            Partner With Us
          </h1>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-gray-50 py-32 px-6">
         <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100">
            <div className="contact-form-element text-center mb-12">
               <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tighter uppercase mb-4">List Your Property</h2>
               <p className="text-foreground/70 text-lg font-medium">
                  Fill out the form below to submit your property details directly to our management team via WhatsApp.
               </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="contact-form-element space-y-3">
                     <label className="text-xs font-black text-primary uppercase tracking-widest">Full Name</label>
                     <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                        placeholder="John Doe"
                     />
                  </div>
                  <div className="contact-form-element space-y-3">
                     <label className="text-xs font-black text-primary uppercase tracking-widest">Phone Number</label>
                     <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                        placeholder="+254 700 000000"
                     />
                  </div>
                  <div className="contact-form-element space-y-3">
                     <label className="text-xs font-black text-primary uppercase tracking-widest">Email Address</label>
                     <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                        placeholder="john@example.com"
                     />
                  </div>
                  <div className="contact-form-element space-y-3">
                     <label className="text-xs font-black text-primary uppercase tracking-widest">Property Type</label>
                     <div className="relative">
                       <select 
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleChange}
                          required
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all appearance-none"
                       >
                          <option value="Apartment">Apartment</option>
                          <option value="Villa">Villa</option>
                          <option value="Townhouse">Townhouse</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Land">Land</option>
                       </select>
                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                       </div>
                     </div>
                  </div>
                  <div className="contact-form-element md:col-span-2 space-y-3">
                     <label className="text-xs font-black text-primary uppercase tracking-widest">Property Location</label>
                     <input 
                        type="text" 
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                        placeholder="e.g. Westlands, Nairobi"
                     />
                  </div>
                  <div className="contact-form-element md:col-span-2 space-y-3">
                     <label className="text-xs font-black text-primary uppercase tracking-widest">Short Description</label>
                     <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all resize-none"
                        placeholder="Tell us about the property..."
                     ></textarea>
                  </div>
               </div>
               
               <div className="contact-form-element">
                 <button 
                    type="submit" 
                    className="w-full bg-primary text-secondary font-black px-10 py-6 rounded-2xl hover:bg-primary/95 transition-all shadow-xl hover:scale-[1.02] active:scale-95 uppercase tracking-widest text-sm"
                 >
                    Submit to WhatsApp
                 </button>
               </div>
            </form>
         </div>
      </section>

      <FooterSection />
    </div>
  );
}
