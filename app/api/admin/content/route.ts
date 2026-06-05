import { adminCookieName, verifyAdminToken } from "@/lib/adminAuth";
import { readSiteContent, writeSiteContent, type SiteContent } from "@/lib/siteContent";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function isAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(adminCookieName)?.value);
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  try {
    return NextResponse.json(await readSiteContent(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Die Inhalte konnten nicht geladen werden.",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const content = (await request.json().catch(() => null)) as SiteContent | null;

  if (
    !content?.brand?.name ||
    !content.translations?.DE ||
    !content.translations?.EN ||
    !Array.isArray(content.casinos)
  ) {
    return NextResponse.json(
      { error: "Die gesendeten Inhalte sind unvollständig." },
      { status: 400 },
    );
  }

  try {
    await writeSiteContent(content);
    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Speichern in Supabase fehlgeschlagen.",
      },
      { status: 500 },
    );
  }
}
