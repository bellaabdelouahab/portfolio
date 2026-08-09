export default function TechnologesUsed({ technologes }) {
  return (
    <div className="flex w-full flex-col bg-page">
      {/* The old rule had `float: left` here, which flex containers ignore on
          their items — it never did anything and is not carried over. */}
      <h2 className="mt-10 mb-5 ml-2.5 p-2.5 text-xl font-bold text-[#00ff0086]">
        Technology Stack...
      </h2>
      {/* my-auto + h-full are both kept from the original: ProjectTools is a row
          flex container, so these two columns stretch to equal heights and the
          auto margins actually have space to distribute. */}
      <ul className="mx-auto my-auto mb-10 h-full w-[95%] bg-surface-raised p-[30px] shadow-[rgba(45,184,17,0.685)_-2.4px_2.4px_3.2px]">
        {technologes.map((tech, index) => (
          <li
            key={index}
            className="group flex flex-row items-center gap-12 border-[5px] border-t-0 border-page p-4 text-base leading-relaxed font-normal text-ink first:border-t-[5px] hover:bg-[#4c4c4c]"
          >
            {tech.title}
            <span className="opacity-0 transition-opacity duration-300 ease-standard group-hover:opacity-100">
              {tech.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
