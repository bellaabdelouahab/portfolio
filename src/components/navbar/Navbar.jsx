import "./wide-screen.css";
import { NavLink } from "react-router-dom";
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

export default function Navbar() {
  const basePath = process.env.VITE_BASE_URL || "";

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

    <NavLink to={`${basePath}${path}`} onClick={(e) => toggleMenu()}>
      <FontAwesomeIcon icon={icon} />
      {label}
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
          {/* <li>
            {getNavLink("/articles", "Articles", faNewspaper)}
          </li> */}
          <li>
            {getNavLink("/reports", "Reports", faFlag)}
          </li>
          <li>
            {getNavLink("/site-map", "Site Map", faSitemap)}
          </li>
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
