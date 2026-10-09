import { Field, Textarea } from "../../../ui";

/** Labels follow the public page: personal projects use Idea / What was built / Result. */
export const storyLabels = (kind) =>
  kind === "personal"
    ? { challenge: "The idea", solution: "What was built", outcome: "The result" }
    : { challenge: "The challenge", solution: "The solution", outcome: "The outcome" };

export default function StoryStep({ f, set }) {
  const L = storyLabels(f.kind);
  return (
    <div className="flex flex-col gap-3">
      <Field label="One-sentence summary" hint="The first thing visitors read under the title. Falls back to the short description when empty.">
        <Textarea rows={2} value={f.summary} onChange={(e) => set("summary", e.target.value)} placeholder="What it is and who it is for, in one sentence" />
      </Field>
      <div className="grid gap-3 md:grid-cols-3">
        <Field label={L.challenge} hint="The problem or need that started the project.">
          <Textarea rows={9} value={f.challenge} onChange={(e) => set("challenge", e.target.value)} />
        </Field>
        <Field label={L.solution} hint="What you designed and built, and how.">
          <Textarea rows={9} value={f.solution} onChange={(e) => set("solution", e.target.value)} />
        </Field>
        <Field label={L.outcome} hint="What changed. Numbers belong in the next step.">
          <Textarea rows={9} value={f.outcome} onChange={(e) => set("outcome", e.target.value)} />
        </Field>
      </div>
    </div>
  );
}
