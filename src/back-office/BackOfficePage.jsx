import { useEffect, useState } from "react";
import ProjectForm from "./forms/project-form/ProjectForm";
import ReportForm from "./forms/reports-form/ReportForm";
import "./BackOfficePage.css";
import LoginPage from "./login-page/LoginPage";
import ManageProjects from "./forms/manage-projects-form/ManageProjects";
import CertificatesForm from "./forms/certificates-form/CertificatesForm";
import Clients from "./forms/clients-form/Clients";
import VisitorStats from "./visitor-stats/VisitorStats";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import SEO from "../components/common/SEO";

export default function FillDB() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // ✅ inside the component

  const handleEditProject = (project) => {
    setEditingProject(project);
    setActiveTab(0);
  };

  const tabs = [ // ✅ also inside the component now, since it uses editingProject
    { id: 0, label: "Project", component: <ProjectForm initialProject={editingProject} onDoneEditing={() => setEditingProject(null)} /> },
    { id: 1, label: "Manage Projects", component: <ManageProjects onEditProject={handleEditProject} /> },
    { id: 2, label: "Certificate", component: <CertificatesForm /> },
    { id: 3, label: "Report", component: <ReportForm /> },
    { id: 4, label: "Clients", component: <Clients /> },
    { id: 5, label: "Visitor Stats", component: <VisitorStats /> },
  ]

  // Handle authentication state
  useEffect(() => {
    const auth = getAuth();
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in - verify it's the right user
        if (currentUser.email === "abdobella977@gmail.com") {
          setUser(currentUser);
          setAuthenticated(true);
          
          // Save user info to localStorage as a backup
          localStorage.setItem("firebaseAuthUser", JSON.stringify({
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL
          }));
        } else {
          // Wrong user, sign them out
          signOut(auth).then(() => {
            setUser(null);
            setAuthenticated(false);
            localStorage.removeItem("firebaseAuthUser");
          });
        }
      } else {
        // User is signed out - check localStorage as fallback
        setUser(null);
        const storedUser = localStorage.getItem("firebaseAuthUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.email === "abdobella977@gmail.com") {
            setAuthenticated(true);
            setUser(parsedUser);
          } else {
            localStorage.removeItem("firebaseAuthUser");
            setAuthenticated(false);
          }
        } else {
          setAuthenticated(false);
        }
      }
      setAuthChecked(true);
    });
    
    // Clean up subscription
    return () => unsubscribe();
  }, []);

  // Handle tab changes
  useEffect(() => {
    // Reset any form state when changing tabs
    if (authenticated) {
      console.log(`Tab changed to: ${tabs[activeTab]?.label}`);
    }
  }, [activeTab, authenticated]);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.removeItem("firebaseAuthUser");
      localStorage.removeItem("githubToken");
      setAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Show loading state while checking auth
  if (!authChecked) {
    return <div className="loading-auth">Checking authentication...</div>;
  }

  return (
    <>
      <SEO noindex />
      {!authenticated ? (
        <LoginPage setAuthenticated={setAuthenticated} />
      ) : (
        <div className="filldb-container">
          <div className="sidebar">
            {user && (
              <div className="user-profile">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="user-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/30";
                  }}
                />
                <span className="user-name">{user.displayName}</span>
              </div>
            )}

            <div className="nav-buttons">
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

            <button
              className="filldb-nav__btn logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          <div className="main-content" style={{  overflowY: "hidden" }}>
            {tabs.map((tab) => activeTab === tab.id && tab.component)}
          </div>
        </div>
      )}
    </>
  );
}
