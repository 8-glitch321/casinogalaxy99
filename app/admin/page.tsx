import { adminCookieName, verifyAdminToken } from "@/lib/adminAuth";
import { cookies } from "next/headers";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = verifyAdminToken(
    cookieStore.get(adminCookieName)?.value,
  );

  return <AdminPanel isAuthenticated={isAuthenticated} />;
}
