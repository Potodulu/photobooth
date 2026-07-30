import type { PaperSize, Size } from "./types";

export const PRINT_DPI = 300;

export function inToPx(inches: number, dpi = PRINT_DPI): number {
  return Math.round(inches * dpi);
}

export function paperSizeToPixels(paperSize: PaperSize, dpi = PRINT_DPI): Size {
  return {
    width: inToPx(paperSize.widthIn, dpi),
    height: inToPx(paperSize.heightIn, dpi),
  };
}
