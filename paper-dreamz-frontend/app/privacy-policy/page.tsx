import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Paper Dreamz by Ruchi Mishra",
  description: "How Paper Dreamz by Ruchi Mishra collects, uses and protects your details.",
  alternates: { canonical: "/privacy-policy" },
};

export default function Page() {
  return <PolicyPage slug="privacy-policy" />;
}
