import type { Metadata } from "next";
import GetAQuote from "@/components/getaquote";

export const metadata: Metadata = {
  title: "Get a Free Phone Repair Quote",
  description:
    "Free, no-obligation quote for your iPhone or phone repair in Columbus, OH. Tell us your model and the issue — we'll respond with a transparent price within 1 hour.",
  alternates: { canonical: "/getaquote" },
};

export default function Page() {
  return <GetAQuote />;
}
