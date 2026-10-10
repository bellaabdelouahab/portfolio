import { useEffect, useState } from "react";
import { useT } from "../i18n/strings";

const read = () => (typeof document !== "undefined" ? document.documentElement.getAttribute("data-theme") : null);

/**
 * Light / dark switch. The initial theme is set before paint by the inline
 * script in index.html; this component only reflects and changes it. The active
 * state is read after mount so server and client markup match.
 */
export default function ThemeToggle({ className = "" }) {
  const t = useT();
  const [theme, setTheme] = useState(null);
  useEffect(() => setTheme(read() === "light" ? "light" : "dark"), []);

  const choose = (next) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* the choice just does not persist */
    }
    setTheme(next);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "light" ? "#ffffff" : "#171717");
  };

  return (
    <div role="group" aria-label={t("nav.theme")} className={`flex items-center justify-center gap-1 text-sm font-bold ${className}`}>
      {[
        ["light", t("nav.themeLight")],
        ["dark", t("nav.themeDark")],
      ].map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => choose(value)}
          aria-pressed={theme === value}
          className={[
            "cursor-pointer rounded-sm border px-2.5 py-1 tracking-[1px]!",
            theme === value ? "border-success bg-success/15 text-success!" : "border-line text-ink! hover:border-success/50",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
