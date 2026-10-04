import type { Metadata } from "next";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "Ranking",
  robots: {
    index: false,
    follow: true
  }
};

export default async function RankingPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/rankings#ranking-${slug}`);
}
