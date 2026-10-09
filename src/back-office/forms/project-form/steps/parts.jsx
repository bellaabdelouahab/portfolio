import { Button, Input } from "../../../ui";

const cx = (...p) => p.filter(Boolean).join(" ");

/** A titled box with an optional one-line explanation. */
export function Group({ title, hint, actions, children, className = "" }) {
  return (
    <section className={cx("min-w-0 rounded-md border border-line bg-page/30 p-3", className)}>
      {(title || actions) && (
        <header className="mb-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h3 className="text-sm font-semibold tracking-normal! text-ink-strong">{title}</h3>}
            {hint && <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function RemoveButton({ onClick, label = "Remove" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-danger/10 hover:text-danger"
    >
      <span aria-hidden="true" className="text-lg leading-none">&times;</span>
    </button>
  );
}

/** Rows of single-line text (key features). Enter adds a row below. */
export function StringRows({ items, onChange, placeholder, addLabel, label }) {
  const update = (i, val) => onChange(items.map((x, j) => (j === i ? val : x)));
  const add = (at = items.length) => {
    const next = [...items];
    next.splice(at, 0, "");
    onChange(next);
    setTimeout(() => document.querySelector(`[data-row="${label}-${at}"]`)?.focus(), 30);
  };
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((x, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Input
            data-row={`${label}-${i}`}
            value={x}
            placeholder={placeholder}
            aria-label={`${label} ${i + 1}`}
            className="py-1.5!"
            onChange={(e) => update(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (x.trim()) add(i + 1);
              }
            }}
          />
          <RemoveButton label={`Remove ${label} ${i + 1}`} onClick={() => onChange(items.filter((_, j) => j !== i))} />
        </div>
      ))}
      <div>
        <Button size="sm" onClick={() => add()}>+ {addLabel}</Button>
      </div>
    </div>
  );
}

/** Rows of value | label pairs (key numbers). */
export function PairRows({ items, onChange, valuePlaceholder, labelPlaceholder, addLabel, label, errors, refs }) {
  const update = (i, patch) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((r, i) => {
        const err = errors?.find((e) => e.field === `result-${i}`);
        return (
          <div key={i}>
            {refs?.[i] && <p className="mb-0.5 truncate text-xs text-ink-muted">English: {refs[i]}</p>}
            <div className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-1.5">
              <Input value={r.value} placeholder={valuePlaceholder} aria-label={`${label} ${i + 1} value`} className="py-1.5!" error={!!err} onChange={(e) => update(i, { value: e.target.value })} />
              <Input value={r.label} placeholder={labelPlaceholder} aria-label={`${label} ${i + 1} label`} className="py-1.5!" error={!!err} onChange={(e) => update(i, { label: e.target.value })} />
              <RemoveButton label={`Remove ${label} ${i + 1}`} onClick={() => onChange(items.filter((_, j) => j !== i))} />
            </div>
          </div>
        );
      })}
      <div>
        <Button size="sm" onClick={() => onChange([...items, { value: "", label: "" }])}>+ {addLabel}</Button>
      </div>
    </div>
  );
}
