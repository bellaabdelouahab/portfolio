# Light and dark theme

Branch `light-mode` (exploration). Dark stays the default look; light is added.

## How it works
- Colours are CSS variables from `src/shared/styles/tailwind.css` (`@theme`). Dark values are the defaults. `html[data-theme="light"]` re-declares them; `[data-theme="dark"]` restores the dark values inside a container that must stay dark (the hero band).
- `index.html` sets `data-theme` before first paint from `localStorage.theme` ("light" or "dark"), else from `prefers-color-scheme`. `src/shared/ui/ThemeToggle.jsx` (in the navbar footer) changes it and stores the choice.
- Use tokens, never literals: `bg-page`, `bg-surface`, `bg-surface-raised`, `border-line`, `text-ink`, `text-ink-strong`, `text-ink-muted`, `text-success`, `bg-success`, `text-danger`, `bg-accent`; in hand-written CSS use `var(--color-...)`. Translucent forms (`bg-page/60`, `border-line/50`) keep working.
- Do not use `text-white`, `text-black` (except on a solid `bg-success` button), `bg-black/..`, `bg-white/..`, `border-white/..`, or hex values for surfaces and text.

## Palette
| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| page | #232323 | #f6f7f8 | page background |
| main | #1c1c1c | #f1f3f5 | scrolling area behind sections |
| surface | #2e2e2e | #ffffff | cards, panels |
| surface-raised | #383838 | #eef0f3 | hover and nested surfaces |
| line | #3a3a3a | #dcdfe4 | borders, dividers |
| rail / rail-line | #171717 / #2a2a2a | #ffffff / #e5e7eb | side rail, mobile top bar |
| ink-strong | #ffffff | #0f1419 | headings |
| ink | #bbbbbb | #3b4350 | body text |
| ink-muted | #888888 | #667085 | captions |
| success | #2ac17f | #12875a | accent, links, active states (text contrast on white 4.6:1) |
| accent | #d91b42 | #d91b42 | brand red |
| danger | #ff4d4d | #d62f2f | errors |

Brand colours that never change: WhatsApp green (#25d366), the Calendly button.

## Rules for light mode
- Text contrast at least 4.5:1 (body) and 3:1 (large text and icons).
- Photographic and dark screenshots stay as they are; any overlay or text on a photo keeps its own dark scrim.
- The hero keeps its dark photographic look in both themes (it sets `data-theme="dark"` on itself).
- The back office may stay dark; it is not part of this work.

## Status (branch light-mode)
- Done: tokens and light palette, no-flash script, toggle, shell (rail, mobile bar, skeletons), home, projects (incl. light code highlighting), services, certificates, team, contact.
- Choices: the hero stays dark in both themes and fades into the next section; the back office stays dark; brand colours unchanged.
- Known soft spots: the dark-to-light fade under the hero is a grey band (acceptable, could be a clean edge); the FAQ column has empty space on wide screens (pre-existing).
- Not merged: production runs `master` (dark only) until this branch is approved.
