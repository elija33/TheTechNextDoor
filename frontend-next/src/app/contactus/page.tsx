import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with The Tech Next Door for fast phone repair in Columbus, OH. Call, text, or fill out the form — we come to you for screen, battery, and charging port repairs.",
  alternates: { canonical: "/contactus" },
};

export default function Page() {
  return <Contact />;
}
