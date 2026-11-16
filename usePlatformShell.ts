import { useEffect } from "react";
import { IS_ANDROID, IS_IOS, statusBarColor } from "@/lib/platform";

/**
 * Applies native-feeling chrome: safe-area padding, status-bar theme color,
 * and viewport-fit so the app renders edge-to-edge on iOS and Android.
 */
export function usePlatformShell() {
  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--safe-top", "env(safe-area-inset-top, 0px)");
    root.style.setProperty("--safe-bottom", "env(safe-area-inset-bottom, 0px)");
    root.style.setProperty("--safe-left", "env(safe-area-inset-left, 0px)");
    root.style.setProperty("--safe-right", "env(safe-area-inset-right, 0px)");

    root.classList.toggle("platform-ios", IS_IOS);
    root.classList.toggle("platform-android", IS_ANDROID);

    // Edge-to-edge viewport for notched devices.
    let viewport = document.querySelector<HTMLMetaElement>(
      'meta[name="viewport"]',
    );
    if (!viewport) {
      viewport = document.createElement("meta");
      viewport.name = "viewport";
      document.head.appendChild(viewport);
    }
    viewport.content =
      "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover";

    // Status bar / browser chrome tint.
    let theme = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (!theme) {
      theme = document.createElement("meta");
      theme.name = "theme-color";
      document.head.appendChild(theme);
    }
    theme.content = statusBarColor(false);

    // Prevent iOS rubber-band overscroll on the body.
    document.body.style.overscrollBehaviorY = "none";
    document.body.style.backgroundColor = "#f1f5f9";

    return () => {
      root.classList.remove("platform-ios", "platform-android");
    };
  }, []);
}

export default usePlatformShell;