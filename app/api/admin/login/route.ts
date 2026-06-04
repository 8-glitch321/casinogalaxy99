import { adminCookieName, createAdminToken, verifyAdminPassword } from "@/lib/adminAuth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    password?: unknown;
  } | null;

  const password = typeof body?.password === "string" ? body.password : "";

  if (!verifyAdminPassword(password)) {
    return NextResponse.json(
      { error: "Das Passwort ist falsch oder ADMIN_PASSWORD ist nicht gesetzt." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(adminCookieName, createAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
