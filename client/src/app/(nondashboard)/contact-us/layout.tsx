import { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Your Property in Nairobi | Chestone Properties",
  description: "Maximize your property's value by listing with Nairobi's premier real estate firm. Our expert team ensures high-velocity exposure for your elite listings. Partner with us and list your property today.",
};

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
