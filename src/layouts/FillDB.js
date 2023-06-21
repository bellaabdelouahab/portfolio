import React, { useState } from 'react';
import axios from 'axios';
import { ProjectForm , SkillForm , ReportForm } from '../components/ContentForms';

import '../assets/css/filldb.css'

export default function FillDB() {
    const [authenticated, setAuthenticated] = useState(true);
    const [content, setContent] = useState("project");
    
    return (
      <>
        {!authenticated ? (
          <div className="filldb-container">
            <form
              className="login-form"
              onSubmit={(e) => {
                e.preventDefault();
                const data = {};
                data["email"] = e.target.email.value;
                data["password"] = e.target.password.value;
                axios
                  .post("http://localhost:5000/api/users/login", data)
                  .then((res) => {
                    console.log(res);
                    // add cookie
                    document.cookie = `jwt=${res.data.token}`;
                    setAuthenticated(true);
                  })
                  .catch((err) => {
                    setAuthenticated(false);
                  });
              }}
            >
              <h1 className="login-title">Login</h1>
              <input
                className="login-input"
                type="text"
                name="email"
                placeholder="email"
              />
              <input
                className="login-input"
                type="password"
                name="password"
                placeholder="password"
              />
              <input type="submit" className="login-submit" value="Submit" />
            </form>
          </div>
        ) : (
          <>
            {/* 3 buttons project skill report */}
            <div className="buttons">
              <button
                className="filldb-nav__btn active"
                onClick={(e) => {
                    setContent("project");
                    e.target.classList.add("active");
                    e.target.parentElement.children[1].classList.remove("active");
                    e.target.parentElement.children[2].classList.remove("active");

                }}
                data-content="project"
                value={content}
              >
                Project
              </button>

              <button
                className="filldb-nav__btn"
                onClick={(e) =>{
                    setContent("skill");
                    e.target.classList.add("active");
                    e.target.parentElement.children[0].classList.remove("active");
                    e.target.parentElement.children[2].classList.remove("active");

                }}
                data-content="skill"
                value={content}
              >
                Skill
              </button>

              <button
                className="filldb-nav__btn"
                onClick={(e) => {
                    setContent("report");
                    e.target.classList.add("active");
                    e.target.parentElement.children[0].classList.remove("active");
                    e.target.parentElement.children[1].classList.remove("active");
                }}
                data-content="report"
                value={content}
              >
                Report
              </button>
            </div>
            {content === "project" ? <ProjectForm /> : null}
            {content === "skill" ? <SkillForm /> : null}
            {content === "report" ? <ReportForm /> : null}
          </>
        )}
      </>
    );
}




// let thisYearGoals = ["Learn Kubernetes", "Learn Jhipster","Learn System Design"];
// thisYearGoals.start()
