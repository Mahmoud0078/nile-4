import { useEffect, useState } from "react";
import {
  detectPlatform,
  isStandalone,
  statusBarColor,
  supportsVibration,
  type Platform,
} from "@/lib/platform";

type Result = {
  platform: Platform;
  standalone: boolean;
  vibrationSupported: boolean;
  statusColor: string;
  safeTop: number;
  safeBottom: number;
};

function readInset(name: string): number {
  if (typeof window === "undefined") return 0;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function usePlatform(): Result {
  const [platform] = useState<Platform>(() => detectPlatform());
  const [standalone] = useState<boolean>(() => isStandalone());
  const [vibrationSupported] = useState<boolean>(() => supportsVibration());
  const [safeTop, setSafeTop] = useState(0);
  const [safeBottom, setSafeBottom] = useState(0);

  useEffect(() => {
    function sync() {
      setSafeTop(readInset("--safe-top"));
      setSafeBottom(readInset("--safe-bottom"));
    }
    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, []);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const color = statusBarColor(platform);
    if (meta) {
      meta.setAttribute("content", color);
    } else {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "theme-color");
      tag.setAttribute("content", color);
      document.head.appendChild(tag);
    }
  }, [platform]);

  return {
    platform,
    standalone,
    vibrationSupported,
    statusColor: statusBarColor(platform),
    safeTop,
    safeBottom,
  };
}