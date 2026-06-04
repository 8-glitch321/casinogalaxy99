import { promises as fs } from "fs";
import path from "path";
import { adminCookieName, verifyAdminToken } from "@/lib/adminAuth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const maxUploadSize = 3 * 1024 * 1024;
const uploadDir = path.join(process.cwd(), "public", "uploads", "admin");

async function isAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(adminCookieName)?.value);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  const slot = formData?.get("slot");

  if (!(file instanceof File) || typeof slot !== "string") {
    return NextResponse.json(
      { error: "Upload-Daten sind unvollständig." },
      { status: 400 },
    );
  }

  if (!/^[-a-z0-9]+$/i.test(slot)) {
    return NextResponse.json(
      { error: "Ungültiger Bild-Slot." },
      { status: 400 },
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Es sind nur Bilddateien erlaubt." },
      { status: 400 },
    );
  }

  if (file.size > maxUploadSize) {
    return NextResponse.json(
      { error: "Das optimierte Bild ist zu groß." },
      { status: 400 },
    );
  }

  await fs.mkdir(uploadDir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  const fileName = `${slot}.webp`;
  const filePath = path.join(uploadDir, fileName);

  await fs.writeFile(filePath, bytes);

  return NextResponse.json({
    url: `/uploads/admin/${fileName}?v=${Date.now()}`,
  });
}
