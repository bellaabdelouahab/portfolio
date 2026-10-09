import { Field, Input } from "../../../ui";
import { fieldError } from "../formModel";
import { Group, PairRows, StringRows } from "./parts";

export default function FactsStep({ f, set, errors }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-3 md:grid-cols-4">
        <Field label={f.kind === "personal" ? "Type of project (for example: Hackathon project)" : "Client or context"}>
          <Input value={f.client} onChange={(e) => set("client", e.target.value)} />
        </Field>
        <Field label="Role">
          <Input value={f.role} onChange={(e) => set("role", e.target.value)} placeholder="Full-stack developer" />
        </Field>
        <Field label="Status">
          <Input value={f.status} onChange={(e) => set("status", e.target.value)} placeholder="Live, In progress..." />
        </Field>
        <Field label="Live site" error={fieldError(errors, "liveUrl")} hint="Adds a Live demo button.">
          <Input value={f.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} placeholder="https://" error={!!fieldError(errors, "liveUrl")} />
        </Field>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Group title="Key numbers" hint="Big figures under the header. Four fit best.">
          <PairRows
            items={f.results}
            onChange={(v) => set("results", v)}
            label="Key number"
            valuePlaceholder="2nd"
            labelPlaceholder="place at the hackathon"
            addLabel="Add number"
            errors={errors}
          />
        </Group>
        <Group title="Key features" hint="A short list shown in two columns. Press Enter to add the next one.">
          <StringRows items={f.features} onChange={(v) => set("features", v)} label="Feature" placeholder="Public tracking page by tracking number" addLabel="Add feature" />
        </Group>
      </div>
    </div>
  );
}
