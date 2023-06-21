import {createBrowserRouter,RouterProvider,Route,createRoutesFromElements} from 'react-router-dom';
import Root from './layouts/Root';
import Home, {getHighlightedProjects} from './layouts/Home';
import Resume from './layouts/Resume';
import Projects, { getProjects } from "./layouts/Projects";
import Project ,{getProject}from './layouts/Project';
import Skills from './layouts/Skills';
import Reports, { getReports } from "./layouts/Reports";
import Articles from './layouts/Articles';
import FillDB from './layouts/FillDB';
import ExperienceCarousel from './components/ExperienceCarousel';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Home />} loader={getHighlightedProjects} />
      <Route path="resume" element={<Resume />} />
      <Route path="projects" element={<Projects />} loader={getProjects} />
      <Route path="projects/:id" element={<Project />} loader={getProject} />
      <Route path="skills" element={<Skills />} />
      <Route path="Reports" element={<Reports />} loader={getReports} />
      <Route path="articles" element={<Articles />} />
      <Route path="fillDB" element={<FillDB />} />
      <Route path="test" element={<ExperienceCarousel />} />
    </Route>
  )
);

function App() { 
  return (
      <RouterProvider router={router}/>
  )
}

export default App;