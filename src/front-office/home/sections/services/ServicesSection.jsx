import { Link } from "react-router-dom";
import { servicesContent } from "../../homeContent";
import { BOOKING_URL } from "../../../../shared/lib/contactConfig";

/**
 * Two services, shown as plain cards that lead to their own pages. There is no
 * request form here on purpose: clients of a freelancer start with a call or a
 * message, not a priced order form, and the old form collected budget ranges
 * nobody was going to pick from.
 */
export default function ServicesSection() {
  return (
    <div className="relative h-auto w-full bg-[#171717] bg-[linear-gradient(to_bottom,#1c1c1c,transparent_30px)] pt-7.5 pb-10">
      <div className="home-sections-title">
        <span>07. </span>
        Services
      </div>
      <div className="mx-auto grid w-[92%] max-w-5xl gap-5 py-4 md:grid-cols-2">
        {servicesContent.map((s) => (
          <article key={s.id} className="flex flex-col rounded-md border border-line bg-[#202020] p-6">
            <h3 className="text-2xl leading-snug font-bold text-ink-strong">{s.title}</h3>
            <p className="mt-1 text-sm font-bold text-success">{s.startingPrice}</p>
            <p className="mt-3 text-base leading-relaxed text-ink">{s.description}</p>
            <ul className="mt-4 mb-6 space-y-1.5 text-sm text-ink">
              {s.deliverables.slice(0, 3).map((d) => (
                <li key={d} className="flex gap-2">
                  <span aria-hidden="true" className="text-success">✓</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-3">
              <Link
                to={`/services/${s.id}`}
                className="rounded-sm border border-success px-4 py-2 text-sm font-bold tracking-[1px]! text-success! transition-colors hover:bg-success/10"
              >
                Details
              </Link>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm bg-success px-4 py-2 text-sm font-bold tracking-[1px]! text-black! transition-transform hover:scale-105"
              >
                Book a call
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
