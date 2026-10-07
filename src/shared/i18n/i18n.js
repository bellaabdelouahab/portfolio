import { useLocation } from "react-router-dom";

export const LANGS = ["en", "fr"];

/** `/fr` or `/fr/...` is French, everything else English. Works on server and client. */
export const langOf = (pathname = "/") => (/^\/fr(\/|$)/.test(pathname) ? "fr" : "en");

/** Removes the language prefix: `/fr/projects` -> `/projects`, `/fr` -> `/`. */
export const stripLang = (pathname = "/") => pathname.replace(/^\/fr(?=\/|$)/, "") || "/";

/** Adds the prefix for a language: ("fr", "/projects") -> `/fr/projects`. */
export const withLang = (lang, path = "/") => {
  const clean = stripLang(path);
  if (lang !== "fr") return clean;
  return clean === "/" ? "/fr" : `/fr${clean}`;
};

export function useLang() {
  return langOf(useLocation().pathname);
}

/** Returns `lp(path)`, which prefixes a site path with the current language. */
export function useLocalePath() {
  const lang = useLang();
  return (path) => withLang(lang, path);
}

export const dateLocale = (lang) => (lang === "fr" ? "fr-FR" : "en-GB");
