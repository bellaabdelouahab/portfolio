import { BUSINESS } from "../lib/contactConfig";

/**
 * Short, plain statement of the legal status for clients who need a compliant
 * supplier. Used on the home services section and on each service page.
 */
export default function BusinessStatus({ className = "" }) {
  return (
    <aside className={`flex gap-4 rounded-md border border-line bg-surface p-5 ${className}`}>
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-success" aria-hidden="true">
        <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" />
        <path d="M8.5 12l2.5 2.5 4.5-5" />
      </svg>
      <div>
        <h3 className="text-base font-bold text-ink-strong">
          {BUSINESS.status} in Morocco{BUSINESS.ice ? ` · ICE ${BUSINESS.ice}` : ""}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-ink">
          I work as a declared business, not as an informal freelancer. Every project starts with a written quote and
          ends with an official invoice, and my taxes are declared, so I can be added to your suppliers and booked as
          a normal expense.
        </p>
      </div>
    </aside>
  );
}
