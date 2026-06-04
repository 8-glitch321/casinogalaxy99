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
    return NextResponse.json(await readSiteContent());
  } catch {
    return NextResponse.json(
      { error: "Die Inhalte konnten nicht geladen werden." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const content = (await request.json().catch(() => null)) as SiteContent | null;

  if (!content?.brand?.name || !content.translations?.DE || !content.translations?.EN) {
    return NextResponse.json(
      { error: "Die gesendeten Inhalte sind unvollständig." },
      { status: 400 },
    );
  }

  try {
    await writeSiteContent(content);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Speichern fehlgeschlagen. Auf Vercel ist das Dateisystem zur Laufzeit read-only." },
      { status: 500 },
    );
  }
}
