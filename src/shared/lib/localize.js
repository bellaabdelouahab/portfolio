/**
 * Returns a project in the requested language. French text lives in the
 * Firestore document under `fr` (title, description and the case-study text);
 * anything missing falls back to English so a project is never blank.
 * `slugTitle` keeps the English title so URLs are identical in both languages.
 */
export function localizeProject(project, lang) {
  if (!project) return project;
  const base = { ...project, slugTitle: project.title };
  if (lang !== "fr" || !project.fr) return base;
  const { caseStudy: frCase = {}, carouselTitles, ...rest } = project.fr;
  return {
    ...base,
    ...rest,
    caseStudy: { ...(project.caseStudy || {}), ...frCase },
    carouselImages: (project.carouselImages || []).map((c, i) => ({ ...c, title: carouselTitles?.[i] ?? c.title })),
  };
}
