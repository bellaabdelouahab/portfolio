import { useCallback, useEffect, useMemo, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import SEO from "../shared/ui/SEO";
import { avatarPlaceholder } from "../shared/lib/placeholders";
import { ToastProvider } from "./ui";
import LoginPage from "./login-page/LoginPage";
import OverviewPanel from "./overview/OverviewPanel";
import ProjectForm from "./forms/project-form/ProjectForm";
import ManageProjects from "./forms/manage-projects-form/ManageProjects";
import CertificatesForm from "./forms/certificates-form/CertificatesForm";
import Clients from "./forms/clients-form/Clients";
import StoragePanel from "./storage/StoragePanel";
import AnalyticsPanel from "./analytics/AnalyticsPanel";

const OWNER_EMAIL = "abdobella977@gmail.com";
const STORED_USER_KEY = "firebaseAuthUser";

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORED_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const NAV = [
  {
    group: "Content",
    items: [
      { id: "overview", label: "Overview" },
      { id: "project", label: "Add project" },
      { id: "projects", label: "Projects" },
      { id: "certificates", label: "Certificates" },
      { id: "testimonials", label: "Testimonials" },
    ],
  },
  {
    group: "Site",
    items: [
      { id: "storage", label: "Storage and backup" },
      { id: "analytics", label: "Analytics" },
    ],
  },
];
const TAB_IDS = NAV.flatMap((g) => g.items.map((i) => i.id));

export default function FillDB() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProject, setEditingProject] = useState(null);
  const [resumeDraftId, setResumeDraftId] = useState(null);

  // The back office needs the full width: hide the public navbar rail while it is open.
  useEffect(() => {
    document.body.classList.add("admin-mode");
    return () => document.body.classList.remove("admin-mode");
  }, []);

  // The active tab lives in the URL hash so a reload (or a link) lands on the same screen.
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#", "");
      if (TAB_IDS.includes(id)) setActiveTab(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const goTo = useCallback((id) => {
    setActiveTab(id);
    try {
      window.history.replaceState(null, "", `#${id}`);
    } catch {
      /* hash is a convenience only */
    }
  }, []);

  const handleEditProject = useCallback(
    (project) => {
      setResumeDraftId(null);
      setEditingProject(project);
      goTo("project");
    },
    [goTo]
  );

  const handleResumeDraft = useCallback(
    (draftId) => {
      setEditingProject(null);
      setResumeDraftId(draftId);
      goTo("project");
    },
    [goTo]
  );

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (currentUser.email === OWNER_EMAIL) {
          setUser(currentUser);
          setAuthenticated(true);
          try {
            localStorage.setItem(
              STORED_USER_KEY,
              JSON.stringify({
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                email: currentUser.email,
                photoURL: currentUser.photoURL,
              })
            );
          } catch {
            /* ignore */
          }
        } else {
          signOut(auth).finally(() => {
            setUser(null);
            setAuthenticated(false);
            try {
              localStorage.removeItem(STORED_USER_KEY);
            } catch {
              /* ignore */
            }
          });
        }
      } else {
        const stored = readStoredUser();
        if (stored?.email === OWNER_EMAIL) {
          setUser(stored);
          setAuthenticated(true);
        } else {
          setUser(null);
          setAuthenticated(false);
        }
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
    } catch (error) {
      console.error("Error signing out: ", error);
    }
    try {
      localStorage.removeItem(STORED_USER_KEY);
    } catch {
      /* ignore */
    }
    setAuthenticated(false);
    setUser(null);
  };

  const screen = useMemo(() => {
    switch (activeTab) {
      case "project":
        return (
          <ProjectForm
            key={resumeDraftId || editingProject?._id || "new"}
            initialProject={editingProject}
            resumeDraftId={resumeDraftId}
            onDoneEditing={() => {
              setEditingProject(null);
              setResumeDraftId(null);
              goTo("projects");
            }}
          />
        );
      case "projects":
        return <ManageProjects onEditProject={handleEditProject} onResumeDraft={handleResumeDraft} />;
      case "certificates":
        return <CertificatesForm />;
      case "testimonials":
        return <Clients />;
      case "storage":
        return <StoragePanel />;
      case "analytics":
        return <AnalyticsPanel />;
      default:
        return <OverviewPanel onNavigate={(id) => { if (id === "project") { setEditingProject(null); setResumeDraftId(null); } goTo(id); }} />;
    }
  }, [activeTab, editingProject, resumeDraftId, goTo, handleEditProject, handleResumeDraft]);

  if (!authChecked) {
    return <div className="grid min-h-[50vh] place-items-center text-sm text-ink-muted">Checking authentication...</div>;
  }

  return (
    <>
      <SEO noindex />
      {!authenticated ? (
        <LoginPage setAuthenticated={setAuthenticated} />
      ) : (
        <ToastProvider>
          {/* Two sidebars on purpose: the public navbar (left) stays reachable so you
              can jump to a live page while editing, and the admin navigation sits
              on the right. row-reverse keeps the nav before the content in the DOM.
              min-h-full, not min-h-screen: this renders inside `.main`, which is
              already the scroll container. */}
          <div className="flex min-h-full flex-col bg-page md:flex-row-reverse">
            <aside className="shrink-0 border-b border-line bg-surface md:w-56 md:border-b-0 md:border-l">
              <div className="flex flex-col gap-5 p-4 md:sticky md:top-0 md:max-h-screen md:overflow-y-auto">
                {user && (
                  <div className="flex items-center gap-3">
                    <img
                      src={user.photoURL || avatarPlaceholder}
                      alt=""
                      className="size-9 shrink-0 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = avatarPlaceholder;
                      }}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-strong">{user.displayName || "Owner"}</p>
                      <p className="text-xs text-ink-muted">Back office</p>
                    </div>
                  </div>
                )}

                <a href="/" className="rounded-md border border-line px-3 py-2 text-center text-xs text-ink! hover:border-success/50 hover:text-ink-strong!">
                  View site
                </a>

                <nav className="flex flex-1 flex-col gap-4" aria-label="Back office sections">
                  {NAV.map((group) => (
                    <div key={group.group}>
                      <p className="mb-1 px-3 text-[0.68rem] font-semibold uppercase tracking-wider! text-ink-muted">{group.group}</p>
                      <div className="flex flex-col gap-0.5">
                        {group.items.map((item) => {
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                if (item.id === "project") {
                                  setEditingProject(null);
                                  setResumeDraftId(null);
                                }
                                goTo(item.id);
                              }}
                              aria-current={isActive ? "page" : undefined}
                              className={[
                                "cursor-pointer rounded-md px-3 py-2 text-left text-sm tracking-normal! transition-colors duration-150",
                                isActive
                                  ? "bg-success/15 font-medium text-success"
                                  : "text-ink hover:bg-surface-raised hover:text-ink-strong",
                              ].join(" ")}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="cursor-pointer rounded-md border border-line px-3 py-2 text-sm text-ink-muted transition-colors duration-150 hover:border-danger/50 hover:text-danger"
                >
                  Log out
                </button>
              </div>
            </aside>

            <div className="min-w-0 flex-1 overflow-y-auto p-4 md:p-6">{screen}</div>
          </div>
        </ToastProvider>
      )}
    </>
  );
}
