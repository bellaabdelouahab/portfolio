/**
 * Build-time prerenderer.
 *
 * GitHub Pages has no server-side rewrite: it serves `404.html` with an HTTP 404
 * status for any path that is not a real file on disk. Googlebot treats that 404
 * as "this page does not exist" and stops before running any JavaScript, so every
 * client-side route was unindexable no matter what the SPA rendered.
 *
 * This script fixes that by writing a real `build/<route>/index.html` for every
 * route, so GitHub Pages answers `/projects` with a 200 and fully rendered markup.
 * `404.html` then only handles genuinely unknown URLs, which is what it is for.
 *
 * Routes come from prerender-routes.json, written by scripts/generate-sitemap.js,
 * so the pages we generate and the URLs we advertise cannot drift apart.
 */

const fs = require('fs');
const http = require('http');
const path = require('path');
const puppeteer = require('puppeteer');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const ROUTES_MANIFEST = path.join(__dirname, '..', 'prerender-routes.json');

// Per-route budget for the app to boot, resolve its lazy chunk and fetch Firestore.
const NAV_TIMEOUT_MS = 45000;
const RENDER_TIMEOUT_MS = 45000;
// Firestore-driven sections settle after first paint; capture a little later.
const SETTLE_MS = 1500;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// Used when the manifest is absent, i.e. a local build without Firebase Admin
// credentials. CI always has the manifest because generate-sitemap runs first
// and exits non-zero on failure. Project detail routes are necessarily missing
// here — they only exist in Firestore.
const FALLBACK_ROUTES = [
  '/',
  '/projects',
  '/certificates',
  '/resume',
  '/my-team',
  '/music',
  '/reports',
  '/articles',
  '/site-map',
];

function loadRoutes() {
  if (!fs.existsSync(ROUTES_MANIFEST)) {
    console.warn(
      `No prerender-routes.json found — falling back to static routes only.\n` +
        `Run "npm run generate-sitemap" first to include project detail pages.\n`
    );
    return FALLBACK_ROUTES;
  }
  const routes = JSON.parse(fs.readFileSync(ROUTES_MANIFEST, 'utf8'));
  if (!Array.isArray(routes) || routes.length === 0) {
    throw new Error('Route manifest is empty; refusing to prerender nothing.');
  }
  return routes;
}

/**
 * Static server that mirrors how GitHub Pages will serve the finished build,
 * except unknown paths fall back to index.html so the SPA can render the route
 * we are about to snapshot.
 */
function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const candidate = path.join(BUILD_DIR, urlPath);

    // Keep traversal inside build/ even if a route contains "..".
    if (!candidate.startsWith(BUILD_DIR)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    // Serve real files only for asset-looking requests. Navigation requests must
    // always get the un-prerendered shell — otherwise re-running the prerender
    // over an existing build would feed it back its own stale output.
    const isAssetRequest = path.extname(urlPath) !== '';
    const filePath =
      isAssetRequest && fs.existsSync(candidate) && fs.statSync(candidate).isFile()
        ? candidate
        : path.join(BUILD_DIR, 'index.html');

    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    });

    const stream = fs.createReadStream(filePath);
    // Without this the stream's 'error' event is unhandled and takes down the
    // whole process, losing every route rendered so far.
    stream.on('error', () => res.end());
    stream.pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

/**
 * A route is only writable if its decoded path survives as a directory name.
 * Project slugs come from hand-entered Firestore titles, so guard rather than
 * emit a file at a path that will never match the incoming request.
 */
function outputPathFor(route) {
  const decoded = decodeURIComponent(route);
  if (decoded === '/') return path.join(BUILD_DIR, 'index.html');
  if (/[<>:"\\|?*\x00-\x1f]/.test(decoded)) return null;
  return path.join(BUILD_DIR, decoded, 'index.html');
}

async function renderRoute(browser, port, route) {
  const page = await browser.newPage();
  try {
    // Suppress the visitor-tracking write in src/App.jsx for this pass.
    await page.evaluateOnNewDocument(() => {
      window.__PRERENDER__ = true;
    });

    await page.goto(`http://127.0.0.1:${port}${route}`, {
      waitUntil: 'domcontentloaded',
      timeout: NAV_TIMEOUT_MS,
    });

    // Firestore holds a long-lived connection, so networkidle never fires here.
    // Wait on the DOM instead. This must reject every intermediate state, not
    // just the empty one: a skeleton screen has text and a populated #root, so a
    // naive check happily snapshots "Loading Project" into the deployed HTML.
    await page.waitForFunction(
      () => {
        const root = document.getElementById('root');
        if (!root || root.childElementCount === 0) return false;
        // Router-level Suspense fallback.
        if (root.querySelector('.preloader')) return false;
        // react-loading-skeleton placeholders (project + music views).
        if (root.querySelector('.react-loading-skeleton')) return false;
        // Views that announce their own pending state via Helmet.
        if (root.querySelector('.loading-indicator, .loading')) return false;
        if (/^Loading\b/.test(document.title)) return false;
        if (root.innerText.trim().length === 0) return false;

        // The checks above only rule out loading states we thought to name, and
        // a section that has not started rendering looks exactly like one that
        // has finished. Sections fed by their own Firestore read (Projects
        // Highlights, Happy Clients, Collaborations) commit well after the shell
        // does, so require the DOM to hold still AND a minimum dwell before
        // capturing. Without this the home page intermittently prerendered with
        // an empty Projects Highlights section — invisible in the build log, and
        // shipped to crawlers.
        const key = `${root.querySelectorAll('*').length}:${root.innerHTML.length}`;
        const s = (window.__prerenderStability =
          window.__prerenderStability || { key: '', n: 0, t0: Date.now() });
        if (s.key === key) s.n++;
        else { s.key = key; s.n = 0; }
        return s.n >= 6 && Date.now() - s.t0 >= 5000;
      },
      { polling: 300, timeout: RENDER_TIMEOUT_MS }
    );

    await new Promise((r) => setTimeout(r, SETTLE_MS));

    return await page.content();
  } finally {
    await page.close();
  }
}

async function main() {
  const routes = loadRoutes();

  if (!fs.existsSync(path.join(BUILD_DIR, 'index.html'))) {
    throw new Error(`No build/index.html found. Run "vite build" before prerendering.`);
  }

  const { server, port } = await startServer();
  const browser = await puppeteer.launch({
    headless: true,
    // Required for the container GitHub Actions runs the build in.
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const failed = [];
  const skipped = [];

  try {
    for (const route of routes) {
      const outPath = outputPathFor(route);
      if (!outPath) {
        console.warn(`  SKIP  ${route} (slug is not a valid directory name)`);
        skipped.push(route);
        continue;
      }

      try {
        const html = await renderRoute(browser, port, route);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, html);
        console.log(`  OK    ${route}  ->  ${path.relative(BUILD_DIR, outPath)} (${html.length} bytes)`);
      } catch (error) {
        console.error(`  FAIL  ${route}: ${error.message}`);
        failed.push(route);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log(
    `\nPrerendered ${routes.length - failed.length - skipped.length}/${routes.length} routes.`
  );

  // Fail the build rather than silently shipping 404-ing routes again.
  if (failed.length > 0) {
    throw new Error(`Prerendering failed for: ${failed.join(', ')}`);
  }
}

main().catch((error) => {
  console.error('\nPrerender failed:', error.message);
  process.exit(1);
});
