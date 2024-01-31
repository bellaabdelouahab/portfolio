import React, { useEffect, useState } from "react";
import ProjectForm from "components/backoffice-component/forms/project-form/ProjectForm";
import SkillForm from "components/backoffice-component/forms/SkillForm";
import ReportForm from "components/backoffice-component/forms/ReportForm";


import "./filldb.css";
import LoginPage from "../../components/backoffice-component/login-page/LoginPage";
import ButtonGroup from "../../components/backoffice-component/button-group/ButtonGroup";
import ArrangeProjects from "components/backoffice-component/forms/arrange-projectsform/ArragneProjects";

const tabs = [
  { id: 0, label: "Project", component: <ProjectForm /> },
  { id: 1, label: "Arrange Projects", component: <ArrangeProjects /> },
  { id: 2, label: "Skill", component: <SkillForm /> },
  { id: 3, label: "Report", component: <ReportForm /> },
  // Add more buttons here if needed
];

export default function FillDB() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[1].id);

  /**
   * useEffect hook to update the CSS variable '--button-index' when the activeTab changes.
   */
  useEffect(() => {
    const buttonsContainer = document.getElementsByClassName("buttons")[0];
    if (buttonsContainer)
      buttonsContainer.style.setProperty(
        "--button-index",
        tabs.findIndex((tab) => tab.id === activeTab).toString()
      );
  }, [activeTab]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      {!authenticated ? (
        <LoginPage setAuthenticated={setAuthenticated} />
      ) : (
        <>
          <ButtonGroup
            tabs={tabs}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
          {tabs.map((tab) => activeTab === tab.id && tab.component)}
        </>
      )}
    </>
  );
}
