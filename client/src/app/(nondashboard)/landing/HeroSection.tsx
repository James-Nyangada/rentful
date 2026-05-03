"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import SearchComponent from "./components/SearchComponent";

const HeroSection = () => {
  const router = useRouter();

  return (
    <div className="relative h-screen">
      <Image
        src="/landing-splash.jpg"
        alt="Chestone Properties Ltd Hero Section"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-primary/20"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center w-full"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl md:text-7xl font-extrabold text-primary mb-8 text-center drop-shadow-sm tracking-tight">
            Elevate Your Living
          </h1>
          <div className="flex justify-center gap-6 mb-12">
            <Button
              onClick={() => router.push("/signup")}
              className="bg-primary hover:bg-primary/90 text-white font-bold rounded-lg px-8 h-14 text-lg shadow-lg transition-all"
            >
              Start Your Journey <ArrowUpRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => router.push("/search")}
              className="bg-secondary hover:bg-secondary/90 text-white font-bold rounded-lg px-8 h-14 text-lg shadow-lg transition-all"
            >
              View Listings <ArrowUpRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <SearchComponent />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
