import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luxury Apartments & Houses for Sale in Nairobi | Chestone Properties",
  description: "Browse a curated portfolio of premium residential and commercial properties. Verified listings in Lavington, Westlands, Kileleshwa, and Kilimani. Find your perfect luxury home in Nairobi today.",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
