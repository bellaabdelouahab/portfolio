import {createBrowserRouter,RouterProvider,Route,createRoutesFromElements} from 'react-router-dom';
import Root from './components/Root';
import Home, {getProjects} from './components/Home';
import Resume from './components/Resume';
import Projects from './components/Projects';
import Project from './components/Project';
import Skills from './components/Skills';
import Reports from './components/Reports';
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root/>}>
            <Route index element={<Home/>} looder={getProjects}/>
            <Route path="/resume" element={<Resume/>}/>
            <Route path="/projects" element={<Projects/>}/>
            <Route path="/projects/1" element={<Project/>}/>
            <Route path="/skills" element={<Skills/>}/>
            <Route path="/Reports" element={<Reports/>}/>

        </Route>
    )
);

function App() { 
return (
    <RouterProvider router={router}/>
)}


export default App;
