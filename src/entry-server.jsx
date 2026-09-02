import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom/server";
import { Helmet } from "react-helmet";
import { SkeletonTheme } from "react-loading-skeleton";
import { routes } from "./routes";

const handler = createStaticHandler(routes);

/**
 * Runs the route's loader(s) via the same `routes` table the client uses,
 * then renders the matched route to a string. Returns everything
 * server/index.mjs needs to assemble the final HTML response: the rendered
 * markup, the collected <head> tags SEO.jsx produced via react-helmet, the
 * HTTP status to respond with, and the loader data to hand back to the
 * client so hydration doesn't re-fetch it.
 */
export async function render(url, requestHeaders = {}) {
  const request = new Request(url, { headers: requestHeaders });
  const context = await handler.query(request);

  // A loader threw a Response (e.g. a redirect) — let the caller issue a
  // real HTTP redirect instead of rendering HTML.
  if (context instanceof Response) {
    return { redirect: context };
  }

  const router = createStaticRouter(handler.dataRoutes, context);

  const appHtml = renderToString(
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <StaticRouterProvider router={router} context={context} />
    </SkeletonTheme>
  );

  const helmet = Helmet.renderStatic();

  // The catch-all `*` route matching is how NotFoundPage renders, but that
  // shouldn't mean a 200 — GitHub Pages' 404.html served a real 404 for
  // unknown paths, and crawlers should keep seeing that signal under SSR too.
  const statusCode = context.matches.some((match) => match.route.path === "*")
    ? 404
    : context.statusCode || 200;

  return {
    appHtml,
    helmet,
    statusCode,
    hydrationData: {
      loaderData: context.loaderData,
      actionData: context.actionData,
      errors: context.errors,
    },
  };
}
