import type { Metadata } from "next";
import Script from "next/script";
import AdminPreview from "@/components/AdminPreview";
import { INTRO_SEEN_KEY } from "@/lib/intro";
import {
  Playfair_Display,
  Urbanist,
  Barlow_Semi_Condensed,
  Cormorant_Garamond,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
});

const barlow = Barlow_Semi_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paperdreamz3.dsdspl.com";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const SITE_DESCRIPTION =
  "Paper Dreamz — luxury handmade envelopes, keepsakes and gifts for life's most beautiful moments. Gold foil, hand-poured wax seals, and heirloom velvet.";

// Organization + LocalBusiness + founder + website, so search engines and LLMs can identify the brand.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": `${SITE_URL}/#business`,
      name: "Paper Dreamz",
      alternateName: "Paper Dreamz by Ruchi Mishra",
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/images/logo-full.png`,
      image: `${SITE_URL}/images/hero_emerald_envelope.jpg`,
      description: SITE_DESCRIPTION,
      foundingDate: "2010",
      founder: { "@id": `${SITE_URL}/#founder` },
      telephone: "+91-99999-80586",
      address: {
        "@type": "PostalAddress",
        addressLocality: "New Delhi",
        addressRegion: "Delhi",
        addressCountry: "IN",
      },
      contactPoint: [
        { "@type": "ContactPoint", telephone: "+91-99999-80586", contactType: "customer service", areaServed: "IN" },
        { "@type": "ContactPoint", telephone: "+91-76690-06999", contactType: "sales", contactOption: "WhatsApp" },
      ],
      sameAs: [
        "https://www.instagram.com/paperdreamz_ruchi",
        "https://www.facebook.com/share/1EEz4maxTH/",
        "https://www.youtube.com/@paperdreamz2017",
        "https://pin.it/575TwFYzX",
      ],
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#founder`,
      name: "Ruchi Mishra",
      jobTitle: "Founder & Designer",
      worksFor: { "@id": `${SITE_URL}/#business` },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Paper Dreamz",
      inLanguage: "en-IN",
      publisher: { "@id": `${SITE_URL}/#business` },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Paper Dreamz by Ruchi Mishra | Luxury Envelopes & Gifts",
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  keywords: [
    "luxury envelopes",
    "shagun lifafa",
    "wedding invitation suites",
    "handcrafted gifting",
    "Paper Dreamz",
    "floating pearl envelopes",
    "baby envelopes",
    "wedding engagement roka envelopes",
    "floral envelopes",
    "festive envelopes",
    "religious envelopes",
    "gold silver coin envelopes",
    "gift tags",
    "gold silver coin boxes",
    "cash boxes",
  ],
  openGraph: {
    title: "Paper Dreamz by Ruchi Mishra",
    description: "Luxury handcrafted envelopes, keepsakes & bespoke gifting.",
    type: "website",
    url: "/",
    siteName: "Paper Dreamz",
    locale: "en_IN",
    images: [{ url: "/images/hero_emerald_envelope.jpg", width: 1200, height: 896, alt: "Paper Dreamz handcrafted emerald velvet envelope" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paper Dreamz by Ruchi Mishra",
    description: "Luxury handcrafted envelopes, keepsakes & bespoke gifting.",
    images: ["/images/hero_emerald_envelope.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${urbanist.variable} ${barlow.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-ink noise">
        {/* Runs before first paint: returning (this session) and reduced-motion visitors skip the intro, so its
            overlay is hidden by CSS straight away instead of flashing black until the page's JavaScript loads.
            Admin previews (?admin-preview=<section>) skip it too, unless the intro itself is being previewed. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var p=new URLSearchParams(location.search).get("admin-preview");if(p)document.documentElement.dataset.adminPreview=p;if((p&&p!=="intro")||sessionStorage.getItem("${INTRO_SEEN_KEY}")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.introSkip="1"}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
        />
        {children}
        <AdminPreview />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
