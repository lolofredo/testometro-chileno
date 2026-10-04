import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTestBySlug } from "@/data/tests";
import { TestPlayer } from "@/components/test/TestPlayer";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "Responder test",
  robots: {
    index: false,
    follow: true
  },
  // Sin canónica propia: si no, hereda la de la home desde el layout.
  alternates: { canonical: null }
};

export default async function PlayPage({ params }: PageProps) {
  const { slug } = await params;
  const test = getTestBySlug(slug);

  if (!test) notFound();

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12">
      <Suspense>
        <TestPlayer test={test} />
      </Suspense>
    </div>
  );
}
