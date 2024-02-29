import "./resources_used.css";
export default function ResourcesUsed({ resources }) {
  return (
    <div className="project__resources">
      <h2 className="project__resources__title">Resources...</h2>
      <ul className="project__resources__list">
        {resources.map((resource, index) => (
          <li key={index} className="project__resources__item">
            {resource.title} <span>{resource.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
