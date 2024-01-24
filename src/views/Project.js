import '../assets/css/project.css';
import CodeSamples from '../components/CodeSamples';
import Carousel from '../components/Carousel';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import Collaborators from 'components/project-collaborators/Collaborators';

export default function Project() {
  const project = useLoaderData();

  const dataSources = [
    "https://img.icons8.com/color/250/000000/microsoft-excel-2019--v1.png",
    "https://img.icons8.com/color/250/000000/csv.png",
    "https://img.icons8.com/color/250/000000/json--v1.png",
    "https://img.icons8.com/color/250/000000/microsoft-sql-server.png",
    "https://img.icons8.com/color/250/000000/mysql-logo.png",
    "https://img.icons8.com/color/250/000000/mongodb.png",
    "https://img.icons8.com/color/250/000000/python.png",
    "https://img.icons8.com/color/250/000000/xml.png",
  ];


  console.log("project", project);
  
  return ( 
    <section className='project-page'>
      <div className="project-overview">
        <div
          className="project__image"
          style={{
            backgroundImage: `url(http://localhost:5000/${project.image})`,
          }}
        />
        <div className="project__info">
          <h1 className="title">
            {project.title}
          </h1>
          <p className="description">
            {project.description}
          </p>
          <div className="bottom_options">
            <p className="project__dates">
              13-06-2023 ⇒ 07-09-2023 | Duration : {"6 months"}
            </p>
            <a href={project.githubLink} target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </div>
        </div>
      </div>
      {/* tools */}
      <div className="project__tools">
        <h2 className="project__tools__title">Technology Stack Used...</h2>
        <ul className="project__tools__list">


          <li  className="project__tools__item">
            random tool 1  <span>HHHHHHHHHHHHHHHHHHHHHHHHHHH</span>
          </li>
          <li  className="project__tools__item">
            random tool 2
          </li>
          <li  className="project__tools__item">
            random tool 3
          </li>


          {/* {project.tools &&
            project.tools.length > 0 && 
             project.tools.map((tool, index) => ( 
              <li key={index} className="project__tools__item">
                {"tool"}
              </li>
             ))} */}
        </ul>
      </div>

      {/* {project.dataSources && */}
         {/* project.dataSources.length > 0 && */}
        {/* ( */}
          <div className="project__data-sources">
            <h2 className="project__data-sources__title">Data Sources</h2>
            <hr />
            <div className="project__data-sources__list">
            {/* {project.dataSources.map((dataSource, index) => ( */}
                <div key={"index"} className="project__data-sources__item">
                  <div className="project__data-sources__item__image">
                    <img src={dataSources[0]} alt="excel" />
                  </div>
                  <div className="project__data-sources__item__info">
                    <p className="project__data-sources__item__info__name">{"dataSource.name"}</p>
                    <p className="project__data-sources__item__info__size">142Mb</p>
                  </div>
                </div>
              {/* ))} */}
            </div>
          </div>
        {/* ) */}
      {/* } */}

      {/* code samples */}
        


      {project.codeSamples &&
        project.codeSamples.length > 0 &&
        project.codeSamples.map((codeSample, index) => {
          return <CodeSamples key={index} codeSample={codeSample} />;
        })}

      {/* carousel */}
      <Carousel carouselImages={project.carouselImages} />
      <Collaborators collaborators={project.collaborators} />
    </section>
  );
}

export async function getProject({ params }) {
  const response = await axios.get(`http://localhost:5000/api/projects/${params.id}`);
  console.log("res.data", response.data);
  return response.data.data;
}