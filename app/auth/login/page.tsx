import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Top left text */}
      <div className="absolute top-6 left-6 text-lg font-semibold">
        NochEinWort
      </div>

      {/* Login form */}
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
