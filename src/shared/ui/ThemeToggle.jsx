import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
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

function stored() {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

/** Current theme and a setter; follows the device until the visitor picks one. */
export function useTheme() {
  const [theme, setTheme] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = stored();
    setSaved(!!s);
    const current = s || systemTheme();
    setTheme(current);
    if (!s) apply(current);
  }, []);

  useEffect(() => {
    if (saved || !window.matchMedia) return undefined;
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      const next = systemTheme();
      apply(next);
      setTheme(next);
    };
    mql.addEventListener ? mql.addEventListener("change", onChange) : mql.addListener(onChange);
    return () => (mql.removeEventListener ? mql.removeEventListener("change", onChange) : mql.removeListener(onChange));
  }, [saved]);

  const choose = (next) => {
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* the choice just does not persist */
    }
    apply(next);
    setTheme(next);
    setSaved(true);
  };
  return { theme, choose };
}

/** One tap switches the theme (used in the phone top bar). */
export function ThemeSwitchButton({ className = "" }) {
  const t = useT();
  const { theme, choose } = useTheme();
  const next = theme === "light" ? "dark" : "light";
  return (
    <button
      type="button"
      onClick={() => choose(next)}
      aria-label={next === "light" ? t("nav.themeLight") : t("nav.themeDark")}
      title={next === "light" ? t("nav.themeLight") : t("nav.themeDark")}
      className={`grid size-9 cursor-pointer place-items-center rounded-md border border-line text-base text-ink ${className}`}
    >
      <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
    </button>
  );
}

/**
 * Sun / moon switch. With no saved choice the site follows the visitor's device
 * (and keeps following it when the device switches); picking a theme saves it
 * and it wins from then on. The first paint is set by the inline script in
 * index.html; the active state is read after mount so markup matches.
 */
export default function ThemeToggle({ className = "" }) {
  const t = useT();
  const { theme, choose } = useTheme();

  return (
    <div role="group" aria-label={t("nav.theme")} className={`flex items-center gap-1 ${className}`}>
      {[
        ["light", faSun, t("nav.themeLight")],
        ["dark", faMoon, t("nav.themeDark")],
      ].map(([value, icon, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => choose(value)}
          aria-pressed={theme === value}
          aria-label={label}
          title={label}
          className={[
            "grid size-8 cursor-pointer place-items-center rounded-sm border text-sm",
            theme === value ? "border-success bg-success/15 text-success" : "border-line text-ink hover:border-success/50",
          ].join(" ")}
        >
          <FontAwesomeIcon icon={icon} />
        </button>
      ))}
    </div>
  );
}
