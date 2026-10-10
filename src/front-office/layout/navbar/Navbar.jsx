import "./Navbar.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faListCheck,
  faCertificate,
  faUsers,
  faEnvelope,
  faChartLine,
  faCode
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedinIn, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useLang, useLocalePath, stripLang, withLang } from "../../../shared/i18n/i18n";
import { useT } from "../../../shared/i18n/strings";
import { useContent } from "../../../shared/i18n/useContent";
import ThemeToggle, { ThemeSwitchButton } from "../../../shared/ui/ThemeToggle";
import { GITHUB_URL, LINKEDIN_URL, getWhatsAppLink } from "../../../shared/lib/contactConfig";

// Keyed by the service's own id, so a new service just needs an entry
// here rather than a matching if/else chain in the render below.
const SERVICE_ICONS = {
  data: faChartLine,
  web: faCode,
};

export default function Navbar() {
  const basePath = process.env.VITE_BASE_URL || "";
  const navigate = useNavigate();
  const t = useT();
  const lang = useLang();
  const lp = useLocalePath();
  const { search, pathname } = useLocation();
  const { services } = useContent();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // The back office stores the signed-in owner in localStorage. Reading that is
  // enough to decide whether to show the owner-only Site Map link, and it keeps
  // the whole Firebase SDK out of every public page.
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("firebaseAuthUser") || "null");
      if (stored?.email === "abdobella977@gmail.com") {
        setIsAuthenticated(true);
        setUserEmail(stored.email);
      }
    } catch {
      /* private mode or corrupt value: stay signed out */
    }
  }, []);

  // Add keyboard shortcut for admin panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl + A shortcut
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault(); // Prevent default browser behavior (select all)
        navigate(`${basePath}/fill-db`);
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, basePath]);

  const toggleMenu = () => {
    const el = document.getElementById("hamburger-menu");
    if (el.classList.contains("hidden")) {
      document.querySelectorAll(".inner-menu").forEach((item) => {
        item.classList.add("hidden");
        item.setAttribute("aria-hidden", "true");
      });
      el.classList.remove("hidden");
      el.setAttribute("aria-hidden", "false");
    } else {
      el.classList.add("hidden");
      el.setAttribute("aria-hidden", "true");
    }
    !el.classList.contains("hidden") && el.focus();
  };

  const getNavLink = (path, label, icon) => (
    <NavLink to={`${basePath}${lp(path)}`} end={path === "/"} onClick={toggleMenu}>
      <FontAwesomeIcon icon={icon} />
      {label}
    </NavLink>
  );

  return (
    <nav className="navbar at-top" id="navbar" role="navigation">
      <NavLink className="navbar__logolink" to={lp("/")} aria-label={t("nav.home")} />
      {/* Phones only (hidden on desktop by Navbar.css): one tap switches the
          language or the theme, so neither is buried in the menu. */}
      <div className="navbar__quick">
        <Link
          to={`${withLang(lang === "fr" ? "en" : "fr", stripLang(pathname))}${search}`}
          hrefLang={lang === "fr" ? "en" : "fr"}
          lang={lang === "fr" ? "en" : "fr"}
          aria-label={lang === "fr" ? "English" : "Français"}
          className="grid h-9 place-items-center rounded-md border border-line px-2.5 text-sm font-bold tracking-[1px]! text-ink!"
        >
          {lang.toUpperCase()}
        </Link>
        <ThemeSwitchButton />
      </div>
      <div className="navbar__menu">
        <button
          htmlFor="f-toggle"
          tabIndex="0"
          id="hamburger"
          className="hamburger"
          aria-label={t("nav.toggle")}
          onClick={(e) => toggleMenu()}
        >
          <span></span>
        </button>
        <ul
          className="navbar__menu__list menu hidden"
          id="hamburger-menu"
          role="menu"
          aria-describedby="hamburger"
          tabIndex="0"
          aria-hidden="true"
        >
          <br />
          <li>
            {getNavLink("/", t("nav.home"), faHome)}
          </li>
          <br />
          <hr />
          <br />
          {services.map((service) => (
            <li key={service.id}>
              {getNavLink(
                `/services/${service.id}`,
                service.title,
                SERVICE_ICONS[service.id] ?? faListCheck
              )}
            </li>
          ))}
          <br />
          <hr />
          <br />
          <li>
            {getNavLink("/projects", t("nav.projects"), faListCheck)}
          </li>
          <li>
            {getNavLink("/certificates", t("nav.certificates"), faCertificate)}
          </li>
          <br />
          <hr />
          <br />
          <li>
            {getNavLink("/my-team", t("nav.team"), faUsers)}
          </li>
          <li>
            {getNavLink("/contact", t("nav.contact"), faEnvelope)}
          </li>
          <br />
          <hr />
          <br />
          <li>
            <div className="navbar__social flex w-full items-center justify-center gap-5 py-1">
              {[
                [GITHUB_URL, faGithub, "GitHub"],
                [LINKEDIN_URL, faLinkedinIn, "LinkedIn"],
                [getWhatsAppLink(), faWhatsapp, "WhatsApp"],
              ].map(([href, icon, label]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="grid size-9 place-items-center rounded-md text-lg text-ink! hover:text-success!"
                >
                  <FontAwesomeIcon icon={icon} />
                </a>
              ))}
            </div>
          </li>
          <br />
          <hr />
        </ul>
      </div>
      <span className="navbar__footer">
        {/* Language and theme switches share one row. */}
        <div className="mb-1 flex items-center justify-center gap-3">
          <div role="group" aria-label={t("nav.language")} className="flex items-center gap-1 text-sm font-bold">
            {["en", "fr"].map((code) => (
              <Link
                key={code}
                to={`${withLang(code, stripLang(pathname))}${search}`}
                hrefLang={code}
                lang={code}
                aria-current={lang === code ? "true" : undefined}
                className={[
                  "grid h-8 place-items-center rounded-sm border px-2 tracking-[1px]!",
                  lang === code ? "border-success bg-success/15 text-success!" : "border-line text-ink! hover:border-success/50",
                ].join(" ")}
              >
                {code.toUpperCase()}
              </Link>
            ))}
          </div>
          <ThemeToggle />
        </div>
        <p>{t("nav.status")}</p>
      </span>
    </nav>
  );
}
