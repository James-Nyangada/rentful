import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Landing from "./(nondashboard)/landing/page";

export const metadata: Metadata = {
  title: "Luxury Real Estate Nairobi | Chestone Properties",
  description: "Experience the pinnacle of luxury living with Chestone Properties. We offer premium residential and commercial real estate solutions in Nairobi. Browse our verified listings and discover your dream home today.",
};

export default function Home() {
  return (
    <div className="h-full w-full">
      <Navbar />
      <main className={`h-full flex w-full flex-col`}>
        <Landing />
      </main>
    </div>
  );
}
