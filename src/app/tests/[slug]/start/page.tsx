import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTestBySlug } from "@/data/tests";
import { TestStarter } from "@/components/test/TestStarter";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "Iniciar test",
  robots: {
    index: false,
    follow: true
  },
  // Sin canónica propia: si no, hereda la de la home desde el layout.
  alternates: { canonical: null }
};

export default async function StartPage({ params }: PageProps) {
  const { slug } = await params;
  const test = getTestBySlug(slug);

  if (!test) notFound();

  return <TestStarter questionCount={test.questions.length} slug={test.slug} title={test.title} />;
}
