import { createClient } from "@/lib/supabase/server";
import { getCompletedArticles } from "@/lib/data/deutsch";

export default async function CompletedPage() {
  const supabase = await createClient();

  const { data, error } = await getCompletedArticles(supabase);

  if (error) return <p>{error.message}</p>;
  if (!data || data.length === 0) return <p>No completed articles yet.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Completed Articles</h1>

      <ul className="space-y-2">
        {data.map((article) => (
          <li
            key={article.id}
            className="order rounded-lg p-4 bg-[#cfdbd5] text-black"
          >
            <p className="font-medium">{article.title_en}</p>
            <p className="text-xs text-black">{article.topic}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
