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
    // Check if we have a valid date
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
 * Ensure the directory exists
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

/**
 * Generate sitemap.xml content with enhanced SEO metadata
 */
async function generateSitemapXML() {
  try {
    console.log('Fetching projects for sitemap...');
    // Fetch all projects to include in sitemap
    const projectsSnapshot = await db.collection('projects').get();
    const currentDate = getCurrentDate();
    
    const projects = projectsSnapshot.docs.map(doc => {
      let updatedAt;
      
      // Safely handle date from updatedAt field
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

    // Base URL for the site
    const baseUrl = normalizedSiteUrl;
    
    // Static routes with enhanced descriptions and priorities
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
    
    // Create XML with image extensions for Google Image Sitemap
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<!-- Generated on ' + new Date().toUTCString() + ' -->\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n';
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
    
    // Add static routes
    staticRoutes.forEach(route => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${route.url}</loc>\n`;
      xml += `    <lastmod>${route.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += '    <xhtml:link rel="alternate" hreflang="en" href="' + baseUrl + route.url + '" />\n';
      
      // Add image information if available
      if (route.image) {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${route.image}</image:loc>\n`;
        xml += `      <image:title>${route.title}</image:title>\n`;
        xml += '    </image:image>\n';
      }
      
      xml += '  </url>\n';
    });
    
    // Add project routes with enhanced SEO
    projects.forEach(project => {
      if (!project.title) return;
      
      const projectUrl = `/projects/${encodeURIComponent(slugifyTitle(project.title))}`;
      const lastmod = safeFormatDate(project.updatedAt, currentDate);
      
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${projectUrl}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '    <xhtml:link rel="alternate" hreflang="en" href="' + baseUrl + projectUrl + '" />\n';
      
      // Add image information if available
      if (project.image) {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${baseUrl}/${project.image.startsWith('/') ? project.image.substring(1) : project.image}</image:loc>\n`;
        xml += `      <image:title>${project.title}</image:title>\n`;
        xml += `      <image:caption>Portfolio project: ${project.title}</image:caption>\n`;
        xml += '    </image:image>\n';
      }
      
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    return xml;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    usedFallback = true;
    // Return a minimal valid sitemap in case of error
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${normalizedSiteUrl}</loc>\n    <priority>1.0</priority>\n  </url>\n</urlset>`;
  }
}

/**
 * Write sitemap to file and create a sitemap index if needed
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

// Execute the function
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
