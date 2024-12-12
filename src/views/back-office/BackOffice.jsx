import { useEffect, useState } from "react";
import ProjectForm from "components/backoffice-component/forms/project-form/ProjectForm";
import SkillForm from "components/backoffice-component/forms/SkillForm";
import ReportForm from "components/backoffice-component/forms/ReportForm";
import axiosInstance from "utils/axios";
import "./filldb.css";
import LoginPage from "../../components/backoffice-component/login-page/LoginPage";
import ArrangeProjects from "components/backoffice-component/forms/arrange-projects-form/ArragneProjects";
import CertificatesForm from "components/backoffice-component/forms/certificates-form/CertificatesForm";
import Clients from "components/backoffice-component/forms/clients-form/Clients";

const tabs = [
  { id: 0, label: "Project", component: <ProjectForm /> },
  { id: 1, label: "Arrange Projects", component: <ArrangeProjects /> },
  { id: 2, label: "Certificate", component: <CertificatesForm /> },
  { id: 3, label: "Skill", component: <SkillForm /> },
  { id: 4, label: "Report", component: <ReportForm /> },
  { id: 5, label: "Clients", component: <Clients /> },
];

export default function FillDB() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    axiosInstance
      .get("users/is-logged-in", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((res) => {
        if (res.status === "success") {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setAuthenticated(false);
      });
  }, []);

  return (
    <>
      {!authenticated ? (
        <LoginPage setAuthenticated={setAuthenticated} />
      ) : (
        <div className="filldb-container">
          <div className="buttons">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`filldb-nav__btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {tabs.map((tab) => activeTab === tab.id && tab.component)}
          </div>
        </div>
      )}
    </>
  );
}
