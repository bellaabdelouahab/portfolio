import { useT } from "../../../../shared/i18n/strings";
import { useLang } from "../../../../shared/i18n/i18n";
import { BOOKING_URL } from "../../../../shared/lib/contactConfig";

/** createdAt can arrive as a Firestore timestamp, `{ seconds }`, `{ _seconds }`, a string or a number. */
function toMillis(value) {
  if (!value) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const ms = Date.parse(value);
    return Number.isNaN(ms) ? 0 : ms;
  }
  if (typeof value.toMillis === "function") return value.toMillis();
  const seconds = value.seconds ?? value._seconds;
  return typeof seconds === "number" ? seconds * 1000 : 0;
}

const orderOf = (c) => (typeof c.order === "number" ? c.order : Number.MAX_SAFE_INTEGER);

function sortClients(list) {
  return list
    .filter((c) => c && !c.hidden && c.name && c.description)
    .sort(
      (a, b) =>
        orderOf(a) - orderOf(b) ||
        Number(!!b.featured) - Number(!!a.featured) ||
        toMillis(b.createdAt) - toMillis(a.createdAt)
    );
}

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

function Stars({ rating }) {
  const value = Math.max(1, Math.min(5, Math.round(rating)));
  return (
    <div className="mb-3 flex gap-0.5 text-success" role="img" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 20 20" className="size-4" fill={n <= value ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M10 1.8l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L1.4 8.1l6-.8z" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ client }) {
  if (client.image) {
    return <img loading="lazy" decoding="async" className="size-11 shrink-0 rounded-full border border-line object-cover" src={client.image} alt="" />;
  }
  return (
    <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface-raised text-sm font-medium text-ink-strong">
      {initials(client.name)}
    </span>
  );
}

export default function HappyClientsSection({ clients = [] }) {
  const t = useT();
  const lang = useLang();
  const list = sortClients(Array.isArray(clients) ? [...clients] : []);

  if (list.length === 0) return null;

  const cta = lang === "fr" ? "Travaillons ensemble" : "Work with me";

  return (
    <div className="happy-clients-section hidden-area bg-[#1c1c1c] bg-[linear-gradient(to_bottom,#171717,transparent_30px)] px-5 pt-7.5 pb-8 text-ink">
      <div className="home-sections-title">
        <span>06. </span>
        {t("home.clients")}
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((client, index) => {
          const fr = lang === "fr" ? client.fr || {} : {};
          const quote = fr.description || client.description;
          const role = fr.profession || client.profession;
          const roleLine = [role, client.company].filter(Boolean).join(client.company && role ? " · " : "");
          return (
            <figure key={client.id || `${client.name}-${index}`} className="m-0 flex h-full flex-col rounded-md border border-line bg-surface p-5">
              {typeof client.rating === "number" && client.rating >= 1 && <Stars rating={client.rating} />}
              <blockquote className="m-0 flex-1 text-base leading-relaxed text-ink-strong">
                <p className="m-0">&ldquo;{quote}&rdquo;</p>
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                <Avatar client={client} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-ink-strong">{client.name}</div>
                  {roleLine && <div className="truncate text-xs text-ink-muted">{roleLine}</div>}
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>
      <div className="mt-8 flex justify-center">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-line bg-surface px-5 py-2.5 text-sm font-medium tracking-normal! text-ink-strong no-underline transition-colors duration-150 hover:border-success/50 hover:bg-surface-raised"
        >
          {cta}
        </a>
      </div>
    </div>
  );
}
