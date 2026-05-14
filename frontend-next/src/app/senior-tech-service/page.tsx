import type { Metadata } from "next";
import SeniorTechService from "@/components/SeniorTechService";

export const metadata: Metadata = {
  title: "In-Home Tech Help for Seniors",
  description:
    "Patient, in-home tech support for seniors in Columbus, OH. We help with iPhones, iPads, Wi-Fi, email, video calls, and more. Affordable, friendly visits in your own home.",
  alternates: { canonical: "/senior-tech-service" },
};

export default function Page() {
  return <SeniorTechService />;
}
