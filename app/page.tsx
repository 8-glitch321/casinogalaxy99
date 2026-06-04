"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const offers = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
}));

const headerLinks = [
  { label: "Twitch", href: "https://www.twitch.tv/casinogalaxy99" },
  { label: "Telegram", href: "#start" },
  { label: "Instagram", href: "#start" },
];

const footerLinks = [
  { label: "Telegram", href: "#start" },
  { label: "Instagram", href: "#start" },
  { label: "Twitch", href: "https://www.twitch.tv/casinogalaxy99" },
  { label: "Discord", href: "#start" },
];

const languages = [
  { label: "Deutsch", code: "DE" },
  { label: "English", code: "EN" },
];

const translations = {
  DE: {
    nav: ["Start", "Bonus", "Story"],
    heroEyebrow: "Exklusive Casino Bonusangebote",
    heroCopy:
      "Bonus-Hub für die Community von galaxycasino99: dunkel, galaktisch und bereit für die besten Deals.",
    primaryCta: "Bonus sichern",
    secondaryCta: "Kanal ansehen",
    playOffer: "Jetzt spielen",
    detailsOffer: "Details",
    ageKicker: "Willkommen bei",
    ageTitle: "Casino Galaxy 99",
    ageCopy:
      "Diese Seite richtet sich ausschließlich an Personen ab 18 Jahren.",
    ageNotice: "Bitte beachte die gesetzlichen Bestimmungen deines Aufenthaltsorts.",
    ageEnter: "Ich bin über 18 - weiter",
    ageLeave: "Seite verlassen",
    stats: [
      {
        icon: "community",
        title: "Community Deals",
        text: "Exklusive Angebote für Mitglieder",
      },
      {
        icon: "stream",
        title: "Streamer Boni",
        text: "Beste Boni von deinen Lieblingsstreamern",
      },
      {
        icon: "star",
        title: "Galaxy Picks",
        text: "Handverlesene Top-Empfehlungen",
      },
    ],
    bonusTitle: "Top Casinos",
    storyEyebrow: "Das ist",
    storyTitleTop: "Galaxy",
    storyTitleBottom: "Casino",
    storyTitleAccent: "99",
    storyLead: "Streamer. Creator. Community zuerst.",
    storyParagraphs: [
      "galaxycasino99 ist ein Twitch-Kanal für Casino-Entertainment mit Space-Vibe, starken Reaktionen und einer Community, die gemeinsam jeden Bonus, Hunt und Moment feiert.",
      "Auf dem Kanal geht es nicht nur um Gewinne, sondern um Spannung, transparente Aktionen und einen Ort, an dem Zuschauer nah dran sind: live im Chat, bei neuen Deals und bei allem, was in der Galaxy passiert.",
      "Diese Seite sammelt künftig die passenden Bonusangebote für die Community, sauber präsentiert und schnell vergleichbar.",
    ],
    storyFeatures: [
      {
        icon: "bolt",
        title: "Gewinne, Spannung & epische Reactions",
        text: "Hier wird jeder Spin zum Highlight.",
        href: "#bonus",
      },
      {
        icon: "chat",
        title: "Live im Chat & immer mit euch",
        text: "Neue Deals, Challenges und Interaktion in Echtzeit.",
        href: "https://www.twitch.tv/casinogalaxy99",
      },
      {
        icon: "gift",
        title: "Exklusive Bonusangebote",
        text: "Für die Community - schnell, transparent, vergleichbar.",
        href: "#bonus",
      },
    ],
    storyLiveTitle: "Jetzt live auf Twitch",
    storyHandle: "casinogalaxy99",
    footerCopy:
      "Unabhängiger Streamer-Affiliate. Verhandelte Boni für die Galaxy-Community.",
    responsibleTitle: "18+ Nur. Glücksspiel kann süchtig machen.",
    responsibleCopy:
      "Bonus-Angebote unterliegen den Bedingungen des jeweiligen Casinos. Spiele nur, was du dir leisten kannst zu verlieren.",
    rights: "Alle Rechte vorbehalten.",
    terms: "AGB",
    privacy: "Datenschutz",
  },
  EN: {
    nav: ["Start", "Bonus", "Story"],
    heroEyebrow: "Exclusive Casino Bonus Offers",
    heroCopy:
      "Bonus hub for the galaxycasino99 community: dark, galactic and ready for the best deals.",
    primaryCta: "Claim Bonus",
    secondaryCta: "Watch Channel",
    playOffer: "Play Now",
    detailsOffer: "Details",
    ageKicker: "Welcome to",
    ageTitle: "Casino Galaxy 99",
    ageCopy: "This page is intended only for people aged 18 or older.",
    ageNotice: "Please follow the legal requirements of your location.",
    ageEnter: "I am over 18 - continue",
    ageLeave: "Leave site",
    stats: [
      {
        icon: "community",
        title: "Community Deals",
        text: "Exclusive offers for members",
      },
      {
        icon: "stream",
        title: "Streamer Bonuses",
        text: "Best bonuses from your favorite streamers",
      },
      {
        icon: "star",
        title: "Galaxy Picks",
        text: "Handpicked top recommendations",
      },
    ],
    bonusTitle: "Top Casinos",
    storyEyebrow: "This is",
    storyTitleTop: "Galaxy",
    storyTitleBottom: "Casino",
    storyTitleAccent: "99",
    storyLead: "Streamer. Creator. Community first.",
    storyParagraphs: [
      "galaxycasino99 is a Twitch channel for casino entertainment with a space vibe, big reactions and a community that celebrates every bonus, hunt and moment together.",
      "The channel is not just about wins. It is about excitement, transparent promotions and a place where viewers are close to the action: live in chat, around new deals and everything happening in the Galaxy.",
      "This page will collect the right bonus offers for the community, presented cleanly and easy to compare.",
    ],
    storyFeatures: [
      {
        icon: "bolt",
        title: "Wins, tension & epic reactions",
        text: "Every spin is built to feel like a highlight.",
        href: "#bonus",
      },
      {
        icon: "chat",
        title: "Live chat & close to the crew",
        text: "Fresh deals, challenges and real-time interaction.",
        href: "https://www.twitch.tv/casinogalaxy99",
      },
      {
        icon: "gift",
        title: "Exclusive bonus offers",
        text: "For the community - clean, fast and transparent.",
        href: "#bonus",
      },
    ],
    storyLiveTitle: "Now live on Twitch",
    storyHandle: "casinogalaxy99",
    footerCopy:
      "Independent streamer affiliate. Negotiated bonuses for the Galaxy community.",
    responsibleTitle: "18+ Only. Gambling can be addictive.",
    responsibleCopy:
      "Bonus offers are subject to the terms of each casino. Only play what you can afford to lose.",
    rights: "All rights reserved.",
    terms: "Terms",
    privacy: "Privacy",
  },
} as const;

type LanguageCode = keyof typeof translations;

function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      return;
    }

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const stars: Array<{
      x: number;
      y: number;
      z: number;
      size: number;
      drift: number;
      twinkle: number;
      hue: number;
    }> = [];
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let animationFrame = 0;
    let start = performance.now();
    let lastFrame = 0;
    let shootingStarAt = start + 18000 + Math.random() * 16000;

    const getSettings = () => {
      const reducedMotion = reducedMotionQuery.matches;
      const mobile = mobileQuery.matches;

      return {
        density: reducedMotion ? 0.16 : mobile ? 0.28 : 0.52,
        mobile,
        pixelRatio: Math.min(window.devicePixelRatio || 1, mobile ? 1.1 : 1.35),
        reducedMotion,
      };
    };

    const resize = () => {
      const settings = getSettings();
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = settings.pixelRatio;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      stars.length = 0;

      const count = Math.min(
        settings.mobile ? 42 : 88,
        Math.floor(((width * height) / 14500) * settings.density),
      );
      for (let index = 0; index < count; index += 1) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: 0.25 + Math.random() * 0.75,
          size: 0.32 + Math.random() * 0.95,
          drift: 0.008 + Math.random() * 0.018,
          twinkle: Math.random() * Math.PI * 2,
          hue: 246 + Math.random() * 34,
        });
      }
    };

    const drawNebula = (time: number) => {
      const { reducedMotion, mobile } = getSettings();
      const slow = reducedMotion ? 0 : time * 0.000008;
      const strength = mobile ? 0.54 : 0.74;
      const nebulaOne = context.createRadialGradient(
        width * (0.18 + Math.sin(slow) * 0.04),
        height * (0.18 + Math.cos(slow * 1.2) * 0.035),
        0,
        width * 0.2,
        height * 0.22,
        Math.max(width, height) * 0.62,
      );
      nebulaOne.addColorStop(0, `rgba(143, 55, 255, ${0.12 * strength})`);
      nebulaOne.addColorStop(0.42, `rgba(85, 22, 158, ${0.055 * strength})`);
      nebulaOne.addColorStop(1, "rgba(0, 0, 0, 0)");

      const nebulaTwo = context.createRadialGradient(
        width * (0.78 + Math.cos(slow * 0.85) * 0.03),
        height * (0.58 + Math.sin(slow) * 0.025),
        0,
        width * 0.76,
        height * 0.62,
        Math.max(width, height) * 0.54,
      );
      nebulaTwo.addColorStop(0, `rgba(193, 92, 255, ${0.085 * strength})`);
      nebulaTwo.addColorStop(0.44, `rgba(255, 191, 46, ${0.014 * strength})`);
      nebulaTwo.addColorStop(0.72, `rgba(77, 20, 145, ${0.035 * strength})`);
      nebulaTwo.addColorStop(1, "rgba(0, 0, 0, 0)");

      const horizon = context.createLinearGradient(0, height * 0.48, 0, height);
      horizon.addColorStop(0, "rgba(0, 0, 0, 0)");
      horizon.addColorStop(0.66, `rgba(126, 43, 224, ${0.025 * strength})`);
      horizon.addColorStop(1, `rgba(255, 191, 46, ${0.01 * strength})`);

      context.save();
      context.globalCompositeOperation = "screen";
      context.fillStyle = nebulaOne;
      context.fillRect(0, 0, width, height);
      context.fillStyle = nebulaTwo;
      context.fillRect(0, 0, width, height);
      context.fillStyle = horizon;
      context.fillRect(0, 0, width, height);
      context.restore();
    };

    const drawShootingStar = (time: number) => {
      const { reducedMotion, mobile } = getSettings();
      if (reducedMotion || mobile || time < shootingStarAt) {
        return;
      }

      const duration = 1700;
      const progress = Math.min((time - shootingStarAt) / duration, 1);
      const x = width * (0.12 + progress * 0.38);
      const y = height * (0.16 + progress * 0.13);
      const tail = 104;
      const opacity = Math.sin(progress * Math.PI) * 0.24;

      context.save();
      context.globalAlpha = opacity;
      const gradient = context.createLinearGradient(x - tail, y - tail * 0.44, x, y);
      gradient.addColorStop(0, "rgba(193, 92, 255, 0)");
      gradient.addColorStop(0.72, "rgba(193, 92, 255, 0.45)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0.9)");
      context.strokeStyle = gradient;
      context.lineWidth = 1.3;
      context.beginPath();
      context.moveTo(x - tail, y - tail * 0.44);
      context.lineTo(x, y);
      context.stroke();
      context.restore();

      if (progress >= 1) {
        shootingStarAt = time + 26000 + Math.random() * 24000;
      }
    };

    const render = (time: number) => {
      const { reducedMotion } = getSettings();
      if (!reducedMotion && time - lastFrame < 33) {
        animationFrame = requestAnimationFrame(render);
        return;
      }
      lastFrame = time;

      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(4, 1, 9, 0.82)";
      context.fillRect(0, 0, width, height);
      drawNebula(time - start);

      context.save();
      context.globalCompositeOperation = "screen";
      for (const star of stars) {
        const drift = reducedMotion ? 0 : (time - start) * star.drift * 0.001;
        const x = (star.x + drift * 38 * star.z) % (width + 12);
        const y = (star.y + Math.sin(drift * 1.3 + star.twinkle) * 3.2 * star.z) % height;
        const pulse = reducedMotion
          ? 0.36
          : 0.22 + Math.sin(time * 0.0007 + star.twinkle) * 0.1;
        const alpha = Math.max(0.08, pulse * star.z);

        context.beginPath();
        context.fillStyle = `hsla(${star.hue}, 100%, 92%, ${alpha})`;
        context.arc(x, y, star.size * star.z, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();

      drawShootingStar(time);

      if (!reducedMotion) {
        animationFrame = requestAnimationFrame(render);
      }
    };

    resize();
    start = performance.now();
    render(start);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas className="galaxy-background" ref={canvasRef} aria-hidden="true" />;
}

function BrandAvatar() {
  return (
    <span className="brand-avatar">
      <Image
        src="/assets/casino-galaxy-profile.png"
        alt="Casino Galaxy 99 Profilbild"
        fill
        sizes="56px"
      />
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

function PlaceholderOffer({
  id,
  detailsLabel,
  playLabel,
}: {
  id: number;
  detailsLabel: string;
  playLabel: string;
}) {
  const toggleId = `offer-toggle-${id}`;

  return (
    <article className="offer-card">
      <input className="offer-toggle" id={toggleId} type="checkbox" />
      <div className="offer-main">
        <div className="casino-logo">SOON</div>

        <div className="bonus-title">
          <span className="text-slot">-</span>
          <strong className="big-slot">-</strong>
          <small className="text-slot">-</small>
        </div>

        <div className="code-stack" aria-label="Bonus codes">
          <div>
            <span className="text-slot">-</span>
            <strong className="text-slot">-</strong>
          </div>
          <div>
            <span className="text-slot">-</span>
            <strong className="text-slot">-</strong>
          </div>
        </div>

        <div className="offer-perks" aria-label="Bonus details">
          {["+", "%", "=", "x"].map((icon) => (
            <div key={icon}>
              <span className="perk-icon">{icon}</span>
              <strong className="text-slot">-</strong>
            </div>
          ))}
        </div>

        <div className="offer-actions">
          <a href="#bonus" className="play-button">
            <span>{playLabel}</span>
          </a>
          <label className="details-button" htmlFor={toggleId}>
            <span>{detailsLabel}</span>
            <span className="details-arrow" aria-hidden="true" />
          </label>
        </div>
      </div>

      <div className="offer-copy">
        <div>
          <p>-</p>
          <p>-</p>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>("DE");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [ageGateOpen, setAgeGateOpen] = useState(true);
  const copy = translations[selectedLanguage];

  useEffect(() => {
    document.body.classList.toggle("age-gate-lock", ageGateOpen);
    document.documentElement.classList.toggle("age-gate-lock", ageGateOpen);

    return () => {
      document.body.classList.remove("age-gate-lock");
      document.documentElement.classList.remove("age-gate-lock");
    };
  }, [ageGateOpen]);

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
              href="https://www.twitch.tv/casinogalaxy99"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="CasinoGalaxy99 Twitch Kanal öffnen"
            >
              <BrandAvatar />
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

      <main className="site-shell">
      <header className="topbar">
        <a
          className="brand"
          href="https://www.twitch.tv/casinogalaxy99"
          rel="noopener noreferrer"
          target="_blank"
          aria-label="CasinoGalaxy99 Twitch Kanal öffnen"
        >
          <BrandAvatar />
          <span>CasinoGalaxy99</span>
        </a>

        <nav className="main-nav" aria-label="Hauptnavigation">
          <a href="#start">{copy.nav[0]}</a>
          <a href="#bonus">{copy.nav[1]}</a>
          <a href="#story">{copy.nav[2]}</a>
        </nav>

        <div className="header-socials" aria-label="Social Links">
          {headerLinks.map((link) => (
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
        <Image
          src="/assets/casino-galaxy-hero.png"
          alt=""
          fill
          className="hero-image"
          priority
          sizes="100vw"
        />
        <div className="hero-glow" />
        <div className="hero-content">
          <p className="eyebrow">
            <HeroIcon type="diamond" />
            <span>{copy.heroEyebrow}</span>
          </p>
          <h1>
            Casino
            <span>Galaxy 99</span>
          </h1>
          <p className="hero-copy">
            {selectedLanguage === "DE" ? (
              <>
                Bonus-Hub für die Community von{" "}
                <strong>galaxycasino99</strong>: dunkel, galaktisch und bereit
                für die besten Deals.
              </>
            ) : (
              <>
                Bonus hub for the <strong>galaxycasino99</strong> community:
                dark, galactic and ready for the best deals.
              </>
            )}
          </p>
          <div className="hero-actions">
            <a href="#bonus" className="primary-button">
              <HeroIcon type="gift" />
              {copy.primaryCta}
            </a>
            <a
              href="https://www.twitch.tv/casinogalaxy99"
              className="ghost-button"
              rel="noopener noreferrer"
              target="_blank"
            >
              <HeroIcon type="play" />
              {copy.secondaryCta}
            </a>
          </div>
        </div>
        <div className="hero-info-panel" aria-hidden="true">
          {copy.stats.map((stat) => (
            <div key={stat.title}>
              <span>
                <HeroIcon type={stat.icon} />
              </span>
              <section>
                <strong>{stat.title}</strong>
                <p>{stat.text}</p>
              </section>
            </div>
          ))}
        </div>
      </section>

      <section className="section-heading" id="bonus" aria-labelledby="bonus-title">
        <span />
        <h2 id="bonus-title">{copy.bonusTitle}</h2>
        <span />
      </section>

      <section className="offers-grid" aria-label="Casino Bonusangebote">
        {offers.map((offer) => (
          <PlaceholderOffer
            detailsLabel={copy.detailsOffer}
            key={offer.id}
            id={offer.id}
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
          <p>{copy.storyParagraphs[0]}</p>
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
            href="https://www.twitch.tv/casinogalaxy99"
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
            <span />
          </div>
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
        </div>
      </section>

      <footer className="footer-panel">
        <div>
          <a className="brand footer-brand" href="#start">
            <BrandAvatar />
            <span>CasinoGalaxy99</span>
          </a>
          <p>{copy.footerCopy}</p>
          <div className="social-row" aria-label="Social links">
            {footerLinks.map((link) => (
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
          <span>&copy; 2026 CasinoGalaxy99. {copy.rights}</span>
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
