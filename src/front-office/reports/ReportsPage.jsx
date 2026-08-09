import './ReportsPage.css';
import { useLoaderData } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../shared/lib/firebase";
import { useEffect } from 'react';
import SEO from '../../shared/ui/SEO';
import { coverPlaceholder } from '../../shared/lib/placeholders';

// Helper function to format dates
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (error) {
        return dateString;
    }
};

// Helper function to format timestamps
const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (error) {
        return "Invalid Date";
    }
};

// Helper function to check if report is new (less than 7 days old)
const isNewReport = (timestamp) => {
    if (!timestamp) return false;
    try {
        const reportDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const differenceInTime = now - reportDate;
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return differenceInDays <= 7;
    } catch (error) {
        return false;
    }
};

// Helper function to truncate long file names
const truncateFileName = (name) => {
    const nameWithoutExtension = name.replace(/\.[^/.]+$/, "");
    return nameWithoutExtension.length > 30 ?
        nameWithoutExtension.substring(0, 30) + "..." :
        nameWithoutExtension;
};

export default function Reports() {
    const reports = useLoaderData();

    // Placeholder image if cover image is missing
    const placeholderImage = coverPlaceholder;

    // Sort reports by date (newest first)
    const sortedReports = [...reports].sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
    });

    // Add staggered animation effect
    useEffect(() => {
        // Set a small delay to ensure all resources are loaded
        setTimeout(() => {
            const cards = document.querySelectorAll('.report-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = 1;
                    card.style.transform = 'translateY(0)';
                }, 100 * index);
            });
        }, 300);
    }, []);

    return (
        <section className="min-h-screen bg-transparent pb-10">
            <SEO
                title="Reports"
                description="Technical reports, case studies, and academic documents authored by Abdelouahab Bella across data engineering, machine learning, and optimization."
                keywords="Abdelouahab Bella reports, technical case studies, data engineering reports, machine learning papers"
            />
            <div className="mx-auto w-[90%] px-4">
                <h2 className="mb-[30px] mt-12 block text-center text-2xl font-bold leading-snug text-ink-strong md:mb-12 md:text-3xl lg:text-4xl">
                    <span className="text-success">Reports</span> &amp; Documents
                </h2>

                {sortedReports && sortedReports.length > 0 ? (
                    /* auto-fill + minmax keeps the card width honest at every
                       viewport, so only the minimum track size changes per
                       breakpoint rather than a column count. */
                    <div className="mb-10 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-[15px] sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] md:gap-5 lg:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] lg:gap-[30px]">
                        {sortedReports.map((report) => (
                            /* `report-card` is kept as a hook only — the stagger
                               effect above queries it by class name. All styling
                               is utilities. The inline opacity/transform are what
                               that effect animates, so they must stay inline. */
                            <div
                                className="report-card group relative flex h-full flex-col overflow-hidden rounded-lg border border-line shadow-md transition-colors duration-300 ease-standard hover:border-success/40 hover:shadow-lg"
                                key={report._id}
                                style={{
                                    opacity: 0,
                                    transform: 'translateY(20px)',
                                    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                }}
                            >
                                {isNewReport(report.createdAt) &&
                                    <div className="absolute right-3 top-3 z-2 animate-[report-badge-pulse_2s_infinite] rounded-full bg-[linear-gradient(135deg,#48bb78,#276749)] px-2.5 py-1 text-xs font-bold leading-none tracking-[0.5px] text-ink-strong">NEW</div>
                                }
                                <div className="relative mx-auto mt-5 h-[170px] w-[119px] overflow-hidden rounded-md border-2 border-line shadow-md transition-all duration-500 ease-standard group-hover:border-success/40 group-hover:shadow-lg sm:h-[185px] sm:w-[130px] md:h-[210px] md:w-[147px]">
                                    <img
                                        src={report.coverImage || placeholderImage}
                                        alt={report.name}
                                        className="size-full object-cover transition-transform duration-500 ease-standard group-hover:scale-108"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.src = placeholderImage;
                                        }}
                                    />
                                </div>
                                <div className="mt-2.5 flex grow flex-col border-t border-line bg-[rgba(10,15,20,0.6)] px-[18px] py-4">
                                    {/* min-h rather than a fixed height: two clamped
                                        lines no longer fit in the old 26px box now
                                        that the type is at the 12px floor. */}
                                    <h3 className="mb-2.5 line-clamp-2 min-h-8 text-center text-xs font-semibold leading-snug tracking-wide text-ink-strong">
                                        {truncateFileName(report.name)}
                                    </h3>
                                    <span className="mb-2.5 block text-center text-xs leading-normal text-ink">
                                        {formatDate(report.date)}
                                        <span className="mt-[3px] block text-xs italic leading-normal text-ink-muted">
                                            Created: {formatTimestamp(report.createdAt)}
                                        </span>
                                    </span>
                                    <p className="mb-4 line-clamp-2 grow px-1 text-center text-xs leading-relaxed text-ink">
                                        {report.description || "No description available"}
                                    </p>
                                </div>
                                <div className="flex justify-center bg-[rgba(10,15,20,0.7)] px-[15px] pb-5 pt-[5px]">
                                    <a
                                        className="inline-block w-full max-w-[140px] rounded-md bg-[linear-gradient(135deg,#48bb78,#2f855a)] px-3 py-[7px] text-center text-xs font-medium uppercase leading-none tracking-[1px] text-ink-strong shadow-md transition-all duration-300 ease-standard hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0.5 sm:max-w-40 sm:px-[18px] sm:py-2.5"
                                        href={report.pdfPath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                    >
                                        Download
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-line bg-[rgba(10,15,20,0.7)] py-15 text-center shadow-md">
                        <p className="text-sm leading-relaxed text-ink">No reports available at this time.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export async function getReports() {
  const colRef = collection(db, "reports");
  const snapshot = await getDocs(colRef);
  const data = snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
  return data;
}
