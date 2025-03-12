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
 * Generate sitemap.xml content
 */
async function generateSitemapXML() {
  try {
    console.log('Fetching projects for sitemap...');
    // Fetch all projects to include in sitemap
    const projectsSnapshot = await db.collection('projects').get();
    const projects = projectsSnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title || 'Untitled Project'
    }));
    
    console.log(`Found ${projects.length} projects to include in sitemap`);

    // Base URL for the site
    const baseUrl = 'https://bellaabdelouahab.github.io';
    
    // Static routes
    const staticRoutes = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/projects', priority: '0.9', changefreq: 'weekly' },
      { url: '/certificates', priority: '0.8', changefreq: 'monthly' },
      { url: '/resume', priority: '0.8', changefreq: 'monthly' },
      { url: '/my-team', priority: '0.7', changefreq: 'monthly' },
      { url: '/music', priority: '0.7', changefreq: 'monthly' },
      { url: '/reports', priority: '0.6', changefreq: 'monthly' },
      { url: '/site-map', priority: '0.5', changefreq: 'monthly' },
    ];
    
    // Create XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add static routes
    staticRoutes.forEach(route => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/#${route.url}</loc>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += '  </url>\n';
    });
    
    // Add project routes
    projects.forEach(project => {
      if (!project.title) return;
      
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/#/projects/${encodeURIComponent(project.title.replace(/\s/g, '-'))}</loc>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    return xml;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return a minimal valid sitemap in case of error
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://bellaabdelouahab.github.io</loc>\n    <priority>1.0</priority>\n  </url>\n</urlset>';
  }
}

/**
 * Write sitemap to file
 */
async function writeSitemapToFile() {
  try {
    const sitemapContent = await generateSitemapXML();
    const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    
    fs.writeFileSync(outputPath, sitemapContent);
    console.log(`Sitemap generated successfully at: ${outputPath}`);
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
