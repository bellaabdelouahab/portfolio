import "./CertificatesPage.css";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import SEO from "../../shared/ui/SEO";

export default function Certificates() {
  const basePath = process.env.VITE_BASE_URL || "";
  // Loader now returns allCertificates and count
  const { allCertificates, count } = useLoaderData();
  const certificatesPerPage = 9;
  const [page, setPage] = useState(1);
  
  // Display the first chunk of certificates
  const displayedCertificates = allCertificates.slice(0, page * certificatesPerPage);

  const handleShowMore = () => {
    setPage(page + 1);
  };

  return (
    <>
      <SEO
        title="Certificates"
        description="Professional certifications and badges earned by Abdelouahab Bella in data analytics, machine learning, cloud platforms, and software engineering."
        keywords="Abdelouahab Bella certifications, data analyst certificates, machine learning certification, professional badges"
      />
      <div className="certifications-header">
        <div className="count">Over {count} Badges & Certifications</div>
      </div>
      <div className="certifications-content">
        {displayedCertificates.map((certificate, index) => (
          <div className="certification-element" key={index}>
            <img
              src={`${basePath}${certificate.image.replace(
                ".webp",
                "_result.webp"
              )}`}
              alt="NoImage"
              width="100"
              height="100"
            />
            <div className="certification-title">{certificate.title}</div>
          </div>
        ))}
      </div>
      {displayedCertificates.length < allCertificates.length && (
        <div className="certifications-show-more">
          <div className="line"></div>
          <button onClick={handleShowMore}>Show More</button>
          <div className="line"></div>
        </div>
      )}
    </>
  );
}