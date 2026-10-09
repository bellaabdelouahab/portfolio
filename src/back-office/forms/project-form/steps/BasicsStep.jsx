import { Field, Input, Textarea, Select, Toggle } from "../../../ui";
import { fieldError } from "../formModel";
import { Group } from "./parts";

export default function BasicsStep({ f, set, errors }) {
  const titleErr = fieldError(errors, "title");
  const descErr = fieldError(errors, "description");
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Field label="Title" required error={titleErr} className="md:col-span-2">
        <Input value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Project name" error={!!titleErr} />
      </Field>
      <Field label="Kind" hint="Client work or a personal project.">
        <Select value={f.kind} onChange={(e) => set("kind", e.target.value)}>
          <option value="client">Client work</option>
          <option value="personal">Personal project</option>
        </Select>
      </Field>

      <Field label="Short description" required error={descErr} hint="Shown on the project card and as the page summary when there is none." className="md:col-span-3">
        <Textarea rows={2} value={f.description} onChange={(e) => set("description", e.target.value)} placeholder="One or two sentences about the project" error={!!descErr} />
      </Field>

      <Field label="Start date">
        <Input type="date" value={f.startDate} onChange={(e) => set("startDate", e.target.value)} />
      </Field>
      <Field label="End date" hint="Leave empty if the project is ongoing." error={fieldError(errors, "endDate")}>
        <Input type="date" value={f.endDate} onChange={(e) => set("endDate", e.target.value)} error={!!fieldError(errors, "endDate")} />
      </Field>
      <Group title="Services">
        <div className="flex flex-col gap-2">
          <Toggle label="Web development" checked={f.web} onChange={(x) => set("web", x)} />
          <Toggle label="Data analytics" checked={f.data} onChange={(x) => set("data", x)} />
        </div>
      </Group>

      <Group title="Highlighted" className="md:col-span-1">
        <Toggle label="Highlight this project" hint="Shown first and marked with a star." checked={f.highlighted} onChange={(x) => set("highlighted", x)} />
      </Group>
      <Group title="Hidden" className="md:col-span-2">
        <Toggle label="Hide this project" hint="Removed from every page of the site. Use it while a project is not ready." checked={f.hidden} onChange={(x) => set("hidden", x)} />
      </Group>
    </div>
  );
}
