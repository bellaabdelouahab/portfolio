import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';

/**
 * Generate XML sitemap content for the portfolio
 */
export const generateSitemapXML = async () => {
  try {
    // Fetch all projects to include in sitemap
    const projectsRef = collection(db, "projects");
    const projectsSnap = await getDocs(projectsRef);
    const projects = projectsSnap.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description?.substring(0, 100) + '...',
      url: `/projects/${doc.data().title.replace(/\s/g, '-')}`
    }));
    
    // Base URL for the site
    const baseUrl = 'https://abdelouahab.xyz';
    
    // Static routes with enhanced descriptions and priorities
    const staticRoutes = [
      { 
        url: '/', 
        priority: '1.0', 
        changefreq: 'weekly',
        title: 'Best Software Engineer & Data Scientist Portfolio 2025'
      },
      { 
        url: '/projects', 
        priority: '0.9', 
        changefreq: 'weekly',
        title: 'Featured Portfolio Projects 2025 | Software & Data Science'
      },
      { 
        url: '/certificates', 
        priority: '0.8', 
        changefreq: 'monthly',
        title: 'Professional Certifications | Top Developer Portfolio'
      },
      { 
        url: '/resume', 
        priority: '0.8', 
        changefreq: 'monthly',
        title: 'Software Engineer Resume 2025 | Professional CV'
      },
      { 
        url: '/my-team', 
        priority: '0.7', 
        changefreq: 'monthly',
        title: 'Development Team | Collaborative Projects Portfolio'
      },
      { 
        url: '/music', 
        priority: '0.7', 
        changefreq: 'monthly',
        title: 'Music & Podcast Recommendations | Developer Lifestyle'
      },
      { 
        url: '/reports', 
        priority: '0.6', 
        changefreq: 'monthly',
        title: 'Technical Reports & Case Studies | Software Engineer Portfolio'
      },
      { 
        url: '/site-map', 
        priority: '0.5', 
        changefreq: 'monthly',
        title: 'Portfolio Site Map | Navigation Guide'
      },
    ];
    
    // Create XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
    
    // Add static routes
    staticRoutes.forEach(route => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/#${route.url}</loc>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += '    <xhtml:link rel="alternate" hreflang="en" href="' + baseUrl + '/#' + route.url + '" />\n';
      xml += '  </url>\n';
    });
    
    // Add project routes with enhanced SEO
    projects.forEach(project => {
      if (!project.title) return;
      
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/#/projects/${encodeURIComponent(project.title.replace(/\s/g, '-'))}</loc>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '    <xhtml:link rel="alternate" hreflang="en" href="' + baseUrl + '/#/projects/' + encodeURIComponent(project.title.replace(/\s/g, '-')) + '" />\n';
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    return xml;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
};

/**
 * Get the portfolio structure as a JavaScript object
 */
export const getSiteStructure = async () => {
  try {
    // Fetch all projects
    const projectsRef = collection(db, "projects");
    const projectsSnap = await getDocs(projectsRef);
    const projects = projectsSnap.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description?.substring(0, 100) + '...',
      url: `/projects/${doc.data().title.replace(/\s/g, '-')}`
    }));
    
    // Get certificates
    const certificatesRef = collection(db, "certificates");
    const certificatesSnap = await getDocs(certificatesRef);
    const certificates = certificatesSnap.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title || 'Certificate',
      url: '/certificates' // All certificates on one page
    }));

    // Site structure
    return {
      name: 'Abdelouahab Bella Portfolio',
      baseUrl: 'https://abdelouahab.xyz',
      pages: [
        {
          title: 'Home',
          url: '/',
          description: 'Portfolio homepage featuring highlighted projects and personal information',
          sections: ['Introduction', 'Projects', 'About Me', 'Internships', 'Collaborations', 'Testimonials', 'Services']
        },
        {
          title: 'Projects',
          url: '/projects',
          description: 'Browse through all projects developed by Abdelouahab Bella',
          children: projects
        },
        {
          title: 'Certificates',
          url: '/certificates',
          description: 'View professional certificates and achievements',
          children: certificates
        },
        {
          title: 'Resume',
          url: '/resume',
          description: 'Professional resume highlighting skills and experience',
        },
        {
          title: 'Team',
          url: '/my-team',
          description: 'Meet the team members and collaborators',
        },
        {
          title: 'Music Picks',
          url: '/music',
          description: 'Musical preferences and podcast recommendations',
        },
        {
          title: 'Reports',
          url: '/reports',
          description: 'Professional reports and publications',
        },
        {
          title: 'Site Map',
          url: '/site-map',
          description: 'Overview of the website structure',
        }
      ]
    };
  } catch (error) {
    console.error('Error getting site structure:', error);
    return {
      name: 'Abdelouahab Bella Portfolio',
      pages: [
        { title: 'Home', url: '/' },
        { title: 'Projects', url: '/projects' },
        { title: 'Certificates', url: '/certificates' },
        { title: 'Resume', url: '/resume' },
        { title: 'Team', url: '/my-team' },
        { title: 'Music Picks', url: '/music' },
        { title: 'Reports', url: '/reports' },
        { title: 'Site Map', url: '/site-map' }
      ]
    };
  }
};
