export default function ProjectTools({ tools }) {
  if (!tools || tools.length === 0) return null;
  return (
    <div className="project__tools">
      <h2 className="project__tools__title">Technology Stack Used...</h2>
      <ul className="project__tools__list">
        {tools.map((tool, index) => (
          <li key={index} className="project__tools__item">
            {tool.title} <span>{tool.descreption}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
