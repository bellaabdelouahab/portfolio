/**
 * Shared Tailwind class strings for the project form's popup sub-forms.
 *
 * WHY THIS FILE EXISTS
 * The selectors these replace (.form-group, .form-control, .submit-btn,
 * .close-button, .form-title …) lived as GLOBAL rules inside
 * code-sample-form/CodeSampleForm.css. Four sibling forms — Techs, Resources,
 * Data Sources, Carousel — never imported that file and were styled by it
 * anyway, purely because every form ships in the same bundle. Deleting or
 * lazy-loading CodeSampleForm would have silently unstyled the other four.
 * Exporting the strings keeps one source of truth and makes the dependency a
 * real import.
 *
 * ONE ACCENT: `success`.
 * The form previously ran three competing accents — an indigo primary button,
 * a violet upload icon, and green borders/headings — with no rule for which
 * meant what. The admin shell (BackOfficePage) already uses `success` for its
 * active state, so everything affirmative is green here too. `danger` is
 * reserved for destructive actions: close, delete, clear, validation errors.
 */

/* ---- Main form fields (was form-components.css) ------------------------
   Consumers: IndexForm.jsx (every field component), GithubTokenInput.jsx
   (toggleRow / toggleLabel / toggleDesc / fieldInput / requiredMark) and
   ProjectForm.jsx (fieldRow). Nothing outside project-form/ used these.

   Sizes: the old values were fractional rem left over from the 62.5%-root
   migration — 0.46875rem is 7.5px, 0.4875rem is 7.8px. Anything under 11px is
   raised to text-xs (12px) here, which is most of them. */

export const fieldRow = "mb-4 grid w-full grid-cols-2 gap-4";

export const fieldFlow = "flex w-full flex-col gap-1.5";

export const fieldSmallLabel = "text-xs font-medium tracking-[0.01em] text-ink";

export const requiredMark = "ml-[3px] text-danger";

// The date picker's indicator is black-on-black without the invert.
export const fieldInput =
  "w-full rounded-md border border-line bg-page px-2.5 py-2 text-xs text-ink-strong shadow-[inset_0_1px_2px_rgb(0_0_0/0.2)] outline-none transition-colors duration-200 ease-standard placeholder:text-ink-muted hover:border-success/40 hover:bg-surface focus:border-success focus:ring-2 focus:ring-success/20 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:invert-[0.85] hover:[&::-webkit-calendar-picker-indicator]:opacity-100";

export const fieldTextarea = "min-h-30 resize-y leading-relaxed";

export const fieldHint = "text-xs leading-relaxed text-ink-muted";

export const fieldErrorText = "text-xs leading-relaxed text-danger";

/* ---- Toggle row -------------------------------------------------------- */

export const toggleRow =
  "my-2 flex w-full cursor-pointer items-center justify-between rounded-md border border-line bg-page p-3 transition-colors duration-200 ease-standard hover:border-success/40 hover:bg-surface";

export const toggleLabel = "block text-xs font-medium text-ink-strong";

// Was 7.8px on #64748b against #1D242C — roughly 2.5:1 and effectively
// unreadable. This is one of the descriptions the redesign was asked to fix.
export const toggleDesc = "text-xs leading-relaxed text-ink-muted";

/* ---- Popup shell ------------------------------------------------------- */

export const popupOverlay =
  "fixed inset-0 z-1000 flex items-center justify-center bg-black/60 p-4";

// ml-30 (120px) is not decoration: the public navbar is a fixed rail on the
// left of the admin screen, and a centred panel sits partly underneath it.
export const popupPanel =
  "relative ml-30 max-h-[90vh] rounded-lg bg-surface p-5 text-ink shadow-lg";

export const popupClose =
  "absolute -top-4 -right-4 flex size-9 cursor-pointer items-center justify-center rounded-full bg-danger text-base text-white shadow-md transition-transform duration-200 ease-standard hover:scale-110";

// Was a blue gradient clipped to the text (#4b6cb7 -> #182848), which rendered
// the right half of every popup heading almost black on a dark panel.
export const popupTitle =
  "mb-6 flex items-center justify-center text-2xl leading-snug font-semibold text-success";

export const popupTitleIcon = "mr-2.5 text-success";

/* ---- Fields ------------------------------------------------------------ */

export const fieldGroup = "mb-5";

export const fieldLabel = "mb-2 block font-medium text-ink";

export const control =
  "w-full rounded-sm border border-line bg-page px-4 py-3 text-ink-strong outline-none transition-colors duration-200 ease-standard placeholder:text-ink-muted focus:border-success focus:ring-2 focus:ring-success/25";

export const helperRow =
  "mt-2 flex items-center gap-1.5 text-xs leading-relaxed text-ink-muted";

export const helperIcon = "text-success";

export const formError =
  "mb-5 rounded-sm border-l-4 border-danger bg-danger/15 p-2.5 text-sm leading-relaxed text-danger";

/* ---- Actions ----------------------------------------------------------- */

export const formActions = "mt-8 flex justify-end gap-2.5";

// text-page, not text-white: white on #2ac17f is about 2.4:1 and fails at any
// size. The dark page colour on the same green is ~7:1.
export const btnPrimary =
  "cursor-pointer rounded-sm bg-success px-5 py-2.5 font-medium text-page transition-colors duration-200 ease-standard hover:bg-success/85 disabled:cursor-not-allowed disabled:opacity-50";

export const btnGhost =
  "cursor-pointer rounded-sm border border-line bg-surface-raised px-5 py-2.5 text-ink transition-colors duration-200 ease-standard hover:border-ink-muted hover:text-ink-strong";

/* ---- Quick-pick panel (Techs "Quick Select", Resources "Resource Type") -- */

export const pickerPanel = "mb-5 rounded-sm border border-success/30 bg-page p-4";

export const pickerLabel = "mb-2.5 block font-medium text-ink";

export const pickerRow = "flex flex-wrap gap-2";

export const pickerChip =
  "cursor-pointer rounded-full border border-success/40 bg-success/15 px-3 py-1.5 text-xs text-success transition-colors duration-200 ease-standard hover:bg-success hover:text-page";

/* ---- Two-column popup body: form on the left, added-items list on the
        right. Was PopupShared.css. --------------------------------------- */

export const bodySplit = "flex flex-col items-stretch gap-4 sm:flex-row";

export const bodyFormCol = "min-w-0 flex-1";

// The webkit-scrollbar pseudo-elements are reachable from Tailwind as arbitrary
// variants, so this no longer needs a stylesheet of its own.
export const bodyListCol =
  "flex max-h-50 w-full shrink-0 flex-col gap-1.5 overflow-y-auto pr-0.5 sm:max-h-120 sm:w-65 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-success/60";

export const listHeading =
  "mb-1 text-xs font-bold tracking-[0.05em] text-ink-muted uppercase";

export const listEmpty =
  "py-2.5 text-center text-xs leading-relaxed text-ink-muted";

export const listItem =
  "flex cursor-pointer items-center gap-1.5 rounded-md border p-1.5 transition-colors duration-150 ease-standard";

export const listItemIdle =
  "border-line bg-surface-raised hover:border-success/60 hover:bg-success/10";

export const listItemActive = "border-success bg-success/15";

export const listThumb = "size-10 shrink-0 rounded-sm bg-page object-cover";

export const listThumbPlaceholder =
  "flex items-center justify-center text-xs text-ink-muted";

export const listItemInfo = "min-w-0 flex-1";

export const listItemTitle =
  "truncate text-xs leading-relaxed text-ink-strong";

export const listItemMeta = "text-xs leading-relaxed text-ink-muted";

export const listItemDelete =
  "shrink-0 cursor-pointer rounded-sm p-1 text-danger transition-colors duration-150 ease-standard hover:bg-danger/20";
