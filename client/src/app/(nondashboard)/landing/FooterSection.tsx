"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FooterSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 95%",
      }
    });

    tl.from(".footer-brand", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    }).from(".footer-col", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: "power2.out"
    }, "-=0.3").from(".footer-bottom", {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.2");
  }, { scope: containerRef });

  return (
    <footer ref={containerRef} className="bg-primary pt-24 pb-16 text-white border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-0">
          <div className="footer-brand flex flex-col max-w-sm">
            <Link href="/" className="group" scroll={false}>
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src="/logo-rentful.png"
                  alt="Rentful Logo"
                  width={200}
                  height={200}
                  className="h-20 w-auto object-contain"
                />
                <span className="text-white font-black text-4xl tracking-tighter uppercase">
                  CHESTONE PROPERTIES
                </span>
              </div>
            </Link>
            <p className="text-white font-bold text-base tracking-widest uppercase mb-6">
              Elite Property Management
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Redefining the standard of luxury real estate and property management in Nairobi. Trust, stability, and premium quality are the pillars of our foundation.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-secondary hover:border-secondary hover:text-primary transition-all">
                <FontAwesomeIcon icon={faFacebook} className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-secondary hover:border-secondary hover:text-primary transition-all">
                <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-secondary hover:border-secondary hover:text-primary transition-all">
                <FontAwesomeIcon icon={faTwitter} className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-secondary hover:border-secondary hover:text-primary transition-all">
                <FontAwesomeIcon icon={faLinkedin} className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 font-inter">
            {/* Column A: Neighborhoods */}
            <div className="footer-col">
              <h4 className="text-secondary font-black text-sm uppercase tracking-widest mb-8 font-nav">Neighborhoods</h4>
              <ul className="flex flex-col space-y-4">
                <li><Link href="/search?location=lavington" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Lavington Residential</Link></li>
                <li><Link href="/search?location=westlands" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Westlands Commercial</Link></li>
                <li><Link href="/search?location=kileleshwa" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Kileleshwa Portfolio</Link></li>
                <li><Link href="/search?location=kilimani" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Kilimani Listings</Link></li>
              </ul>
            </div>
            {/* Column B: For Landlords */}
            <div className="footer-col">
              <h4 className="text-secondary font-black text-sm uppercase tracking-widest mb-8 font-nav">For Landlords</h4>
              <ul className="flex flex-col space-y-4">
                <li><Link href="/managers/onboarding" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Onboarding Process</Link></li>
                <li><Link href="/managers/benefits" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Exclusive Listing Benefits</Link></li>
                <li><Link href="/managers/inventory" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Inventory Management</Link></li>
                <li><Link href="/contact-us" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Submit Property</Link></li>
              </ul>
            </div>
            {/* Column C: Subscribe */}
            <div className="footer-col">
              <h4 className="text-secondary font-black text-sm uppercase tracking-widest mb-8 font-nav">Stay Updated</h4>
              <p className="text-gray-400 text-xs mb-6 font-medium leading-relaxed">
                Join our exclusive mailing list for early access to the most prestigious property nodes in Nairobi.
              </p>
              <form className="flex flex-col gap-3">
                <input 
                  type="email" 
                  placeholder="Your Email Address" 
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-all"
                />
                <button className="bg-secondary text-primary font-black text-xs uppercase tracking-widest py-3 rounded-lg hover:bg-secondary/90 transition-all">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-bottom mt-20 pt-8 border-t border-secondary/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 font-medium tracking-wide">
            © 2026 Rentful. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-secondary transition-colors uppercase font-bold tracking-tighter">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-secondary transition-colors uppercase font-bold tracking-tighter">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
