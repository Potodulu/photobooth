// Layout assets
import photostrip4slot from "./layouts/photostrip-4-slot.svg";

// Frame assets
import potoduluOriWhiteOverlay from "./frames/potodulu-ori-white/overlay.png";
import potoduluOriWhitePreview from "./frames/potodulu-ori-white/overlay.svg";
import stripClassicBlackOverlay from "./frames/strip-classic-black/overlay.png";
import stripClassicBlueOverlay from "./frames/strip-classic-blue/overlay.png";
import stripClassicCreamOverlay from "./frames/strip-classic-cream/overlay.png";
import stripClassicGreyOverlay from "./frames/strip-classic-grey/overlay.png";
import stripClassicLavenderOverlay from "./frames/strip-classic-lavender/overlay.png";
import stripClassicMintOverlay from "./frames/strip-classic-mint/overlay.png";
import stripClassicMistOverlay from "./frames/strip-classic-mist/overlay.png";
import stripClassicPeachOverlay from "./frames/strip-classic-peach/overlay.png";
import stripClassicPinkOverlay from "./frames/strip-classic-pink/overlay.png";
import stripClassicSageOverlay from "./frames/strip-classic-sage/overlay.png";
import stripClassicVanillaOverlay from "./frames/strip-classic-vanilla/overlay.png";
import stripClassicWhiteOverlay from "./frames/strip-classic-white/overlay.png";

type AssetModule = string | { src: string };

function toUrl(mod: AssetModule): string {
  return typeof mod === "string" ? mod : mod.src;
}

const ASSETS: Record<string, string> = {
  // Layout assets
  "layouts/photostrip-4-slot.svg": toUrl(photostrip4slot),

  // Frame assets
  "frames/potodulu-ori-white/overlay.png": toUrl(potoduluOriWhiteOverlay),
  "frames/potodulu-ori-white/overlay.svg": toUrl(potoduluOriWhitePreview),
  "frames/strip-classic-black/overlay.png": toUrl(stripClassicBlackOverlay),
  "frames/strip-classic-blue/overlay.png": toUrl(stripClassicBlueOverlay),
  "frames/strip-classic-cream/overlay.png": toUrl(stripClassicCreamOverlay),
  "frames/strip-classic-grey/overlay.png": toUrl(stripClassicGreyOverlay),
  "frames/strip-classic-lavender/overlay.png": toUrl(
    stripClassicLavenderOverlay,
  ),
  "frames/strip-classic-mint/overlay.png": toUrl(stripClassicMintOverlay),
  "frames/strip-classic-mist/overlay.png": toUrl(stripClassicMistOverlay),
  "frames/strip-classic-peach/overlay.png": toUrl(stripClassicPeachOverlay),
  "frames/strip-classic-pink/overlay.png": toUrl(stripClassicPinkOverlay),
  "frames/strip-classic-sage/overlay.png": toUrl(stripClassicSageOverlay),
  "frames/strip-classic-vanilla/overlay.png": toUrl(stripClassicVanillaOverlay),
  "frames/strip-classic-white/overlay.png": toUrl(stripClassicWhiteOverlay),
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
