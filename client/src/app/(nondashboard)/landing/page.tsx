import React from "react";
import HeroSection from "./HeroSection";
import RecentListingsSection from "./RecentListingsSection";
import NeighborhoodSection from "./NeighborhoodSection";
import FeaturesSection from "./FeaturesSection";
import MissionSection from "./MissionSection";
import DiscoverSection from "./DiscoverSection";
import CallToActionSection from "./CallToActionSection";
import FooterSection from "./FooterSection";

const Landing = () => {
  return (
    <div className="bg-background">
      <HeroSection />
      <NeighborhoodSection />
      <RecentListingsSection />
      <FeaturesSection />
      {/* <MissionSection /> */}
      {/* <DiscoverSection /> */}
      <CallToActionSection />
      <FooterSection />
    </div>
  );
};

export default Landing;
