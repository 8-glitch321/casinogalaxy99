import HomePage from "./HomePage";
import { readSiteContent } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await readSiteContent();

  return <HomePage content={content} />;
}
