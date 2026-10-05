import type { Metadata } from "next";
import { ResultView } from "@/components/test/ResultView";

type PageProps = {
  params: Promise<{ sessionId: string }>;
};

export const metadata: Metadata = {
  title: "Resultado personal",
  robots: {
    index: false,
    follow: false
  },
  // Sin canónica propia: si no, hereda la de la home desde el layout.
  alternates: { canonical: null }
};

export default async function ResultPage({ params }: PageProps) {
  const { sessionId } = await params;

  return <ResultView sessionId={sessionId} />;
}
