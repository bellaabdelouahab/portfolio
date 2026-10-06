/**
 * Inline placeholder images.
 *
 * These replace https://via.placeholder.com/..., a third-party generator that has
 * since been discontinued — so every report without a cover rendered as an empty
 * black rectangle, and every team member without an avatar showed a broken image.
 *
 * Data URIs rather than files: they cost no request, cannot 404, work offline and
 * during the build-time prerender, and are styled to match the dark theme instead
 * of flashing a light grey box.
 */

const svg = (markup) => `data:image/svg+xml,${encodeURIComponent(markup)}`;

/** Portrait placeholder for report covers (matches the 175x250 card art). */
export const coverPlaceholder = svg(`
<svg xmlns="http://www.w3.org/2000/svg" width="175" height="250" viewBox="0 0 175 250">
  <rect width="175" height="250" fill="#2e2e2e"/>
  <g fill="none" stroke="#4a4a4a" stroke-width="2">
    <rect x="47" y="86" width="81" height="100" rx="4"/>
    <path d="M62 112h51M62 130h51M62 148h34"/>
  </g>
  <text x="87.5" y="212" fill="#888" font-family="sans-serif" font-size="12" text-anchor="middle">No cover</text>
</svg>`);

/** Square placeholder for avatars. */
export const avatarPlaceholder = svg(`
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="32" fill="#383838"/>
  <circle cx="32" cy="25" r="11" fill="#5a5a5a"/>
  <path d="M12 60c0-11 9-18 20-18s20 7 20 18z" fill="#5a5a5a"/>
</svg>`);
