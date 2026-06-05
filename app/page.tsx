import HomePage from "./HomePage";
import { readSiteContent } from "@/lib/siteContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function loadContentResult() {
  try {
    return { content: await readSiteContent(), error: null };
  } catch (error) {
    return {
      content: null,
      error:
        error instanceof Error
          ? error.message
          : "Bitte pruefe NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY und die Tabelle site_content.",
    };
  }
}

export default async function Page() {
  const { content, error } = await loadContentResult();

  if (!content) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#030106] px-4 text-white">
        <section className="w-full max-w-xl rounded-2xl border border-red-300/25 bg-red-400/10 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.42)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-200">
            Supabase Fehler
          </p>
          <h1 className="mt-2 text-2xl font-black">
            Inhalte konnten nicht geladen werden.
          </h1>
          <p className="mt-3 text-sm leading-6 text-red-100">
            {error}
          </p>
        </section>
      </main>
    );
  }

  return <HomePage content={content} />;
}
