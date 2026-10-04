import { getSharedResult } from "@/lib/share/result-link";
import { renderResultStory } from "@/lib/share/result-image";

type RouteProps = {
  params: Promise<{ slug: string; token: string }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { slug, token } = await params;
  const shared = getSharedResult(slug, token);
  if (!shared) return new Response("Not found", { status: 404 });

  return renderResultStory(shared);
}
