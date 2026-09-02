import SEO from "../shared/ui/SEO";

/**
 * Server-side stand-in for /fill-db. The real BackOfficePage tree eagerly
 * pulls in pdfjs-dist (ReportForm) and does browser-only setup throughout
 * its forms — none of it SSR-safe, and none of it worth making SSR-safe:
 * this route is noIndex, owner-only, and always used interactively. Routes.js
 * only reaches this component on the server; the browser always loads the
 * real BackOfficePage, so the swap happens on first client render, before
 * any effects run.
 */
export default function AdminShell() {
  return (
    <>
      <SEO title="Admin" noIndex />
      <div style={{ minHeight: "50vh" }} />
    </>
  );
}
