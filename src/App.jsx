import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { Suspense } from "react";

import { getHighlightedProjects } from "./views/Home";
import { getProjects } from "./views/Projects";
import { getAllCertificates } from "./utils/firebaseQueries";
import { getReports } from "./views/Reports";

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
const Skills = React.lazy(() => import("./views/Skills"));
const Reports = React.lazy(() => import("./views/Reports"));
const Articles = React.lazy(() => import("./views/Articles"));
const Team = React.lazy(()=> import("./views/Team"));
const BackOffice = React.lazy(() => import("./views/back-office/BackOffice"));
const NotFound = React.lazy(() => import("./views/NotFound"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/portfolio"
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
        path="skills"
        element={
          <Suspense fallback={fallback}>
            <Skills />
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
        path="fillDB"
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
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} fallbackElement={fallback} />;
}

export default App;
