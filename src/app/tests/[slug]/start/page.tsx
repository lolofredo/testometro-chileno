import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTestBySlug } from "@/data/tests";
import { StartForm } from "@/components/test/StartForm";
import { siteConfig } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: `Iniciar test | ${siteConfig.name}`,
  robots: {
    index: false,
    follow: true
  }
};

export default async function StartPage({ params }: PageProps) {
  const { slug } = await params;
  const test = getTestBySlug(slug);

  if (!test) notFound();

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12">
      <StartForm test={test} />
    </div>
  );
}
