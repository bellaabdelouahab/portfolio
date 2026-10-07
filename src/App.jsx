import { RouterProvider } from "react-router-dom";

// The router is constructed in entry-client.jsx (async, awaiting full
// initialization before the first hydrateRoot call — see the comment there
// for why) rather than here, so it's passed in as a prop.
export default function App({ router }) {
  return <RouterProvider router={router} />;
}
