import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Estate Advisory & Asset De-risking | Chestone",
  description: "Expert real estate advisory and asset de-risking services in Nairobi. We specialize in structured solutions for high-end property investors. Secure your real estate assets with Chestone Properties.",
};

export default function ExclusiveAreasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
