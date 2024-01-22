import {createBrowserRouter,RouterProvider,Route,createRoutesFromElements} from 'react-router-dom';
import Root from './views/Root';
import Home, {getHighlightedProjects} from './views/Home';
import Resume from './views/Resume';
import Projects, { getProjects } from "./views/Projects";
import Project ,{getProject}from './views/Project';
import Skills from './views/Skills';
import Reports, { getReports } from "./views/Reports";
import Articles from './views/Articles';
import FillDB from './views/FillDB';

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
    </Route>
  )
);

function App() { 
  return (
      <RouterProvider router={router}/>
  )
}

export default App;