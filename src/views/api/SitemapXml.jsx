import { useEffect, useState } from "react";
import { generateSitemapXML } from "../../utils/sitemapGenerator";

export default function SitemapXml() {
  const [xml, setXml] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const sitemapXml = await generateSitemapXML();
        setXml(sitemapXml);
        setLoaded(true);

        // Create a downloadable blob
        const blob = new Blob([sitemapXml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        
        // Force download or display
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 100);
      } catch (error) {
        console.error("Error generating sitemap XML:", error);
        setLoaded(true);
      }
    };
    
    fetchSitemap();
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {!loaded ? (
        <p>Generating sitemap XML...</p>
      ) : (
        <p>Sitemap XML generated. Check your downloads folder.</p>
      )}
    </div>
  );
}
