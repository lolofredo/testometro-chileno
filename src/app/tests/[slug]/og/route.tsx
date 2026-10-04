import { getTestBySlug } from "@/data/tests";
import { renderTestPreview } from "@/lib/share/result-image";
import { getTestHeadline } from "@/lib/share/share-copy";
import { getDurationLabel } from "@/lib/tests/duration";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const test = getTestBySlug(slug);
  if (!test) return new Response("Not found", { status: 404 });

  return renderTestPreview({
    headline: getTestHeadline(test.slug, test.title),
    title: test.title,
    questionCount: test.questions.length,
    durationLabel: getDurationLabel(test)
  });
}
