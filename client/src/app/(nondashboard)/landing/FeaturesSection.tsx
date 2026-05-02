"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FeaturesSection = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-32 px-6 sm:px-8 lg:px-12 xl:px-16 bg-white"
    >
      <div className="max-w-4xl xl:max-w-6xl mx-auto">
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-extrabold text-center mb-20 w-full sm:w-3/4 mx-auto text-primary tracking-tight"
        >
          Discover Your Next Chapter with Our Specialized Search
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {[0, 1, 2].map((index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard
                imageSrc={`/landing-search${3 - index}.png`}
                title={
                  [
                    "Verified Premium Listings",
                    "Intuitive Browsing Experience",
                    "Advanced Property Solutions",
                  ][index]
                }
                description={
                  [
                    "Access a curated selection of properties verified for quality and transparency.",
                    "Experience seamless navigation through our high-end rental and sale portfolios.",
                    "Leverage our advanced filtering to find the exact space that meets your lifestyle.",
                  ][index]
                }
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const FeatureCard = ({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string;
  title: string;
  description: string;
}) => (
  <div className="text-center group">
    <div className="p-8 rounded-2xl mb-6 flex items-center justify-center h-56 bg-gray-50 border border-gray-100 shadow-sm group-hover:shadow-md transition-all duration-300">
      <Image
        src={imageSrc}
        width={400}
        height={400}
        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        alt={title}
      />
    </div>
    <h3 className="text-2xl font-bold mb-3 text-primary">{title}</h3>
    <p className="text-foreground leading-relaxed font-medium">{description}</p>
  </div>
);

export default FeaturesSection;
