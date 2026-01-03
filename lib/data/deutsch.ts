import type { SupabaseClient } from "@supabase/supabase-js";

export async function getLikedArticles(supabase: SupabaseClient) {
  return supabase
    .from("deutsch")
    .select("id, topic, completed_at")
    .eq("feedback", "up");
}
