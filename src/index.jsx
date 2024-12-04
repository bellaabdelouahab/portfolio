import ReactDOM from "react-dom/client";
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
