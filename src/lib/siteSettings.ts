import db from "@/db/db";

// Default brand accent (the current yellow). Overridden by the "theme_color"
// SiteSetting once the owner picks a color in admin → Branding.
export const DEFAULT_THEME_COLOR = "#facc15";

export async function getSetting(
  key: string,
  fallback = "",
): Promise<string> {
  try {
    const row = await db.siteSetting.findUnique({ where: { key } });
    return row?.value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getThemeColor(): Promise<string> {
  return getSetting("theme_color", DEFAULT_THEME_COLOR);
}

/** Custom uploaded logo URL, or "" to fall back to the bundled logo. */
export async function getLogoUrl(): Promise<string> {
  return getSetting("logo_url", "");
}
