import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Returns & Refunds | Paper Dreamz by Ruchi Mishra",
  description: "Returns, exchanges and cancellations for Paper Dreamz handmade, customised orders.",
  alternates: { canonical: "/returns-refunds" },
};

export default function Page() {
  return <PolicyPage slug="returns-refunds" />;
}
