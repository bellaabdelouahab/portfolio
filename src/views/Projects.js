import axios from 'axios';
import { useNavigate, useLoaderData } from 'react-router-dom'
import { useEffect,useState } from 'react';
import '../assets/css/projects.css'


export default function Projects() {
    const projects = useLoaderData();
    const Navigate = useNavigate();
    const [filter, setFilter] = useState('All');

    // handleFilterShow
    const handleFilterShow = (e) => {
        const filterElement = document.querySelector('.filter');
        const filters = document.querySelector('.filters');
        if (!filters.classList.contains('hidden')) {
            filters.classList.add('hidden');
            filterElement.innerHTML = filter + ' ▼';
        } else {
            filters.classList.remove('hidden');
            filterElement.innerHTML = filter + ' ▶';
        }
    }

    // use effet :
    useEffect(()=>{
        document.getElementById("cards").onmousemove = e => {
            for (const card of document.getElementsByClassName("card")) {
                const rect = card.getBoundingClientRect(),
                    x = e.clientX - rect.left,
                    y = e.clientY - rect.top;

                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            };
        };
    },[])
    return ( 
        <>
            <section className="projects-section">
                <div className='projects-header'>
                    <h1 className="projects-section__title">Projects Library</h1>
                    <div className="projects-section__filters">
                            <label >Category: <span className='filter' onClick={handleFilterShow}> {filter} ▼</span> </label>
                    </div>
                </div>
                <div className='filters-container'>
                    <div className="filters hidden">
                        <ul>
                            <li onClick={e=>{setFilter('All')}}>All</li>
                            <li onClick={e=>{setFilter('Web')}}>Web</li>
                            <li onClick={e=>{setFilter('Mobile')}}>Mobile</li>
                            <li onClick={e=>{setFilter('Desktop')}}>Desktop</li>
                        </ul>
                    </div>
                </div>

                <h2 className="projects-section__subtitle">Get Access To All My Public Projects</h2>
                <div id='cards'>
                    {projects && projects.map((project,index)=>(
                        <div key={project._id} className="card" onClick={e=>{Navigate('/projects/'+project._id)}} >
                            <div className="projects-section__projects__project__img" style={{
                                backgroundImage: `url(http://localhost:5000/${project.image})`
                            }}/>
                                <h3 className="projects-section__projects__project__title">{project.title}</h3>
                                <p className="projects-section__projects__project__description">{project.description}</p>  
                        </div>
                    ))} 
                    {projects && projects.map((project, index) => (
                        <div key={project._id} className="card" onClick={e => { Navigate('/projects/' + project._id) }} >
                            <div className="projects-section__projects__project__img" style={{
                                backgroundImage: `url(http://localhost:5000/${project.image})`
                            }} />
                            <h3 className="projects-section__projects__project__title">{project.title}</h3>
                            <p className="projects-section__projects__project__description">{project.description}</p>
                        </div>
                    ))} 
                </div> 
            </section>
        </>
    )
}
export const getProjects = async () => {
    return await axios.get('http://localhost:5000/api/projects')
    .then(res=>{
        return res.data.data;
    }
    )
    .catch(err=>console.log(err))
}