import { rotometroOriginal } from "@/data/rotometro-original";
import { ResultView } from "@/components/test/ResultView";

type PageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function ResultPage({ params }: PageProps) {
  const { sessionId } = await params;

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12">
      <ResultView test={rotometroOriginal} sessionId={sessionId} />
    </div>
  );
}
