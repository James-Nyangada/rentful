import Link from "next/link";
import Image from "next/image";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const FooterSection = () => {
  return (
    <footer className="bg-primary py-24 text-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-0">
          <div className="flex flex-col max-w-sm">
            <Link href="/" className="group" scroll={false}>
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src="/logo-rentful.png"
                  alt="Chestone Properties Logo"
                  width={200}
                  height={200}
                  className="h-28 w-auto object-contain"
                />
                <span className="text-white font-black text-4xl tracking-tighter uppercase">
                  Chestone Properties
                </span>
              </div>
            </Link>
            <p className="text-white font-bold text-base tracking-widest uppercase mb-6">
              Structured Property Solutions
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Redefining the standard of luxury real estate and property management in Kenya. Trust, stability, and premium quality are the pillars of our foundation.
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
            <div>
              <h4 className="text-secondary font-black text-sm uppercase tracking-widest mb-8 font-nav">Neighborhoods</h4>
              <ul className="flex flex-col space-y-4">
                <li><Link href="/search?location=lavington" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Lavington Residential</Link></li>
                <li><Link href="/search?location=westlands" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Westlands Commercial & Luxury</Link></li>
                <li><Link href="/search?location=kileleshwa" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Kileleshwa Portfolio</Link></li>
                <li><Link href="/search?location=kilimani" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Kilimani Listings</Link></li>
              </ul>
            </div>
            {/* Column B: For Landlords */}
            <div>
              <h4 className="text-secondary font-black text-sm uppercase tracking-widest mb-8 font-nav">For Landlords</h4>
              <ul className="flex flex-col space-y-4">
                <li><Link href="/managers/onboarding" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Onboarding Process</Link></li>
                <li><Link href="/managers/benefits" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Exclusive Listing Benefits</Link></li>
                <li><Link href="/managers/inventory" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Inventory Management</Link></li>
                <li><Link href="/managers/newproperty" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Submit Property</Link></li>
              </ul>
            </div>
            {/* Column C: Company */}
            <div>
              <h4 className="text-secondary font-black text-sm uppercase tracking-widest mb-8 font-nav">Company</h4>
              <ul className="flex flex-col space-y-4">
                <li><Link href="/about" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Our Story</Link></li>
                <li><Link href="/verification" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Verification Standards</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Contact & Offices</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Terms & Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-secondary/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 font-medium tracking-wide">
            © 2026 Chestone Properties. ALL RIGHTS RESERVED.
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
