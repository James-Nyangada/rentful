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
            <p className="text-secondary font-bold text-sm tracking-widest uppercase mb-6">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div>
              <h4 className="text-secondary font-black text-xs uppercase tracking-widest mb-8">Sitemap</h4>
              <ul className="flex flex-col space-y-4">
                <li><Link href="/" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Home</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">About Us</Link></li>
                <li><Link href="/search" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Listings</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-secondary font-black text-xs uppercase tracking-widest mb-8">Resources</h4>
              <ul className="flex flex-col space-y-4">
                <li><Link href="/faq" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">FAQ</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Terms</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Privacy</Link></li>
                <li><Link href="/cookies" className="text-gray-300 hover:text-secondary transition-colors text-sm font-medium">Cookies</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-secondary/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-medium tracking-wide">
            © 2026 Chestone Properties. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-secondary transition-colors uppercase font-bold tracking-tighter">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-secondary transition-colors uppercase font-bold tracking-tighter">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
