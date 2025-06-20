import "./wide-screen.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faListCheck,
  faCertificate,
  faFileAlt,
  faFlaskVial,
  faNewspaper,
  faFlag,
  faSitemap
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const basePath = process.env.VITE_BASE_URL || "";
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication status when component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === "abdobella977@gmail.com") {
        setIsAuthenticated(true);
        setUserEmail(currentUser.email);
      } else {
        // Check localStorage as fallback
        const storedUser = localStorage.getItem("firebaseAuthUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.email === "abdobella977@gmail.com") {
            setIsAuthenticated(true);
            setUserEmail(parsedUser.email);
          } else {
            setIsAuthenticated(false);
            setUserEmail("");
          }
        } else {
          setIsAuthenticated(false);
          setUserEmail("");
        }
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
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
            <br />
            <br />
            <br />
            <br />
          </li>
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
            {getNavLink("/resume", "Resume", faFileAlt)}
          </li>
          <li>
            {getNavLink("/my-team", "Team", faFlaskVial)}
          </li>
          <li>
            {getNavLink("/music", "Music Picks", faFlag)}
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
          href="https://github.com/your-username/your-repo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} size="2x" />
        </a>
        <p>‟Made with hard work and Discipline, not Love ^_~‟</p>
      </span>
    </nav>
  );
}
