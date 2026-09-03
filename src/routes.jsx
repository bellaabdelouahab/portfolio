// Single source of truth for the route tree, consumed by both the client
// entry (createBrowserRouter) and the server entry (createStaticHandler /
// createStaticRouter). Each route resolves its component AND loader together
// via `lazy`, which both the browser router and the SSR static handler know
// how to await — this is what lets one route table serve both without a
// separate prerender pass.
export const routes = [
  {
    path: "/",
    lazy: async () => {
      const { default: Component } = await import("./front-office/layout/Root");
      return { Component };
    },
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Component, getHighlightedProjects: loader } =
            await import("./front-office/home/HomePage");
          return { Component, loader };
        },
      },
      {
        path: "projects",
        lazy: async () => {
          const { default: Component, getProjects: loader } =
            await import("./front-office/projects/ProjectListPage");
          return { Component, loader };
        },
      },
      {
        path: "projects/:title",
        lazy: async () => {
          const { default: Component } =
            await import("./front-office/projects/ProjectDetailPage");
          return { Component };
        },
      },
      {
        path: "services/:id",
        lazy: async () => {
          const { default: Component, getServiceDetail: loader } =
            await import("./front-office/services/ServiceDetailPage");
          return { Component, loader };
        },
      },
      {
        path: "certificates",
        lazy: async () => {
          const { default: Component } =
            await import("./front-office/certificates/CertificatesPage");
          const { getAllCertificates: loader } =
            await import("./shared/lib/firebaseQueries");
          return { Component, loader };
        },
      },
      {
        path: "resume",
        lazy: async () => {
          const { default: Component } =
            await import("./front-office/resume/ResumePage");
          return { Component };
        },
      },
      {
        path: "my-team",
        lazy: async () => {
          const { default: Component } =
            await import("./front-office/team/TeamPage");
          return { Component };
        },
      },
      {
        path: "music",
        lazy: async () => {
          const { default: Component } =
            await import("./front-office/music/MusicPage");
          return { Component };
        },
      },
      {
        path: "reports",
        lazy: async () => {
          const { default: Component, getReports: loader } =
            await import("./front-office/reports/ReportsPage");
          return { Component, loader };
        },
      },
      {
        path: "articles",
        lazy: async () => {
          const { default: Component } =
            await import("./front-office/articles/ArticlesPage");
          return { Component };
        },
      },
      {
        path: "site-map",
        lazy: async () => {
          const { default: Component } =
            await import("./front-office/sitemap/SiteMapPage");
          return { Component };
        },
      },
      // The admin area stays INSIDE the site layout deliberately: the
      // front-office navbar is how you jump back to a public page while
      // editing, and it owns the Ctrl+A shortcut that opens this route.
      {
        path: "fill-db",
        lazy: async () => {
          // Admin area is client-only in practice (Firebase Auth gate,
          // pdfjs-dist, direct DOM work throughout its forms) and noIndex —
          // no SEO reason to SSR it, and real reasons not to. The server
          // gets a tiny shell; the browser always loads the real page, so
          // this only ever swaps on the client's first render, before any
          // effect runs.
          if (typeof window === "undefined") {
            const { default: Component } = await import("./back-office/AdminShell");
            return { Component };
          }
          const { default: Component } =
            await import("./back-office/BackOfficePage");
          return { Component };
        },
      },
      {
        path: "*",
        lazy: async () => {
          const { default: Component } =
            await import("./front-office/not-found/NotFoundPage");
          return { Component };
        },
      },
    ],
  },
];
