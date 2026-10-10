/**
 * Shared building blocks for every back-office screen.
 *
 * One rule: screens compose these instead of inventing their own classes, so
 * the whole admin looks and behaves the same. Colours come from the site
 * tokens (`success` is the one accent, `danger` is for destructive actions
 * and errors only). Everything here must work from a 1366x768 laptop up.
 */
import { createContext, forwardRef, useCallback, useContext, useEffect, useRef, useState } from "react";

const cx = (...parts) => parts.filter(Boolean).join(" ");

/* ---- Layout ---------------------------------------------------------- */

/** Page wrapper: title row with optional actions, then content. */
export function Page({ title, subtitle, actions, children, className = "" }) {
  return (
    <section className={cx("mx-auto w-full max-w-6xl", className)}>
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-normal! text-ink-strong">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </header>
      {children}
    </section>
  );
}

export function Card({ title, description, actions, children, className = "", bodyClassName = "" }) {
  return (
    <div className={cx("rounded-md border border-line bg-surface", className)}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold tracking-normal! text-ink-strong">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-ink-muted">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cx("p-4", bodyClassName)}>{children}</div>
    </div>
  );
}

/* ---- Form controls --------------------------------------------------- */

export const inputClass =
  "w-full rounded-md border border-line bg-page/60 px-3 py-2 text-sm text-ink-strong outline-none transition-colors duration-150 placeholder:text-ink-muted focus:border-success focus:ring-2 focus:ring-success/25 disabled:cursor-not-allowed disabled:opacity-60";
const inputErrorClass = "border-danger bg-danger/5 focus:border-danger focus:ring-danger/25";

/** Label + control + hint/error. Pass the control as children. */
export function Field({ label, hint, error, required, children, className = "" }) {
  return (
    <label className={cx("flex min-w-0 flex-col gap-1.5", className)}>
      {label && (
        <span className="text-xs font-medium text-ink">
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </span>
      )}
      {children}
      {error ? (
        <span className="text-xs text-danger">{error}</span>
      ) : (
        hint && <span className="text-xs text-ink-muted">{hint}</span>
      )}
    </label>
  );
}

export const Input = forwardRef(function Input({ error, className = "", ...props }, ref) {
  return <input ref={ref} className={cx(inputClass, error && inputErrorClass, className)} {...props} />;
});

export const Textarea = forwardRef(function Textarea({ error, rows = 4, className = "", ...props }, ref) {
  return <textarea ref={ref} rows={rows} className={cx(inputClass, "resize-y", error && inputErrorClass, className)} {...props} />;
});

export const Select = forwardRef(function Select({ error, className = "", children, ...props }, ref) {
  return (
    <select ref={ref} className={cx(inputClass, "cursor-pointer", error && inputErrorClass, className)} {...props}>
      {children}
    </select>
  );
});

export function Toggle({ checked, onChange, label, hint }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 size-4 accent-[var(--color-success,#2fbf71)]" />
      <span className="min-w-0">
        <span className="block text-sm text-ink-strong">{label}</span>
        {hint && <span className="block text-xs text-ink-muted">{hint}</span>}
      </span>
    </label>
  );
}

/* ---- Buttons and badges ---------------------------------------------- */

const BUTTON = {
  primary: "bg-success text-black! hover:brightness-110",
  secondary: "border border-line bg-surface-raised text-ink-strong hover:border-success/50",
  ghost: "text-ink hover:bg-surface-raised hover:text-ink-strong",
  danger: "border border-danger/40 text-danger hover:bg-danger/10",
};

export function Button({ variant = "secondary", size = "md", loading = false, className = "", children, disabled, type = "button", ...props }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cx(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium tracking-normal! transition duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-4 py-2 text-sm",
        BUTTON[variant],
        className
      )}
      {...props}
    >
      {loading && <span aria-hidden="true" className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}

const BADGE = {
  neutral: "border-line text-ink-muted",
  success: "border-success/40 bg-success/10 text-success",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  danger: "border-danger/40 bg-danger/10 text-danger",
};
export function Badge({ tone = "neutral", children }) {
  return <span className={cx("inline-flex items-center rounded-full border px-2 py-0.5 text-xs", BADGE[tone])}>{children}</span>;
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="rounded-md border border-dashed border-line px-6 py-10 text-center">
      <p className="text-sm font-medium text-ink-strong">{title}</p>
      {message && <p className="mx-auto mt-1 max-w-md text-xs text-ink-muted">{message}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

/* ---- Confirm dialog -------------------------------------------------- */

export function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onCancel?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4" onClick={onCancel}>
      <div className="w-full max-w-sm rounded-md border border-line bg-surface p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-base font-semibold tracking-normal! text-ink-strong">{title}</h2>
        {message && <p className="mt-2 text-sm text-ink">{message}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

/* ---- Toasts ---------------------------------------------------------- */

const ToastContext = createContext({ toast: () => {} });
export const useToast = () => useContext(ToastContext);

/** Mounted once in BackOfficePage. `toast("Saved")` or `toast("Failed", "danger")`. */
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const nextId = useRef(1);
  const toast = useCallback((message, tone = "success") => {
    const id = nextId.current++;
    setItems((list) => [...list, { id, message, tone }]);
    setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), tone === "danger" ? 6000 : 3500);
  }, []);
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 left-1/2 z-[1200] flex -translate-x-1/2 flex-col items-center gap-2">
        {items.map((t) => (
          <div key={t.id} className={cx("pointer-events-auto rounded-md border px-4 py-2 text-sm shadow-lg", t.tone === "danger" ? "border-danger/50 bg-surface text-danger" : "border-success/40 bg-surface text-ink-strong")}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ---- Stepper --------------------------------------------------------- */

/**
 * Horizontal step indicator. `steps` is [{ id, label, done? }], `current` an id.
 * Clicking a step calls onStep(id); disable navigation by omitting onStep.
 */
export function Stepper({ steps, current, onStep }) {
  return (
    <ol className="flex flex-wrap gap-1.5" aria-label="Steps">
      {steps.map((s, i) => {
        const active = s.id === current;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={onStep ? () => onStep(s.id) : undefined}
              aria-current={active ? "step" : undefined}
              className={cx(
                "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-xs transition-colors duration-150",
                active ? "border-success/50 bg-success/10 text-success" : "border-line text-ink hover:border-success/40",
                !onStep && "cursor-default"
              )}
            >
              <span className={cx("flex size-5 items-center justify-center rounded-full text-[0.7rem]", s.done ? "bg-success text-black" : "bg-surface-raised text-ink-strong")}>
                {s.done ? "✓" : i + 1}
              </span>
              {s.label}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/* ---- Helpers --------------------------------------------------------- */

const unsavedOwners = new Set();
/** True while any mounted screen reports unsaved work (see useUnsavedGuard). */
export const hasUnsavedChanges = () => unsavedOwners.size > 0;

/** Warns before closing the tab, and lets the shell ask before switching screens. */
export function useUnsavedGuard(dirty) {
  useEffect(() => {
    if (!dirty) return undefined;
    const owner = {};
    unsavedOwners.add(owner);
    return () => unsavedOwners.delete(owner);
  }, [dirty]);
  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
}
