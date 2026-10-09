const PLAUSIBLE_URL = "https://plausible.abdelouahab.xyz/abdelouahab.xyz";

export default function AnalyticsPanel() {
  return (
    <section className="rounded-md border border-line bg-surface-raised p-6">
      <h2 className="mb-2 text-sm font-semibold text-ink-strong">Analytics</h2>
      <p className="mb-4 text-sm text-ink">
        Visits, sources, pages and contact clicks are in Plausible. No personal data is stored.
      </p>
      <a
        className="inline-block rounded-sm border border-line px-4 py-2 text-sm text-ink-strong"
        href={PLAUSIBLE_URL}
        target="_blank"
        rel="noreferrer"
      >
        Open Plausible
      </a>
    </section>
  );
}
