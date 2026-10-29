"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export type ThemeKey =
  | "harmonious"
  | "emerald"
  | "ivory"
  | "beige"
  | "yellow"
  | "blush"
  | "sage"
  | "burgundy"
  | "terracotta"
  | "midnight"
  | "custom";

export interface ThemeOption {
  id: ThemeKey;
  name: string;
  tagline: string;
  swatch: string;
  secondarySwatch: string;
  accentSwatch: string;
  textColor: string;
  isDark: boolean;
  bgClass: string;
  customHex?: string;
  cardBgClass: string;
  textClass: string;
  subtextClass: string;
  borderClass: string;
}

export function isColorDark(hex: string): boolean {
  if (!hex || hex.startsWith("linear-gradient")) return false;
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (cleanHex.length !== 6) return false;
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 135;
}

export function createCustomThemeOption(hexColor: string, name = "Custom Bespoke"): ThemeOption {
  const dark = isColorDark(hexColor);
  return {
    id: "custom",
    name,
    tagline: `Hex: ${hexColor.toUpperCase()}`,
    swatch: hexColor,
    secondarySwatch: hexColor,
    accentSwatch: "#c5a059",
    textColor: dark ? "#faf6ee" : "#2c2420",
    isDark: dark,
    bgClass: "",
    customHex: hexColor,
    cardBgClass: dark
      ? "bg-white/[0.08] border-gold/30 text-[#faf6ee]"
      : "bg-white/80 border-gold/25 text-[#2c2420]",
    textClass: dark ? "text-[#faf6ee]" : "text-[#2c2420]",
    subtextClass: dark ? "text-[#cfc7b8]" : "text-[#7a6f61]",
    borderClass: dark ? "border-gold/30" : "border-gold/25",
  };
}

export const THEME_OPTIONS: Record<ThemeKey, ThemeOption> = {
  emerald: {
    id: "emerald",
    name: "Royal Emerald",
    tagline: "Signature Luxury Bottle Green",
    swatch: "#0a1f14",
    secondarySwatch: "#0f2b1e",
    accentSwatch: "#c5a059",
    textColor: "#faf6ee",
    isDark: true,
    bgClass: "bg-[#0a1f14] text-[#faf6ee]",
    customHex: "#0a1f14",
    cardBgClass: "bg-[#0f2b1e]/90 border-gold/30 text-[#faf6ee]",
    textClass: "text-[#faf6ee]",
    subtextClass: "text-[#cfc7b8]",
    borderClass: "border-gold/30",
  },
  ivory: {
    id: "ivory",
    name: "Royal Ivory",
    tagline: "Pearl Parchment & Fine Cardstock",
    swatch: "#faf6ee",
    secondarySwatch: "#f8f4ec",
    accentSwatch: "#c5a059",
    textColor: "#2c2420",
    isDark: false,
    bgClass: "bg-[#faf6ee] text-[#2c2420]",
    customHex: "#faf6ee",
    cardBgClass: "bg-white/80 border-gold/25 text-[#2c2420]",
    textClass: "text-[#2c2420]",
    subtextClass: "text-[#7a6f61]",
    borderClass: "border-gold/25",
  },
  beige: {
    id: "beige",
    name: "Light Beige",
    tagline: "Warm Handcrafted Linen Paper",
    swatch: "#f3ecdf",
    secondarySwatch: "#ebe2d1",
    accentSwatch: "#9c7a3f",
    textColor: "#2c2420",
    isDark: false,
    bgClass: "bg-[#f3ecdf] text-[#2c2420]",
    customHex: "#f3ecdf",
    cardBgClass: "bg-[#faf6ee]/90 border-gold/30 text-[#2c2420]",
    textClass: "text-[#2c2420]",
    subtextClass: "text-[#73675a]",
    borderClass: "border-gold/30",
  },
  yellow: {
    id: "yellow",
    name: "Warm Golden Yellow",
    tagline: "Marigold Champagne & Honey Glow",
    swatch: "#fdf6e2",
    secondarySwatch: "#f8ecbf",
    accentSwatch: "#c5a059",
    textColor: "#2a2015",
    isDark: false,
    bgClass: "bg-[#fdf6e2] text-[#2a2015]",
    customHex: "#fdf6e2",
    cardBgClass: "bg-[#fffbf0]/90 border-gold/35 text-[#2a2015]",
    textClass: "text-[#2a2015]",
    subtextClass: "text-[#7d6a4a]",
    borderClass: "border-gold/35",
  },
  blush: {
    id: "blush",
    name: "Blush Rose",
    tagline: "Delicate Floral Silk Parchment",
    swatch: "#fbf0eb",
    secondarySwatch: "#f5ded5",
    accentSwatch: "#e3a98f",
    textColor: "#2e1e19",
    isDark: false,
    bgClass: "bg-[#fbf0eb] text-[#2e1e19]",
    customHex: "#fbf0eb",
    cardBgClass: "bg-white/85 border-[#e3a98f]/40 text-[#2e1e19]",
    textClass: "text-[#2e1e19]",
    subtextClass: "text-[#80635a]",
    borderClass: "border-[#e3a98f]/40",
  },
  sage: {
    id: "sage",
    name: "Artisanal Sage",
    tagline: "Botanical Calm & Leaf Green",
    swatch: "#edf3ed",
    secondarySwatch: "#dde8de",
    accentSwatch: "#3d6b4f",
    textColor: "#17231c",
    isDark: false,
    bgClass: "bg-[#edf3ed] text-[#17231c]",
    customHex: "#edf3ed",
    cardBgClass: "bg-white/85 border-[#3d6b4f]/25 text-[#17231c]",
    textClass: "text-[#17231c]",
    subtextClass: "text-[#5b6e61]",
    borderClass: "border-[#3d6b4f]/30",
  },
  burgundy: {
    id: "burgundy",
    name: "Royal Burgundy",
    tagline: "Deep Maroon Shagun Velvet",
    swatch: "#260d14",
    secondarySwatch: "#38131e",
    accentSwatch: "#c5a059",
    textColor: "#faf6ee",
    isDark: true,
    bgClass: "bg-[#260d14] text-[#faf6ee]",
    customHex: "#260d14",
    cardBgClass: "bg-[#38131e]/90 border-gold/30 text-[#faf6ee]",
    textClass: "text-[#faf6ee]",
    subtextClass: "text-[#d8c3b8]",
    borderClass: "border-gold/30",
  },
  terracotta: {
    id: "terracotta",
    name: "Warm Terracotta",
    tagline: "Earthy Artisanal Clay Paper",
    swatch: "#f7ede2",
    secondarySwatch: "#eedacf",
    accentSwatch: "#c5a059",
    textColor: "#2e1e19",
    isDark: false,
    bgClass: "bg-[#f7ede2] text-[#2e1e19]",
    customHex: "#f7ede2",
    cardBgClass: "bg-white/85 border-gold/30 text-[#2e1e19]",
    textClass: "text-[#2e1e19]",
    subtextClass: "text-[#80635a]",
    borderClass: "border-gold/30",
  },
  midnight: {
    id: "midnight",
    name: "Midnight Indigo",
    tagline: "Royal Night Velvet & Obsidian",
    swatch: "#091222",
    secondarySwatch: "#101d36",
    accentSwatch: "#c5a059",
    textColor: "#faf6ee",
    isDark: true,
    bgClass: "bg-[#091222] text-[#faf6ee]",
    customHex: "#091222",
    cardBgClass: "bg-[#101d36]/90 border-gold/30 text-[#faf6ee]",
    textClass: "text-[#faf6ee]",
    subtextClass: "text-[#b8c6dc]",
    borderClass: "border-gold/30",
  },
  custom: {
    id: "custom",
    name: "Custom Bespoke",
    tagline: "Personalized Custom Palette",
    swatch: "#faf6ee",
    secondarySwatch: "#f8f4ec",
    accentSwatch: "#c5a059",
    textColor: "#2c2420",
    isDark: false,
    bgClass: "",
    customHex: "#faf6ee",
    cardBgClass: "bg-white/80 border-gold/25 text-[#2c2420]",
    textClass: "text-[#2c2420]",
    subtextClass: "text-[#7a6f61]",
    borderClass: "border-gold/25",
  },
  harmonious: {
    id: "harmonious",
    name: "Harmonious Luxury Mix",
    tagline: "Artisan Balanced Signature Transitions",
    swatch: "linear-gradient(135deg, #0a1f14 0%, #faf6ee 50%, #f3ecdf 100%)",
    secondarySwatch: "#f3ecdf",
    accentSwatch: "#c5a059",
    textColor: "#2c2420",
    isDark: false,
    bgClass: "bg-harmonious",
    customHex: undefined,
    cardBgClass: "bg-cream-2/60 border-gold/30",
    textClass: "text-ink",
    subtextClass: "text-taupe",
    borderClass: "border-gold/25",
  },
};

export type SectionId = "collections" | "story" | "experience" | "process" | "arrivals" | "faq";

export interface SectionThemes {
  collections: ThemeKey;
  story: ThemeKey;
  experience: ThemeKey;
  process: ThemeKey;
  arrivals: ThemeKey;
  faq: ThemeKey;
}

export type SectionCustomColors = Record<SectionId, string>;

const DEFAULT_SECTION_THEMES: SectionThemes = {
  collections: "ivory",
  story: "ivory",
  experience: "ivory",
  process: "ivory",
  arrivals: "ivory",
  faq: "ivory",
};

const DEFAULT_SECTION_CUSTOM_COLORS: SectionCustomColors = {
  collections: "#faf6ee",
  story: "#faf6ee",
  experience: "#faf6ee",
  process: "#faf6ee",
  arrivals: "#faf6ee",
  faq: "#faf6ee",
};

interface ThemeContextType {
  globalTheme: ThemeKey;
  sectionThemes: SectionThemes;
  customGlobalColor: string;
  sectionCustomColors: SectionCustomColors;
  setGlobalTheme: (theme: ThemeKey) => void;
  setSectionTheme: (section: SectionId, theme: ThemeKey) => void;
  setCustomGlobalColor: (hex: string) => void;
  setCustomSectionColor: (section: SectionId, hex: string) => void;
  resetToDefault: () => void;
  applyGlobalThemeToAllSections: (theme: ThemeKey) => void;
  getSectionThemeStyle: (section: SectionId) => ThemeOption;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "pd_luxury_theme_config_v6";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [globalTheme, setGlobalThemeState] = useState<ThemeKey>("harmonious");
  const [sectionThemes, setSectionThemes] = useState<SectionThemes>(DEFAULT_SECTION_THEMES);
  const [customGlobalColor, setCustomGlobalColorState] = useState<string>("#faf6ee");
  const [sectionCustomColors, setSectionCustomColors] = useState<SectionCustomColors>(
    DEFAULT_SECTION_CUSTOM_COLORS
  );
  const isMounted = useRef(false);

  // Load from local storage
  useEffect(() => {
    isMounted.current = true;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        queueMicrotask(() => {
        if (parsed.globalTheme && (THEME_OPTIONS[parsed.globalTheme as ThemeKey] || parsed.globalTheme === "custom")) {
          setGlobalThemeState(parsed.globalTheme as ThemeKey);
        }
        if (parsed.customGlobalColor) {
          setCustomGlobalColorState(parsed.customGlobalColor);
        }
        if (parsed.sectionThemes) {
          setSectionThemes((prev) => ({ ...prev, ...parsed.sectionThemes }));
        }
        if (parsed.sectionCustomColors) {
          setSectionCustomColors((prev) => ({ ...prev, ...parsed.sectionCustomColors }));
        }
        });
      }
    } catch {}
  }, []);

  // Save to local storage & update root attributes & CSS variables
  useEffect(() => {
    if (!isMounted.current) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          globalTheme,
          sectionThemes,
          customGlobalColor,
          sectionCustomColors,
        })
      );
      document.documentElement.setAttribute("data-theme", globalTheme);

      if (globalTheme === "custom") {
        document.documentElement.style.setProperty("--custom-global-bg", customGlobalColor);
      } else {
        document.documentElement.style.removeProperty("--custom-global-bg");
      }
    } catch {}
  }, [globalTheme, sectionThemes, customGlobalColor, sectionCustomColors]);

  const setGlobalTheme = (theme: ThemeKey) => {
    setGlobalThemeState(theme);
    if (theme !== "harmonious") {
      setSectionThemes({
        collections: theme,
        story: theme,
        experience: theme === "emerald" ? "emerald" : theme,
        process: theme,
        arrivals: theme,
        faq: theme,
      });
    } else {
      setSectionThemes(DEFAULT_SECTION_THEMES);
    }
  };

  const setCustomGlobalColor = (hex: string) => {
    setCustomGlobalColorState(hex);
    setGlobalThemeState("custom");
    setSectionThemes({
      collections: "custom",
      story: "custom",
      experience: "custom",
      process: "custom",
      arrivals: "custom",
      faq: "custom",
    });
    setSectionCustomColors({
      collections: hex,
      story: hex,
      experience: hex,
      process: hex,
      arrivals: hex,
      faq: hex,
    });
  };

  const setSectionTheme = (section: SectionId, theme: ThemeKey) => {
    setSectionThemes((prev) => ({
      ...prev,
      [section]: theme,
    }));
  };

  const setCustomSectionColor = (section: SectionId, hex: string) => {
    setSectionCustomColors((prev) => ({
      ...prev,
      [section]: hex,
    }));
    setSectionThemes((prev) => ({
      ...prev,
      [section]: "custom",
    }));
  };

  const applyGlobalThemeToAllSections = (theme: ThemeKey) => {
    setGlobalThemeState(theme);
    setSectionThemes({
      collections: theme,
      story: theme,
      experience: theme,
      process: theme,
      arrivals: theme,
      faq: theme,
    });
  };

  const resetToDefault = () => {
    setGlobalThemeState("harmonious");
    setSectionThemes(DEFAULT_SECTION_THEMES);
    setCustomGlobalColorState("#faf6ee");
    setSectionCustomColors(DEFAULT_SECTION_CUSTOM_COLORS);
  };

  const getSectionThemeStyle = (section: SectionId): ThemeOption => {
    const key = sectionThemes[section] || "ivory";
    if (key === "custom") {
      const hex = sectionCustomColors[section] || customGlobalColor || "#faf6ee";
      return createCustomThemeOption(hex, `Custom (${hex.toUpperCase()})`);
    }
    return THEME_OPTIONS[key] || THEME_OPTIONS.ivory;
  };

  return (
    <ThemeContext.Provider
      value={{
        globalTheme,
        sectionThemes,
        customGlobalColor,
        sectionCustomColors,
        setGlobalTheme,
        setSectionTheme,
        setCustomGlobalColor,
        setCustomSectionColor,
        resetToDefault,
        applyGlobalThemeToAllSections,
        getSectionThemeStyle,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
