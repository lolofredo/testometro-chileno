import { notFound } from "next/navigation";
import { getTestBySlug } from "@/data/rotometro-original";
import { StartForm } from "@/components/test/StartForm";

type PageProps = {
  params: Promise<{ slug: string }>;
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
