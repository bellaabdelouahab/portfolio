/**
 * Placeholder shown while a route's loader is running.
 *
 * Why this exists: createBrowserRouter blocks the navigation until the route's
 * loader resolves. Until then the router keeps rendering the PREVIOUS page, so
 * clicking a link appeared to do nothing for a second or two and then the new
 * page snapped in — the "freeze then sudden switch". Nothing was broken; there
 * was simply no pending state, so the wait was invisible and felt like a hang.
 *
 * Skeletons rather than a spinner: a spinner says "something is happening", a
 * skeleton says "this is what is arriving and where", so the eye settles before
 * the content lands and nothing jumps when it does. The shapes deliberately
 * approximate the real layouts — a skeleton that does not match what replaces it
 * causes exactly the layout shift it was meant to prevent.
 */

const Box = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-surface-raised/60 ${className}`} />
);

/** Card grid — projects, certificates, reports. */
function CardGridSkeleton({ cards = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-line bg-surface">
          <Box className="h-44 rounded-none" />
          <div className="space-y-3 p-4">
            <Box className="h-5 w-3/4" />
            <Box className="h-3 w-full" />
            <Box className="h-3 w-5/6" />
            <Box className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Long-form page — resume, a single project, an article. */
function ArticleSkeleton() {
  return (
    <div className="space-y-6">
      <Box className="h-10 w-2/3 max-w-lg" />
      <Box className="h-64 w-full rounded-lg" />
      <div className="space-y-3">
        <Box className="h-3 w-full" />
        <Box className="h-3 w-11/12" />
        <Box className="h-3 w-4/5" />
        <Box className="h-3 w-9/12" />
      </div>
    </div>
  );
}

export default function PageSkeleton({ variant = "cards" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="mx-auto w-[90%] max-w-7xl py-12"
    >
      <span className="sr-only">Loading page…</span>
      <Box className="mb-8 h-9 w-64" />
      {variant === "article" ? <ArticleSkeleton /> : <CardGridSkeleton />}
    </div>
  );
}
