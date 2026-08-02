const fallbackSiteUrl = "https://abdelouahab.xyz";

export const siteUrl =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SITE_URL) ||
  fallbackSiteUrl;

export const normalizeSiteUrl = (value = siteUrl) =>
  (value || fallbackSiteUrl).replace(/\/+$/, "");

export const getAbsoluteUrl = (path = "/") => {
  const normalizedBaseUrl = normalizeSiteUrl(siteUrl);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBaseUrl}${normalizedPath}`;
};
