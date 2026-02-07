export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold text-black dark:text-white">
          Simple Next.js App
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Deployed on Cloudflare Pages
        </p>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Deploy verification: OK
          </p>
        </div>
      </main>
    </div>
  );
}
