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
        alt="Rentiful Rental Platform Hero Section"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center w-full"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 text-center drop-shadow-lg">
            Rent or Buy a property in Kenya
          </h1>
          <div className="flex justify-center gap-4 mb-10">
            <Button
              onClick={() => router.push("/signup")}
              className="bg-[#D2E030] hover:bg-[#b8c52a] text-black font-semibold rounded-md px-6 h-12"
            >
              Your Dream Home Starts Here <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => router.push("/search")}
              className="bg-white hover:bg-gray-100 text-black font-semibold rounded-md px-6 h-12"
            >
              View Listings <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <SearchComponent />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
