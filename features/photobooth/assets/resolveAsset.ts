import single1 from "./layouts/single-1.svg";
import strip2 from "./layouts/strip-2.svg";
import grid4 from "./layouts/grid-4.svg";
import strip2r from "./layouts/strip-2r.svg";
import strip4r from "./layouts/strip-4r.svg";
import classicOverlay from "./frames/classic/overlay.png";
import minimalOverlay from "./frames/minimal/overlay.png";
import birthdayOverlay from "./frames/birthday/overlay.png";
import classicPreview from "./frames/classic/overlay.svg";
import minimalPreview from "./frames/minimal/overlay.svg";
import birthdayPreview from "./frames/birthday/overlay.svg";

type AssetModule = string | { src: string };

function toUrl(mod: AssetModule): string {
  return typeof mod === "string" ? mod : mod.src;
}

const ASSETS: Record<string, string> = {
  "layouts/single-1.svg": toUrl(single1),
  "layouts/strip-2.svg": toUrl(strip2),
  "layouts/grid-4.svg": toUrl(grid4),
  "layouts/strip-2r.svg": toUrl(strip2r),
  "layouts/strip-4r.svg": toUrl(strip4r),
  "frames/classic/overlay.png": toUrl(classicOverlay),
  "frames/minimal/overlay.png": toUrl(minimalOverlay),
  "frames/birthday/overlay.png": toUrl(birthdayOverlay),
  "frames/classic/overlay.svg": toUrl(classicPreview),
  "frames/minimal/overlay.svg": toUrl(minimalPreview),
  "frames/birthday/overlay.svg": toUrl(birthdayPreview),
};

/** Resolve a relative key under features/photobooth/assets to a bundler URL. */
export function resolvePhotoboothAsset(key: string): string {
  const url = ASSETS[key];
  if (!url) {
    throw new Error(`Unknown photobooth asset: ${key}`);
  }
  return url;
}

export function tryResolvePhotoboothAsset(
  key: string | null | undefined,
): string | null {
  if (!key) return null;
  return ASSETS[key] ?? null;
}
