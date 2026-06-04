import { promises as fs } from "fs";
import path from "path";

export type LanguageCode = "DE" | "EN";

export type LinkItem = {
  label: string;
  href: string;
};

export type StatItem = {
  icon: string;
  title: string;
  text: string;
};

export type StoryFeature = StatItem & {
  href: string;
};

export type CasinoOffer = {
  id: string;
  logoText: string;
  logoUrl: string;
  title: string;
  highlight: string;
  subtitle: string;
  codeLabel: string;
  codeValue: string;
  bonusLabel: string;
  bonusValue: string;
  perks: string[];
  playHref: string;
  details: string[];
};

export type Casino = {
  id: string;
  name: string;
  logoUrl: string;
  bonus: string;
  description1: string;
  description2: string;
  feature1: string;
  feature2: string;
  feature3: string;
  feature4: string;
  buttonText: string;
  buttonLink: string;
  detailsText: string;
  order: number;
  active: boolean;
};

export type TranslationContent = {
  nav: [string, string, string];
  heroEyebrow: string;
  heroTitleTop: string;
  heroTitleBottom: string;
  heroCopy: string;
  primaryCta: string;
  primaryCtaHref: string;
  secondaryCta: string;
  secondaryCtaHref: string;
  playOffer: string;
  detailsOffer: string;
  ageKicker: string;
  ageTitle: string;
  ageCopy: string;
  ageNotice: string;
  ageEnter: string;
  ageLeave: string;
  stats: StatItem[];
  bonusTitle: string;
  storyEyebrow: string;
  storyTitleTop: string;
  storyTitleBottom: string;
  storyTitleAccent: string;
  storyLead: string;
  storyParagraphs: string[];
  storyFeatures: StoryFeature[];
  storyLiveTitle: string;
  storyHandle: string;
  footerCopy: string;
  responsibleTitle: string;
  responsibleCopy: string;
  rights: string;
  terms: string;
  privacy: string;
};

export type SiteContent = {
  brand: {
    name: string;
    profileImageUrl: string;
    heroImageUrl: string;
    twitchUrl: string;
  };
  colors: {
    background: string;
    foreground: string;
    violet: string;
    violetHot: string;
    violetSoft: string;
    gold: string;
    red: string;
  };
  links: {
    header: LinkItem[];
    footer: LinkItem[];
  };
  casinos: Casino[];
  offers?: CasinoOffer[];
  translations: Record<LanguageCode, TranslationContent>;
};

export const siteContentPath = path.join(
  process.cwd(),
  "data",
  "siteContent.json",
);

export async function readSiteContent(): Promise<SiteContent> {
  const raw = await fs.readFile(siteContentPath, "utf8");
  return normalizeSiteContent(JSON.parse(raw) as SiteContent);
}

function normalizeSiteContent(content: SiteContent): SiteContent {
  if (Array.isArray(content.casinos)) {
    return content;
  }

  return {
    ...content,
    casinos: (content.offers ?? []).map((offer, index) => ({
      id: offer.id,
      name: offer.title === "-" ? "" : offer.title,
      logoUrl: offer.logoUrl,
      bonus: offer.highlight === "-" ? "" : offer.highlight,
      description1: offer.codeLabel,
      description2: offer.codeValue,
      feature1: offer.perks[0] ?? "",
      feature2: offer.perks[1] ?? "",
      feature3: offer.perks[2] ?? "",
      feature4: offer.perks[3] ?? "",
      buttonText: "JETZT SPIELEN",
      buttonLink: offer.playHref,
      detailsText: offer.details.filter(Boolean).join("\n"),
      order: index + 1,
      active: true,
    })),
  };
}

export async function writeSiteContent(content: SiteContent) {
  /*
   * Vercel deployments use a read-only file system for application files, so
   * saving this JSON file is best for local/self-hosted use. For persistent
   * production editing, move the content store to Supabase, Firebase, or
   * Vercel KV and keep these API routes as the admin-facing layer.
   */
  await fs.mkdir(path.dirname(siteContentPath), { recursive: true });
  await fs.writeFile(siteContentPath, `${JSON.stringify(content, null, 2)}\n`);
}
