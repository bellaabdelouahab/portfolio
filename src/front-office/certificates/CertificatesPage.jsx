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
      {/* Centred on phones, pushed to the edges once there is room for it. */}
      <div className="flex h-[5vh] w-full items-center justify-center px-5 py-6 tracking-[0.5px] text-ink-strong md:justify-between md:px-25">
        <div className="text-sm leading-normal md:text-lg md:leading-none">
          Over {count} Badges &amp; Certifications
        </div>
      </div>
      {/* The old grid drew its lines with nth-child border juggling — six rules
          to fake a table. Separate bordered cards say the same thing, match the
          projects/reports/articles grids, and survive any column count. */}
      <div className="grid gap-4 px-5 sm:grid-cols-2 md:px-12.5 lg:grid-cols-3">
        {displayedCertificates.map((certificate, index) => (
          <div
            className="group flex h-50 cursor-pointer flex-row items-center justify-start gap-2.5 rounded-lg border border-line bg-surface p-2.5 text-ink shadow-md transition-colors duration-200 hover:border-success/40"
            key={index}
          >
            <img
              src={`${basePath}${certificate.image.replace(
                ".webp",
                "_result.webp"
              )}`}
              alt="NoImage"
              width="100"
              height="100"
              className="size-37.5 shrink-0 rounded-sm"
            />
            <div className="mt-1 text-xl font-bold leading-snug group-hover:underline">
              {certificate.title}
            </div>
          </div>
        ))}
      </div>
      {displayedCertificates.length < allCertificates.length && (
        <div className="flex h-[5vh] w-full cursor-pointer items-center justify-center px-5 py-6 tracking-[0.5px] text-ink-strong md:px-25">
          <div className="min-h-px w-full bg-line"></div>
          <button
            onClick={handleShowMore}
            className="mx-5 min-w-37.5 cursor-pointer rounded-md border border-line bg-surface px-2.5 py-1.5 text-sm font-semibold tracking-[2px] text-ink transition-colors duration-200 hover:border-success/40 hover:bg-surface-raised hover:text-ink-strong"
          >
            Show More
          </button>
          <div className="min-h-px w-full bg-line"></div>
        </div>
      )}
    </>
  );
}
