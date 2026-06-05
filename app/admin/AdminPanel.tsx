"use client";

/* eslint-disable @next/next/no-img-element */
import type {
  Casino,
  LanguageCode,
  LinkItem,
  SiteContent,
  StatItem,
  StoryFeature,
} from "@/lib/siteContent";
import type { FormEvent, ReactNode, RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";

type Status = {
  type: "success" | "error" | "idle";
  message: string;
};

type ApiResponseBody = {
  error?: string;
  success?: boolean;
  url?: string;
};

type ImageUploadConfig = {
  fit?: "cover" | "contain";
  height: number;
  label: string;
  onUploaded: (url: string) => void;
  slot: string;
  value: string;
  width: number;
};

type CropEditorState = {
  aspect: number;
  completedCrop?: PixelCrop;
  config: ImageUploadConfig;
  crop?: Crop;
  imageUrl: string;
  imageDisplayHeight?: number;
  imageDisplayWidth?: number;
  imageNaturalHeight?: number;
  imageNaturalWidth?: number;
  outputHeight: number;
  outputWidth: number;
  zoom: number;
};

type CasinoField = keyof Omit<Casino, "id">;
type CasinoFieldValue = Casino[CasinoField];

type SectionId =
  | "dashboard"
  | "brand"
  | "colors"
  | "home-de"
  | "home-en"
  | "social"
  | "header"
  | "footer"
  | "casinos";

const sections: Array<{
  code: string;
  description: string;
  id: SectionId;
  label: string;
}> = [
  { code: "00", description: "Status & Überblick", id: "dashboard", label: "Dashboard" },
  { code: "01", description: "Logo, Hero, Twitch", id: "brand", label: "Brand & Bilder" },
  { code: "02", description: "Theme-Steuerung", id: "colors", label: "Farben" },
  { code: "DE", description: "Deutsch Content", id: "home-de", label: "Startseite DE" },
  { code: "EN", description: "English Content", id: "home-en", label: "Startseite EN" },
  { code: "S", description: "Header & Footer Links", id: "social", label: "Social Links" },
  { code: "H", description: "Topbar Buttons", id: "header", label: "Header" },
  { code: "F", description: "Footer & Legal", id: "footer", label: "Footer" },
  { code: "C", description: "Casino Cards", id: "casinos", label: "Casino Boni" },
];

function cloneContent(content: SiteContent): SiteContent {
  return JSON.parse(JSON.stringify(content)) as SiteContent;
}

function createCasinoId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `casino-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createEmptyCasino(casinos: Casino[]): Casino {
  const nextOrder =
    casinos.reduce((highest, casino) => Math.max(highest, casino.order || 0), 0) + 1;

  return {
    id: createCasinoId(),
    name: "",
    logoUrl: "",
    bonus: "",
    description1: "",
    description1Label: "REGISTRIERUNGSCODE",
    description2: "",
    description2Label: "EINZAHLUNGSCODE",
    feature1: "-",
    feature1Icon: "gift",
    feature2: "-",
    feature2Icon: "speed",
    feature3: "-",
    feature3Icon: "card",
    feature4: "-",
    feature4Icon: "wager",
    buttonText: "JETZT SPIELEN",
    buttonLink: "",
    detailsText: "",
    order: nextOrder,
    active: true,
  };
}

function fieldId(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

async function readJsonResponse(response: Response): Promise<ApiResponseBody> {
  const text = await response.text();

  if (!text.trim()) {
    throw new Error(
      `Leere Antwort vom Server erhalten (${response.status}). Bitte API Route pruefen.`,
    );
  }

  try {
    return JSON.parse(text) as ApiResponseBody;
  } catch {
    throw new Error(
      `Server hat keine gueltige JSON-Antwort gesendet (${response.status}).`,
    );
  }
}

function Card({
  children,
  subtitle,
  title,
}: {
  children: ReactNode;
  subtitle?: string;
  title: string;
}) {
  return (
    <section className="group relative overflow-hidden rounded-2xl border border-violet-200/15 bg-[linear-gradient(145deg,rgba(24,10,38,0.92),rgba(7,3,13,0.96))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.32)] ring-1 ring-white/[0.03] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#ffbf2e]/55 to-transparent opacity-80" />
      <div className="mb-5 border-b border-white/[0.06] pb-4">
        <h2 className="text-lg font-black tracking-tight text-white">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm leading-6 text-[#cfc2dc]">{subtitle}</p>
        ) : null}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  onChange,
  placeholder,
  textarea = false,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  textarea?: boolean;
  value: string;
}) {
  const id = fieldId(label);
  const controlClass =
    "w-full rounded-xl border border-violet-200/20 bg-[#050208]/80 px-4 py-3 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-[#6f607d] hover:border-violet-200/32 focus:border-[#ffbf2e] focus:ring-2 focus:ring-[#ffbf2e]/20";

  return (
    <label className="grid gap-2" htmlFor={id}>
      <span className="text-xs font-black uppercase tracking-[0.14em] text-[#d9cdea]">
        {label}
      </span>
      {textarea ? (
        <textarea
          className={`${controlClass} min-h-32 resize-y leading-6`}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={controlClass}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

function ColorField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2 rounded-xl border border-violet-200/15 bg-[#050208]/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <span className="text-xs font-black uppercase tracking-[0.14em] text-[#d9cdea]">
        {label}
      </span>
      <div className="grid grid-cols-[52px_1fr] items-center gap-3">
        <input
          className="h-12 w-13 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1"
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          className="w-full rounded-xl border border-violet-200/20 bg-[#050208]/80 px-4 py-3 text-sm text-white outline-none transition focus:border-[#ffbf2e] focus:ring-2 focus:ring-[#ffbf2e]/20"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </label>
  );
}

function ImageUploadField({
  config,
  disabled,
  onUpload,
}: {
  config: ImageUploadConfig;
  disabled: boolean;
  onUpload: (config: ImageUploadConfig, file: File) => Promise<void>;
}) {
  const id = fieldId(`${config.label}-upload`);

  return (
    <div className="grid gap-3 rounded-2xl border border-violet-200/15 bg-[#050208]/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d9cdea]">
          {config.label}
        </p>
        <p className="mt-1 text-sm text-[#9f91b1]">
          Maximalgröße: {config.width} x {config.height}px, automatisch
          zentriert und {config.fit === "contain" ? "eingepasst" : "zugeschnitten"}.
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/35 shadow-[0_14px_42px_rgba(0,0,0,0.24)]">
        {config.value ? (
          <img
            alt=""
            className={`h-44 w-full ${
              config.fit === "contain" ? "object-contain p-[2px]" : "object-cover"
            }`}
            src={config.value}
          />
        ) : (
          <div className="grid h-44 place-items-center text-sm text-[#9f91b1]">
            Keine Vorschau
          </div>
        )}
      </div>
      <label
        className={`grid min-h-12 cursor-pointer place-items-center rounded-xl border border-dashed border-[#ffbf2e]/35 bg-[#ffbf2e]/8 px-4 text-center text-sm font-black uppercase tracking-[0.08em] text-[#fff3c7] transition hover:border-[#ffbf2e]/65 hover:bg-[#ffbf2e]/12 ${
          disabled ? "pointer-events-none opacity-60" : ""
        }`}
        htmlFor={id}
      >
        Bild hochladen
      </label>
      <input
        accept="image/*"
        className="sr-only"
        disabled={disabled}
        id={id}
        type="file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";

          if (file) {
            void onUpload(config, file);
          }
        }}
      />
    </div>
  );
}

function getUploadAspect(config: ImageUploadConfig) {
  if (config.slot.includes("hero")) {
    return 16 / 9;
  }

  if (config.slot.includes("casino-logo")) {
    return 6 / 5;
  }

  return 1;
}

function getUploadOutputSize(config: ImageUploadConfig) {
  if (config.slot.includes("hero")) {
    return { outputWidth: 1200, outputHeight: 675 };
  }

  if (config.slot.includes("casino-logo")) {
    return { outputWidth: 720, outputHeight: 600 };
  }

  const size = Math.min(1200, Math.max(512, Math.min(config.width, 800)));
  return { outputWidth: size, outputHeight: size };
}

function createCenteredAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 86,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

async function cropImageToBlob({
  crop,
  image,
  outputHeight,
  outputWidth,
  zoom,
}: {
  crop: PixelCrop;
  image: HTMLImageElement;
  outputHeight: number;
  outputWidth: number;
  zoom: number;
}) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas konnte nicht initialisiert werden.");
  }

  drawCropToCanvas({
    canvas,
    context,
    crop,
    image,
    outputHeight,
    outputWidth,
    zoom,
  });

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", 0.9);
  });

  if (!blob) {
    throw new Error("Bild konnte nicht verarbeitet werden.");
  }

  return blob;
}

function drawCropToCanvas({
  canvas,
  context,
  crop,
  image,
  outputHeight,
  outputWidth,
  zoom,
}: {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  crop: PixelCrop;
  image: HTMLImageElement;
  outputHeight: number;
  outputWidth: number;
  zoom: number;
}) {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const cropCenterX = (crop.x + crop.width / 2) * scaleX;
  const cropCenterY = (crop.y + crop.height / 2) * scaleY;
  const sourceWidth = (crop.width * scaleX) / zoom;
  const sourceHeight = (crop.height * scaleY) / zoom;
  const sourceX = clampNumber(
    cropCenterX - sourceWidth / 2,
    0,
    Math.max(0, image.naturalWidth - sourceWidth),
  );
  const sourceY = clampNumber(
    cropCenterY - sourceHeight / 2,
    0,
    Math.max(0, image.naturalHeight - sourceHeight),
  );

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    outputWidth,
    outputHeight,
  );
}

export default function AdminPanel({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const [authenticated, setAuthenticated] = useState(isAuthenticated);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard");
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [saving, setSaving] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(isAuthenticated);
  const [openCasinoIds, setOpenCasinoIds] = useState<string[]>([]);
  const [cropEditor, setCropEditor] = useState<CropEditorState | null>(null);
  const cropImageRef = useRef<HTMLImageElement | null>(null);

  const activeTitle = useMemo(
    () => sections.find((section) => section.id === activeSection)?.label,
    [activeSection],
  );

  useEffect(() => {
    if (!authenticated) {
      return;
    }

    let ignore = false;

    async function loadContent() {
      setLoading(true);
      setStatus({ type: "idle", message: "" });

      try {
        const response = await fetch("/api/admin/content", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Inhalte konnten nicht geladen werden.");
        }

        if (!ignore) {
          const loadedContent = data as SiteContent;
          console.log("Loaded content from Supabase:", loadedContent);
          setContent(loadedContent);
          setOpenCasinoIds(
            loadedContent.casinos[0]?.id ? [loadedContent.casinos[0].id] : [],
          );
        }
      } catch (error) {
        if (!ignore) {
          setStatus({
            type: "error",
            message:
              error instanceof Error
                ? error.message
                : "Inhalte konnten nicht geladen werden.",
          });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadContent();

    return () => {
      ignore = true;
    };
  }, [authenticated]);

  useEffect(() => {
    return () => {
      if (cropEditor?.imageUrl) {
        URL.revokeObjectURL(cropEditor.imageUrl);
      }
    };
  }, [cropEditor?.imageUrl]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus({
        type: "error",
        message: data.error ?? "Login fehlgeschlagen.",
      });
      return;
    }

    setPassword("");
    setAuthenticated(true);
  }

  async function saveContent(
    nextContent: SiteContent,
    successMessage = "Inhalte wurden gespeichert.",
  ) {
    console.log("Saving content to Supabase:", nextContent);
    setSaving(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextContent),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Speichern fehlgeschlagen.");
      }

      setStatus({ type: "success", message: successMessage });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Speichern fehlgeschlagen.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    if (!content) {
      return;
    }

    await saveContent(content);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setContent(null);
  }

  function setBrand(field: keyof SiteContent["brand"], value: string) {
    if (!content) {
      return;
    }

    setContent({
      ...content,
      brand: { ...content.brand, [field]: value },
    });
  }

  function setColor(field: keyof SiteContent["colors"], value: string) {
    if (!content) {
      return;
    }

    setContent({
      ...content,
      colors: { ...content.colors, [field]: value },
    });
  }

  function setTranslation(
    language: LanguageCode,
    field: keyof SiteContent["translations"][LanguageCode],
    value: string,
  ) {
    if (!content) {
      return;
    }

    setContent({
      ...content,
      translations: {
        ...content.translations,
        [language]: {
          ...content.translations[language],
          [field]: value,
        },
      },
    });
  }

  function setTranslationArrayItem(
    language: LanguageCode,
    field: "nav" | "storyParagraphs",
    index: number,
    value: string,
  ) {
    if (!content) {
      return;
    }

    const next = cloneContent(content);
    next.translations[language][field][index] = value;
    setContent(next);
  }

  function setStatItem(
    language: LanguageCode,
    index: number,
    field: keyof StatItem,
    value: string,
  ) {
    if (!content) {
      return;
    }

    const next = cloneContent(content);
    next.translations[language].stats[index][field] = value;
    setContent(next);
  }

  function setStoryFeature(
    language: LanguageCode,
    index: number,
    field: keyof StoryFeature,
    value: string,
  ) {
    if (!content) {
      return;
    }

    const next = cloneContent(content);
    next.translations[language].storyFeatures[index][field] = value;
    setContent(next);
  }

  function setSocialLink(
    area: "header" | "footer",
    index: number,
    field: keyof LinkItem,
    value: string,
  ) {
    if (!content) {
      return;
    }

    const next = cloneContent(content);
    next.links[area][index][field] = value;
    setContent(next);
  }

  function toggleCasino(casinoId: string) {
    setOpenCasinoIds((current) =>
      current.includes(casinoId)
        ? current.filter((id) => id !== casinoId)
        : [...current, casinoId],
    );
  }

  function updateCasino(
    casinoId: string,
    field: CasinoField,
    value: CasinoFieldValue,
  ) {
    console.log("Casino field update:", casinoId, field, value);
    setContent((currentContent) => {
      if (!currentContent) {
        return currentContent;
      }

      return {
        ...currentContent,
        casinos: currentContent.casinos.map((casino) =>
          casino.id === casinoId
            ? {
                ...casino,
                [field]: value,
              }
            : casino,
        ),
      };
    });
  }

  async function addCasino() {
    if (!content) {
      return;
    }

    const casino = createEmptyCasino(content.casinos);
    const nextContent = {
      ...content,
      casinos: [...content.casinos, casino],
    };

    setContent(nextContent);
    setOpenCasinoIds((current) => [...current, casino.id]);
    await saveContent(
      nextContent,
      "Neues Casino wurde hinzugefuegt und gespeichert. Es ist jetzt auf der Main-Seite sichtbar.",
    );
  }

  function duplicateCasino(casinoIndex: number) {
    let duplicateId = "";

    setContent((currentContent) => {
      if (!currentContent?.casinos[casinoIndex]) {
        return currentContent;
      }

      const source = currentContent.casinos[casinoIndex];
      const nextOrder =
        currentContent.casinos.reduce(
          (highest, casino) => Math.max(highest, casino.order || 0),
          0,
        ) + 1;
      const duplicate: Casino = {
        ...source,
        id: createCasinoId(),
        name: source.name ? `${source.name} Kopie` : "",
        order: nextOrder,
      };
      duplicateId = duplicate.id;

      return {
        ...currentContent,
        casinos: [...currentContent.casinos, duplicate],
      };
    });

    if (duplicateId) {
      setOpenCasinoIds((current) => [...current, duplicateId]);
    }

    setStatus({
      type: "success",
      message: "Casino wurde dupliziert. Bitte pruefen und speichern.",
    });
  }

  function deleteCasino(casinoIndex: number) {
    let casinoName = `Casino ${casinoIndex + 1}`;
    let deletedId = "";

    setContent((currentContent) => {
      if (!currentContent?.casinos[casinoIndex]) {
        return currentContent;
      }

      const casino = currentContent.casinos[casinoIndex];
      casinoName = casino.name || `Casino ${casinoIndex + 1}`;
      deletedId = casino.id;

      return {
        ...currentContent,
        casinos: currentContent.casinos.filter((_, index) => index !== casinoIndex),
      };
    });

    if (deletedId) {
      setOpenCasinoIds((current) => current.filter((id) => id !== deletedId));
    }

    setStatus({
      type: "success",
      message: `${casinoName} wurde entfernt. Bitte speichern, damit es auch auf der Seite verschwindet.`,
    });
  }

  async function handleImageUpload(config: ImageUploadConfig, file: File) {
    const maxSourceSize = 8 * 1024 * 1024;

    if (!file.type.startsWith("image/")) {
      setStatus({ type: "error", message: "Bitte nur Bilddateien hochladen." });
      return;
    }

    if (file.size > maxSourceSize) {
      setStatus({
        type: "error",
        message: "Das Originalbild darf maximal 8 MB groß sein.",
      });
      return;
    }

    setStatus({ type: "idle", message: "" });

    if (cropEditor?.imageUrl) {
      URL.revokeObjectURL(cropEditor.imageUrl);
    }

    const aspect = getUploadAspect(config);
    const { outputHeight, outputWidth } = getUploadOutputSize(config);
    setCropEditor({
      aspect,
      config,
      imageUrl: URL.createObjectURL(file),
      outputHeight,
      outputWidth,
      zoom: 1,
    });
  }

  async function uploadCroppedImage() {
    if (!cropEditor || !cropImageRef.current || !cropEditor.completedCrop) {
      setStatus({
        type: "error",
        message: "Bitte zuerst einen Bildausschnitt auswaehlen.",
      });
      return;
    }

    const { config } = cropEditor;
    setUploadingSlot(config.slot);
    setStatus({ type: "idle", message: "" });

    try {
      const resizedBlob = await cropImageToBlob({
        crop: cropEditor.completedCrop,
        image: cropImageRef.current,
        outputHeight: cropEditor.outputHeight,
        outputWidth: cropEditor.outputWidth,
        zoom: cropEditor.zoom,
      });
      const formData = new FormData();
      formData.append("slot", config.slot);
      formData.append(
        "file",
        new File([resizedBlob], `${config.slot}.webp`, { type: "image/webp" }),
      );

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await readJsonResponse(response);

      if (!response.ok || data.success === false || typeof data.url !== "string") {
        throw new Error(data.error ?? "Upload fehlgeschlagen.");
      }

      config.onUploaded(data.url);
      URL.revokeObjectURL(cropEditor.imageUrl);
      setCropEditor(null);
      setStatus({
        type: "success",
        message:
          "Bild wurde angepasst und in Supabase Storage hochgeladen. Bitte speichern, um die URL dauerhaft zu sichern.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Upload fehlgeschlagen.",
      });
    } finally {
      setUploadingSlot(null);
    }
  }

  function closeCropEditor() {
    if (cropEditor?.imageUrl) {
      URL.revokeObjectURL(cropEditor.imageUrl);
    }

    setCropEditor(null);
  }

  if (!authenticated) {
    return (
      <main className="relative z-10 min-h-screen overflow-hidden bg-[#030106] px-4 py-10 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(193,92,255,0.14),transparent_34%),linear-gradient(245deg,rgba(255,191,46,0.08),transparent_32%),repeating-linear-gradient(90deg,rgba(255,255,255,0.025)_0_1px,transparent_1px_88px)]" />
        <form
          className="relative mx-auto mt-[10vh] grid w-full max-w-md gap-5 overflow-hidden rounded-3xl border border-violet-200/20 bg-[#100817]/90 p-8 shadow-[0_34px_120px_rgba(0,0,0,0.58)] ring-1 ring-white/[0.04] backdrop-blur-xl"
          onSubmit={handleLogin}
        >
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#ffbf2e] to-transparent" />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ffbf2e]">
              CasinoGalaxy99
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">Admin Command</h1>
          </div>
          <Field
            label="Passwort"
            value={password}
            onChange={setPassword}
          />
          <button
            className="min-h-12 rounded-xl bg-[linear-gradient(180deg,#ffe577,#ffbf2e_54%,#df7412)] px-5 text-sm font-black uppercase tracking-[0.1em] text-[#170b00] shadow-[0_16px_42px_rgba(255,191,46,0.22)] transition hover:brightness-110"
            type="submit"
          >
            Einloggen
          </button>
          {status.type !== "idle" ? <StatusMessage status={status} /> : null}
        </form>
      </main>
    );
  }

  if (loading || !content) {
    return (
      <main className="relative z-10 min-h-screen bg-[#030106] px-4 py-10 text-white">
        <section className="mx-auto w-full max-w-3xl rounded-3xl border border-violet-200/20 bg-[#100817]/90 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
          <p className="text-[#cfc2dc]">Inhalte werden geladen...</p>
          {status.type === "error" ? <StatusMessage status={status} /> : null}
        </section>
      </main>
    );
  }

  return (
    <>
    <main className="relative z-10 min-h-screen bg-[#030106] px-3 py-0 text-white [scrollbar-gutter:stable] sm:px-5 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(155,60,255,0.14),transparent_36%),linear-gradient(242deg,rgba(255,191,46,0.07),transparent_32%),repeating-linear-gradient(90deg,rgba(255,255,255,0.022)_0_1px,transparent_1px_92px)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,rgba(193,92,255,0.18),transparent)]" />
      <div className="relative mx-auto grid min-h-screen w-full max-w-[1500px] gap-5 py-4 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
        <aside className="w-full shrink-0 overflow-y-auto rounded-3xl border border-violet-200/15 bg-[linear-gradient(180deg,rgba(18,8,30,0.96),rgba(6,2,12,0.96))] p-3 shadow-[0_30px_110px_rgba(0,0,0,0.44)] ring-1 ring-white/[0.04] backdrop-blur-xl lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:w-72 lg:min-w-72">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.035] px-4 py-5">
            <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#ffbf2e]/70 to-transparent" />
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffbf2e]">
              Control Room
            </p>
            <h1 className="mt-2 text-3xl font-black leading-none tracking-tight">
              Casino<br />Galaxy99
            </h1>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-emerald-300/15 bg-emerald-300/8 px-3 py-2 text-emerald-200">
                Live JSON
              </div>
              <div className="rounded-xl border border-[#ffbf2e]/20 bg-[#ffbf2e]/10 px-3 py-2 text-[#ffe7a0]">
                Admin v2
              </div>
            </div>
          </div>
          <nav className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {sections.map((section) => (
              <button
                className={`group grid w-full grid-cols-[42px_minmax(0,1fr)] items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                  activeSection === section.id
                    ? "bg-[linear-gradient(135deg,#ffe577,#ffbf2e_54%,#cf7918)] text-[#170b00] shadow-[0_16px_42px_rgba(255,191,46,0.2)]"
                    : "bg-white/[0.035] text-[#d9cdea] hover:bg-violet-200/10 hover:text-white"
                }`}
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                type="button"
              >
                <span
                  className={`grid h-10 place-items-center rounded-xl text-xs font-black ${
                    activeSection === section.id
                      ? "bg-black/12 text-[#170b00]"
                      : "bg-black/28 text-[#ffda75] group-hover:bg-black/34"
                  }`}
                >
                  {section.code}
                </span>
                <span>
                  <span className="block text-sm font-black">{section.label}</span>
                  <span
                    className={`mt-0.5 block text-xs ${
                      activeSection === section.id ? "text-[#4c2900]" : "text-[#9f91b1]"
                    }`}
                  >
                    {section.description}
                  </span>
                </span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 w-full overflow-hidden rounded-3xl border border-violet-200/15 bg-[linear-gradient(180deg,rgba(11,4,18,0.92),rgba(4,1,8,0.96))] shadow-[0_30px_110px_rgba(0,0,0,0.42)] ring-1 ring-white/[0.04] backdrop-blur-xl">
          <header className="sticky top-0 z-20 flex shrink-0 flex-col gap-4 border-b border-violet-200/15 bg-[#090411]/90 p-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffbf2e]">
                {activeTitle}
              </p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-white">
                Mission Control
              </h2>
              <p className="mt-1 text-sm text-[#a99ab8]">Content bearbeiten, Assets optimieren, Website live halten.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {status.type !== "idle" ? <StatusMessage status={status} /> : null}
              <button
                className="min-h-11 rounded-xl border border-violet-200/20 bg-white/[0.04] px-4 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-white/[0.08]"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
              <button
                className="min-h-11 rounded-xl bg-[linear-gradient(180deg,#ffe577,#ffbf2e_54%,#df7412)] px-6 text-sm font-black uppercase tracking-[0.08em] text-[#170b00] shadow-[0_16px_42px_rgba(255,191,46,0.2)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
                disabled={saving}
                onClick={handleSave}
                type="button"
              >
                {saving ? "Speichert..." : "Speichern"}
              </button>
            </div>
            </div>
          </header>

          <div className="mx-auto grid w-full max-w-5xl content-start gap-5 p-4 pb-28 sm:p-5 sm:pb-28 lg:p-6 lg:pb-28">
            {activeSection === "dashboard" ? renderDashboard(content) : null}
            {activeSection === "brand"
              ? renderBrand(
                  content,
                  setBrand,
                  handleImageUpload,
                  uploadingSlot,
                )
              : null}
            {activeSection === "colors" ? renderColors(content, setColor) : null}
            {activeSection === "home-de"
              ? renderHomeLanguage(
                  "DE",
                  content,
                  setTranslation,
                  setTranslationArrayItem,
                  setStatItem,
                  setStoryFeature,
                )
              : null}
            {activeSection === "home-en"
              ? renderHomeLanguage(
                  "EN",
                  content,
                  setTranslation,
                  setTranslationArrayItem,
                  setStatItem,
                  setStoryFeature,
                )
              : null}
            {activeSection === "social"
              ? renderSocial(content, setSocialLink)
              : null}
            {activeSection === "header"
              ? renderHeader(content, setSocialLink)
              : null}
            {activeSection === "footer"
              ? renderFooter(content, setTranslation, setSocialLink)
              : null}
            {activeSection === "casinos"
              ? renderCasinos(
                  content,
                  addCasino,
                  deleteCasino,
                  duplicateCasino,
                  updateCasino,
                  toggleCasino,
                  openCasinoIds,
                  handleImageUpload,
                  uploadingSlot,
                )
              : null}
          </div>
        </section>
      </div>
    </main>
    {cropEditor ? (
      <CropEditorModal
        editor={cropEditor}
        imageRef={cropImageRef}
        saving={uploadingSlot === cropEditor.config.slot}
        setEditor={setCropEditor}
        onApply={() => {
          void uploadCroppedImage();
        }}
        onCancel={closeCropEditor}
      />
    ) : null}
    </>
  );
}

function StatusMessage({ status }: { status: Status }) {
  return (
    <p
      className={`rounded-xl border px-3 py-2 text-sm shadow-[0_10px_34px_rgba(0,0,0,0.22)] ${
        status.type === "success"
          ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
          : "border-red-300/20 bg-red-400/10 text-red-200"
      }`}
    >
      {status.message}
    </p>
  );
}

function CropEditorModal({
  editor,
  imageRef,
  onApply,
  onCancel,
  saving,
  setEditor,
}: {
  editor: CropEditorState;
  imageRef: RefObject<HTMLImageElement | null>;
  onApply: () => void;
  onCancel: () => void;
  saving: boolean;
  setEditor: (editor: CropEditorState) => void;
}) {
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewportSize, setViewportSize] = useState({ height: 0, width: 0 });
  const activeCrop = editor.completedCrop;
  const cropSourceWidth =
    activeCrop && editor.imageDisplayWidth && editor.imageNaturalWidth
      ? Math.round((activeCrop.width * editor.imageNaturalWidth) / editor.imageDisplayWidth)
      : 0;
  const cropSourceHeight =
    activeCrop && editor.imageDisplayHeight && editor.imageNaturalHeight
      ? Math.round((activeCrop.height * editor.imageNaturalHeight) / editor.imageDisplayHeight)
      : 0;

  useEffect(() => {
    function updateViewportSize() {
      setViewportSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);

    return () => {
      window.removeEventListener("resize", updateViewportSize);
    };
  }, []);

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    const image = imageRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context || !image || !activeCrop) {
      return;
    }

    drawCropToCanvas({
      canvas,
      context,
      crop: activeCrop,
      image,
      outputHeight: editor.outputHeight,
      outputWidth: editor.outputWidth,
      zoom: editor.zoom,
    });
  }, [activeCrop, editor.outputHeight, editor.outputWidth, editor.zoom, imageRef]);

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-black/78 px-3 py-5 text-white backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
    >
      <div className="grid w-full max-w-5xl gap-4 overflow-hidden rounded-3xl border border-violet-200/20 bg-[linear-gradient(145deg,rgba(20,8,33,0.98),rgba(5,2,9,0.98))] p-4 shadow-[0_34px_140px_rgba(0,0,0,0.72)] ring-1 ring-white/[0.04] sm:p-5">
        <div className="flex flex-col gap-3 border-b border-white/[0.07] pb-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffbf2e]">
              Bild zuschneiden
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">
              {editor.config.label}
            </h2>
            <p className="mt-1 text-sm text-[#bcaed0]">
              Ausgabe: {editor.outputWidth} x {editor.outputHeight}px in Supabase Storage.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="min-h-10 rounded-xl border border-violet-200/20 bg-white/[0.04] px-4 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-white/[0.08]"
              onClick={onCancel}
              type="button"
            >
              Abbrechen
            </button>
            <button
              className="min-h-10 rounded-xl bg-[linear-gradient(180deg,#ffe577,#ffbf2e_54%,#df7412)] px-5 text-xs font-black uppercase tracking-[0.08em] text-[#170b00] shadow-[0_16px_42px_rgba(255,191,46,0.22)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
              disabled={saving}
              onClick={onApply}
              type="button"
            >
              {saving ? "Laedt hoch..." : "Uebernehmen"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="grid min-h-[320px] place-items-center overflow-hidden rounded-2xl border border-white/10 bg-black/45 p-3">
            <ReactCrop
              aspect={editor.aspect}
              className="max-h-[64vh] max-w-full"
              crop={editor.crop}
              keepSelection
              onChange={(pixelCrop, percentCrop) =>
                setEditor({
                  ...editor,
                  completedCrop: pixelCrop,
                  crop: percentCrop,
                })
              }
              onComplete={(completedCrop) =>
                setEditor({ ...editor, completedCrop })
              }
            >
              <img
                alt=""
                className="max-h-[64vh] max-w-full select-none"
                decoding="async"
                ref={imageRef}
                src={editor.imageUrl}
                onLoad={(event) => {
                  const image = event.currentTarget;
                  const crop = createCenteredAspectCrop(
                    image.width,
                    image.height,
                    editor.aspect,
                  );
                  const completedCrop = convertToPixelCrop(
                    crop,
                    image.width,
                    image.height,
                  );

                  setEditor({
                    ...editor,
                    completedCrop,
                    crop,
                    imageDisplayHeight: image.height,
                    imageDisplayWidth: image.width,
                    imageNaturalHeight: image.naturalHeight,
                    imageNaturalWidth: image.naturalWidth,
                  });
                }}
              />
            </ReactCrop>
          </div>

          <aside className="grid content-start gap-4 rounded-2xl border border-violet-200/15 bg-[#050208]/70 p-4">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/45">
              <canvas
                className="block h-auto w-full"
                height={editor.outputHeight}
                ref={previewCanvasRef}
                width={editor.outputWidth}
              />
            </div>

            <label className="grid gap-3">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#d9cdea]">
                Zoom
              </span>
              <input
                className="accent-[#ffbf2e]"
                max="2"
                min="1"
                step="0.05"
                type="range"
                value={editor.zoom}
                onChange={(event) =>
                  setEditor({
                    ...editor,
                    zoom: Number.parseFloat(event.target.value),
                  })
                }
              />
              <span className="text-sm text-[#cfc2dc]">
                {Math.round(editor.zoom * 100)}%
              </span>
            </label>

            <div className="rounded-xl border border-[#ffbf2e]/20 bg-[#ffbf2e]/8 p-3 text-sm leading-6 text-[#ffe8a7]">
              Ziehe den Rahmen mit Maus oder Touch. Profilbilder werden quadratisch,
              Casino-Logos im Kartenformat und Hero-Bilder im 16:9 Format gespeichert.
            </div>

            <div className="grid gap-2 rounded-xl border border-violet-200/15 bg-black/28 p-3 text-xs text-[#d9cdea]">
              <CropMetric label="Upload" value={`${editor.outputWidth} x ${editor.outputHeight}px`} />
              <CropMetric label="Crop sichtbar" value={activeCrop ? `${Math.round(activeCrop.width)} x ${Math.round(activeCrop.height)}px` : "-"} />
              <CropMetric label="Crop Original" value={activeCrop ? `${cropSourceWidth} x ${cropSourceHeight}px` : "-"} />
              <CropMetric label="Bild sichtbar" value={editor.imageDisplayWidth && editor.imageDisplayHeight ? `${editor.imageDisplayWidth} x ${editor.imageDisplayHeight}px` : "-"} />
              <CropMetric label="Originalbild" value={editor.imageNaturalWidth && editor.imageNaturalHeight ? `${editor.imageNaturalWidth} x ${editor.imageNaturalHeight}px` : "-"} />
              <CropMetric label="Fenster" value={viewportSize.width ? `${viewportSize.width} x ${viewportSize.height}px` : "-"} />
              <CropMetric
                label="Format"
                value={
                  editor.aspect === 1
                    ? "1:1"
                    : editor.aspect === 16 / 9
                      ? "16:9"
                      : "6:5"
                }
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function CropMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-2 last:border-b-0 last:pb-0">
      <span className="font-bold text-[#9f91b1]">{label}</span>
      <strong className="text-right font-black text-white">{value}</strong>
    </div>
  );
}

function renderDashboard(content: SiteContent) {
  return (
    <div className="grid gap-4">
      <section className="relative overflow-hidden rounded-3xl border border-violet-200/15 bg-[linear-gradient(135deg,rgba(35,13,55,0.95),rgba(7,2,13,0.98))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#ffbf2e]/75 to-transparent" />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffbf2e]">
              Galaxy Operations
            </p>
            <h2 className="mt-2 max-w-3xl text-3xl font-black leading-none tracking-tight text-white sm:text-4xl">
              Content, Boni und Assets an einem Ort.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#cfc2dc]">
              Bearbeite Startseite, Casino-Karten, Uploads und rechtliche Texte
              ohne Code. Der Speicherstatus bleibt oben sichtbar.
            </p>
          </div>
          <div className="grid gap-2 rounded-2xl border border-white/[0.08] bg-black/24 p-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#a99ab8]">
                Active Brand
              </span>
              <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-200">
                Online
              </span>
            </div>
            <p className="text-2xl font-black">{content.brand.name}</p>
            <p className="break-all text-sm text-[#cfc2dc]">{content.brand.twitchUrl}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          detail="bearbeitbare Bonus-Angebote"
          label="Casino Karten"
          value={String(content.casinos.length)}
        />
        <MetricCard detail="Deutsch und Englisch" label="Sprachen" value="2" />
        <MetricCard
          detail="Header und Footer"
          label="Social Links"
          value={String(content.links.header.length + content.links.footer.length)}
        />
      </div>
      <section className="rounded-2xl border border-[#ffbf2e]/15 bg-[#ffbf2e]/8 px-4 py-3 text-sm leading-6 text-[#ffe8a7]">
        Änderungen werden lokal in <strong>data/siteContent.json</strong>{" "}
        gespeichert. Für Vercel-Produktion ist Supabase, Firebase oder Vercel KV
        besser.
      </section>
    </div>
  );
}

function MetricCard({
  detail,
  label,
  value,
}: {
  detail: string;
  label: string;
  value: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-violet-200/15 bg-[linear-gradient(145deg,rgba(20,8,33,0.94),rgba(5,2,9,0.96))] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.26)]">
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#ffbf2e]/65 to-transparent" />
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a99ab8]">
        {label}
      </p>
      <p className="mt-2 text-4xl font-black leading-none text-[#ffbf2e]">
        {value}
      </p>
      <p className="mt-2 text-sm text-[#cfc2dc]">{detail}</p>
    </section>
  );
}

function renderBrand(
  content: SiteContent,
  setBrand: (field: keyof SiteContent["brand"], value: string) => void,
  handleImageUpload: (config: ImageUploadConfig, file: File) => Promise<void>,
  uploadingSlot: string | null,
) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Card title="Brand & Bilder" subtitle="Logo, Hero-Bild und Twitch-Link.">
        <Field
          label="Brand Name"
          value={content.brand.name}
          onChange={(value) => setBrand("name", value)}
        />
        <Field
          label="Twitch URL"
          value={content.brand.twitchUrl}
          onChange={(value) => setBrand("twitchUrl", value)}
        />
        <Field
          label="Logo/Profile Bild URL"
          value={content.brand.profileImageUrl}
          onChange={(value) => setBrand("profileImageUrl", value)}
        />
        <ImageUploadField
          config={{
            height: 512,
            label: "Profilbild automatisch anpassen",
            onUploaded: (url) => setBrand("profileImageUrl", url),
            slot: "brand-profile",
            value: content.brand.profileImageUrl,
            width: 512,
            fit: "contain",
          }}
          disabled={uploadingSlot === "brand-profile"}
          onUpload={handleImageUpload}
        />
        <Field
          label="Hero Logo/Grafik URL"
          value={content.brand.heroLogoUrl}
          onChange={(value) => setBrand("heroLogoUrl", value)}
        />
        <ImageUploadField
          config={{
            height: 650,
            label: "Hero Logo/Grafik automatisch anpassen",
            onUploaded: (url) => setBrand("heroLogoUrl", url),
            slot: "brand-hero-logo",
            value: content.brand.heroLogoUrl,
            width: 1600,
            fit: "contain",
          }}
          disabled={uploadingSlot === "brand-hero-logo"}
          onUpload={handleImageUpload}
        />
        <Field
          label="Hero Bild URL"
          value={content.brand.heroImageUrl}
          onChange={(value) => setBrand("heroImageUrl", value)}
        />
        <ImageUploadField
          config={{
            height: 1080,
            label: "Hero-Bild automatisch anpassen",
            onUploaded: (url) => setBrand("heroImageUrl", url),
            slot: "brand-hero",
            value: content.brand.heroImageUrl,
            width: 1920,
          }}
          disabled={uploadingSlot === "brand-hero"}
          onUpload={handleImageUpload}
        />
      </Card>
      <Card title="Vorschau">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
          <img
            alt=""
            className="h-44 w-full object-cover"
            src={content.brand.heroImageUrl}
          />
        </div>
        <div className="flex items-center gap-3">
          <img
            alt=""
            className="h-14 w-14 rounded-full border border-[#ffbf2e]/40 bg-black object-contain p-[2px]"
            src={content.brand.profileImageUrl}
          />
          <div>
            <p className="font-black">{content.brand.name}</p>
            <p className="text-sm text-[#cfc2dc]">Live Brand Preview</p>
          </div>
        </div>
        <div className="rounded-xl border border-[#ffbf2e]/20 bg-black/40 p-3">
          <img
            alt=""
            className="h-28 w-full object-contain"
            src={content.brand.heroLogoUrl || content.brand.profileImageUrl}
          />
        </div>
      </Card>
    </div>
  );
}

function renderColors(
  content: SiteContent,
  setColor: (field: keyof SiteContent["colors"], value: string) => void,
) {
  return (
    <Card title="Farben" subtitle="Diese Werte steuern die wichtigsten Theme-Farben.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(Object.keys(content.colors) as Array<keyof SiteContent["colors"]>).map(
          (key) => (
            <ColorField
              key={key}
              label={key}
              value={content.colors[key]}
              onChange={(value) => setColor(key, value)}
            />
          ),
        )}
      </div>
    </Card>
  );
}

function renderHomeLanguage(
  language: LanguageCode,
  content: SiteContent,
  setTranslation: (
    language: LanguageCode,
    field: keyof SiteContent["translations"][LanguageCode],
    value: string,
  ) => void,
  setTranslationArrayItem: (
    language: LanguageCode,
    field: "nav" | "storyParagraphs",
    index: number,
    value: string,
  ) => void,
  setStatItem: (
    language: LanguageCode,
    index: number,
    field: keyof StatItem,
    value: string,
  ) => void,
  setStoryFeature: (
    language: LanguageCode,
    index: number,
    field: keyof StoryFeature,
    value: string,
  ) => void,
) {
  const copy = content.translations[language];

  return (
    <div className="grid gap-5">
      <Card title={`Hero ${language}`} subtitle="Haupttitel, Untertitel und CTA Buttons.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Haupttitel oben"
            value={copy.heroTitleTop}
            onChange={(value) => setTranslation(language, "heroTitleTop", value)}
          />
          <Field
            label="Haupttitel unten"
            value={copy.heroTitleBottom}
            onChange={(value) =>
              setTranslation(language, "heroTitleBottom", value)
            }
          />
        </div>
        <Field
          label="Eyebrow"
          value={copy.heroEyebrow}
          onChange={(value) => setTranslation(language, "heroEyebrow", value)}
        />
        <Field
          label="Untertitel"
          textarea
          value={copy.heroCopy}
          onChange={(value) => setTranslation(language, "heroCopy", value)}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Button Text 1"
            value={copy.primaryCta}
            onChange={(value) => setTranslation(language, "primaryCta", value)}
          />
          <Field
            label="Button Link 1"
            value={copy.primaryCtaHref}
            onChange={(value) =>
              setTranslation(language, "primaryCtaHref", value)
            }
          />
          <Field
            label="Button Text 2"
            value={copy.secondaryCta}
            onChange={(value) => setTranslation(language, "secondaryCta", value)}
          />
          <Field
            label="Button Link 2"
            value={copy.secondaryCtaHref}
            onChange={(value) =>
              setTranslation(language, "secondaryCtaHref", value)
            }
          />
        </div>
      </Card>

      <Card title="Navigation & Bonus Labels">
        <div className="grid gap-4 md:grid-cols-3">
          {copy.nav.map((item, index) => (
            <Field
              key={`${language}-nav-${index}`}
              label={`Navigation ${index + 1}`}
              value={item}
              onChange={(value) =>
                setTranslationArrayItem(language, "nav", index, value)
              }
            />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Field
            label="Bonus Überschrift"
            value={copy.bonusTitle}
            onChange={(value) => setTranslation(language, "bonusTitle", value)}
          />
          <Field
            label="Angebot Button"
            value={copy.playOffer}
            onChange={(value) => setTranslation(language, "playOffer", value)}
          />
          <Field
            label="Details Button"
            value={copy.detailsOffer}
            onChange={(value) => setTranslation(language, "detailsOffer", value)}
          />
        </div>
      </Card>

      <Card title="Infokarten">
        <div className="grid gap-4 xl:grid-cols-3">
          {copy.stats.map((stat, index) => (
            <div
              className="grid gap-3 rounded-2xl border border-violet-200/15 bg-[#050208]/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              key={`${language}-stat-${index}`}
            >
              <Field
                label="Icon"
                value={stat.icon}
                onChange={(value) => setStatItem(language, index, "icon", value)}
              />
              <Field
                label="Titel"
                value={stat.title}
                onChange={(value) => setStatItem(language, index, "title", value)}
              />
              <Field
                label="Text"
                value={stat.text}
                onChange={(value) => setStatItem(language, index, "text", value)}
              />
              <Field
                label="Link"
                value={stat.href}
                onChange={(value) => setStatItem(language, index, "href", value)}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card title="Story">
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Story Eyebrow"
            value={copy.storyEyebrow}
            onChange={(value) => setTranslation(language, "storyEyebrow", value)}
          />
          <Field
            label="Story Lead"
            value={copy.storyLead}
            onChange={(value) => setTranslation(language, "storyLead", value)}
          />
          <Field
            label="Story Titel oben"
            value={copy.storyTitleTop}
            onChange={(value) => setTranslation(language, "storyTitleTop", value)}
          />
          <Field
            label="Story Titel unten"
            value={copy.storyTitleBottom}
            onChange={(value) =>
              setTranslation(language, "storyTitleBottom", value)
            }
          />
          <Field
            label="Story Titel Akzent"
            value={copy.storyTitleAccent}
            onChange={(value) =>
              setTranslation(language, "storyTitleAccent", value)
            }
          />
          <Field
            label="Live Titel"
            value={copy.storyLiveTitle}
            onChange={(value) =>
              setTranslation(language, "storyLiveTitle", value)
            }
          />
        </div>
        <Field
          label="Story Handle"
          value={copy.storyHandle}
          onChange={(value) => setTranslation(language, "storyHandle", value)}
        />
        {copy.storyParagraphs.map((paragraph, index) => (
          <Field
            key={`${language}-story-paragraph-${index}`}
            label={`Story Text ${index + 1}`}
            textarea
            value={paragraph}
            onChange={(value) =>
              setTranslationArrayItem(language, "storyParagraphs", index, value)
            }
          />
        ))}
      </Card>

      <Card title="Story Features">
        <div className="grid gap-4 xl:grid-cols-3">
          {copy.storyFeatures.map((feature, index) => (
            <div
              className="grid gap-3 rounded-2xl border border-violet-200/15 bg-[#050208]/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              key={`${language}-feature-${index}`}
            >
              <Field
                label="Icon"
                value={feature.icon}
                onChange={(value) =>
                  setStoryFeature(language, index, "icon", value)
                }
              />
              <Field
                label="Titel"
                value={feature.title}
                onChange={(value) =>
                  setStoryFeature(language, index, "title", value)
                }
              />
              <Field
                label="Text"
                textarea
                value={feature.text}
                onChange={(value) =>
                  setStoryFeature(language, index, "text", value)
                }
              />
              <Field
                label="Link"
                value={feature.href}
                onChange={(value) =>
                  setStoryFeature(language, index, "href", value)
                }
              />
            </div>
          ))}
        </div>
      </Card>

      <Card title="18+ Gate">
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Kicker"
            value={copy.ageKicker}
            onChange={(value) => setTranslation(language, "ageKicker", value)}
          />
          <Field
            label="Titel"
            value={copy.ageTitle}
            onChange={(value) => setTranslation(language, "ageTitle", value)}
          />
          <Field
            label="Weiter Button"
            value={copy.ageEnter}
            onChange={(value) => setTranslation(language, "ageEnter", value)}
          />
          <Field
            label="Verlassen Button"
            value={copy.ageLeave}
            onChange={(value) => setTranslation(language, "ageLeave", value)}
          />
        </div>
        <Field
          label="Hinweis"
          textarea
          value={copy.ageCopy}
          onChange={(value) => setTranslation(language, "ageCopy", value)}
        />
        <Field
          label="Legal Notice"
          textarea
          value={copy.ageNotice}
          onChange={(value) => setTranslation(language, "ageNotice", value)}
        />
      </Card>

      <Card title="Footer & Rechtliches">
        <Field
          label="Footer Text"
          textarea
          value={copy.footerCopy}
          onChange={(value) => setTranslation(language, "footerCopy", value)}
        />
        <Field
          label="Responsible Titel"
          value={copy.responsibleTitle}
          onChange={(value) =>
            setTranslation(language, "responsibleTitle", value)
          }
        />
        <Field
          label="Responsible Text"
          textarea
          value={copy.responsibleCopy}
          onChange={(value) =>
            setTranslation(language, "responsibleCopy", value)
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          <Field
            label="Rechte Text"
            value={copy.rights}
            onChange={(value) => setTranslation(language, "rights", value)}
          />
          <Field
            label="AGB Label"
            value={copy.terms}
            onChange={(value) => setTranslation(language, "terms", value)}
          />
          <Field
            label="Datenschutz Label"
            value={copy.privacy}
            onChange={(value) => setTranslation(language, "privacy", value)}
          />
        </div>
      </Card>
    </div>
  );
}

function renderSocial(
  content: SiteContent,
  setSocialLink: (
    area: "header" | "footer",
    index: number,
    field: keyof LinkItem,
    value: string,
  ) => void,
) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {(["header", "footer"] as const).map((area) => (
        <Card key={area} title={`${area === "header" ? "Header" : "Footer"} Social Links`}>
          {content.links[area].map((link, index) => (
            <div
              className="grid gap-4 rounded-2xl border border-violet-200/15 bg-[#050208]/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:grid-cols-2"
              key={`${area}-${index}`}
            >
              <Field
                label="Label"
                value={link.label}
                onChange={(value) => setSocialLink(area, index, "label", value)}
              />
              <Field
                label="Link"
                value={link.href}
                onChange={(value) => setSocialLink(area, index, "href", value)}
              />
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}

function renderHeader(
  content: SiteContent,
  setSocialLink: (
    area: "header" | "footer",
    index: number,
    field: keyof LinkItem,
    value: string,
  ) => void,
) {
  return (
    <Card title="Header Links" subtitle="Social Buttons oben in der Navigation.">
      {content.links.header.map((link, index) => (
        <div
          className="grid gap-4 rounded-2xl border border-violet-200/15 bg-[#050208]/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:grid-cols-2"
          key={`header-only-${index}`}
        >
          <Field
            label="Label"
            value={link.label}
            onChange={(value) => setSocialLink("header", index, "label", value)}
          />
          <Field
            label="Link"
            value={link.href}
            onChange={(value) => setSocialLink("header", index, "href", value)}
          />
        </div>
      ))}
    </Card>
  );
}

function renderFooter(
  content: SiteContent,
  setTranslation: (
    language: LanguageCode,
    field: keyof SiteContent["translations"][LanguageCode],
    value: string,
  ) => void,
  setSocialLink: (
    area: "header" | "footer",
    index: number,
    field: keyof LinkItem,
    value: string,
  ) => void,
) {
  return (
    <div className="grid gap-5">
      <Card title="Footer Links">
        {content.links.footer.map((link, index) => (
          <div
            className="grid gap-4 rounded-2xl border border-violet-200/15 bg-[#050208]/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:grid-cols-2"
            key={`footer-only-${index}`}
          >
            <Field
              label="Label"
              value={link.label}
              onChange={(value) => setSocialLink("footer", index, "label", value)}
            />
            <Field
              label="Link"
              value={link.href}
              onChange={(value) => setSocialLink("footer", index, "href", value)}
            />
          </div>
        ))}
      </Card>
      <div className="grid gap-5 xl:grid-cols-2">
        {(["DE", "EN"] as const).map((language) => (
          <Card key={`footer-copy-${language}`} title={`Footer Texte ${language}`}>
            <Field
              label="Footer Text"
              textarea
              value={content.translations[language].footerCopy}
              onChange={(value) => setTranslation(language, "footerCopy", value)}
            />
            <Field
              label="Responsible Titel"
              value={content.translations[language].responsibleTitle}
              onChange={(value) =>
                setTranslation(language, "responsibleTitle", value)
              }
            />
            <Field
              label="Responsible Text"
              textarea
              value={content.translations[language].responsibleCopy}
              onChange={(value) =>
                setTranslation(language, "responsibleCopy", value)
              }
            />
          </Card>
        ))}
      </div>
    </div>
  );
}

function renderCasinos(
  content: SiteContent,
  addCasino: () => void,
  deleteCasino: (casinoIndex: number) => void,
  duplicateCasino: (casinoIndex: number) => void,
  updateCasino: (
    casinoId: string,
    field: CasinoField,
    value: CasinoFieldValue,
  ) => void,
  toggleCasino: (casinoId: string) => void,
  openCasinoIds: string[],
  handleImageUpload: (config: ImageUploadConfig, file: File) => Promise<void>,
  uploadingSlot: string | null,
) {
  const activeCount = content.casinos.filter((casino) => casino.active).length;

  return (
    <Card
      title="Casino Boni"
      subtitle="Beliebig viele Casino Cards erstellen, sortieren, deaktivieren oder entfernen."
    >
      <div className="grid gap-5">
        <div className="flex flex-col gap-3 rounded-2xl border border-[#ffbf2e]/20 bg-[#ffbf2e]/8 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-white">
              {activeCount} von {content.casinos.length} Casino
              {content.casinos.length === 1 ? "" : "s"} aktiv
            </p>
            <p className="mt-1 text-sm text-[#ffe8a7]">
              Neue Casinos starten leer und erscheinen nach dem Speichern automatisch auf der Startseite.
            </p>
          </div>
          <button
            className="min-h-11 rounded-xl bg-[linear-gradient(180deg,#ffe577,#ffbf2e_54%,#df7412)] px-5 text-sm font-black uppercase tracking-[0.08em] text-[#170b00] shadow-[0_16px_42px_rgba(255,191,46,0.2)] transition hover:brightness-110"
            onClick={addCasino}
            type="button"
          >
            + Neues Casino hinzufuegen
          </button>
        </div>

        {content.casinos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-violet-200/25 bg-[#050208]/50 p-8 text-center">
            <p className="text-lg font-black text-white">Keine Casino-Karten vorhanden</p>
            <p className="mt-2 text-sm text-[#cfc2dc]">
              Fuege ein neues Casino hinzu, damit es auf der Startseite angezeigt wird.
            </p>
          </div>
        ) : null}

        {content.casinos.map((casino, index) => {
          const isOpen = openCasinoIds.includes(casino.id);
          const uploadSlot = `casino-logo-${casino.id.replace(/[^a-z0-9-]/gi, "-")}`;

          return (
            <article
              className="overflow-hidden rounded-2xl border border-violet-200/15 bg-[#050208]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              key={casino.id}
            >
              <div className="flex flex-col gap-3 border-b border-white/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  className="grid min-w-0 flex-1 grid-cols-[52px_minmax(0,1fr)] items-center gap-3 text-left"
                  onClick={() => toggleCasino(casino.id)}
                  type="button"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-[#ffbf2e]/25 bg-[#ffbf2e]/10 text-sm font-black text-[#ffdf79]">
                    {casino.order || index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-black uppercase tracking-[0.18em] text-[#ffbf2e]">
                      Casino Preset {index + 1}
                    </span>
                    <span className="mt-1 block truncate text-lg font-black text-white">
                      {casino.name || "Neues Casino"}
                    </span>
                    <span className="mt-1 block text-xs font-bold text-[#9f91b1]">
                      {casino.active ? "Aktiv auf der Website" : "Inaktiv / ausgeblendet"}
                    </span>
                  </span>
                </button>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <button
                    className="min-h-10 rounded-xl border border-violet-200/20 bg-white/[0.04] px-4 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-white/[0.08]"
                    onClick={() => toggleCasino(casino.id)}
                    type="button"
                  >
                    {isOpen ? "Zuklappen" : "Bearbeiten"}
                  </button>
                  <button
                    className="min-h-10 rounded-xl border border-[#ffbf2e]/25 bg-[#ffbf2e]/10 px-4 text-xs font-black uppercase tracking-[0.08em] text-[#ffe8a7] transition hover:bg-[#ffbf2e]/16"
                    onClick={() => duplicateCasino(index)}
                    type="button"
                  >
                    Duplizieren
                  </button>
                  <button
                    className="min-h-10 rounded-xl border border-red-300/25 bg-red-400/10 px-4 text-xs font-black uppercase tracking-[0.08em] text-red-200 transition hover:bg-red-400/18"
                    onClick={() => deleteCasino(index)}
                    type="button"
                  >
                    Loeschen
                  </button>
                </div>
              </div>

              {isOpen ? (
                <div className="grid gap-5 p-4">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Field
                      label="Casino Name"
                      value={casino.name}
                      onChange={(value) =>
                        updateCasino(casino.id, "name", value)
                      }
                    />
                    <Field
                      label="Logo/Bild URL"
                      value={casino.logoUrl}
                      onChange={(value) =>
                        updateCasino(casino.id, "logoUrl", value)
                      }
                    />
                    <Field
                      label="Bonus Text"
                      value={casino.bonus}
                      onChange={(value) =>
                        updateCasino(casino.id, "bonus", value)
                      }
                    />
                    <Field
                      label="Code Box 1 Label"
                      value={casino.description1Label}
                      onChange={(value) =>
                        updateCasino(casino.id, "description1Label", value)
                      }
                    />
                    <Field
                      label="Code Box 1 Wert"
                      value={casino.description1}
                      onChange={(value) =>
                        updateCasino(casino.id, "description1", value)
                      }
                    />
                    <Field
                      label="Code Box 2 Label"
                      value={casino.description2Label}
                      onChange={(value) =>
                        updateCasino(casino.id, "description2Label", value)
                      }
                    />
                    <Field
                      label="Code Box 2 Wert"
                      value={casino.description2}
                      onChange={(value) =>
                        updateCasino(casino.id, "description2", value)
                      }
                    />
                    <Field
                      label="Ranking/Reihenfolge"
                      value={String(casino.order)}
                      onChange={(value) =>
                        updateCasino(casino.id, "order", Number.parseInt(value, 10) || 0)
                      }
                    />
                  </div>

                  <ImageUploadField
                    config={{
                      height: 360,
                      label: `Casino ${index + 1} Logo automatisch anpassen`,
                      onUploaded: (url) =>
                        updateCasino(casino.id, "logoUrl", url),
                      slot: uploadSlot,
                      value: casino.logoUrl,
                      width: 640,
                      fit: "contain",
                    }}
                    disabled={uploadingSlot === uploadSlot}
                    onUpload={handleImageUpload}
                  />

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {(
                      [
                        ["feature1", "feature1Icon"],
                        ["feature2", "feature2Icon"],
                        ["feature3", "feature3Icon"],
                        ["feature4", "feature4Icon"],
                      ] as const
                    ).map(([textField, iconField], featureIndex) => (
                      <div
                        className="grid gap-3 rounded-2xl border border-violet-200/15 bg-[#050208]/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                        key={`${casino.id}-${textField}`}
                      >
                        <Field
                          label={`Feature ${featureIndex + 1}`}
                          value={casino[textField]}
                          onChange={(value) =>
                            updateCasino(casino.id, textField, value)
                          }
                        />
                        <Field
                          label={`Icon ${featureIndex + 1}`}
                          value={casino[iconField]}
                          placeholder="gift, speed, card, wager, star"
                          onChange={(value) =>
                            updateCasino(casino.id, iconField, value)
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Button Text"
                      value={casino.buttonText}
                      onChange={(value) =>
                        updateCasino(casino.id, "buttonText", value)
                      }
                    />
                    <Field
                      label="Button Link"
                      value={casino.buttonLink}
                      onChange={(value) =>
                        updateCasino(casino.id, "buttonLink", value)
                      }
                    />
                  </div>

                  <Field
                    label="Details Text"
                    textarea
                    value={casino.detailsText}
                    onChange={(value) =>
                      updateCasino(casino.id, "detailsText", value)
                    }
                  />

                  <div className="flex flex-col gap-3 rounded-2xl border border-violet-200/15 bg-black/24 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-black text-white">Website Status</p>
                      <p className="mt-1 text-sm text-[#9f91b1]">
                        Inaktive Casinos bleiben gespeichert, werden aber nicht angezeigt.
                      </p>
                    </div>
                    <button
                      className={`min-h-11 rounded-xl px-5 text-sm font-black uppercase tracking-[0.08em] transition ${
                        casino.active
                          ? "bg-emerald-300/15 text-emerald-200 ring-1 ring-emerald-300/25"
                          : "bg-red-400/10 text-red-200 ring-1 ring-red-300/25"
                      }`}
                      onClick={() =>
                        updateCasino(casino.id, "active", !casino.active)
                      }
                      type="button"
                    >
                      {casino.active ? "Aktiv" : "Inaktiv"}
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </Card>
  );
}
