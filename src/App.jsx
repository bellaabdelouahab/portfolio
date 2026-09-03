import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { trackVisitor } from "./shared/lib/visitorTracking";

// The router is constructed in entry-client.jsx (async, awaiting full
// initialization before the first hydrateRoot call — see the comment there
// for why) rather than here, so it's passed in as a prop.
export default function App({ router }) {
  // trackVisitor only ever runs here, in a browser-only effect — it never
  // executes during SSR (effects don't run server-side), so real visits are
  // never double-counted or logged during a render that never reaches a browser.
  useEffect(() => {
    trackVisitor();
  }, []);

  return <RouterProvider router={router} />;
}
