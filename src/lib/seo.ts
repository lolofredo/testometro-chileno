import type { Metadata } from "next";
import type { CatalogTest } from "@/data/test-catalog";
import type { TestDefinition } from "@/lib/tests/types";

const ogImage = "/memes/meme-1.png";

export const siteConfig = {
  name: "Testómetro Chileno",
  fullName: "Testómetro Chileno",
  description:
    "Tests chilenos de humor, cultura popular chilena, memes, nostalgia, Rotómetro, Cuicómetro, Chantómetro y rarezas del Chile actual.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://testometro.cl",
  locale: "es_CL",
  author: "Testómetro Chileno",
  keywords: [
    "Testómetro",
    "Testómetro Chileno",
    "tests chilenos",
    "test chileno",
    "tests de cultura popular chilena",
    "cultura popular chilena",
    "humor chileno",
    "memes chilenos",
    "Rotómetro Original",
    "Rotómetro 2.0",
    "Cuicómetro",
    "Chantómetro",
    "qué tan chanta eres",
    "qué tan cuico eres",
    "qué tan roto eres",
    "chilenidad",
    "nostalgia chilena",
    "farándula chilena",
    "internet chileno antiguo",
    "Chile actual",
    "Chile de los 2000"
  ]
};

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Tests chilenos, memes y cultura popular chilena`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  alternates: {
    canonical: absoluteUrl("/")
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: absoluteUrl(ogImage),
        width: 982,
        height: 982,
        alt: "Meme chileno del archivo visual del Testómetro Chileno"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [absoluteUrl(ogImage)]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export function getTestMetadata(test: TestDefinition): Metadata {
  const path = `/tests/${test.slug}`;
  const title = `${test.title} | Test chileno de humor`;
  const description = test.description;

  return {
    title,
    description,
    keywords: [
      ...siteConfig.keywords,
      test.title,
      test.eyebrow,
      "test de humor chileno",
      "test de cultura popular chilena"
    ],
    alternates: {
      canonical: absoluteUrl(path)
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: defaultMetadata.openGraph?.images
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(ogImage)]
    }
  };
}

export function getCatalogTestMetadata(catalogTest: CatalogTest): Metadata {
  const path = catalogTest.href ?? `/tests/${catalogTest.slug}`;
  const title = `${catalogTest.title} | ${siteConfig.name}`;
  const description = catalogTest.description;

  return {
    // La plantilla del layout ya agrega " | Testómetro Chileno" a la pestaña.
    title: catalogTest.title,
    description,
    keywords: [...siteConfig.keywords, catalogTest.title, catalogTest.theme],
    alternates: {
      canonical: absoluteUrl(path)
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: defaultMetadata.openGraph?.images
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(ogImage)]
    }
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: "es-CL",
  description: siteConfig.description
};

export function getTestJsonLd(test: TestDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${test.title} | ${siteConfig.name}`,
    url: absoluteUrl(`/tests/${test.slug}`),
    inLanguage: "es-CL",
    description: test.description,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url
    },
    about: [
      "tests chilenos",
      "cultura popular chilena",
      "humor chileno",
      test.title,
      test.eyebrow
    ]
  };
}
