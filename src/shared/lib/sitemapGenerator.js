import { collection, getDocs } from "firebase/firestore";
import { db } from './firebase';
import { getAbsoluteUrl } from './siteConfig';
import { slugifyProjectTitle } from './projectSlug';
import { byNewest } from './dates';

/**
 * Builds the data behind the human-facing /site-map page.
 *
 * Note this is NOT the XML sitemap pipeline. The sitemap submitted to search
 * engines is generated at build time by scripts/generate-sitemap.js, straight
 * from Firestore via the Admin SDK.
 */
export const getSiteStructure = async () => {
  try {
    // Fetch all projects
    const projectsRef = collection(db, "projects");
    const projectsSnap = await getDocs(projectsRef);
    // Sorted for the same reason as the projects list: Firestore's document
    // order is unspecified, so the site map would otherwise reshuffle itself
    // between visits. Newest first, matching /projects.
    const projects = projectsSnap.docs
      .map(doc => ({
        id: doc.id,
        title: doc.data().title,
        startDate: doc.data().startDate,
        description: doc.data().description?.substring(0, 100) + '...',
        url: `/projects/${slugifyProjectTitle(doc.data().title)}`
      }))
      .sort((a, b) => new Date(b.startDate ?? 0) - new Date(a.startDate ?? 0));

    // Get certificates
    const certificatesRef = collection(db, "certificates");
    const certificatesSnap = await getDocs(certificatesRef);
    const certificates = certificatesSnap.docs
      .map(doc => ({
        id: doc.id,
        title: doc.data().title || 'Certificate',
        createdAt: doc.data().createdAt,
        url: '/certificates' // All certificates on one page
      }))
      .sort(byNewest('createdAt'));

    // Site structure
    return {
      name: 'Abdelouahab Bella Portfolio',
      baseUrl: getAbsoluteUrl('/'),
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
