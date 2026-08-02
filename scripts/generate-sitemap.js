const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { initializeApp, cert, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

dotenv.config({ path: path.join(__dirname, '..', '.env.production') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const siteUrl = process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://abdelouahab.xyz';
const normalizedSiteUrl = siteUrl.replace(/\/+$/, '');

// Initialize Firebase Admin
try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initializeApp({
      credential: applicationDefault()
    });
  } else {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;

    if (!serviceAccount) {
      throw new Error('No Firebase credentials available. Provide FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS.');
    }

    initializeApp({
      credential: cert(serviceAccount)
    });
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  process.exit(1);
}

const db = getFirestore();
let usedFallback = false;

/**
 * Escape special characters so generated text can never break the XML,
 * regardless of what a title/caption contains (hand-typed or from Firestore).
 */
function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function slugifyTitle(title) {
  return title
    .replace(/[:|]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

/**
 * Format current date as YYYY-MM-DD for sitemap
 */
function getCurrentDate() {
  const date = new Date();
  return date.toISOString().split('T')[0];
}

/**
 * Safely format a date for sitemap
 */
function safeFormatDate(dateValue, fallbackDate) {
  try {
    if (dateValue && !isNaN(new Date(dateValue).getTime())) {
      return new Date(dateValue).toISOString().split('T')[0];
    }
    return fallbackDate || getCurrentDate();
  } catch (error) {
    console.warn('Date conversion error:', error.message);
    return fallbackDate || getCurrentDate();
  }
}

/**
 * Generate sitemap.xml content with enhanced SEO metadata
 */
async function generateSitemapXML() {
  try {
    console.log('Fetching projects for sitemap...');
    const projectsSnapshot = await db.collection('projects').get();
    const currentDate = getCurrentDate();

    const projects = projectsSnapshot.docs.map(doc => {
      let updatedAt;
      try {
        if (doc.data().updatedAt) {
          updatedAt = doc.data().updatedAt;
        } else if (doc.updateTime && typeof doc.updateTime.toDate === 'function') {
          updatedAt = doc.updateTime.toDate();
        } else {
          updatedAt = new Date();
        }
      } catch (err) {
        console.warn(`Date conversion error for project ${doc.id}:`, err.message);
        updatedAt = new Date();
      }

      return {
        id: doc.id,
        title: doc.data().title || 'Untitled Project',
        updatedAt: updatedAt,
        image: doc.data().thumbnail || doc.data().images?.[0] || null
      };
    });

    console.log(`Found ${projects.length} projects to include in sitemap`);

    const baseUrl = normalizedSiteUrl;

    const staticRoutes = [
      {
        url: '/',
        priority: '1.0',
        changefreq: 'weekly',
        lastmod: currentDate,
        title: 'Best Software Engineer & Data Analyst Portfolio',
        image: `${baseUrl}/logo.jpg`
      },
      {
        url: '/projects',
        priority: '0.9',
        changefreq: 'weekly',
        lastmod: currentDate,
        title: 'Featured Portfolio Projects | Software & Data Science',
        image: `${baseUrl}/images/projects-cover.jpg`
      },
      {
        url: '/certificates',
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: currentDate,
        title: 'Professional Certifications | Top Developer Portfolio',
        image: `${baseUrl}/yassine-pic.png`
      },
      {
        url: '/resume',
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: currentDate,
        title: 'Software Engineer Resume | Professional CV',
        image: `${baseUrl}/resume.png`
      },
      {
        url: '/my-team',
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: currentDate,
        title: 'Development Team | Collaborative Projects Portfolio'
      },
      {
        url: '/music',
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: currentDate,
        title: 'Music & Podcast Recommendations | Developer Lifestyle'
      },
      {
        url: '/reports',
        priority: '0.6',
        changefreq: 'monthly',
        lastmod: currentDate,
        title: 'Technical Reports & Case Studies | Software Engineer Portfolio'
      },
      {
        url: '/site-map',
        priority: '0.5',
        changefreq: 'monthly',
        lastmod: currentDate,
        title: 'Portfolio Site Map | Navigation Guide'
      },
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<!-- Generated on ' + new Date().toUTCString() + ' -->\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n';
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

    staticRoutes.forEach(route => {
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(baseUrl + route.url)}</loc>\n`;
      xml += `    <lastmod>${route.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += '    <xhtml:link rel="alternate" hreflang="en" href="' + escapeXml(baseUrl + route.url) + '" />\n';

      if (route.image) {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${escapeXml(route.image)}</image:loc>\n`;
        xml += `      <image:title>${escapeXml(route.title)}</image:title>\n`;
        xml += '    </image:image>\n';
      }

      xml += '  </url>\n';
    });

    projects.forEach(project => {
      if (!project.title) return;

      const projectUrl = `/projects/${encodeURIComponent(slugifyTitle(project.title))}`;
      const lastmod = safeFormatDate(project.updatedAt, currentDate);

      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(baseUrl + projectUrl)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '    <xhtml:link rel="alternate" hreflang="en" href="' + escapeXml(baseUrl + projectUrl) + '" />\n';

      if (project.image) {
        const imageUrl = `${baseUrl}/${project.image.startsWith('/') ? project.image.substring(1) : project.image}`;
        xml += '    <image:image>\n';
        xml += `      <image:loc>${escapeXml(imageUrl)}</image:loc>\n`;
        xml += `      <image:title>${escapeXml(project.title)}</image:title>\n`;
        xml += `      <image:caption>Portfolio project: ${escapeXml(project.title)}</image:caption>\n`;
        xml += '    </image:image>\n';
      }

      xml += '  </url>\n';
    });

    xml += '</urlset>';

    return xml;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    usedFallback = true;
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${escapeXml(normalizedSiteUrl)}</loc>\n    <priority>1.0</priority>\n  </url>\n</urlset>`;
  }
}

/**
 * Write sitemap to file
 */
async function writeSitemapToFile() {
  try {
    const sitemapContent = await generateSitemapXML();
    const rootSitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

    fs.writeFileSync(rootSitemapPath, sitemapContent);
    console.log(`Sitemap generated successfully at: ${rootSitemapPath}`);

    if (usedFallback) {
      throw new Error('Sitemap generation used fallback data because Firestore failed.');
    }

    return true;
  } catch (error) {
    console.error('Error writing sitemap file:', error);
    return false;
  }
}

writeSitemapToFile()
  .then((success) => {
    if (!success) {
      console.error('Sitemap generation failed');
      process.exit(1);
    }
    console.log('Sitemap generation process complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('Sitemap generation failed:', error);
    process.exit(1);
  });