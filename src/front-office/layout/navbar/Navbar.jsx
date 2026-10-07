import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faListCheck,
  faCertificate,
  faUsers,
  faNewspaper,
  faFlag,
  faSitemap,
  faChartLine,
  faCode
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { servicesContent } from "../../home/homeContent";

// Keyed by servicesContent's own id, so a new service just needs an entry
// here rather than a matching if/else chain in the render below.
const SERVICE_ICONS = {
  data: faChartLine,
  web: faCode,
};

export default function Navbar() {
  const basePath = process.env.VITE_BASE_URL || "";
  const navigate = useNavigate();
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

  const getNavLink = (path, label, icon, isBeta = false) => (
    <NavLink to={`${basePath}${path}`} onClick={(e) => { if (!isBeta) toggleMenu(); }} style={{ pointerEvents: isBeta ? 'none' : 'auto' }}>
      <FontAwesomeIcon icon={icon} />
      {label}
      {isBeta && <span className="beta-badge" style={{ marginLeft: '5px', fontSize: '0.6em', padding: '2px 4px', background: '#ffcc00', color: '#333', borderRadius: '3px', verticalAlign: 'center' }}>BETA</span>}
    </NavLink>
  );

  return (
    <nav className="navbar at-top" id="navbar" role="navigation">
      <NavLink className="navbar__logolink" to={`/`} />
      <div className="navbar__menu">
        <button
          htmlFor="f-toggle"
          tabIndex="0"
          id="hamburger"
          className="hamburger"
          aria-label="Toggle navigation"
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
          <li>
            {getNavLink("/", "Home", faHome)}
          </li>
          <br />
          <hr />
          <br />
          {servicesContent.map((service) => (
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
            {getNavLink("/projects", "All Projects", faListCheck)}
          </li>
          <li>
            {getNavLink("/certificates", "Certificates", faCertificate)}
          </li>
          <br />
          <hr />
          <br />
          <li>
            {getNavLink("/my-team", "Team", faUsers)}
          </li>
          <br />
          <hr />
          <br />
          <li>
            {getNavLink("/reports", "Reports", faFlag, true)}
          </li>
          <li>
            {getNavLink("/articles", "Articles", faNewspaper, true)}
          </li>
          {isAuthenticated && userEmail === "abdobella977@gmail.com" && (
            <li>
              {getNavLink("/site-map", "Site Map", faSitemap)}
            </li>
          )}
          <br />
          <hr />
        </ul>
      </div>
      <span className="navbar__footer">
        <a
          href="https://github.com/bellaabdelouahab"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
        >
          <FontAwesomeIcon icon={faGithub} size="2x" />
        </a>
        <p>Registered auto-entrepreneur. Agadir, Morocco.</p>
      </span>
    </nav>
  );
}
