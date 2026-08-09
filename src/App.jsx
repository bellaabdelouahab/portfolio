import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { Suspense, useEffect } from "react";

import { getHighlightedProjects } from "./front-office/home/HomePage";
import { getProjects } from "./front-office/projects/ProjectListPage";
import { getAllCertificates } from "./shared/lib/firebaseQueries";
import { getReports } from "./front-office/reports/ReportsPage";
import { trackVisitor } from "./shared/lib/visitorTracking";

// Define a fallback UI for loading state
const fallback = (
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      color: "white",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: "url('preloader.png')",
      backgroundSize: "auto 50%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    }}
    className="preloader"
  >
  </div>
);

// Import components lazily
const Root = React.lazy(() => import("./front-office/layout/Root"));
const Home = React.lazy(() => import("./front-office/home/HomePage"));
const Projects = React.lazy(() => import("./front-office/projects/ProjectListPage"));
const Project = React.lazy(() => import("./front-office/projects/ProjectDetailPage"));
const Certificates = React.lazy(() => import("./front-office/certificates/CertificatesPage"));
const Resume = React.lazy(() => import("./front-office/resume/ResumePage"));
const MusicPicks = React.lazy(() => import("./front-office/music/MusicPage"));
const Reports = React.lazy(() => import("./front-office/reports/ReportsPage"));
const Articles = React.lazy(() => import("./front-office/articles/ArticlesPage"));
const Team = React.lazy(() => import("./front-office/team/TeamPage"));
const BackOffice = React.lazy(() => import("./back-office/BackOfficePage"));
const NotFound = React.lazy(() => import("./front-office/not-found/NotFoundPage"));
const SiteMap = React.lazy(() => import("./front-office/sitemap/SiteMapPage"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <Suspense fallback={fallback}>
          <Root />
        </Suspense>
      }
    >
      <Route
        index
        element={
          <Suspense fallback={fallback}>
            <Home />
          </Suspense>
        }
        loader={getHighlightedProjects}
      />
      <Route
        path="projects"
        element={
          <Suspense fallback={fallback}>
            <Projects />
          </Suspense>
        }
        loader={getProjects}
      />
      <Route
        path="projects/:title"
        element={
          <Suspense fallback={fallback}>
            <Project />
          </Suspense>
        }
      />
      <Route
        path="certificates"
        element={
          <Suspense fallback={fallback}>
            <Certificates />
          </Suspense>
        }
        loader={getAllCertificates}
      />
      <Route
        path="resume"
        element={
          <Suspense fallback={fallback}>
            <Resume />
          </Suspense>
        }
      />
      <Route
        path="my-team"
        element={
          <Suspense fallback={fallback}>
            <Team />
          </Suspense>
        }
      />
      <Route
        path="music"
        element={
          <Suspense fallback={fallback}>
            <MusicPicks />
          </Suspense>
        }
      />
      <Route
        path="reports"
        element={
          <Suspense fallback={fallback}>
            <Reports />
          </Suspense>
        }
        loader={getReports}
      />
      <Route
        path="articles"
        element={
          <Suspense fallback={fallback}>
            <Articles />
          </Suspense>
        }
      />
      <Route
        path="site-map"
        element={
          <Suspense fallback={fallback}>
            <SiteMap />
          </Suspense>
        }
      />
      {/* The admin area stays INSIDE the site layout deliberately: the front-office
          navbar is how you jump back to a public page while editing, and it owns the
          Ctrl+A shortcut that opens this route in the first place. Two navs is the
          intended shape here, not an accident — see BackOfficePage's own sidebar. */}
      <Route
        path="fill-db"
        element={
          <Suspense fallback={fallback}>
            <BackOffice />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <Suspense fallback={fallback}>
            <NotFound />
          </Suspense>
        }
      />
    </Route>,
  ),
);

function App() {
  // Track visitor when app loads. Skipped during the build-time prerender pass
  // (scripts/prerender.js), which would otherwise log a fake visit per route.
  useEffect(() => {
    if (typeof window !== "undefined" && window.__PRERENDER__) return;
    trackVisitor();
  }, []);

  return <RouterProvider router={router} fallbackElement={fallback} />;
}

export default App;
