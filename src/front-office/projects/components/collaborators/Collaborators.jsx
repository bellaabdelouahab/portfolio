import viewIcon from "assets/images/view.png";

export default function Collaborators({ collaborators }) {
  if (!collaborators || collaborators.length === 0) return null;
  return (
    <div className="h-[69vh] w-full bg-surface">
      <h2 className="float-left mt-10 ml-2.5 p-2.5 text-xl font-bold text-ink">
        Collaborators
      </h2>
      <hr className="mb-5 ml-2.5 w-[98%] border-[0.5px] border-[#d5d5d5]" />
      {/* The old rule here was `display: flow`, which is not a real value and
          was dropped by the browser — the cards have always laid out as
          inline-blocks in a plain block box. Only max-width survives. */}
      <div className="max-w-full">
        {collaborators.map((collaborator) => (
          <div
            key={collaborator._id}
            className="mx-6 mb-2.5 inline-flex h-[225px] w-[200px] max-w-[400px] flex-col items-center justify-between rounded-lg bg-surface-raised p-5"
          >
            {/* `group` replaces the ::after hover rule. The overlay is a real
                element now because the icon is an aliased asset: Vite resolves
                `assets/...` in a JS import, but not inside a url() that
                Tailwind generates into its own stylesheet. */}
            <a href="/" className="group relative block size-[150px]">
              <img
                className="size-[150px] rounded-md"
                src={collaborator.image}
                alt="colaborator"
              />
              <span
                aria-hidden="true"
                style={{ backgroundImage: `url(${viewIcon})` }}
                className="absolute inset-0 z-20 flex items-center justify-center rounded-md bg-[#00fff7]/20 bg-[length:50px] bg-center bg-no-repeat pt-[70px] text-xs leading-none font-bold text-ink-strong opacity-0 transition-opacity duration-300 ease-standard [text-shadow:0_0_10px_#000] group-hover:opacity-100"
              >
                See Github Profile
              </span>
            </a>
            <h3 className="text-lg leading-normal font-bold text-ink">
              {collaborator.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
