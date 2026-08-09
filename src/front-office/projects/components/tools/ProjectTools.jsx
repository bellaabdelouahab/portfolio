import ResourcesUsed from "./resources/ResourcesUsed";
import TechnologesUsed from "./technologies/TechnologiesUsed";
import "./ProjectTools.css"; 

export default function ProjectTools({ tools }) {
  if (!tools) return null;
  console.log(tools);
  return (
    <div className="project__tools">
      <TechnologesUsed technologes={tools.techs} />
      <ResourcesUsed resources={tools.resources} />
    </div>
  );
}
