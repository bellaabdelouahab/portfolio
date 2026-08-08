import { useLocation } from "react-router-dom";
import SEO from "../../shared/ui/SEO";

const NotFound = () => {
  const location = useLocation();
  return (
    <div style={{ textAlign: "center", color: "white" }}>
      <SEO title="Page Not Found" noIndex />
      <h1>404 - Page Not Found</h1>
      <p>The requested URL <code>{location.pathname}</code> was not found on this server.</p>
    </div>
  );
};

export default NotFound;
