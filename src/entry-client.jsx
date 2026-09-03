import ReactDOM from "react-dom/client";
// Must come first — page styles below rely on overriding it.
import "./shared/styles/legacy-base.css";
import "./shared/styles/minw-1000.css";
import "./shared/styles/global.css";
// Last, so utilities sit after the hand-written CSS in source order. Note that
// source order is not the whole story — see the layer comment in tailwind.css.
import "./shared/styles/tailwind.css";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { routes } from "./routes";

async function hydrate() {
  // Hydrates against data already resolved server-side (see
  // entry-server.jsx), so the initial route doesn't re-fetch on mount —
  // only client-side navigations after this call their loaders.
  const router = createBrowserRouter(routes, {
    hydrationData: window.__staticRouterHydrationData,
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
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <App router={router} />
    </SkeletonTheme>
  );
}

hydrate();
