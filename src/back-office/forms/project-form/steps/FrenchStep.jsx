import { Field, Input, Textarea, Badge } from "../../../ui";
import { FR_FIELDS, frenchFilled } from "../formModel";

const ROWS = [
  [["title", "Title", "title"], ["description", "Description", "description", true]],
  [["client", "Client or context", "cs_client"], ["role", "Role", "cs_role"], ["status", "Status", "cs_status"]],
  [["summary", "Summary", "cs_summary", true]],
  [["challenge", "Challenge", "cs_challenge", true], ["solution", "Solution", "cs_solution", true], ["outcome", "Outcome", "cs_outcome", true]],
  [["results", "Key numbers", "cs_results", true], ["features", "Key features", "cs_features", true]],
];

function Ref({ text }) {
  return (
    <div className="max-h-16 overflow-y-auto rounded-md border border-dashed border-line bg-page/40 px-2 py-1 text-xs whitespace-pre-line text-ink-muted">
      {text.trim() ? text : <span className="italic">English is empty</span>}
    </div>
  );
}

export default function FrenchStep({ v, set }) {
  const filled = frenchFilled(v);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ink-muted">Leave a field empty to show the English text on the French site. The dashed box is the English reference.</p>
        <Badge tone={filled ? "success" : "neutral"}>{filled} of {FR_FIELDS.length} filled</Badge>
      </div>
      {ROWS.map((row, i) => (
        <div key={i} className={`grid gap-3 ${row.length === 3 ? "md:grid-cols-3" : row.length === 2 ? "md:grid-cols-2" : ""}`}>
          {row.map(([key, label, enKey, multiline]) => {
            const fk = `fr_${key}`;
            return (
              <Field key={fk} label={`${label} (FR)`}>
                <Ref text={String(v[enKey] || "")} />
                {multiline ? (
                  <Textarea rows={key === "challenge" || key === "solution" || key === "outcome" || key === "results" || key === "features" ? 3 : 2} value={v[fk]} onChange={(e) => set(fk, e.target.value)} />
                ) : (
                  <Input value={v[fk]} onChange={(e) => set(fk, e.target.value)} />
                )}
              </Field>
            );
          })}
        </div>
      ))}
    </div>
  );
}
