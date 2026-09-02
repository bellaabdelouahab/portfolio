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
import App from "./App";

const root = document.getElementById("root");

// hydrateRoot, not createRoot: the server already sent real markup in #root
// (see entry-server.jsx / server/index.mjs) — createRoot would discard it and
// re-render from scratch client-side, throwing away the whole point of SSR.
ReactDOM.hydrateRoot(
  root,
  <SkeletonTheme baseColor="#202020" highlightColor="#444">
    <App />
  </SkeletonTheme>
);
