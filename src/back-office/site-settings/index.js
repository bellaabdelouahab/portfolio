import SiteTextPanel from "./SiteTextPanel";
import ContactPanel from "./ContactPanel";
import SeoPanel from "./SeoPanel";
import HomeContentPanel from "./HomeContentPanel";

/** Navigation entries for the site settings screens, wired in BackOfficePage. */
export const SITE_SETTINGS_TABS = [
  { id: "site-text", label: "Site text", Component: SiteTextPanel },
  { id: "contact", label: "Contact", Component: ContactPanel },
  { id: "seo", label: "SEO", Component: SeoPanel },
  { id: "home-content", label: "Home content", Component: HomeContentPanel },
];

export { SiteTextPanel, ContactPanel, SeoPanel, HomeContentPanel };
