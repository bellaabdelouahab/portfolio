import { BUSINESS } from "../lib/contactConfig";

import { useT } from "../i18n/strings";
/**
 * Short, plain statement of the legal status for clients who need a compliant
 * supplier. Used on the home services section and on each service page.
 */
export default function BusinessStatus({ className = "" }) {
  const t = useT();
  return (
    <aside className={`flex gap-4 rounded-md border border-line bg-surface p-5 ${className}`}>
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-success" aria-hidden="true">
        <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" />
        <path d="M8.5 12l2.5 2.5 4.5-5" />
      </svg>
      <div>
        <h3 className="text-base font-bold text-ink-strong">
          {t("biz.title")}{BUSINESS.ice ? ` · ICE ${BUSINESS.ice}` : ""}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-ink">{t("biz.text")}</p>
      </div>
    </aside>
  );
}
