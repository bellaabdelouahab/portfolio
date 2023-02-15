import '../assets/css/project.css'
import CodeSamples from '../components/CodeSamples';
import Carousel from '../components/Carousel';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom'

export default function Project() {
    const project = useLoaderData();
    console.log("project", project);
    return (
      <>
        <section className="project-first-section">
          <div
            className="project-first-section__project__image"
            style={{
              backgroundImage: `url(http://localhost:5000/${project.image})`,
            }}
          />
          <div className="project-first-section__project__info">
            <h1 className="project-first-section__project__info__title">
              {project.title}
            </h1>
            <p className="project-first-section__project__info__description">
              {project.description}
            </p>
          </div>
        </section>
        {/* code samples */}
        {project.codeSamples &&
          project.codeSamples.length > 0 &&
          project.codeSamples.map((codeSample, index) => {
            // console.log("codeSample", codeSample.code);
            return <CodeSamples key={index} codeSample={codeSample} />;
          })}
        {/* carousel */}
        <Carousel carouselImages={project.carouselImages} />
      </>
    );
}

export async function getProject({ params }) {
    return await axios.get(`http://localhost:5000/api/projects/${params.id}`)
    .then(res=>{
        console.log("res.data", res.data);
        return res.data.data;
    }
    )
}