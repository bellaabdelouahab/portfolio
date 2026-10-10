import { useCallback } from "react";
import * as contactConfig from "../../shared/lib/contactConfig";
import { STRINGS } from "../../shared/i18n/strings";
import { Button, Card, Field, Input, Page } from "../ui";
import { SaveActions, SectionLoader, cx, isBlank, prune, setIn, useSectionEditor } from "./parts";

// CONTACT_DEFAULTS is the contract; the fallback keeps the screen usable
// until every default is exported from contactConfig.js.
const DEFAULTS = contactConfig.CONTACT_DEFAULTS || {
  email: contactConfig.CONTACT_EMAIL,
  bookingUrl: contactConfig.BOOKING_URL,
  ice: contactConfig.BUSINESS?.ice,
};

const digitsOnly = (v) => String(v || "").replace(/[\s+()\-.]/g, "");
const isUrl = (v) => {
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
};

const FIELDS = [
  {
    key: "whatsappNumber",
    label: "WhatsApp number",
    hint: "Digits with the country code, no + or spaces. Example: 212612345678.",
    validate: (v) => (/^\d{8,15}$/.test(digitsOnly(v)) ? "" : "Use 8 to 15 digits including the country code."),
    clean: digitsOnly,
  },
  {
    key: "phoneDisplay",
    label: "Phone shown on the site",
    hint: "Free format, shown as written. Example: +212 6 12 34 56 78.",
    validate: (v) => (v.replace(/\D/g, "").length >= 6 ? "" : "Add a phone number with at least 6 digits."),
  },
  {
    key: "email",
    label: "Email",
    hint: "Used by the email button and in structured data.",
    validate: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Enter a valid email address."),
  },
  {
    key: "bookingUrl",
    label: "Booking link",
    hint: "Full address of your calendar page, starting with https://.",
    validate: (v) => (isUrl(v) ? "" : "Enter a full address starting with https://."),
  },
  {
    key: "ice",
    label: "ICE number",
    hint: "The 15-digit business identifier shown with your legal status.",
    validate: (v) => (/^\d{15}$/.test(digitsOnly(v)) ? "" : "The ICE number has 15 digits."),
    clean: digitsOnly,
  },
  {
    key: "githubUrl",
    label: "GitHub profile",
    hint: "Full address, starting with https://.",
    validate: (v) => (isUrl(v) ? "" : "Enter a full address starting with https://."),
  },
  {
    key: "linkedinUrl",
    label: "LinkedIn profile",
    hint: "Full address, starting with https://.",
    validate: (v) => (isUrl(v) ? "" : "Enter a full address starting with https://."),
  },
];

const def = (k) => String(DEFAULTS[k] ?? "");

function errorsOf(working) {
  const out = {};
  for (const f of FIELDS) {
    const v = String(working?.[f.key] ?? "").trim();
    if (v) {
      const e = f.validate(v);
      if (e) out[f.key] = e;
    }
  }
  return out;
}

function normalize(w) {
  const out = {};
  for (const f of FIELDS) {
    const raw = String(w?.[f.key] ?? "").trim();
    if (!raw) continue;
    const v = f.clean ? f.clean(raw) : raw;
    if (v !== def(f.key)) out[f.key] = v;
  }
  return prune(out);
}

/** Value used by the previews: the typed one when valid, else the default. */
const effective = (working, errors, k) => {
  const f = FIELDS.find((x) => x.key === k);
  const raw = String(working?.[k] ?? "").trim();
  if (raw && !errors[k]) return f.clean ? f.clean(raw) : raw;
  return def(k);
};

function PreviewRow({ label, children, href }) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-line py-3 last:border-b-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-ink">{label}</span>
        {href && (
          <Button size="sm" onClick={() => window.open(href, "_blank", "noopener,noreferrer")}>Test</Button>
        )}
      </div>
      {children}
    </div>
  );
}

function MockButton({ children, tone }) {
  return (
    <span className={cx("inline-flex w-fit items-center rounded-md px-4 py-2 text-sm font-medium", tone === "primary" ? "bg-success text-black" : "border border-line bg-surface-raised text-ink-strong")}>
      {children}
    </span>
  );
}

const Target = ({ children }) => <p className="break-all font-mono text-xs text-ink-muted">{children}</p>;

function Editor({ saved, save }) {
  const editor = useSectionEditor({ saved, save, normalize, label: "Contact details" });
  const { working, update } = editor;
  const errors = errorsOf(working);
  const blocked = Object.keys(errors).length > 0;
  const canSave = editor.dirty && !blocked && !editor.saving;
  const view = { ...editor, canSave };
  const set = useCallback((k, v) => update((w) => setIn(w, [k], v)), [update]);
  const val = (k) => effective(working, errors, k);
  const wa = val("whatsappNumber");
  const waLink = wa ? `https://wa.me/${wa}` : "";
  const mailLink = val("email") ? `mailto:${val("email")}` : "";
  const T = STRINGS.en;

  return (
    <Page
      className="max-w-none!"
      title="Contact and business"
      subtitle="Edit each detail once and it is used on every page. Leave a field empty to use the built-in value."
      actions={<SaveActions editor={view} />}
    >
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card title="Details" bodyClassName="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => {
            const raw = working?.[f.key] ?? "";
            const d = def(f.key);
            const overridden = !isBlank(raw) && !errors[f.key] && (f.clean ? f.clean(String(raw).trim()) : String(raw).trim()) !== d;
            return (
              <Field
                key={f.key}
                label={f.label}
                error={errors[f.key]}
                hint={
                  <>
                    {f.hint}
                    {d ? <> Built-in: <span className="font-mono">{d}</span></> : null}
                    {overridden ? <span className="ml-1 text-success">Edited</span> : null}
                  </>
                }
              >
                <Input
                  value={raw}
                  error={!!errors[f.key]}
                  placeholder={d || "Not set"}
                  inputMode={f.key === "whatsappNumber" || f.key === "ice" ? "numeric" : undefined}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              </Field>
            );
          })}
        </Card>

        <Card title="Where it is used" description="Updates as you type. Invalid values are ignored here until corrected.">
          <PreviewRow label="WhatsApp button" href={waLink}>
            <MockButton tone="primary">{T["cta.whatsapp"]}</MockButton>
            <Target>{waLink || "No number set"}</Target>
          </PreviewRow>
          <PreviewRow label="Email button" href={mailLink}>
            <MockButton>{T["cta.email"]}</MockButton>
            <Target>{mailLink || "No email set"}</Target>
          </PreviewRow>
          <PreviewRow label="Book a meeting button" href={val("bookingUrl")}>
            <MockButton>{T["cta.book"]}</MockButton>
            <Target>{val("bookingUrl") || "No link set"}</Target>
          </PreviewRow>
          <PreviewRow label="Legal status line">
            <p className="text-sm text-ink-strong">
              {contactConfig.BUSINESS?.status || "Registered auto-entrepreneur"}
              {val("ice") ? ` | ICE ${val("ice")}` : ""}
            </p>
          </PreviewRow>
          <PreviewRow label="Phone, GitHub and LinkedIn">
            <Target>{val("phoneDisplay") || "No phone set"}</Target>
            <Target>{val("githubUrl") || "No GitHub link set"}</Target>
            <Target>{val("linkedinUrl") || "No LinkedIn link set"}</Target>
          </PreviewRow>
        </Card>
      </div>
    </Page>
  );
}

export default function ContactPanel() {
  return (
    <SectionLoader section="contact" title="Contact and business" subtitle="Edit each detail once and it is used on every page.">
      {(saved, save) => <Editor saved={saved} save={save} />}
    </SectionLoader>
  );
}
