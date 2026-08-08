import ReactDOM from "react-dom/client";
// Must come first — page styles below rely on overriding it.
import "./shared/styles/legacy-base.css";
import "./minw-1000.css";
import "./index.css";
import "react-loading-skeleton/dist/skeleton.css"; 
import { SkeletonTheme } from "react-loading-skeleton";
import App from "./App";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <SkeletonTheme baseColor="#202020" highlightColor="#444">
    <App />
  </SkeletonTheme>
);
