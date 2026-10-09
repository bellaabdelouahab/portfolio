import { Badge, Button, Card, Page } from "../ui";

const PLAUSIBLE_URL = "https://plausible.abdelouahab.xyz/abdelouahab.xyz";
const GOALS = ["Contact: WhatsApp", "Contact: Email", "Contact: Book a meeting"];
const TRACKED = ["Visits and unique visitors", "Where visitors come from", "Pages people open", "Clicks on contact buttons"];

export default function AnalyticsPanel() {
  return (
    <Page
      title="Analytics"
      subtitle="Visitor statistics live in Plausible, hosted on your own server."
      actions={
        <Button variant="primary" onClick={() => window.open(PLAUSIBLE_URL, "_blank", "noopener,noreferrer")}>
          Open Plausible
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="What is tracked" description="No cookies and no personal data are stored.">
          <ul className="space-y-1.5 text-sm text-ink">
            {TRACKED.map((t) => (
              <li key={t} className="flex gap-2">
                <span aria-hidden="true" className="text-success">•</span>
                {t}
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Goals" description="Counted as conversions in the dashboard.">
          <ul className="space-y-2">
            {GOALS.map((g) => (
              <li key={g}><Badge tone="success">{g}</Badge></li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-muted">
            Each goal fires when a visitor clicks the matching contact button on the site.
          </p>
        </Card>
      </div>
    </Page>
  );
}
