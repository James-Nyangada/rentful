"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const CallToActionSection = () => {
  return (
    <div className="relative pt-20 pb-32 bg-primary overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {/* Placeholder for watermark/logo shield */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[40px] border-secondary rounded-full transform rotate-45 scale-150"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16 text-center"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight uppercase">
            Structured Property Solutions
          </h2>
          <p className="text-white text-xl md:text-2xl mb-12 max-w-3xl font-medium leading-relaxed">
            Experience the pinnacle of real estate management and acquisition. Our commitment to trust and stability ensures your investments are always in elite hands.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/signup"
              className="inline-block bg-secondary text-white rounded-xl px-10 py-4 font-black uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-xl hover:scale-105"
              scroll={false}
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="inline-block border-2 border-secondary text-secondary rounded-xl px-10 py-4 font-black uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-xl hover:scale-105"
              scroll={false}
            >
              Learn More
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CallToActionSection;
