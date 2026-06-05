import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

export type LanguageCode = "DE" | "EN";

export type LinkItem = {
  label: string;
  href: string;
};

export type StatItem = {
  href: string;
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

const siteContentRecordId = "main";

type SiteContentRow = {
  content: SiteContent | null;
  id: string;
  updated_at: string | null;
};

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase ENV fehlt: NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY muessen gesetzt sein.",
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}

async function readDefaultSiteContent(): Promise<SiteContent> {
  const raw = await fs.readFile(siteContentPath, "utf8");
  return normalizeSiteContent(JSON.parse(raw) as SiteContent);
}

export async function readSiteContent(): Promise<SiteContent> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("id, content, updated_at")
    .eq("id", siteContentRecordId)
    .maybeSingle<SiteContentRow>();

  if (error) {
    throw new Error(`Supabase konnte Inhalte nicht laden: ${error.message}`);
  }

  if (data?.content) {
    const defaultContent = await readDefaultSiteContent();
    return normalizeSiteContent(mergeSiteContent(defaultContent, data.content));
  }

  const defaultContent = await readDefaultSiteContent();
  await writeSiteContent(defaultContent);
  return defaultContent;
}

function mergeSiteContent(
  defaultContent: SiteContent,
  savedContent: Partial<SiteContent>,
): SiteContent {
  const savedDE: Partial<TranslationContent> = savedContent.translations?.DE ?? {};
  const savedEN: Partial<TranslationContent> = savedContent.translations?.EN ?? {};

  return {
    ...defaultContent,
    ...savedContent,
    brand: {
      ...defaultContent.brand,
      ...(savedContent.brand ?? {}),
    },
    colors: {
      ...defaultContent.colors,
      ...(savedContent.colors ?? {}),
    },
    links: {
      header: savedContent.links?.header ?? defaultContent.links.header,
      footer: savedContent.links?.footer ?? defaultContent.links.footer,
    },
    casinos: savedContent.casinos ?? defaultContent.casinos,
    translations: {
      DE: {
        ...defaultContent.translations.DE,
        ...savedDE,
        stats: normalizeStats(savedDE.stats, defaultContent.translations.DE.stats),
      },
      EN: {
        ...defaultContent.translations.EN,
        ...savedEN,
        stats: normalizeStats(savedEN.stats, defaultContent.translations.EN.stats),
      },
    },
  };
}

export function normalizeSiteContent(content: SiteContent): SiteContent {
  const normalizedTranslations = {
    DE: {
      ...content.translations.DE,
      stats: normalizeStats(content.translations.DE.stats, content.translations.DE.stats),
    },
    EN: {
      ...content.translations.EN,
      stats: normalizeStats(content.translations.EN.stats, content.translations.EN.stats),
    },
  };

  if (Array.isArray(content.casinos)) {
    return {
      ...content,
      translations: normalizedTranslations,
      casinos: content.casinos.map((casino, index) =>
        normalizeCasino(casino, index),
      ),
    };
  }

  return {
    ...content,
    translations: normalizedTranslations,
    casinos: (content.offers ?? []).map((offer, index) => ({
      id: offer.id,
      name: offer.title === "-" ? "" : offer.title,
      logoUrl: offer.logoUrl,
      bonus: offer.highlight === "-" ? "" : offer.highlight,
      description1: offer.codeLabel,
      description2: offer.codeValue,
      feature1: offer.perks[0] ?? "-",
      feature2: offer.perks[1] ?? "-",
      feature3: offer.perks[2] ?? "-",
      feature4: offer.perks[3] ?? "-",
      buttonText: "JETZT SPIELEN",
      buttonLink: offer.playHref,
      detailsText: offer.details.filter(Boolean).join("\n"),
      order: index + 1,
      active: true,
    })),
  };
}

function normalizeStats(
  stats: Array<Partial<StatItem>> | undefined,
  defaults: StatItem[],
): StatItem[] {
  const source = stats?.length ? stats : defaults;

  return source.map((stat, index) => ({
    href: stat.href ?? defaults[index]?.href ?? "#bonus",
    icon: stat.icon ?? defaults[index]?.icon ?? "star",
    title: stat.title ?? defaults[index]?.title ?? "",
    text: stat.text ?? defaults[index]?.text ?? "",
  }));
}

function normalizeCasino(casino: Partial<Casino>, index: number): Casino {
  return {
    id: casino.id || `casino-${index + 1}`,
    name: casino.name ?? "",
    logoUrl: casino.logoUrl ?? "",
    bonus: casino.bonus ?? "",
    description1: casino.description1 ?? "",
    description2: casino.description2 ?? "",
    feature1: casino.feature1 || "-",
    feature2: casino.feature2 || "-",
    feature3: casino.feature3 || "-",
    feature4: casino.feature4 || "-",
    buttonText: casino.buttonText || "JETZT SPIELEN",
    buttonLink: casino.buttonLink ?? "",
    detailsText: casino.detailsText ?? "",
    order: Number.isFinite(casino.order) ? Number(casino.order) : index + 1,
    active: casino.active !== false,
  };
}

export async function writeSiteContent(content: SiteContent) {
  const supabase = getSupabaseClient();
  const normalizedContent = normalizeSiteContent(content);
  const { error } = await supabase.from("site_content").upsert({
    id: siteContentRecordId,
    content: normalizedContent,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`Supabase konnte Inhalte nicht speichern: ${error.message}`);
  }
}
