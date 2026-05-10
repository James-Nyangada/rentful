import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Chestone | The Standard for Nairobi Real Estate",
  description: "Discover the legacy of Chestone Properties, setting the standard for Nairobi real estate. Learn about our mission to provide elite property solutions and explore our high-end residential nodes.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
