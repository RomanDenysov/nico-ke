import type { Metadata } from "next";
import type { MenuItem } from "@/db/schema";
import env from "@/env";

const BASE_URL = env.NEXT_PUBLIC_APP_URL;

/**
 * Site-wide SEO configuration
 */
export const siteConfig = {
  name: "NICO CAFFÉ",
  description:
    "Dlhý brunch, výberová káva, kváskový chlieb a menu, na ktorom ochutnáte zo všetkého trochu - tradičné jedlá v modernom šate, streetfood aj pan asiu. Byť svetoví aj v Košiciach, to je heslo, ktorým sa snažíme neustále posúvať vpred.",
  url: BASE_URL,
  locale: "sk_SK",
  type: "website" as const,
  images: {
    og: `${BASE_URL}/images/hero.jpg`,
    width: 1200,
    height: 630,
  },
  address: {
    streetAddress: "Kuzmányho 1",
    addressLocality: "Košice",
    postalCode: "040 01",
    addressCountry: "SK",
  },
  geo: {
    latitude: 48.7127,
    longitude: 21.2476,
  },
  phone: "+421 917 478 034",
  openingHours: ["Mo-Fr 07:00-22:00", "Sa 09:00-20:00", "Su 09:00-20:00"],
};

/**
 * Default metadata for the site
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${siteConfig.name} | Košice`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "NICO",
    "kaviareň",
    "Košice",
    "brunch",
    "raňajky",
    "bistro",
    "káva",
    "výberová káva",
    "kváskový chlieb",
    "streetfood",
    "pan asia",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: siteConfig.type,
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Košice`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.images.og,
        width: siteConfig.images.width,
        height: siteConfig.images.height,
        alt: `${siteConfig.name} - Kaviareň a bistro v Košiciach`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Košice`,
    description: siteConfig.description,
    images: [siteConfig.images.og],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add when available:
    // google: 'your-google-verification-code',
  },
};

/**
 * JSON-LD for Organization (used in root layout)
 */
export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${BASE_URL}/#organization`,
    name: siteConfig.name,
    url: BASE_URL,
    logo: `${BASE_URL}/logos/logo-nico-square.svg`,
    image: siteConfig.images.og,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      ...siteConfig.geo,
    },
    telephone: siteConfig.phone,
    servesCuisine: ["Slovenská", "Medzinárodná", "Ázijská"],
    priceRange: "€€",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "09:00",
        closes: "20:00",
      },
    ],
    sameAs: [
      // Add social links when available:
      // "https://www.facebook.com/nicocaffe",
      // "https://www.instagram.com/nicocaffe",
    ],
  };
}

/**
 * JSON-LD for Menu page
 */
export function getMenuJsonLd(
  menuName: string,
  menuDescription: string,
  items: Array<{ category: { name: string }; items: MenuItem[] }>
) {
  const menuSections = items.map(({ category, items: menuItems }) => ({
    "@type": "MenuSection",
    name: category.name,
    hasMenuItem: menuItems.map((item) => ({
      "@type": "MenuItem",
      name: item.name,
      description: item.description ?? undefined,
      offers: {
        "@type": "Offer",
        price: item.price.replace(/[^\d.,]/g, "").replace(",", "."),
        priceCurrency: "EUR",
      },
    })),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: menuName,
    description: menuDescription,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": BASE_URL,
    },
    hasMenuSection: menuSections,
  };
}

/**
 * JSON-LD for WebPage (used on homepage)
 */
export function getWebPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE_URL}/#webpage`,
    url: BASE_URL,
    name: `${siteConfig.name} | Košice`,
    description: siteConfig.description,
    isPartOf: {
      "@id": `${BASE_URL}/#website`,
    },
    about: {
      "@id": `${BASE_URL}/#organization`,
    },
    inLanguage: "sk",
  };
}

/**
 * JSON-LD for WebSite (used in root layout)
 */
export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    inLanguage: "sk",
  };
}

/**
 * Helper to safely stringify JSON-LD (prevents XSS)
 */
export function safeJsonLdStringify(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
