import { useEffect, useState } from "react";
import { useT } from "../i18n/strings";

const KEY = "theme";
const THEME_COLOR = { light: "#ffffff", dark: "#171717" };

const systemTheme = () =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

function apply(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLOR[theme]);
}

function storedMode() {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "auto";
  } catch {
    return "auto";
  }
}

/**
 * Auto / Light / Dark. "Auto" (the default) follows the visitor's device and
 * keeps following it if the device switches (sunset, system setting); Light and
 * Dark are an explicit choice that is remembered. The first paint is set by the
 * inline script in index.html; the mode is read after mount so server and
 * client markup match.
 */
export default function ThemeToggle({ className = "" }) {
  const t = useT();
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const initial = storedMode();
    setMode(initial);
    if (initial === "auto") apply(systemTheme());
  }, []);

  // While in Auto, follow the device when it changes.
  useEffect(() => {
    if (mode !== "auto" || !window.matchMedia) return undefined;
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => apply(systemTheme());
    mql.addEventListener ? mql.addEventListener("change", onChange) : mql.addListener(onChange);
    return () => (mql.removeEventListener ? mql.removeEventListener("change", onChange) : mql.removeListener(onChange));
  }, [mode]);

  const choose = (next) => {
    try {
      if (next === "auto") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, next);
    } catch {
      /* the choice just does not persist */
    }
    apply(next === "auto" ? systemTheme() : next);
    setMode(next);
  };

  return (
    <div role="group" aria-label={t("nav.theme")} className={`flex items-center justify-center gap-1 text-sm font-bold ${className}`}>
      {[
        ["auto", t("nav.themeAuto")],
        ["light", t("nav.themeLight")],
        ["dark", t("nav.themeDark")],
      ].map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => choose(value)}
          aria-pressed={mode === value}
          className={[
            "cursor-pointer rounded-sm border px-2 py-1 tracking-[0.5px]!",
            mode === value ? "border-success bg-success/15 text-success!" : "border-line text-ink! hover:border-success/50",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
