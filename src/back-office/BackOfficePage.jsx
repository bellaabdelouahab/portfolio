import { useEffect, useState } from "react";
import ProjectForm from "./forms/project-form/ProjectForm";
import ReportForm from "./forms/reports-form/ReportForm";
import LoginPage from "./login-page/LoginPage";
import ManageProjects from "./forms/manage-projects-form/ManageProjects";
import CertificatesForm from "./forms/certificates-form/CertificatesForm";
import Clients from "./forms/clients-form/Clients";
import VisitorStats from "./visitor-stats/VisitorStats";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import SEO from "../shared/ui/SEO";
import { avatarPlaceholder } from "../shared/lib/placeholders";

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
        /* Two sidebars is the intended layout: the public navbar (a 240px rail on
           the left, see Navbar.css) stays reachable so you can jump to a live page
           while editing, and the admin nav sits on the right. Hence row-reverse —
           it keeps nav-before-content in the DOM for screen readers while placing
           this rail opposite the public one.

           min-h-full, not min-h-screen: this renders inside `.main`, which is
           already the scroll container at viewport-height-minus-navbar. A screen
           unit here would overflow by exactly the navbar's height. */
        <div className="flex min-h-full flex-col bg-page md:flex-row-reverse">
          {/* The rail stretches to full height for the background; the sticky
              behaviour lives on the inner div. Putting `sticky` on the aside
              itself would need `self-start`, which cancels the flex stretch and
              leaves the panel floating short of the fold. */}
          <aside className="shrink-0 border-b border-line bg-surface md:w-64 md:border-b-0 md:border-l">
            <div className="flex flex-col gap-6 p-4 md:sticky md:top-0 md:max-h-screen md:overflow-y-auto">
              {user && (
                <div className="flex items-center gap-3">
                  <img
                    src={user.photoURL || avatarPlaceholder}
                    alt=""
                    className="size-10 shrink-0 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = avatarPlaceholder;
                    }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-strong">
                      {user.displayName}
                    </p>
                    <p className="text-xs text-ink-muted">Signed in</p>
                  </div>
                </div>
              )}

              <nav
                className="flex flex-1 flex-col gap-1"
                aria-label="Admin sections"
              >
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={[
                        "cursor-pointer rounded-md px-3 py-2 text-left text-sm transition-colors duration-150",
                        isActive
                          ? "bg-success/15 font-medium text-success"
                          : "text-ink hover:bg-surface-raised hover:text-ink-strong",
                      ].join(" ")}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              {/* Visually quiet: signing out is not the goal of this screen, and a
                  red block in the corner pulls the eye every time you look here. */}
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer rounded-md border border-line px-3 py-2 text-sm text-ink-muted transition-colors duration-150 hover:border-danger/50 hover:text-danger"
              >
                Log out
              </button>
            </div>
          </aside>

          <div className="min-w-0 flex-1 p-4 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-raised scrollbar-track-surface">
            {tabs.map((tab) => activeTab === tab.id && tab.component)}
          </div>
        </div>
      )}
    </>
  );
}
