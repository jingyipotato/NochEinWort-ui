"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Article = {
  id: number;
  title_en: string;
  completed_at: string | null;
  sentiment: string | null;
  urgency: string | null;
  article_url: string | null;
};

export function TopicArticleList({ articles }: { articles: Article[] }) {
  const supabase = createClient();
  const [localArticles, setLocalArticles] = useState(articles);

  const markCompleted = async (id: number) => {
    const now = new Date().toISOString();

    await supabase.from("deutsch").update({ completed_at: now }).eq("id", id);

    // Update UI immediately
    setLocalArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed_at: now } : a))
    );
  };

  const [sentiment, setSentiment] = useState<string>("all");
  const [urgency, setUrgency] = useState<string>("all");

  const filtered = localArticles.filter((a) => {
    if (sentiment !== "all" && a.sentiment !== sentiment) return false;
    if (urgency !== "all" && a.urgency !== urgency) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        {/* Sentiment */}
        <select
          value={sentiment}
          onChange={(e) => setSentiment(e.target.value)}
          className="
              rounded
              border border-black/20
              bg-[#faedcd]
              px-4 py-2
              text-sm text-black
              focus:outline-none focus:ring-2 focus:ring-black/30
              "
        >
          <option value="all">All sentiments</option>
          <option value="Positive">Positive</option>
          <option value="Neutral">Neutral</option>
          <option value="Negative">Negative</option>
        </select>

        {/* Urgency */}
        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          className="
              rounded
              border border-black/20
              bg-[#faedcd]
              px-4 py-2
              text-sm text-black
              focus:outline-none focus:ring-2 focus:ring-black/30
              "
        >
          <option value="all">All urgency</option>
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="Breaking">Breaking</option>
        </select>
      </div>

      {/* Articles */}
      <ul className="space-y-3">
        {filtered.map((article) => (
          <li
            key={article.id}
            className="flex justify-between items-center border bg-card text-card-foreground p-4 rounded"
          >
            {/* Left: title + metadata */}
            <div className="flex flex-col gap-1">
              <p
                className={`font-medium ${
                  article.completed_at
                    ? "line-through text-muted-foreground"
                    : ""
                }`}
              >
                {article.title_en}
              </p>

              <p className="text-xs text-gray">
                {article.sentiment ?? "unknown"} ·{" "}
                {article.urgency ?? "unknown"}
              </p>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-3">
              {article.article_url && (
                <a
                  href={article.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded bg-blue-50 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-blue-100"
                >
                  Read
                </a>
              )}

              {article.completed_at ? (
                <span className="text-xs font-medium text-green-700">
                  Completed
                </span>
              ) : (
                <button
                  onClick={() => markCompleted(article.id)}
                  className="rounded border px-2 py-1 text-xs text-card-foreground hover:accent-500"
                >
                  Complete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No articles match the selected filters.
        </p>
      )}
    </div>
  );
}
