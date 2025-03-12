import {
  createHashRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { Suspense, useEffect } from "react";

import { getHighlightedProjects } from "./views/Home";
import { getProjects } from "./views/Projects";
import { getAllCertificates } from "./utils/firebaseQueries";
import { getReports } from "./views/Reports";
import { trackVisitor } from "./utils/visitorTracking";

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
const Root = React.lazy(() => import("./views/Root"));
const Home = React.lazy(() => import("./views/Home"));
const Projects = React.lazy(() => import("./views/Projects"));
const Project = React.lazy(() => import("./views/Project"));
const Certificates = React.lazy(() => import("./views/Certificates"));
const Resume = React.lazy(() => import("./views/Resume"));
const MusicPicks = React.lazy(() => import("./views/music-picks/MusicPicks"));
const Reports = React.lazy(() => import("./views/Reports"));
const Articles = React.lazy(() => import("./views/Articles"));
const Team = React.lazy(() => import("./views/Team"));
const BackOffice = React.lazy(() => import("./views/back-office/BackOffice"));
const NotFound = React.lazy(() => import("./views/NotFound"));
const SiteMap = React.lazy(() => import("./views/SiteMap"));
const SitemapXmlView = React.lazy(() => import("./views/SitemapXmlView"));

const router = createHashRouter(
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
        path="fill-db"
        element={
          <Suspense fallback={fallback}>
            <BackOffice />
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
      <Route
        path="sitemap.xml"
        element={
          <Suspense fallback={fallback}>
            <SitemapXmlView />
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
    </Route>
  )
);

function App() {
  // Track visitor when app loads
  useEffect(() => {
    trackVisitor();
  }, []);

  return <RouterProvider router={router} fallbackElement={fallback} />;
}

export default App;
