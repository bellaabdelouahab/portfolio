import '../assets/css/project.css';
import CodeSamples from '../components/CodeSamples';
import Carousel from '../components/Carousel';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';

export default function Project() {
  const project = useLoaderData();
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
          <h1 className="project__info__title">
            {project.title}
          </h1>
          <p className="project__info__description">
            {project.description}
          </p>
        </div>
      </div>
      {/* tools */}
      <div className="project__tools">
        <h2 className="project__tools__title">Technology Stack Used...</h2>
        <ul className="project__tools__list">


          <li  className="project__tools__item">
            random tool 1
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

      {/* Data Scources for data scince projects */}
      {/* this shoulb be different than tools section , it should be cards
      in each card it should have file type in the center of the card as image taking 80 % of the card with padding 1rem
      and the file name on the right bottom and on the left bottom file size  */}
      {/* {project.dataSources && */}
         {/* project.dataSources.length > 0 && */}
        {/* ( */}
          <div className="project__data-sources">
            <h2 className="project__data-sources__title">Data Sources</h2>
            <div className="project__data-sources__list">
            {/* {project.dataSources.map((dataSource, index) => ( */}
            <div key={"index"} className="project__data-sources__item">
              <div className="project__data-sources__item__image">
                <img src="https://img.icons8.com/color/48/000000/microsoft-excel-2019--v1.png" alt="excel" />
              </div>
              <div className="project__data-sources__item__info">
                <p className="project__data-sources__item__info__name">{"dataSource.name"}</p>
                <p className="project__data-sources__item__info__size">{"dataSource.size"}</p>
              </div>
            </div>
            <div key={"index"} className="project__data-sources__item">
              <div className="project__data-sources__item__image">
                <img src="https://img.icons8.com/color/48/000000/microsoft-excel-2019--v1.png" alt="excel" />
              </div>
              <div className="project__data-sources__item__info">
                <p className="project__data-sources__item__info__name">{"dataSource.name"}</p>
                <p className="project__data-sources__item__info__size">{"dataSource.size"}</p>
              </div>
            </div>
            <div key={"index"} className="project__data-sources__item">
              <div className="project__data-sources__item__image">
                <img src="https://img.icons8.com/color/150/000000/microsoft-excel-2019--v1.png" alt="excel" />
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
    </section>
  );
}

export async function getProject({ params }) {
  const response = await axios.get(`http://localhost:5000/api/projects/${params.id}`);
  console.log("res.data", response.data);
  return response.data.data;
}