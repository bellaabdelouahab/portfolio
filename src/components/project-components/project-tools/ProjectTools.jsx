import ResourcesUsed from "./resources_used/ResourcesUsed";
import TechnologesUsed from "./technologies/TechnologesUsed";
import "./project_tools.css"; 

export default function ProjectTools({ tools }) {
  if (!tools) return null;
  console.log(tools);
  return (
    <div className="project__tools">
      <TechnologesUsed technologes={tools.tech} />
      <ResourcesUsed resources={tools.resources} />
    </div>
  );
}
