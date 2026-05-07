import React from "react";
import HeroSection from "./HeroSection";
import RecentListingsSection from "./RecentListingsSection";
import NeighborhoodSection from "./NeighborhoodSection";
import FeaturesSection from "./FeaturesSection";
import MissionSection from "./MissionSection";
import DiscoverSection from "./DiscoverSection";
import CallToActionSection from "./CallToActionSection";
import TestimonialsSection from "./TestimonialsSection";
import VisionSection from "./VisionSection";
import FooterSection from "./FooterSection";

const Landing = () => {
  return (
    <div className="bg-background">
      <HeroSection />
      <NeighborhoodSection />
      <RecentListingsSection />
      {/* <FeaturesSection /> */}
      {/* <MissionSection /> */}
      {/* <DiscoverSection /> */}
      <TestimonialsSection />
      <CallToActionSection />
      <VisionSection />
      <FooterSection />
    </div>
  );
};

export default Landing;
