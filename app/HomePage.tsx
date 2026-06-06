"use client";

/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { useState } from "react";
import type { Casino, LanguageCode, SiteContent } from "@/lib/siteContent";

const languages = [
  { label: "Deutsch", code: "DE" },
  { label: "English", code: "EN" },
];

function GalaxyBackground() {
  return <div className="galaxy-background" aria-hidden="true" />;
}

function BrandAvatar({
  alt,
  imageUrl,
}: {
  alt: string;
  imageUrl: string;
}) {
  return (
    <span className="brand-avatar">
      <img src={imageUrl} alt={alt} />
    </span>
  );
}

function SocialIcon({ label }: { label: string }) {
  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2.2a3.3 3.3 0 0 0-3.3 3.3v9a3.3 3.3 0 0 0 3.3 3.3h9a3.3 3.3 0 0 0 3.3-3.3v-9a3.3 3.3 0 0 0-3.3-3.3h-9ZM12 7.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Zm0 2.2a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Zm5.2-2.7a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z" />
      </svg>
    );
  }

  if (label === "Telegram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M22.2 4.2 18.9 20c-.3 1.2-1.1 1.5-2.1.9l-5.7-4.2-2.8 2.7c-.3.3-.6.6-1.2.6l.4-5.8L18.1 4.7c.5-.4-.1-.7-.7-.3L4.3 12.7-1.3 11c-1.2-.4-1.2-1.2.3-1.8L20.9.8c1-.4 1.9.2 1.3 3.4Z"
          transform="translate(1.4 1.4) scale(.9)"
        />
      </svg>
    );
  }

  if (label === "Discord") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.2 5.2A16 16 0 0 0 15.3 4l-.5 1a14.6 14.6 0 0 0-5.6 0l-.5-1a16 16 0 0 0-3.9 1.2C2.3 8.2 1.8 11.1 2.1 14c1.6 1.2 3.2 1.9 4.8 2.4l1-1.6c-.6-.2-1.1-.5-1.6-.8l.4-.3c3.1 1.4 7.5 1.4 10.6 0l.4.3c-.5.3-1 .6-1.6.8l1 1.6c1.6-.5 3.2-1.2 4.8-2.4.4-3.4-.7-6.3-2.7-8.8ZM8.6 12.8c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Zm6.8 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8S17 10 17 11s-.7 1.8-1.6 1.8Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 2h18v13l-4 4h-4l-3.2 3H8v-3H3V2Zm3 3v11h4v2l2.2-2H16l2-2V5H6Zm4 3h2v5h-2V8Zm5 0h2v5h-2V8Z" />
    </svg>
  );
}

function HeroIcon({ type }: { type: string }) {
  if (type === "gift") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10h16v10H4V10Zm0-4h16v4H4V6Zm8 0v14M8.2 6C6.8 5.6 6 4.9 6 4c0-.8.7-1.5 1.6-1.5 1.3 0 2.5 1.4 4.4 3.5M15.8 6C17.2 5.6 18 4.9 18 4c0-.8-.7-1.5-1.6-1.5-1.3 0-2.5 1.4-4.4 3.5" />
      </svg>
    );
  }

  if (type === "play") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 7.5v9l7-4.5-7-4.5Z" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }

  if (type === "community") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 19v-1.5C4 15.6 5.6 14 7.5 14h1C10.4 14 12 15.6 12 17.5V19H4Zm8 0v-1.5c0-1.1-.4-2.2-1.1-3  .5-.3 1.1-.5 1.8-.5h3.8c1.9 0 3.5 1.6 3.5 3.5V19h-8Z" />
      </svg>
    );
  }

  if (type === "stream") {
    return <SocialIcon label="Twitch" />;
  }

  if (type === "star") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 2.5 2.9 6 6.6.9-4.8 4.7 1.1 6.6L12 17.6l-5.8 3.1 1.1-6.6-4.8-4.7 6.6-.9L12 2.5Z" />
      </svg>
    );
  }

  if (type === "bolt") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 2 4 13h6l-1 9 10-13h-6l0-7Z" />
      </svg>
    );
  }

  if (type === "chat") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v11H9l-5 4V5Zm5 5h.01M12 10h.01M15 10h.01" />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 20 6v5.6c0 4.8-3.2 7.8-8 9.4-4.8-1.6-8-4.6-8-9.4V6l8-3Zm-3 9 2 2 4-5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2 22 12 12 22 2 12 12 2Zm0 4-6 6 6 6 6-6-6-6Z" />
    </svg>
  );
}

function CasinoFeatureIcon({ type }: { type: string }) {
  if (type === "speed") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="m12 12 4-4" />
      </svg>
    );
  }

  if (type === "card") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="8" width="14" height="9" rx="1.5" />
        <path d="M7 11h10" />
      </svg>
    );
  }

  if (type === "wager") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <text x="12" y="13.5" textAnchor="middle">
          50x
        </text>
      </svg>
    );
  }

  if (type === "star") {
    return <HeroIcon type="star" />;
  }

  return <HeroIcon type="gift" />;
}

function CopyIcon() {
  return (
    <svg
      className="copy-code-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 8h11v11H8V8Z" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

function OfferCard({
  casino,
  detailsLabel,
  playLabel,
}: {
  casino: Casino;
  detailsLabel: string;
  playLabel: string;
}) {
  const toggleId = `offer-toggle-${casino.id}`;
  const [copiedSlot, setCopiedSlot] = useState("");
  const details = casino.detailsText
    .split(/\r?\n/)
    .map((detail) => detail.trim())
    .filter(Boolean);
  const displayValue = (value: string) => value.trim() || "-";
  const copyCode = async (code: string, slot: "registration" | "deposit") => {
    const value = code.trim();

    if (!value || value === "-") {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedSlot(slot);
      window.setTimeout(() => setCopiedSlot(""), 1400);
    } catch {
      setCopiedSlot("");
    }
  };
  const rank = Number.isFinite(casino.order) ? casino.order : 0;
  const rankClass =
    rank === 1
      ? "is-gold"
      : rank === 2
        ? "is-silver"
        : rank === 3
          ? "is-bronze"
          : "is-galaxy";

  return (
    <article className="offer-card">
      <input className="offer-toggle" id={toggleId} type="checkbox" />
      <div className="offer-main">
        <div className="casino-identity">
          <span className={`casino-rank-badge ${rankClass}`}>
            {casino.order || "-"}
          </span>
          <div className="casino-logo">
            {casino.logoUrl ? (
              <img
                src={casino.logoUrl}
                alt={casino.name || "Casino Logo"}
              />
            ) : (
              "SOON"
            )}
          </div>
        </div>

        <div className="bonus-title">
          <span className="text-slot">{casino.name || "-"}</span>
          <strong className="big-slot">{casino.bonus || "-"}</strong>
        </div>

        <div className="code-stack" aria-label="Bonus Codes">
          <button
            className="bonus-code-box is-registration"
            onClick={() => {
              void copyCode(displayValue(casino.description1), "registration");
            }}
            type="button"
          >
            <span>{casino.description1Label || "REGISTRIERUNGSCODE"}</span>
            <strong>{displayValue(casino.description1)}</strong>
            <em aria-hidden="true">
              <CopyIcon />
            </em>
            {copiedSlot === "registration" ? (
              <small>Kopiert</small>
            ) : null}
          </button>
          <button
            className="bonus-code-box is-deposit"
            onClick={() => {
              void copyCode(displayValue(casino.description2), "deposit");
            }}
            type="button"
          >
            <span>{casino.description2Label || "EINZAHLUNGSCODE"}</span>
            <strong>{displayValue(casino.description2)}</strong>
            <em aria-hidden="true">
              <CopyIcon />
            </em>
            {copiedSlot === "deposit" ? (
              <small>Kopiert</small>
            ) : null}
          </button>
        </div>

        <div className="offer-perks" aria-label="Bonus details">
          <div>
            <span className="perk-icon">
              <CasinoFeatureIcon type={casino.feature1Icon} />
            </span>
            <strong className="text-slot">{displayValue(casino.feature1)}</strong>
          </div>
          <div>
            <span className="perk-icon">
              <CasinoFeatureIcon type={casino.feature2Icon} />
            </span>
            <strong className="text-slot">{displayValue(casino.feature2)}</strong>
          </div>
          <div>
            <span className="perk-icon">
              <CasinoFeatureIcon type={casino.feature3Icon} />
            </span>
            <strong className="text-slot">{displayValue(casino.feature3)}</strong>
          </div>
          <div>
            <span className="perk-icon">
              <CasinoFeatureIcon type={casino.feature4Icon} />
            </span>
            <strong className="text-slot">{displayValue(casino.feature4)}</strong>
          </div>
        </div>

        <div className="offer-actions">
          <a href={casino.buttonLink || "#bonus"} className="play-button">
            <span>{casino.buttonText || playLabel}</span>
          </a>
          <label className="details-button" htmlFor={toggleId}>
            <span>{detailsLabel}</span>
            <span className="details-arrow" aria-hidden="true" />
          </label>
        </div>
      </div>

      <div className="offer-copy">
        <div>
          {(details.length > 0 ? details : ["-"]).map((detail, index) => (
            <p key={`${casino.id}-detail-${index}`}>{detail}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

function HighlightedHeroCopy({ text }: { text: string }) {
  const parts = text.split(/(casinogalaxy99|galaxycasino99)/gi);

  return (
    <>
      {parts.map((part, index) => {
        const normalized = part.toLowerCase();
        const isBrand =
          normalized.includes("casinogalaxy99") ||
          normalized.includes("galaxycasino99");

        if (!isBrand) {
          return part;
        }

        return (
          <strong
            className="hero-highlight-gold"
            key={`${part}-${index}`}
          >
            CasinoGalaxy99
          </strong>
        );
      })}
    </>
  );
}

export default function HomePage({ content }: { content: SiteContent }) {
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>("DE");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [ageGateOpen, setAgeGateOpen] = useState(true);
  const copy = content.translations[selectedLanguage];
  const activeCasinos = content.casinos
    .filter((casino) => casino.active)
    .sort((left, right) => left.order - right.order);
  const brandAlt = `${content.brand.name} Profilbild`;
  const colorVars = {
    "--background": content.colors.background,
    "--foreground": content.colors.foreground,
    "--violet": content.colors.violet,
    "--violet-hot": content.colors.violetHot,
    "--violet-soft": content.colors.violetSoft,
    "--gold": content.colors.gold,
    "--red": content.colors.red,
  } as CSSProperties;

  return (
    <>
      <GalaxyBackground />
      {ageGateOpen ? (
        <section
          className="age-gate"
          onTouchMove={(event) => event.preventDefault()}
          onWheel={(event) => event.preventDefault()}
          role="dialog"
          aria-modal="true"
        >
          <div className="age-gate-card">
            <a
              className="age-avatar-link"
              href={content.brand.twitchUrl}
              rel="noopener noreferrer"
              target="_blank"
              aria-label={`${content.brand.name} Twitch Kanal öffnen`}
            >
              <BrandAvatar alt={brandAlt} imageUrl={content.brand.profileImageUrl} />
            </a>
            <p className="age-kicker">{copy.ageKicker}</p>
            <h2>{copy.ageTitle}</h2>
            <div className="age-divider">
              <span />
            </div>
            <p>{copy.ageCopy}</p>
            <p>{copy.ageNotice}</p>
            <button
              className="age-enter"
              onClick={() => setAgeGateOpen(false)}
              type="button"
            >
              <HeroIcon type="shield" />
              {copy.ageEnter}
            </button>
            <a className="age-leave" href="https://www.gambleaware.org/">
              {copy.ageLeave}
            </a>
          </div>
        </section>
      ) : null}

      <main className="site-shell" style={colorVars}>
      <header className="topbar">
        <a
          className="brand"
          href={content.brand.twitchUrl}
          rel="noopener noreferrer"
          target="_blank"
          aria-label={`${content.brand.name} Twitch Kanal öffnen`}
        >
          <BrandAvatar alt={brandAlt} imageUrl={content.brand.profileImageUrl} />
          <span>{content.brand.name}</span>
        </a>

        <nav className="main-nav" aria-label="Hauptnavigation">
          <a href="#start">{copy.nav[0]}</a>
          <a href="#bonus">{copy.nav[1]}</a>
          <a href="#story">{copy.nav[2]}</a>
        </nav>

        <div className="header-socials" aria-label="Social Links">
          {content.links.header.map((link) => (
            <a
              className="social-pill"
              href={link.href}
              key={link.label}
              rel="noopener noreferrer"
              target={link.href.startsWith("http") ? "_blank" : undefined}
            >
              <SocialIcon label={link.label} />
              {link.label}
            </a>
          ))}
        </div>

        <div
          className={`language-picker ${languageOpen ? "is-open" : ""}`}
          aria-label="Sprachauswahl"
        >
          <button
            aria-expanded={languageOpen}
            className="language-trigger"
            onClick={() => setLanguageOpen((open) => !open)}
            type="button"
          >
            <span className="flag-icon" data-flag={selectedLanguage} />
            <strong>{selectedLanguage}</strong>
            <span className="language-caret" aria-hidden="true" />
          </button>
          <div className="language-menu">
            {languages.map((language) => (
              <button
                className={
                  selectedLanguage === language.code ? "is-selected" : ""
                }
                key={language.code}
                onClick={() => {
                  setSelectedLanguage(language.code as LanguageCode);
                  setLanguageOpen(false);
                }}
                type="button"
              >
                <span className="flag-icon" data-flag={language.code} />
                <strong>{language.label}</strong>
                <em>{language.code}</em>
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="hero" id="start">
        <img
          src={content.brand.heroImageUrl}
          alt=""
          className="hero-image"
        />
        <div className="hero-glow" />
        <div className="hero-content">
          <p className="eyebrow">
            <HeroIcon type="diamond" />
            <span>{copy.heroEyebrow}</span>
          </p>
          <div
            className="hero-logo-lockup"
            aria-label={`${copy.heroTitleTop} ${copy.heroTitleBottom}`}
            role="img"
          >
            <span
              aria-hidden="true"
              className="hero-logo-image"
              style={{
                backgroundImage: `url("${content.brand.heroLogoUrl || content.brand.profileImageUrl}")`,
              }}
            />
          </div>
          <p className="hero-copy">
            <HighlightedHeroCopy text={copy.heroCopy} />
          </p>
          <div className="hero-actions">
            <a href={copy.primaryCtaHref} className="primary-button">
              <HeroIcon type="gift" />
              {copy.primaryCta}
            </a>
            <a
              href={copy.secondaryCtaHref}
              className="ghost-button"
              rel="noopener noreferrer"
              target={copy.secondaryCtaHref.startsWith("http") ? "_blank" : undefined}
            >
              <HeroIcon type="play" />
              {copy.secondaryCta}
            </a>
          </div>
        </div>
        <div className="hero-info-panel" aria-label="Community Links">
          {copy.stats.map((stat) => (
            <a
              className="hero-info-card"
              href={stat.href || "#bonus"}
              key={stat.title}
              rel={stat.href?.startsWith("http") ? "noopener noreferrer" : undefined}
              target={stat.href?.startsWith("http") ? "_blank" : undefined}
            >
              <span>
                <HeroIcon type={stat.icon} />
              </span>
              <section>
                <strong>{stat.title}</strong>
                <p>{stat.text}</p>
              </section>
            </a>
          ))}
        </div>
      </section>

      <section className="section-heading" id="bonus" aria-labelledby="bonus-title">
        <span />
        <h2 id="bonus-title">{copy.bonusTitle}</h2>
        <span />
      </section>

      <section className="offers-grid" aria-label="Casino Bonusangebote">
        {activeCasinos.map((casino) => (
          <OfferCard
            detailsLabel={copy.detailsOffer}
            key={casino.id}
            casino={casino}
            playLabel={copy.playOffer}
          />
        ))}
      </section>

      <section className="story-panel" id="story">
        <div className="story-copy">
          <p className="eyebrow">{copy.storyEyebrow}</p>
          <h2>
            <span>{copy.storyTitleTop}</span>
            <span>
              {copy.storyTitleBottom} <i>{copy.storyTitleAccent}</i>
            </span>
          </h2>
          <strong>{copy.storyLead}</strong>
          {copy.storyParagraphs.map((paragraph, index) => (
            <p key={`story-paragraph-${index}`}>{paragraph}</p>
          ))}
          <div className="story-features" aria-label="Story Highlights">
            {copy.storyFeatures.map((feature) => (
              <a
                className="story-feature"
                href={feature.href}
                key={feature.title}
                rel={feature.href.startsWith("http") ? "noopener noreferrer" : undefined}
                target={feature.href.startsWith("http") ? "_blank" : undefined}
              >
                <span>
                  <HeroIcon type={feature.icon} />
                </span>
                <div>
                  <b>{feature.title}</b>
                  <p>{feature.text}</p>
                </div>
              </a>
            ))}
          </div>
          <a
            className="story-live-card"
            href={content.brand.twitchUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>
              <SocialIcon label="Twitch" />
            </span>
            <div>
              <b>{copy.storyLiveTitle}</b>
              <em>{copy.storyHandle}</em>
            </div>
          </a>
        </div>
        <div className="story-visual" aria-hidden="true">
          <div className="helmet">
            <span
              style={{
                backgroundImage: `url("${content.brand.profileImageUrl}")`,
              }}
            />
          </div>
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
        </div>
      </section>

      <footer className="footer-panel">
        <div>
          <a className="brand footer-brand" href="#start">
            <BrandAvatar alt={brandAlt} imageUrl={content.brand.profileImageUrl} />
            <span>{content.brand.name}</span>
          </a>
          <p>{copy.footerCopy}</p>
          <div className="social-row" aria-label="Social links">
            {content.links.footer.map((link) => (
              <a key={link.label} href={link.href} aria-label={link.label}>
                <SocialIcon label={link.label} />
              </a>
            ))}
          </div>
        </div>

        <div className="responsible">
          <strong>{copy.responsibleTitle}</strong>
          <p>{copy.responsibleCopy}</p>
        </div>

        <div className="footer-bottom">
          <span>&copy; 2026 {content.brand.name}. {copy.rights}</span>
          <div>
            <a href="#start">{copy.terms}</a>
            <a href="#start">{copy.privacy}</a>
          </div>
        </div>
      </footer>
    </main>
    </>
  );
}
