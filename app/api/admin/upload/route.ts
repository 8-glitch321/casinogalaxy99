import { adminCookieName, verifyAdminToken } from "@/lib/adminAuth";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const STORAGE_BUCKET = "site-images";
const maxUploadSize = 3 * 1024 * 1024;

type UploadResponse =
  | {
      success: true;
      url: string;
    }
  | {
      success: false;
      error: string;
    };

function jsonResponse(body: UploadResponse, status = 200) {
  return NextResponse.json(body, { status });
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase ENV fehlt: NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY muessen gesetzt sein.",
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
}

async function isAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(adminCookieName)?.value);
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return jsonResponse({ success: false, error: "Nicht autorisiert." }, 401);
    }

    const formData = await request.formData().catch(() => null);
    const file = formData?.get("file");
    const slot = formData?.get("slot");

    if (!(file instanceof File) || typeof slot !== "string") {
      return jsonResponse(
        { success: false, error: "Upload-Daten sind unvollstaendig." },
        400,
      );
    }

    if (!/^[-a-z0-9]+$/i.test(slot)) {
      return jsonResponse(
        { success: false, error: "Ungueltiger Bild-Slot." },
        400,
      );
    }

    if (!file.type.startsWith("image/")) {
      return jsonResponse(
        { success: false, error: "Es sind nur Bilddateien erlaubt." },
        400,
      );
    }

    if (file.size > maxUploadSize) {
      return jsonResponse(
        { success: false, error: "Das optimierte Bild ist zu gross." },
        400,
      );
    }

    const supabase = getSupabaseClient();
    const storagePath = `admin/${slot}.webp`;
    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, bytes, {
        cacheControl: "3600",
        contentType: file.type || "image/webp",
        upsert: true,
      });

    if (uploadError) {
      return jsonResponse(
        {
          success: false,
          error: `Supabase Upload fehlgeschlagen. Verwendeter Bucket: "${STORAGE_BUCKET}". Fehler: ${uploadError.message}. Pruefe in Vercel NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY und redeploye nach ENV-Aenderungen.`,
        },
        500,
      );
    }

    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);
    const versionedUrl = `${data.publicUrl}?v=${Date.now()}`;

    return jsonResponse({ success: true, url: versionedUrl });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        error:
          error instanceof Error
            ? `Upload fehlgeschlagen. Verwendeter Bucket: "${STORAGE_BUCKET}". Fehler: ${error.message}`
            : "Upload fehlgeschlagen. Unbekannter Serverfehler.",
      },
      500,
    );
  }
}
