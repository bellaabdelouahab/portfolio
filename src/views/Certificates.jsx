import "assets/css/certification.css";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axiosInstance from "utils/axios";
const backendUploadsApi = process.env.BACKEND_UPLOADS_API;

export default function Certificates() {
    const {certificatesInit,count} = useLoaderData();
    const [certificates, setCertificates] = useState(certificatesInit);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState({});

    // a handler for the show more button
    useEffect(() => {
      const handleShowMore = () => {
        setPage(page + 1);
        // fetch more certificates
        axiosInstance
          .get(`certificates?limit=9&page=${page + 1}`)
          .then((res) => {
            const newCertificates = res.data;
            setCertificates([...certificates, ...newCertificates]);
          })
          .catch((err) => console.log(err));
      };
      const showMoreButton = document.querySelector(
        ".certifications-show-more button"
      );
      showMoreButton.addEventListener("click", handleShowMore);
      return () => {
        showMoreButton.removeEventListener("click", handleShowMore);
      };
    }, [page, setCertificates, certificates, setPage]);

    const handleImageLoad = (index) => {
      setLoading(prev => ({...prev, [index]: false}));
    };

    return (
      <>
        <div className="certifications-header">
          <div className="count">Over +{count} Badges & Certifications</div>
        </div>
        <div className="certifications-content">
          {certificates.map((certificate, index) => (
            <div className="certification-element" key={index}>
              {loading[index] !== false && (
                <Skeleton 
                  width={100} 
                  height={100} 
                  circle={certificate.issuer?.toLowerCase() === 'ibm'}
                />
              )}
              <img
                style={{
                  display: loading[index] !== false ? 'none' : 'block',
                  ...(certificate.issuer?.toLowerCase() === 'ibm' ? { borderRadius: '50%' } : {})
                }}
                src={`${backendUploadsApi}${certificate.image}`}
                alt="NoImage"
                width="100"
                height="100"
                onLoad={() => handleImageLoad(index)}
              />
              <div className="certification-title">{certificate.title}</div>
            </div>
          ))}
        </div>
        {/* div for show more */}
        <div className="certifications-show-more">
            <div className="line"></div>
          <button>Show More</button>
            <div className="line"></div>
        </div>
      </>
    );
}

export async function getCertificates() {
    const res = await axiosInstance.get("certificates?limit=9");
    const certificates = res.data;
    const count = await axiosInstance.get("certificates/count");
    const data = { certificatesInit: certificates, count: count.data };
    return data;
}