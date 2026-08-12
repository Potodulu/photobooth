"use client";

import * as React from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/libs/cn";

export type QrCodeProps = {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  className?: string;
  bgColor?: string;
  fgColor?: string;
};

export function QrCode({
  value,
  size = 160,
  level = "M",
  className,
  bgColor = "#ffffff",
  fgColor = "#171717",
}: QrCodeProps) {
  if (!value) return null;

  return (
    <div
      className={cn(
        "border-border shadow-neo-sm inline-flex rounded-2xl border-2 bg-white p-3",
        className,
      )}
    >
      <QRCodeSVG
        value={value}
        size={size}
        level={level}
        bgColor={bgColor}
        fgColor={fgColor}
        marginSize={1}
      />
    </div>
  );
}
