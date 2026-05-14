import type { Metadata } from "next";
import Blog from "@/components/Blog";

export const metadata: Metadata = {
  title: "Phone Repair Tips & Guides — The Tech Next Door Blog",
  description:
    "Articles and guides on iPhone repair, battery life, water damage, and tech help for seniors in Columbus, OH. Practical advice from a local repair tech.",
  alternates: { canonical: "/blog" },
};

export default function Page() {
  return <Blog />;
}
