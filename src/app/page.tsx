"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRewrite = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "An error occurred");
        return;
      }

      setResult(data.rewritten);
    } catch {
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-6">
        <h1 className="text-center text-3xl font-bold text-black dark:text-white">
          Text Rewriter
        </h1>
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Powered by Gemini API
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="改善したいテキストを入力してください..."
          rows={6}
          className="w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 text-base text-black placeholder-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
        />

        <button
          onClick={handleRewrite}
          disabled={loading || !text.trim()}
          className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "リライト中..." : "リライトする"}
        </button>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              リライト結果
            </h2>
            <p className="whitespace-pre-wrap text-base text-black dark:text-white">
              {result}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
