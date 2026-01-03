import { createClient } from "@/lib/supabase/server";
import { getLikedcArticlesbyTopic } from "@/lib/data/deutsch";
import { TopicArticleList } from "@/components/topic-article-list";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const supabase = await createClient();

  const { data, error } = await getLikedcArticlesbyTopic(supabase, topic);

  if (error) return <p>{error.message}</p>;
  if (!data || data.length === 0) return <p>No articles found for {topic}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{topic}</h1>

      {/* Filter + list lives here */}
      <TopicArticleList articles={data} />
    </div>
  );
}
