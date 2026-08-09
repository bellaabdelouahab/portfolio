/**
 * Coerces the several date shapes present in Firestore into a Date.
 *
 * The collections were populated at different times by different tooling, so a
 * "date" can be any of:
 *   - an ISO string            (projects: startDate, createdAt, updatedAt)
 *   - a Mongo export wrapper   (certificates: { $date: "..." })  <- from migrate.js
 *   - a Firestore Timestamp    (reports: createdAt, has .toDate())
 *
 * Returns epoch 0 for anything unparseable so sorts stay total and never throw.
 */
export const toDate = (value) => {
  if (!value) return new Date(0);
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value === "object" && value.$date) return new Date(value.$date);
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date(0) : d;
};

/** Comparator for newest-first ordering. */
export const byNewest = (field) => (a, b) => toDate(b?.[field]) - toDate(a?.[field]);
