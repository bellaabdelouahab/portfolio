import React from "react";
import { useEffect } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Navbar() {
  const toggleMenu = (id) => {
    console.log("hey");
    const el = document.getElementById(id);
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

  return (
    <nav className="navbar at-top" id="navbar" role="navigation">
      <NavLink className="navbar__logolink" to="/"></NavLink>
      <div className="navbar__menu">
        <button
          htmlFor="f-toggle"
          tabIndex="0"
          id="hamburger"
          className="hamburger"
          aria-label="Toggle navigation"
          onClick={(e) => toggleMenu("hamburger-menu")}
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
            <NavLink to="/" target="">
              <FontAwesomeIcon icon={faHome} />
              Home
            </NavLink>
            <br />
            <br />
            <br />
            <br />
          </li>
          <hr />
          <br />
          <li>
            <NavLink to="/projects" target="">
              <FontAwesomeIcon icon={faListCheck} />
              All Projects
            </NavLink>
          </li>
          <li>
            <NavLink to="/certificates">
              <FontAwesomeIcon icon={faCertificate} />
              Certificates
            </NavLink>
          </li>
          <br />
          <hr />
          <br />
          <li>
            <NavLink to="/resume" target="">
              <FontAwesomeIcon icon={faFileAlt} />
              Resume
            </NavLink>
          </li>
          <li>
            <NavLink to="/skills">
              <FontAwesomeIcon icon={faFlaskVial} />
              Skills
            </NavLink>
          </li>
          <li>
            <NavLink to="/music">
              <FontAwesomeIcon icon={faFlag} />
              Music Picks
            </NavLink>
          </li>
          <br />
          <hr />
          <br />
          <li>
            <NavLink to="/articles">
              <FontAwesomeIcon icon={faNewspaper} />
              Articles
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports">
              <FontAwesomeIcon icon={faFlag} />
              Reports
            </NavLink>
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
