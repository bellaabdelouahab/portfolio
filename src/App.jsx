import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { routes } from "./routes";
import { trackVisitor } from "./shared/lib/visitorTracking";

// Hydrates against data already resolved server-side (see entry-server.jsx),
// so the initial route doesn't re-fetch on mount — only client-side
// navigations after this call their loaders.
const router = createBrowserRouter(routes, {
  hydrationData: typeof window !== "undefined" ? window.__staticRouterHydrationData : undefined,
});

function App() {
  // trackVisitor only ever runs here, in a browser-only effect — it never
  // executes during SSR (effects don't run server-side), so real visits are
  // never double-counted or logged during a render that never reaches a browser.
  useEffect(() => {
    trackVisitor();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
