import { useEffect } from "react";
import { generateSitemapXML } from "../utils/sitemapGenerator";

export default function SitemapXmlView() {
  useEffect(() => {
    const generateAndServeXml = async () => {
      try {
        // Generate the sitemap XML content
        const xmlContent = await generateSitemapXML();
        
        // Create a Blob with the XML content
        const blob = new Blob([xmlContent], { type: 'application/xml' });
        
        // Create a download URL
        const url = URL.createObjectURL(blob);
        
        // Replace the current window content with the XML
        window.location.replace(url);
        
        // Clean up the URL object after a delay
        setTimeout(() => URL.revokeObjectURL(url), 100);
      } catch (error) {
        console.error('Error generating sitemap XML:', error);
      }
    };

    generateAndServeXml();

    // This component doesn't need to render anything, as we're replacing the window location
    return () => {};
  }, []);

  // Return null since we don't want to render anything
  return null;
}
