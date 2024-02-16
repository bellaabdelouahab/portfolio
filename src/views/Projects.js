import axios from 'axios';
import { useNavigate, useLoaderData } from 'react-router-dom'
import { useEffect, useState } from 'react';
import '../assets/css/projects.css'


export default function Projects() {
    const InitProjects = useLoaderData();
    const [projects, setProjects] = useState(InitProjects);
    const Navigate = useNavigate();
    const [showFilter, setShowFilter] = useState(false);
    const [filter, setFilter] = useState('All');

    let filters = [{
        "All": -1
    }];
    projects.map((project) => {
        project?.tags?.map((tag) => {
            // search if the tag is in filters
            // if so we increment the tag value by 1 else we initialize it by 1
            const updateFilters = (tag) => {
                const filterIndex = filters.findIndex((filter) => filter.hasOwnProperty(tag));
                if (filterIndex !== -1) {
                    filters[filterIndex][tag] += 1;
                } else {
                    filters.push({ [tag]: 1 });
                }
            };
            updateFilters(tag)
        })
    })

    useEffect(() => {

        const handleFilterClick = (e) => {
            const selectedTag = e.target.getAttribute('data-tag');
            setFilter(selectedTag);
        };

        const filterElements = document.querySelectorAll('.filter-element');
        filterElements.forEach((element) => {
            element.addEventListener('click', handleFilterClick);
        });

        return () => {
            filterElements.forEach((element) => {
                element.removeEventListener('click', handleFilterClick);
            });
        };
    }, []);

    useEffect(() => {
        const handleFilter = (filterElement) => {
            filterElement.innerHTML = filter + ' ▼';
            setShowFilter(false);
            // Perform filtering logic here based on the selected tag
            const filteredProjects = InitProjects.filter((project) => {
                if (filter === "All") {
                    return true;
                }
                return project.tags.includes(filter);
            });
            // Update the UI with the filtered projects    
            setProjects(filteredProjects);
        }
        const filterElement = document.querySelector('.filter');
        handleFilter(filterElement);
        handleFilterShow()
    }, [filter])


    // handleFilterShow
    const handleFilterShow = (e) => {
        const filterElement = document.querySelector('.filter');
        const filters = document.querySelector('.filters');
        if (!showFilter) {
            filters.classList.remove('hidden');
            filterElement.innerHTML = filter + ' ▶';
            setShowFilter(true);
        } else {
            filters.classList.add('hidden');
            filterElement.innerHTML = filter + ' ▼';
            setShowFilter(false);
        }
    }
    // use effet :
    useEffect(() => {
        document.getElementById("cards").onmousemove = e => {
            for (const card of document.getElementsByClassName("card")) {
                const rect = card.getBoundingClientRect(),
                    x = e.clientX - rect.left,
                    y = e.clientY - rect.top;

                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            };
        };
    }, [])
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
                        {filters.map((filter, index) => (
                            Object.entries(filter).map(([tag, count]) => (
                                <div key={index} className="filter-element" data-tag={tag}>{tag} {count !== -1 ? "(" + count + ")" : ""}</div>
                            ))
                        ))}
                    </div>
                </div>

                <h2 className="projects-section__subtitle">Get Access To All My Public Projects</h2>
                <div id='cards'>
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
        .then(res => {
            return res.data.data;
        }
        )
        .catch(err => console.log(err))
}