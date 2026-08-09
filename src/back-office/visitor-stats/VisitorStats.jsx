import { useState, useEffect, useMemo } from "react";
import { collection, query, orderBy, limit, getDocs, where, startAfter } from "firebase/firestore";
import { db } from "../../shared/lib/firebase";
import "./VisitorStats.css";

/* The old stylesheet carried its own mini design system (--vs-green, --vs-surface,
   --vs-radius …). Those all map onto the shared tokens now, so the only thing
   worth naming here is the handful of recipes repeated across eight panels.

   `tracking-*` on h2/h3/button carries the important-bang deliberately: global.css
   sets h1..h6,button { letter-spacing: 1px } UNLAYERED, which outranks any utility. */
const SECTION =
  "mb-5 rounded-md border border-line bg-surface-raised p-4.5 shadow-md transition-colors duration-200 ease-standard hover:border-success/40 md:px-6.5 md:py-5.5";
/* The green dot before each section title was a ::before in CSS and still is —
   just declared from the class instead of a stylesheet. */
const SECTION_TITLE =
  "mb-4.5 flex items-center gap-2 border-b border-line pb-3 text-xs font-semibold tracking-normal! text-ink-strong before:size-1.5 before:shrink-0 before:rounded-full before:bg-success before:opacity-70 before:content-['']";
const SUB_TITLE = "mt-5 text-xs font-medium tracking-normal! text-ink";
const LIST = "flex list-none flex-col gap-1.5 p-0";
const LIST_ITEM =
  "flex items-center justify-between gap-3 rounded-sm border border-transparent bg-surface px-3 py-2.5 text-xs leading-normal text-ink transition duration-200 ease-standard hover:translate-x-1 hover:border-line hover:bg-surface-raised";
const COUNT_PILL =
  "rounded-full border border-success/25 bg-success/10 px-2.5 py-[3px] font-mono text-xs font-semibold whitespace-nowrap text-success";
const MONO_CAPTION = "font-mono text-xs uppercase tracking-wider text-ink-muted";
const HEATMAP_ROW = "mb-[3px] grid grid-cols-7 gap-[3px]";

/* Overview strip card. Its accent line + corner glow are multi-stop gradients on
   ::before/::after — kept in VisitorStats.css, there's no clean utility for a
   gradient background-image. `group` here drives the number's hover scale below. */
const STAT_CARD =
  "stats-card group relative overflow-hidden rounded-md border border-line bg-surface-raised p-6 shadow-md transition-all duration-200 ease-standard hover:-translate-y-[3px] hover:border-success/40 hover:shadow-lg";
/* Same caption look as MONO_CAPTION, but this one lands on an <h3>, so it needs
   the important-bang for the same reason SECTION_TITLE does. */
const STAT_LABEL = "mb-3.5 font-mono text-xs uppercase tracking-wider! text-ink-muted";

/* Shared by the three <select>s and the IP search <input>. The select's chevron
   background-image stays in VisitorStats.css — its data: URI has raw spaces that
   don't survive Tailwind's arbitrary-value bracket syntax. */
const FIELD =
  "appearance-none rounded-sm border border-line bg-surface px-3.5 py-1.75 text-xs text-ink-strong outline-none transition-colors duration-200 ease-standard focus:border-success focus:ring-[3px] focus:ring-success/15";

/* Pagination buttons repeat 4-6 times per render (first/prev/numbered/next/last),
   so this is the "extract a small component" case from the conversion guide. */
function PageButton({ active, className = "", children, ...props }) {
  return (
    <button
      type="button"
      className={[
        "cursor-pointer rounded-sm px-3.25 py-1.75 font-mono text-xs leading-none tracking-normal! transition-colors duration-150 ease-standard disabled:cursor-not-allowed disabled:opacity-30",
        active
          ? "border border-transparent bg-success font-semibold text-page"
          : "border border-line bg-surface text-ink-muted enabled:hover:border-white/15 enabled:hover:bg-surface-raised enabled:hover:text-ink-strong",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

export default function VisitorStats() {
  // State for visitor statistics
  const [visitorStats, setVisitorStats] = useState({
    totalVisitors: 0,
    totalPageViews: 0,
    recentVisitors: [],
    allVisitors: [],
    topPages: [],
    browsers: {},
    operatingSystems: {},
    referrers: {},
    screenResolutions: {},
    languages: {},
    timezones: {},
    repeatVisitors: 0,
    newVisitorsToday: 0,
    avgVisitDuration: 0,
    hourlyDistribution: {},
    dailyDistribution: {},
    loading: true,
    error: null
  });

  // Filters and pagination state
  const [filters, setFilters] = useState({
    timeRange: "all", // all, day, week, month
    browser: "all",
    os: "all",
    ipSearch: "", // New filter for IP search
  });

  // Pagination state
  const [pagination, setpagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    viewAll: false,
    totalPages: 1,
    lastVisible: null
  });

  // Calculate today's date at midnight
  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  // Fetch visitor statistics
  useEffect(() => {
    const fetchVisitorStats = async () => {
      try {
        // Get visitors collection
        const visitorsRef = collection(db, "visitors");

        // Apply time filter
        let visitorQuery = visitorsRef;
        let timeFilterDate = null;

        if (filters.timeRange !== "all") {
          const date = new Date();
          if (filters.timeRange === "day") {
            date.setDate(date.getDate() - 1);
          } else if (filters.timeRange === "week") {
            date.setDate(date.getDate() - 7);
          } else if (filters.timeRange === "month") {
            date.setMonth(date.getMonth() - 1);
          }
          timeFilterDate = date;
          visitorQuery = query(visitorsRef, where("timestamp", ">=", date));
        }

        const visitorsSnap = await getDocs(visitorQuery);

        // Process visitor data
        const uniqueVisitors = new Set();
        const browsers = {};
        const operatingSystems = {};
        const referrers = {};
        const screenResolutions = {};
        const languages = {};
        const timezones = {};
        const hourlyDistribution = Array(24).fill(0);
        const dailyDistribution = Array(7).fill(0);

        let repeatVisitors = 0;
        let totalPageViews = 0;
        let newVisitorsToday = 0;
        let totalDuration = 0;
        let visitWithDuration = 0;

        // Get today's date
        const today = getToday();

        visitorsSnap.docs.forEach(doc => {
          const visitorData = doc.data();

          // Count unique visitors
          uniqueVisitors.add(visitorData.ip);

          // Check if new visitor today
          if (visitorData.timestamp) {
              const visitDate = typeof visitorData.timestamp === 'string'
                ? new Date(visitorData.timestamp)
                : visitorData.timestamp.toDate
                  ? visitorData.timestamp.toDate()
                  : visitorData.timestamp._seconds
                    ? new Date(visitorData.timestamp._seconds * 1000)
                    : new Date();

            const visitDateMidnight = new Date(visitDate);
            visitDateMidnight.setHours(0, 0, 0, 0);

            if (visitDateMidnight.getTime() === today.getTime()) {
              newVisitorsToday++;
            }

            // Hourly distribution
            const hour = visitDate.getHours();
            hourlyDistribution[hour]++;

            // Daily distribution
            const day = visitDate.getDay();
            dailyDistribution[day]++;
          }

          // Count browsers
          const browser = visitorData.browser || "unknown";
          browsers[browser] = (browsers[browser] || 0) + 1;

          // Count operating systems
          const os = visitorData.operatingSystem || "unknown";
          operatingSystems[os] = (operatingSystems[os] || 0) + 1;

          // Count referrers
          let referrer = "direct";
          try {
            if (visitorData.referrer) {
              referrer = new URL(visitorData.referrer).hostname;
            }
          } catch (error) {
            referrer = "invalid";
          }
          referrers[referrer] = (referrers[referrer] || 0) + 1;

          // Count screen resolutions
          const resolution = visitorData.screenResolution || "unknown";
          screenResolutions[resolution] = (screenResolutions[resolution] || 0) + 1;

          // Count languages
          const language = visitorData.language || "unknown";
          languages[language] = (languages[language] || 0) + 1;

          // Count timezones
          const timezone = visitorData.timezone || "unknown";
          timezones[timezone] = (timezones[timezone] || 0) + 1;

          // Count repeat visitors
          if (visitorData.visitCount && visitorData.visitCount > 1) {
            repeatVisitors++;
          }

          // Count total page views
          totalPageViews += visitorData.visitCount || 1;

          // Calculate average visit duration
          if (visitorData.visitDuration) {
            totalDuration += visitorData.visitDuration;
            visitWithDuration++;
          }
        });

        // Calculate average visit duration
        const avgVisitDuration = visitWithDuration > 0
          ? Math.round(totalDuration / visitWithDuration)
          : 0;

        // Get all visitors for pagination
        let allVisitorsQuery = query(visitorsRef, orderBy("timestamp", "desc"));

        // Apply browser filter
        if (filters.browser !== "all") {
          allVisitorsQuery = query(allVisitorsQuery, where("browser", "==", filters.browser));
        }

        // Apply OS filter
        if (filters.os !== "all") {
          allVisitorsQuery = query(allVisitorsQuery, where("operatingSystem", "==", filters.os));
        }

        // Apply time filter to all visitors
        if (timeFilterDate) {
          allVisitorsQuery = query(allVisitorsQuery, where("timestamp", ">=", timeFilterDate));
        }

        const allVisitorsSnap = await getDocs(allVisitorsQuery);

        let allVisitors = allVisitorsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: formatTimestamp(doc.data().timestamp)
        }));

        // Filter by IP if search is applied
        if (filters.ipSearch) {
          allVisitors = allVisitors.filter(visitor =>
            visitor.ip && visitor.ip.includes(filters.ipSearch)
          );
        }

        // Calculate total pages
        const totalPages = Math.ceil(allVisitors.length / pagination.itemsPerPage);

        // Get recent visitors based on pagination
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        const endIndex = pagination.viewAll ? allVisitors.length : startIndex + pagination.itemsPerPage;
        const recentVisitors = allVisitors.slice(startIndex, endIndex);

        // Get top pages
        const pageViewsRef = collection(db, "pageViews");
        let pageViewsQuery = pageViewsRef;

        if (timeFilterDate) {
          pageViewsQuery = query(pageViewsQuery, where("timestamp", ">=", timeFilterDate));
        }

        const pageViewsSnap = await getDocs(pageViewsQuery);
        const pages = {};
        pageViewsSnap.docs.forEach(doc => {
          const path = doc.data().path;
          if (path) {
            pages[path] = (pages[path] || 0) + 1;
          }
        });

        const topPages = Object.entries(pages)
          .map(([path, count]) => ({ path, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setVisitorStats({
          totalVisitors: uniqueVisitors.size,
          totalPageViews,
          recentVisitors,
          allVisitors,
          topPages,
          browsers,
          operatingSystems,
          referrers,
          screenResolutions,
          languages,
          timezones,
          repeatVisitors,
          newVisitorsToday,
          avgVisitDuration,
          hourlyDistribution,
          dailyDistribution,
          loading: false,
          error: null
        });

        setpagination(prev => ({
          ...prev,
          totalPages
        }));
      } catch (error) {
        console.error("Error fetching visitor stats:", error);
        setVisitorStats(prev => ({
          ...prev,
          loading: false,
          error: "Failed to load visitor statistics"
        }));
      }
    };

    fetchVisitorStats();
  }, [filters, pagination.currentPage, pagination.itemsPerPage, pagination.viewAll]);

  // Helper function to format timestamps
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";

    try {
      const date = typeof timestamp === 'string'
        ? new Date(timestamp)
        : timestamp.toDate
          ? timestamp.toDate()
          : timestamp._seconds
            ? new Date(timestamp._seconds * 1000)
            : new Date();

      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Helper function to format duration
  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds}s`;
  };

  // Get top browsers
  const topBrowsers = useMemo(() => {
    return Object.entries(visitorStats.browsers)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [visitorStats.browsers]);

  // Get top operating systems
  const topOS = useMemo(() => {
    return Object.entries(visitorStats.operatingSystems)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [visitorStats.operatingSystems]);

  // Get top referrers
  const topReferrers = useMemo(() => {
    return Object.entries(visitorStats.referrers)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [visitorStats.referrers]);

  // Get top screen resolutions
  const topScreenResolutions = useMemo(() => {
    return Object.entries(visitorStats.screenResolutions)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [visitorStats.screenResolutions]);

  // Get available browsers and OS for filters
  const availableBrowsers = useMemo(() => {
    return Object.keys(visitorStats.browsers);
  }, [visitorStats.browsers]);

  const availableOS = useMemo(() => {
    return Object.keys(visitorStats.operatingSystems);
  }, [visitorStats.operatingSystems]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset pagination when filters change
    setpagination(prev => ({
      ...prev,
      currentPage: 1,
      viewAll: false
    }));
  };

  // Handle IP search
  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      ipSearch: e.target.value
    }));

    // Reset pagination when search changes
    setpagination(prev => ({
      ...prev,
      currentPage: 1,
      viewAll: false
    }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setpagination(prev => ({
      ...prev,
      currentPage: page,
      viewAll: false
    }));
  };

  // Toggle view all
  const toggleViewAll = () => {
    setpagination(prev => ({
      ...prev,
      viewAll: !prev.viewAll
    }));
  };

  // Calculate heat map colors. Uses the shared `success` accent's own RGB so this
  // matches the rest of the admin area instead of the old stylesheet's one-off green.
  const getHeatMapColor = (value, max) => {
    if (max === 0) return 'rgba(42, 193, 127, 0)'; // Fully transparent for no data
    const intensity = value / max;

    return `rgba(42, 193, 127, ${intensity})`;
  };

  // Calculate max values for heat maps
  const maxHourlyValue = Array.isArray(visitorStats.hourlyDistribution)
    ? Math.max(...visitorStats.hourlyDistribution)
    : 0;
  const maxDailyValue = Array.isArray(visitorStats.dailyDistribution)
    ? Math.max(...visitorStats.dailyDistribution)
    : 0;

  if (visitorStats.loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-line bg-surface-raised px-5 py-15 text-center text-xs text-ink-strong">
        <div className="mb-3.5 size-10 animate-spin rounded-full border-2 border-success/20 border-t-success" />
        <div>Loading visitor statistics...</div>
      </div>
    );
  }

  if (visitorStats.error) {
    return (
      <div className="flex items-center justify-center rounded-md border border-danger/20 bg-surface-raised px-5 py-15 text-center text-xs text-danger">
        {visitorStats.error}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden overflow-y-auto rounded-md bg-page/30 p-5 text-ink">
      <h2 className="mb-10 text-center text-lg font-semibold tracking-tight! text-ink-strong sm:text-2xl lg:text-3xl">
        <span className="text-success">Visitor</span> Statistics
      </h2>
      <div className="mb-7 flex flex-wrap items-center gap-3.5 rounded-md border border-line bg-surface-raised px-4.5 py-3.5">
        <div>
          <span className={`${MONO_CAPTION} mr-1`}>Time Range:</span>
          <select
            name="timeRange"
            value={filters.timeRange}
            onChange={handleFilterChange}
            className={`${FIELD} filter-select cursor-pointer pr-7.5`}
          >
            <option value="all">All Time</option>
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>

        <div>
          <span className={`${MONO_CAPTION} mr-1`}>Browser:</span>
          <select
            name="browser"
            value={filters.browser}
            onChange={handleFilterChange}
            className={`${FIELD} filter-select cursor-pointer pr-7.5`}
          >
            <option value="all">All Browsers</option>
            {availableBrowsers.map(browser => (
              <option key={browser} value={browser}>
                {browser.charAt(0).toUpperCase() + browser.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className={`${MONO_CAPTION} mr-1`}>Operating System:</span>
          <select
            name="os"
            value={filters.os}
            onChange={handleFilterChange}
            className={`${FIELD} filter-select cursor-pointer pr-7.5`}
          >
            <option value="all">All OS</option>
            {availableOS.map(os => (
              <option key={os} value={os}>
                {os.charAt(0).toUpperCase() + os.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className={`${MONO_CAPTION} mr-1`}>Search IP:</span>
          <input
            type="text"
            placeholder="Search by IP address"
            value={filters.ipSearch}
            onChange={handleSearchChange}
            className={`${FIELD} min-w-55 placeholder:text-ink-muted`}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        <div className={STAT_CARD}>
          <h3 className={STAT_LABEL}>Total Unique Visitors</h3>
          <div className="text-xl font-bold leading-none tracking-tighter text-success transition-transform duration-200 ease-standard group-hover:scale-[1.04] md:text-2xl">
            {visitorStats.totalVisitors}
          </div>
          <div className="mt-2 text-xs text-ink-muted">Unique IP addresses</div>
        </div>

        <div className={STAT_CARD}>
          <h3 className={STAT_LABEL}>Total Page Views</h3>
          <div className="text-xl font-bold leading-none tracking-tighter text-success transition-transform duration-200 ease-standard group-hover:scale-[1.04] md:text-2xl">
            {visitorStats.totalPageViews}
          </div>
          <div className="mt-2 text-xs text-ink-muted">All visits combined</div>
        </div>

        <div className={STAT_CARD}>
          <h3 className={STAT_LABEL}>Repeat Visitors</h3>
          <div className="text-xl font-bold leading-none tracking-tighter text-success transition-transform duration-200 ease-standard group-hover:scale-[1.04] md:text-2xl">
            {visitorStats.repeatVisitors}
            <span className="ml-2.5 inline-block text-xs text-ink-muted">
              ({Math.round((visitorStats.repeatVisitors / visitorStats.totalVisitors) * 100 || 0)}%)
            </span>
          </div>
          <div className="mt-2 text-xs text-ink-muted">Visited more than once</div>
        </div>

        <div className={STAT_CARD}>
          <h3 className={STAT_LABEL}>New Today</h3>
          <div className="text-xl font-bold leading-none tracking-tighter text-success transition-transform duration-200 ease-standard group-hover:scale-[1.04] md:text-2xl">
            {visitorStats.newVisitorsToday}
          </div>
          <div className="mt-2 text-xs text-ink-muted">Visitors in last 24h</div>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className={SECTION}>
        <h3 className={SECTION_TITLE}>Visit Details</h3>
        <div className="mt-1 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
          <div className="rounded-sm border border-line bg-surface px-3.5 py-4 text-center transition-colors duration-200 ease-standard hover:border-success/40 hover:bg-surface-raised">
            <div className={`${MONO_CAPTION} mb-2`}>Avg. Visit Duration</div>
            <div className="font-mono text-sm font-semibold tracking-tight text-success">{formatDuration(visitorStats.avgVisitDuration)}</div>
          </div>
          <div className="rounded-sm border border-line bg-surface px-3.5 py-4 text-center transition-colors duration-200 ease-standard hover:border-success/40 hover:bg-surface-raised">
            <div className={`${MONO_CAPTION} mb-2`}>Pages per Visit</div>
            <div className="font-mono text-sm font-semibold tracking-tight text-success">
              {(visitorStats.totalPageViews / visitorStats.totalVisitors || 0).toFixed(1)}
            </div>
          </div>
          <div className="rounded-sm border border-line bg-surface px-3.5 py-4 text-center transition-colors duration-200 ease-standard hover:border-success/40 hover:bg-surface-raised">
            <div className={`${MONO_CAPTION} mb-2`}>Bounce Rate</div>
            <div className="font-mono text-sm font-semibold tracking-tight text-success">
              {Math.round((1 - visitorStats.repeatVisitors / visitorStats.totalVisitors) * 100 || 0)}%
            </div>
          </div>
          <div className="rounded-sm border border-line bg-surface px-3.5 py-4 text-center transition-colors duration-200 ease-standard hover:border-success/40 hover:bg-surface-raised">
            <div className={`${MONO_CAPTION} mb-2`}>Unique Languages</div>
            <div className="font-mono text-sm font-semibold tracking-tight text-success">{Object.keys(visitorStats.languages).length}</div>
          </div>
          <div className="rounded-sm border border-line bg-surface px-3.5 py-4 text-center transition-colors duration-200 ease-standard hover:border-success/40 hover:bg-surface-raised">
            <div className={`${MONO_CAPTION} mb-2`}>Unique Timezones</div>
            <div className="font-mono text-sm font-semibold tracking-tight text-success">{Object.keys(visitorStats.timezones).length}</div>
          </div>
        </div>
      </div>

      {/* Distribution by Time */}
      <div className={SECTION}>
        <h3 className={SECTION_TITLE}>Visit Distribution by Time</h3>

        <h4 className={SUB_TITLE}>Hourly Distribution</h4>
        <div className="mt-2.5 flex">
          <div className="w-7.5">
            {[0, 6, 12, 18].map(hour => (
              <div key={hour} className="flex h-7.5 items-center justify-end pr-2 font-mono text-xs text-ink-muted">
                {hour}h
              </div>
            ))}
          </div>
          <div className="flex-1">
            <div className={HEATMAP_ROW}>
              {Array(24).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="flex h-7.5 w-full cursor-default items-center justify-center rounded-sm border border-white/5 font-mono text-xs font-medium text-ink-strong transition-[transform,filter] duration-150 ease-standard hover:z-10 hover:scale-[1.12] hover:brightness-[1.3]"
                  style={{ background: getHeatMapColor(visitorStats.hourlyDistribution[i], maxHourlyValue), border: '1px solid rgba(255, 255, 255, 0.1)' }}
                  title={`${i}:00 - ${i+1}:00: ${visitorStats.hourlyDistribution[i]} visits`}
                >
                  {visitorStats.hourlyDistribution[i] > 0 && visitorStats.hourlyDistribution[i]}
                </div>
              ))}
            </div>
          </div>
        </div>

        <h4 className="mt-7.5 text-xs font-medium tracking-normal! text-ink">Daily Distribution</h4>
        <div className="mt-2.5 flex">
          <div className="w-7.5"></div>
          <div className="grid flex-1 grid-cols-7 gap-[3px]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="mb-1.25 text-center font-mono text-xs text-ink-muted">{day}</div>
            ))}
          </div>
        </div>
        <div className="mt-1.25 flex">
          <div className="w-7.5"></div>
          <div className="flex-1">
            <div className={HEATMAP_ROW}>
              {visitorStats.dailyDistribution.map((count, i) => (
                <div
                  key={i}
                  className="flex h-7.5 w-full cursor-default items-center justify-center rounded-sm border border-white/5 font-mono text-xs font-medium text-ink-strong transition-[transform,filter] duration-150 ease-standard hover:z-10 hover:scale-[1.12] hover:brightness-[1.3]"
                  style={{ background: getHeatMapColor(count, maxDailyValue) }}
                  title={`${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i]}: ${count} visits`}
                >
                  {count > 0 && count}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3.5 flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.25 font-mono text-xs text-ink-muted">
            <div className="size-3.5 rounded-sm bg-success/10"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1.25 font-mono text-xs text-ink-muted">
            <div className="size-3.5 rounded-sm bg-success/30"></div>
            <span></span>
          </div>
          <div className="flex items-center gap-1.25 font-mono text-xs text-ink-muted">
            <div className="size-3.5 rounded-sm bg-success/50"></div>
            <span></span>
          </div>
          <div className="flex items-center gap-1.25 font-mono text-xs text-ink-muted">
            <div className="size-3.5 rounded-sm bg-success/70"></div>
            <span></span>
          </div>
          <div className="flex items-center gap-1.25 font-mono text-xs text-ink-muted">
            <div className="size-3.5 rounded-sm bg-success"></div>
            <span>High</span>
          </div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
        {/* Top Pages Section */}
        <div className={SECTION}>
          <h3 className={SECTION_TITLE}>Top Pages</h3>
          <ul className={LIST}>
            {visitorStats.topPages.map((page, index) => (
              <li key={index} className={LIST_ITEM}>
                <span className="font-mono text-xs font-normal text-success">{page.path || "/"}</span>
                <span className={COUNT_PILL}>{page.count} views</span>
              </li>
            ))}
            {visitorStats.topPages.length === 0 && (
              <li className={LIST_ITEM}><span>No page view data available</span></li>
            )}
          </ul>
        </div>

        {/* Top Referrers */}
        <div className={SECTION}>
          <h3 className={SECTION_TITLE}>Traffic Sources</h3>
          <ul className={LIST}>
            {topReferrers.map((referrer, index) => (
              <li key={index} className={LIST_ITEM}>
                <span className="text-xs font-medium text-ink-strong">
                  {referrer.name === 'direct' ? 'Direct / Bookmarked' : referrer.name}
                </span>
                <span className={COUNT_PILL}>{referrer.count}</span>
              </li>
            ))}
            {topReferrers.length === 0 && (
              <li className={LIST_ITEM}><span>No referrer data available</span></li>
            )}
          </ul>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
        {/* Browser Distribution */}
        <div className={SECTION}>
          <h3 className={SECTION_TITLE}>Browser Distribution</h3>
          <ul className={LIST}>
            {topBrowsers.map((browser, index) => (
              <li key={index} className={LIST_ITEM}>
                <span>
                  <img
                    src={`/images/browsers/${browser.name.toLowerCase()}.svg`}
                    alt={browser.name}
                    className="mr-1.25 inline-block size-4 align-middle"
                    onError={(e) => {e.target.style.display = 'none'}}
                  />
                  {browser.name.charAt(0).toUpperCase() + browser.name.slice(1)}
                </span>
                <span className={COUNT_PILL}>{browser.count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* OS Distribution */}
        <div className={SECTION}>
          <h3 className={SECTION_TITLE}>Operating System</h3>
          <ul className={LIST}>
            {topOS.map((os, index) => (
              <li key={index} className={LIST_ITEM}>
                <span>
                  <img
                    src={`/images/os/${os.name.toLowerCase()}.svg`}
                    alt={os.name}
                    className="mr-1.25 inline-block size-4 align-middle"
                    onError={(e) => {e.target.style.display = 'none'}}
                  />
                  {os.name.charAt(0).toUpperCase() + os.name.slice(1)}
                </span>
                <span className={COUNT_PILL}>{os.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Screen Resolution + Languages. In the pre-conversion markup the Languages
          panel's wrapper div was self-closed (`<div className="stats-section"></div>`)
          so its heading/list rendered unwrapped, and this whole pair ended up nested
          inside the Browser/OS distribution-row instead of forming its own row. Fixed
          here to match the Browser/OS pattern it was clearly meant to mirror. */}
      <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
        {/* Screen Resolution */}
        <div className={SECTION}>
          <h3 className={SECTION_TITLE}>Screen Resolutions</h3>
          <ul className={LIST}>
            {topScreenResolutions.map((resolution, index) => (
              <li key={index} className={LIST_ITEM}>
                <span className="text-xs font-medium text-ink-strong">
                  {resolution.name}
                </span>
                <span className={COUNT_PILL}>{resolution.count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Languages */}
        <div className={SECTION}>
          <h3 className={SECTION_TITLE}>Languages</h3>
          <ul className={LIST}>
            {Object.entries(visitorStats.languages)
              .map(([lang, count]) => ({ lang, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
              .map((item, index) => (
                <li key={index} className={LIST_ITEM}>
                  <span className="text-xs font-medium text-ink-strong">
                    {item.lang === 'unknown' ? 'Unknown' : item.lang}
                  </span>
                  <span className={COUNT_PILL}>{item.count}</span>
                </li>
              ))
            }
          </ul>
        </div>
      </div>

      <div className={SECTION}>
        <h3 className={SECTION_TITLE}>Visitor Log</h3>
        <div className="mt-4 overflow-x-auto rounded-sm border border-line">
          <table className="w-full border-collapse text-xs text-ink-strong">
            <thead>
              <tr>
                <th className="border-b border-line bg-surface px-4 py-3 text-left font-mono text-xs font-medium tracking-wider whitespace-nowrap text-ink-muted uppercase">IP Address</th>
                <th className="border-b border-line bg-surface px-4 py-3 text-left font-mono text-xs font-medium tracking-wider whitespace-nowrap text-ink-muted uppercase">Page</th>
                <th className="border-b border-line bg-surface px-4 py-3 text-left font-mono text-xs font-medium tracking-wider whitespace-nowrap text-ink-muted uppercase">Browser / OS</th>
                <th className="border-b border-line bg-surface px-4 py-3 text-left font-mono text-xs font-medium tracking-wider whitespace-nowrap text-ink-muted uppercase">Screen</th>
                <th className="border-b border-line bg-surface px-4 py-3 text-left font-mono text-xs font-medium tracking-wider whitespace-nowrap text-ink-muted uppercase">Language</th>
                <th className="border-b border-line bg-surface px-4 py-3 text-left font-mono text-xs font-medium tracking-wider whitespace-nowrap text-ink-muted uppercase">Time</th>
              </tr>
            </thead>
            {/* divide-y replaces the old "border-bottom on every td, cancelled on the
                last row" trick — same result, no :last-child override needed. */}
            <tbody className="divide-y divide-line">
              {visitorStats.recentVisitors.map((visitor, index) => (
                <tr key={index} className="bg-surface-raised transition-[filter] duration-150 ease-standard hover:brightness-110">
                  <td className="px-4 py-3.25 align-middle text-left text-ink">
                    {visitor.ip || "Unknown"}
                    {visitor.visitCount > 1 && (
                      <span className={`${COUNT_PILL} ml-1.5`}>
                        {visitor.visitCount}x
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.25 align-middle text-left text-ink">
                    <span className="font-mono text-xs font-normal text-success">{visitor.path || "/"}</span>
                  </td>
                  <td className="px-4 py-3.25 align-middle text-left text-ink">
                    <img
                      src={`/images/browsers/${visitor.browser?.toLowerCase()}.svg`}
                      alt={visitor.browser}
                      className="mr-1.25 inline-block size-4 align-middle"
                      onError={(e) => {e.target.style.display = 'none'}}
                    />
                    {visitor.browser || "Unknown"} /
                    <img
                      src={`/images/os/${visitor.operatingSystem?.toLowerCase()}.svg`}
                      alt={visitor.operatingSystem}
                      className="mr-1.25 inline-block size-4 align-middle"
                      onError={(e) => {e.target.style.display = 'none'}}
                    />
                    {visitor.operatingSystem || "Unknown"}
                  </td>
                  <td className="px-4 py-3.25 align-middle text-left text-ink">
                    {visitor.screenResolution || "Unknown"}
                  </td>
                  <td className="px-4 py-3.25 align-middle text-left text-ink">
                    {visitor.language || "Unknown"}
                  </td>
                  <td className="px-4 py-3.25 align-middle text-left text-ink">
                    {visitor.timestamp}
                  </td>
                </tr>
              ))}
              {visitorStats.recentVisitors.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-3.25 text-center align-middle text-ink">
                    No visitor data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4.5 flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={toggleViewAll}
            className={[
              "cursor-pointer rounded-sm px-4 py-1.75 text-xs font-medium tracking-normal! transition-colors duration-150 ease-standard",
              pagination.viewAll
                ? "border border-transparent bg-success font-semibold text-page"
                : "border border-success/25 bg-transparent text-success hover:border-success hover:bg-success/10",
            ].join(" ")}
          >
            {pagination.viewAll ? 'Show Less' : 'View All'}
          </button>

          {!pagination.viewAll && (
            <div className="flex gap-1.25">
              <PageButton
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(1)}
              >
                &laquo;
              </PageButton>
              <PageButton
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                &lsaquo;
              </PageButton>

              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNumber = pagination.currentPage <= 3
                  ? i + 1
                  : pagination.currentPage >= pagination.totalPages - 2
                    ? pagination.totalPages - 4 + i
                    : pagination.currentPage - 2 + i;

                if (pageNumber <= pagination.totalPages && pageNumber > 0) {
                  return (
                    <PageButton
                      key={pageNumber}
                      active={pagination.currentPage === pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </PageButton>
                  );
                }
                return null;
              })}

              <PageButton
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                &rsaquo;
              </PageButton>
              <PageButton
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => handlePageChange(pagination.totalPages)}
              >
                &raquo;
              </PageButton>
            </div>
          )}

          <div className="font-mono text-xs text-ink-muted">
            Showing {pagination.viewAll ? 'all' : `${Math.min((pagination.currentPage - 1) * pagination.itemsPerPage + 1, visitorStats.allVisitors.length)} - ${Math.min(pagination.currentPage * pagination.itemsPerPage, visitorStats.allVisitors.length)}`} of {visitorStats.allVisitors.length} visitors
          </div>
        </div>
      </div>
    </div>
  );
}
