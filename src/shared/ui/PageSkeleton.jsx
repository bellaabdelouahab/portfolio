import { useT } from "../i18n/strings";
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

/** Compact project cards, matching ProjectCard (16:10 image, text lines). */
function ProjectGrid({ cards = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-line bg-surface">
          <Box className="aspect-[16/10] rounded-none" />
          <div className="space-y-3 p-4">
            <Box className="h-3 w-1/3" />
            <Box className="h-5 w-4/5" />
            <Box className="h-3 w-full" />
            <Box className="h-3 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectsListSkeleton() {
  return (
    <>
      <Box className="mb-2 h-9 w-48" />
      <Box className="mb-6 h-4 w-96 max-w-full" />
      <div className="mb-5 flex gap-6 border-b border-line pb-3"><Box className="h-5 w-32" /><Box className="h-5 w-40" /></div>
      <div className="mb-6 flex gap-2"><Box className="h-8 w-28 rounded-full" /><Box className="h-8 w-40 rounded-full" /><Box className="h-8 w-36 rounded-full" /></div>
      <ProjectGrid />
    </>
  );
}

/** Case study: title and text beside a screenshot, a meta strip, key numbers. */
function ProjectDetailSkeleton() {
  return (
    <>
      <Box className="mb-5 h-4 w-56" />
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <Box className="h-3 w-28" />
          <Box className="h-10 w-4/5" />
          <Box className="h-4 w-full" />
          <Box className="h-4 w-5/6" />
          <div className="flex gap-3 pt-2"><Box className="h-10 w-36" /><Box className="h-10 w-32" /></div>
        </div>
        <Box className="aspect-[16/10] w-full" />
      </div>
      <Box className="mt-8 h-20 w-full" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Box key={i} className="h-24" />)}
      </div>
    </>
  );
}

/** Service page: icon, title, price, a checklist panel and four steps. */
function ServiceSkeleton() {
  return (
    <>
      <div className="mb-10 flex flex-col items-center gap-4">
        <Box className="size-16 rounded-full" />
        <Box className="h-9 w-72" />
        <Box className="h-4 w-full max-w-3xl" />
        <Box className="h-4 w-4/5 max-w-2xl" />
        <Box className="h-6 w-56" />
      </div>
      <Box className="mb-4 h-7 w-40" />
      <Box className="mb-12 h-40 w-full" />
      <Box className="mb-5 h-7 w-40" />
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Box key={i} className="h-24" />)}
      </div>
    </>
  );
}

function CertificatesSkeleton() {
  return (
    <>
      <Box className="mb-2 h-9 w-56" />
      <Box className="mb-8 h-4 w-96 max-w-full" />
      <div className="mb-10 grid gap-5 md:grid-cols-2"><Box className="h-36" /><Box className="h-36" /></div>
      <Box className="mb-5 h-6 w-48" />
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-3"><Box className="size-24" /><Box className="h-3 w-24" /></div>
        ))}
      </div>
    </>
  );
}

function TeamSkeleton() {
  return (
    <>
      <Box className="mb-2 h-9 w-40" />
      <Box className="mb-8 h-4 w-80 max-w-full" />
      <div className="grid gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-md border border-line bg-surface p-5">
            <Box className="size-24 rounded-full" /><Box className="h-5 w-40" /><Box className="h-3 w-full" /><Box className="h-3 w-4/5" />
          </div>
        ))}
      </div>
    </>
  );
}

function HomeSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_20rem] md:items-center">
      <div className="space-y-5">
        <Box className="h-3 w-56" />
        <Box className="h-14 w-full" />
        <Box className="h-14 w-4/5" />
        <Box className="h-4 w-2/3" />
        <div className="flex gap-3"><Box className="h-11 w-36" /><Box className="h-11 w-32" /><Box className="h-11 w-40" /></div>
      </div>
      <Box className="mx-auto size-64 rounded-full" />
    </div>
  );
}

const VARIANTS = {
  home: HomeSkeleton,
  projects: ProjectsListSkeleton,
  project: ProjectDetailSkeleton,
  service: ServiceSkeleton,
  certificates: CertificatesSkeleton,
  team: TeamSkeleton,
};

/** Picks the skeleton that matches the page being navigated to. */
export function variantForPath(rawPath = "") {
  const path = rawPath.replace(/^\/fr(?=\/|$)/, "") || "/";
  if (path === "/" || path === "") return "home";
  if (path.startsWith("/projects/")) return "project";
  if (path.startsWith("/projects")) return "projects";
  if (path.startsWith("/services/")) return "service";
  if (path.startsWith("/certificates")) return "certificates";
  if (path.startsWith("/my-team")) return "team";
  return "projects";
}

export default function PageSkeleton({ variant = "projects" }) {
  const t = useT();
  const Body = VARIANTS[variant] || ProjectsListSkeleton;
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="mx-auto w-full max-w-6xl px-5 py-10">
      <span className="sr-only">{t("loading")}</span>
      <Body />
    </div>
  );
}
