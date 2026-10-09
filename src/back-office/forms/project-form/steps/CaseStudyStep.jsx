import { Field, Input, Textarea } from "../../../ui";
import { fieldError, parseResults } from "../formModel";

export default function CaseStudyStep({ v, set, errors }) {
  const resultLines = v.cs_results.split("\n").map((l) => l.trim()).filter(Boolean);
  const ignored = resultLines.length - parseResults(v.cs_results).length;
  const text = (key, label, props = {}) => (
    <Field label={label} className={props.className} hint={props.hint} error={fieldError(errors, key)}>
      <Input value={v[key]} onChange={(e) => set(key, e.target.value)} placeholder={props.placeholder} error={!!fieldError(errors, key)} />
    </Field>
  );
  const area = (key, label, props = {}) => (
    <Field label={label} className={props.className} hint={props.hint} error={props.error}>
      <Textarea rows={props.rows || 4} value={v[key]} onChange={(e) => set(key, e.target.value)} placeholder={props.placeholder} />
    </Field>
  );
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {text("cs_client", "Client or context", { placeholder: "Company, or Personal project" })}
      {text("cs_role", "Your role", { placeholder: "Full-stack developer" })}
      {text("cs_status", "Status", { placeholder: "Live, Delivered, Live demo" })}
      {text("cs_liveUrl", "Live URL", { placeholder: "https://...", className: "md:col-span-1" })}
      {area("cs_summary", "One-sentence summary", { rows: 2, className: "md:col-span-2", hint: "Shown on the card and under the title." })}
      {area("cs_challenge", "The challenge")}
      {area("cs_solution", "What you built")}
      {area("cs_outcome", "The outcome")}
      <div className="md:col-span-1">
        {area("cs_results", "Key numbers (3 or 4)", {
          placeholder: "100M+ | records migrated",
          hint: ignored > 0 ? `${ignored} line(s) ignored: use value | label.` : "One per line: value | label.",
        })}
      </div>
      <div className="md:col-span-2">
        {area("cs_features", "Key features", { hint: "One per line." })}
      </div>
    </div>
  );
}
