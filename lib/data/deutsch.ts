import type { SupabaseClient } from "@supabase/supabase-js";

export async function getLikedArticles(supabase: SupabaseClient) {
  return supabase
    .from("deutsch")
    .select("id, topic, completed_at")
    .eq("feedback", "up");
}

export async function getLikedcArticlesbyTopic(
  supabase: SupabaseClient,
  topic: string
) {
  return supabase
    .from("deutsch")
    .select("id, title_en, completed_at, sentiment, urgency, article_url")
    .eq("feedback", "up")
    .eq("topic", topic)
    .order("completed_at", { ascending: true, nullsFirst: true });
}
