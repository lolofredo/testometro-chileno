import type { Metadata } from "next";
import { ResultView } from "@/components/test/ResultView";
import { siteConfig } from "@/lib/seo";

type PageProps = {
  params: Promise<{ sessionId: string }>;
};

export const metadata: Metadata = {
  title: `Resultado personal | ${siteConfig.name}`,
  robots: {
    index: false,
    follow: false
  }
};

export default async function ResultPage({ params }: PageProps) {
  const { sessionId } = await params;

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12">
      <ResultView sessionId={sessionId} />
    </div>
  );
}
