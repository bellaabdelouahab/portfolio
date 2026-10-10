import ReactDOM from "react-dom/client";
// Must come first — page styles below rely on overriding it.
import "./shared/styles/legacy-base.css";
import "./shared/styles/minw-1000.css";
import "./shared/styles/global.css";
// Last, so utilities sit after the hand-written CSS in source order. Note that
// source order is not the whole story — see the layer comment in tailwind.css.
import "./shared/styles/tailwind.css";
import "react-loading-skeleton/dist/skeleton.css";
// Font Awesome injects its own CSS at runtime, which does not happen reliably
// with server-rendered pages: until it did, every nav icon rendered at the size
// of its container. Loading the stylesheet explicitly fixes that.
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import { SkeletonTheme } from "react-loading-skeleton";
import { createBrowserRouter, matchRoutes } from "react-router-dom";
import App from "./App";
import { routes } from "./routes";
import { setSiteSettings } from "./shared/lib/siteSettings";

// Same overrides the server rendered with, set before hydrating so both match.
setSiteSettings(window.__SITE_SETTINGS__ || {});

// A deploy replaces the hashed JS chunks. A tab left open still points at the old
// ones, so the next navigation fails to import them. Reload once to pick up the
// new build (at most once every 10 seconds, to avoid a loop if the server is down).
const CHUNK_ERROR = /dynamically imported module|Importing a module script failed|error loading dynamically/i;
function reloadForNewBuild() {
  try {
    const last = Number(sessionStorage.getItem("chunk-reload") || 0);
    if (Date.now() - last < 10000) return;
    sessionStorage.setItem("chunk-reload", String(Date.now()));
  } catch {
    // storage unavailable: reload anyway, the router will not loop on its own
  }
  window.location.reload();
}
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  reloadForNewBuild();
});
window.addEventListener("unhandledrejection", (event) => {
  if (CHUNK_ERROR.test(String(event.reason?.message || event.reason))) reloadForNewBuild();
});

async function hydrate() {
  // Hydrates against data already resolved server-side (see
  // entry-server.jsx), so the initial route doesn't re-fetch on mount —
  // only client-side navigations after this call their loaders.
  // Resolve the lazy modules of the matched routes BEFORE creating the router.
  // Otherwise React Router sees `lazy` routes, assumes they may have loaders,
  // and re-runs them on first load even though the server already sent their
  // data. That second read was harmless in a browser but fatal for Googlebot,
  // which does not fetch /api/*: the page swapped its server-rendered content
  // for an error screen and Search Console reported a soft 404.
  const lazyMatches = (matchRoutes(routes, window.location) || []).filter((m) => m.route.lazy);
  await Promise.all(
    lazyMatches.map(async (m) => {
      const mod = await m.route.lazy();
      Object.assign(m.route, { ...mod, lazy: undefined });
    })
  );
  const router = createBrowserRouter(routes, {
    hydrationData: window.__staticRouterHydrationData,
  });


  router.subscribe((state) => {
    const errors = Object.values(state.errors || {});
    if (errors.some((e) => CHUNK_ERROR.test(String(e?.message || e)))) reloadForNewBuild();
  });

  // Every route here uses `lazy` for code-splitting, so on first load the
  // matched route's Component isn't available yet — router.state.initialized
  // starts false and only flips once that dynamic import resolves. Calling
  // hydrateRoot before then means RouterProvider's first render has nothing
  // to show yet, which reads to React as a top-level hydration mismatch
  // against the real server-rendered #root content. React's recovery from
  // that mismatch mounts a second, freshly client-rendered tree once the
  // lazy module resolves, but without clearing the original server markup
  // first — the visible symptom was the entire page appearing twice,
  // stacked, after every route's JS loaded. Waiting for full
  // initialization here means the very first hydrateRoot call already has
  // everything it needs, so it can match the server's output in one pass.
  if (!router.state.initialized) {
    await new Promise((resolve) => {
      const unsubscribe = router.subscribe((state) => {
        if (state.initialized) {
          unsubscribe();
          resolve();
        }
      });
    });
  }

  const root = document.getElementById("root");

  // hydrateRoot, not createRoot: the server already sent real markup in #root
  // (see entry-server.jsx / server/index.mjs) — createRoot would discard it
  // and re-render from scratch client-side, throwing away the whole point of
  // SSR.
  ReactDOM.hydrateRoot(
    root,
    <SkeletonTheme baseColor="var(--skeleton-base)" highlightColor="var(--skeleton-highlight)">
      <App router={router} />
    </SkeletonTheme>
  );
}

hydrate();
