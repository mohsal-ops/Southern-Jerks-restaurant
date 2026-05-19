"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Wrong password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-xs shadow-xl flex flex-col items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-[#c85a1e] flex items-center justify-center">
          <span className="text-white font-bold text-lg">SJ</span>
        </div>

        <div className="text-center">
          <h1 className="text-lg font-bold text-stone-900">Admin Access</h1>
          <p className="text-xs text-stone-400 mt-1">Southern Jerks Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c85a1e] transition-colors"
            autoFocus
            required
          />

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#c85a1e] hover:bg-[#a84918] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}