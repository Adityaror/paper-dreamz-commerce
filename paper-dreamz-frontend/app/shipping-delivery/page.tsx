import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Paper Dreamz by Ruchi Mishra",
  description: "Processing times, delivery across India and complimentary shipping for Paper Dreamz handmade orders.",
  alternates: { canonical: "/shipping-delivery" },
};

export default function Page() {
  return <PolicyPage slug="shipping-delivery" />;
}
