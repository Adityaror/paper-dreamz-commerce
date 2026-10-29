import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Terms & Conditions | Paper Dreamz by Ruchi Mishra",
  description: "Terms that apply to orders, payment and customisation at Paper Dreamz by Ruchi Mishra.",
  alternates: { canonical: "/terms-conditions" },
};

export default function Page() {
  return <PolicyPage slug="terms-conditions" />;
}
