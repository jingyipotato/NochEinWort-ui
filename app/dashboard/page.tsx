import { createClient } from "@/lib/supabase/server";
import { getLikedArticles } from "@/lib/data/deutsch";
import Link from "next/link";

const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return "bg-green-600";
  if (percentage < 50) return "bg-red-500";
  return "bg-yellow-600";
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await getLikedArticles(supabase);

  if (error) return <p>{error.message}</p>;
  if (!data || data.length === 0) return <p>No liked articles yet.</p>;

  const grouped = data.reduce((acc, row) => {
    const topic = row.topic ?? "Uncategorized";

    if (!acc[topic]) {
      acc[topic] = { total: 0, completed: 0 };
    }

    acc[topic].total += 1;
    if (row.completed_at) acc[topic].completed += 1;

    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  const totalArticles = Object.values(grouped).reduce(
    (sum, g) => sum + g.total,
    0
  );

  const totalCompleted = Object.values(grouped).reduce(
    (sum, g) => sum + g.completed,
    0
  );

  const overallPercentage =
    totalArticles === 0
      ? 0
      : Math.round((totalCompleted / totalArticles) * 100);

  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-semibold">Overall Progress</span>
          <span className="text-card-foreground">
            {totalCompleted} / {totalArticles} completed
          </span>
        </div>

        <div
          className="w-full h-3 bg-gray-300 rounded"
          title={`${totalCompleted} / ${totalArticles} articles completed`}
        >
          <div
            className={`h-3 rounded transition-all ${getProgressColor(
              overallPercentage
            )}`}
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Topic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(grouped).map(([topic, stats]) => {
          const percentage = Math.round((stats.completed / stats.total) * 100);

          return (
            <div
              key={topic}
              className="rounded-xl p-6 space-y-4 bg-card text-card-foreground shadow"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">{topic}</h2>
                <span className="text-sm text-card-foreground">
                  {percentage}%
                </span>
              </div>

              {/* Per-topic progress bar */}
              <div
                className="w-full h-2 bg-muted rounded"
                title={`${stats.completed} / ${stats.total} articles completed`}
              >
                <div
                  className={`h-2 rounded transition-all ${getProgressColor(
                    percentage
                  )}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* View button */}
              <Link href={`/dashboard/topic/${encodeURIComponent(topic)}`}>
                <button className="w-full rounded bg-secondary text-secondary-foreground py-2 font-medium hover:bg-accent transition">
                  View
                </button>
              </Link>

              {/* Footer stats */}
              <div className="flex justify-between text-sm pt-4 border-t">
                <div>
                  <p>Total Articles</p>
                  <p className="font-semibold">{stats.total}</p>
                </div>
                <div>
                  <p>Completed</p>
                  <p className="font-semibold">{stats.completed}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
