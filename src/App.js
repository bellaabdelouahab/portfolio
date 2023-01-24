import {createBrowserRouter,RouterProvider,Route,createRoutesFromElements} from 'react-router-dom';
import Root from './layouts/Root';
import Home, {getProjects} from './layouts/Home';
import Resume from './layouts/Resume';
import Projects from './layouts/Projects';
import Project from './layouts/Project';
import Skills from './layouts/Skills';
import Reports from './layouts/Reports';
import Articles from './layouts/Articles';
import FillDB from './layouts/FillDB';
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Root/>}>
            <Route index element={<Home/>} looder={getProjects}/>
            <Route path="resume" element={<Resume/>}/>
            <Route path="projects" element={<Projects/>}/>
            <Route path="projects/1" element={<Project/>}/>
            <Route path="skills" element={<Skills/>}/>
            <Route path="Reports" element={<Reports/>}/>
            <Route path="articles" element={<Articles/>}/>
            <Route path="fillDB" element={<FillDB/>}/>
        </Route>
    )
);

function App() { 
return (
    <RouterProvider router={router}/>
)}


export default App;
