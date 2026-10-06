const FIELD =
  "w-full rounded-md border border-line bg-surface p-2.5 text-sm text-ink-strong focus:border-success focus:outline-none";
const LABEL = "mb-1 block text-xs font-semibold text-ink";
const HINT = "mt-1 text-xs text-ink-muted";

const lines = (arr, fn) => (arr || []).map(fn).join("\n");

/**
 * Case-study fields shown on the public project page. Uncontrolled inputs read
 * back by parseCaseStudy() on submit, so the form's own state stays untouched.
 * Results are written one per line as `value | label`, features one per line.
 */
export default function CaseStudyFields({ initial }) {
  const cs = initial?.caseStudy || {};
  const has = (s) => (cs.services || []).includes(s);
  return (
    <fieldset className="mt-5 rounded-md border border-line p-4">
      <legend className="px-2 text-sm font-bold text-success">Case study (shown on the project page)</legend>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={LABEL}>Type</label>
          <select name="cs_kind" defaultValue={cs.kind || "client"} className={FIELD}>
            <option value="client">Client work</option>
            <option value="personal">Personal project</option>
          </select>
        </div>
        <div>
          <label className={LABEL}>Service</label>
          <div className="flex gap-5 pt-2 text-sm text-ink">
            <label className="flex items-center gap-2"><input type="checkbox" name="cs_web" defaultChecked={has("web")} /> Web development</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="cs_data" defaultChecked={has("data")} /> Data analytics</label>
          </div>
        </div>
        <div>
          <label className={LABEL}>Client or context</label>
          <input name="cs_client" defaultValue={cs.client || ""} className={FIELD} placeholder="Company name, or 'Personal project'" />
        </div>
        <div>
          <label className={LABEL}>Your role</label>
          <input name="cs_role" defaultValue={cs.role || ""} className={FIELD} placeholder="Full-stack developer" />
        </div>
        <div>
          <label className={LABEL}>Status</label>
          <input name="cs_status" defaultValue={cs.status || ""} className={FIELD} placeholder="Live, Delivered, Live demo" />
        </div>
        <div>
          <label className={LABEL}>Live URL</label>
          <input name="cs_liveUrl" defaultValue={cs.liveUrl || ""} className={FIELD} placeholder="https://..." />
        </div>
      </div>
      <div className="mt-4">
        <label className={LABEL}>One-sentence summary</label>
        <textarea name="cs_summary" defaultValue={cs.summary || ""} rows={2} className={FIELD} />
        <p className={HINT}>Shown on the card and under the title.</p>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div><label className={LABEL}>The challenge</label><textarea name="cs_challenge" defaultValue={cs.challenge || ""} rows={5} className={FIELD} /></div>
        <div><label className={LABEL}>What you built</label><textarea name="cs_solution" defaultValue={cs.solution || ""} rows={5} className={FIELD} /></div>
        <div><label className={LABEL}>The outcome</label><textarea name="cs_outcome" defaultValue={cs.outcome || ""} rows={5} className={FIELD} /></div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className={LABEL}>Key numbers (3 or 4)</label>
          <textarea name="cs_results" defaultValue={lines(cs.results, (r) => `${r.value} | ${r.label}`)} rows={5} className={FIELD} placeholder={"100M+ | records migrated\n1 | dashboard for all cities"} />
          <p className={HINT}>One per line: value | label. Only numbers you can defend.</p>
        </div>
        <div>
          <label className={LABEL}>Key features</label>
          <textarea name="cs_features" defaultValue={lines(cs.features, (f) => f)} rows={5} className={FIELD} />
          <p className={HINT}>One per line.</p>
        </div>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="cs_hidden" defaultChecked={initial?.hidden === true} />
        Hide this project from the site
      </label>
    </fieldset>
  );
}

/** Builds the caseStudy object and `hidden` flag from the submitted form. */
export function parseCaseStudy(formData, initial) {
  const split = (name) =>
    String(formData.get(name) || "").split("\n").map((l) => l.trim()).filter(Boolean);
  const services = [formData.get("cs_web") && "web", formData.get("cs_data") && "data"].filter(Boolean);
  const results = split("cs_results").map((l) => {
    const [value, ...rest] = l.split("|");
    return { value: value.trim(), label: rest.join("|").trim() };
  }).filter((r) => r.value && r.label);
  const text = (n) => String(formData.get(n) || "").trim();
  return {
    caseStudy: {
      ...(initial?.caseStudy || {}),
      kind: text("cs_kind") || "client",
      services,
      client: text("cs_client"),
      role: text("cs_role"),
      status: text("cs_status"),
      liveUrl: text("cs_liveUrl"),
      summary: text("cs_summary"),
      challenge: text("cs_challenge"),
      solution: text("cs_solution"),
      outcome: text("cs_outcome"),
      results,
      features: split("cs_features"),
    },
    hidden: formData.get("cs_hidden") === "on",
  };
}
