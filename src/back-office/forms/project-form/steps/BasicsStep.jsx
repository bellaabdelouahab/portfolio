import { Field, Input, Textarea, Select, Toggle } from "../../../ui";
import { fieldError } from "../formModel";

export default function BasicsStep({ v, set, errors }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Field label="Title" required error={fieldError(errors, "title")} className="md:col-span-2">
        <Input value={v.title} onChange={(e) => set("title", e.target.value)} placeholder="My project" error={!!fieldError(errors, "title")} />
      </Field>
      <Field label="GitHub link">
        <Input value={v.githubLink} onChange={(e) => set("githubLink", e.target.value)} placeholder="github.com/you/repo" />
      </Field>
      <Field label="Short description" required error={fieldError(errors, "description")} className="md:col-span-3">
        <Textarea rows={3} value={v.description} onChange={(e) => set("description", e.target.value)} placeholder="One or two sentences about the project" error={!!fieldError(errors, "description")} />
      </Field>
      <Field label="Start date">
        <Input type="date" value={v.startDate} onChange={(e) => set("startDate", e.target.value)} />
      </Field>
      <Field label="End date" hint="Leave empty if ongoing." error={fieldError(errors, "endDate")}>
        <Input type="date" value={v.endDate} onChange={(e) => set("endDate", e.target.value)} error={!!fieldError(errors, "endDate")} />
      </Field>
      <Field label="Kind">
        <Select value={v.cs_kind} onChange={(e) => set("cs_kind", e.target.value)}>
          <option value="client">Client work</option>
          <option value="personal">Personal project</option>
        </Select>
      </Field>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-ink">Services</span>
        <Toggle label="Web development" checked={v.cs_web} onChange={(x) => set("cs_web", x)} />
        <Toggle label="Data analytics" checked={v.cs_data} onChange={(x) => set("cs_data", x)} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-ink">Visibility</span>
        <Toggle label="Highlighted" hint="Shown first and marked with a star." checked={v.highlighted} onChange={(x) => set("highlighted", x)} />
        <Toggle label="Hidden" hint="Removed from every page of the site." checked={v.hidden} onChange={(x) => set("hidden", x)} />
      </div>
    </div>
  );
}
