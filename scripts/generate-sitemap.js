const fs = require('fs');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin
try {
  // Try to load from environment variable first
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : require('../portfolio-d0eff-firebase-adminsdk-m2qoy-aeb5920ad6.json');

  initializeApp({
    credential: cert(serviceAccount)
  });
} catch (error) {
  console.error('Firebase initialization error:', error);
  process.exit(1);
}

const db = getFirestore();

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
    const baseUrl = 'https://abdelouahab.xyz';
    
    // Static routes with enhanced descriptions and priorities
    const staticRoutes = [
      { 
        url: '/', 
        priority: '1.0', 
        changefreq: 'weekly',
        lastmod: currentDate,
        title: 'Best Software Engineer & Data Scientist Portfolio 2025',
        image: `${baseUrl}/logo.jpg`
      },
      { 
        url: '/projects', 
        priority: '0.9', 
        changefreq: 'weekly',
        lastmod: currentDate,
        title: 'Featured Portfolio Projects 2025 | Software & Data Science',
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
        title: 'Software Engineer Resume 2025 | Professional CV',
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
      xml += `    <loc>${baseUrl}/#${route.url}</loc>\n`;
      xml += `    <lastmod>${route.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += '    <xhtml:link rel="alternate" hreflang="en" href="' + baseUrl + '/#' + route.url + '" />\n';
      
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
      
      const projectUrl = `/projects/${encodeURIComponent(project.title.replace(/\s/g, '-'))}`;
      const lastmod = safeFormatDate(project.updatedAt, currentDate);
      
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/#${projectUrl}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '    <xhtml:link rel="alternate" hreflang="en" href="' + baseUrl + '/#' + projectUrl + '" />\n';
      
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
    // Return a minimal valid sitemap in case of error
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://abdelouahab.xyz</loc>\n    <priority>1.0</priority>\n  </url>\n</urlset>';
  }
}

/**
 * Write sitemap to file and create a sitemap index if needed
 */
async function writeSitemapToFile() {
  try {
    const sitemapContent = await generateSitemapXML();
    const outputDir = path.join(__dirname, '..', 'public', 'sitemaps');
    const outputPath = path.join(outputDir, 'sitemap.xml');
    
    // Ensure directory exists
    ensureDirectoryExists(outputDir);
    
    // Write sitemap.xml
    fs.writeFileSync(outputPath, sitemapContent);
    console.log(`Sitemap generated successfully at: ${outputPath}`);
    
    // Create a copy at the root level for better discoverability
    const rootSitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(rootSitemapPath, sitemapContent);
    console.log(`Sitemap also copied to: ${rootSitemapPath}`);
    
    // Generate a sitemap index file that includes both locations
    const sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                         '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
                         '  <sitemap>\n' +
                         '    <loc>https://abdelouahab.xyz/sitemap.xml</loc>\n' +
                         `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n` +
                         '  </sitemap>\n' +
                         '</sitemapindex>';
    
    const indexPath = path.join(outputDir, 'sitemap-index.xml');
    fs.writeFileSync(indexPath, sitemapIndex);
    console.log(`Sitemap index generated at: ${indexPath}`);
    
    return true;
  } catch (error) {
    console.error('Error writing sitemap file:', error);
    return false;
  }
}

// Execute the function
writeSitemapToFile()
  .then(() => {
    console.log('Sitemap generation process complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('Sitemap generation failed:', error);
    process.exit(1);
  });
