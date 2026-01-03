import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen flex flex-col bg-background text-card-foreground">
      {/* Top bar */}
      <header className="h-14 border-b flex items-center justify-end px-6">
        <LogoutButton />
      </header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 border-r p-6">
          <h2 className="font-semibold text-lg mb-4">NochEinWort</h2>

          <nav className="flex flex-col gap-2 text-sm">
            <Link
              href="/dashboard"
              className="rounded px-3 py-2 transition hover:bg-accent hover:text-foreground"
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/completed"
              className="rounded px-3 py-2 transition hover:bg-accent hover:text-foreground"
            >
              Completed
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
