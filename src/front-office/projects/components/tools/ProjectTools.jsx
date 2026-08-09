import ResourcesUsed from "./resources/ResourcesUsed";
import TechnologesUsed from "./technologies/TechnologiesUsed";

export default function ProjectTools({ tools }) {
  if (!tools) return null;
  return (
    // The old rule also carried `align-items: left`, which is not a valid value
    // for that property and never applied; the columns have always stretched.
    <div className="flex w-full flex-col bg-page md:flex-row">
      <TechnologesUsed technologes={tools.techs} />
      <ResourcesUsed resources={tools.resources} />
    </div>
  );
}
