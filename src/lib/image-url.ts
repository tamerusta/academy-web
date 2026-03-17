export const R2_BASE = process.env.NEXT_PUBLIC_R2_URL || "";

/**
 * Constructs image URL from R2 base + path.
 * Path should be like "/images/logo/dmg-logo.webp" — maps to shared/logo/ in R2.
 */
export function imageUrl(path: string): string {
  const cleanPath = path.replace(/^\/images\//, "");
  // Logo files are in shared/logo/ on R2
  if (cleanPath.startsWith("logo/")) {
    return `${R2_BASE}/shared/${cleanPath}`;
  }
  return `${R2_BASE}/${cleanPath}`;
}

/**
 * Constructs per-event image URL for speakers, sponsors, organizers, etc.
 */
export function eventImageUrl(
  eventSlug: string,
  category: string,
  filename: string,
): string {
  return `${R2_BASE}/${eventSlug}/${category}/${filename}`;
}

/**
 * Converts a stored organizer image path (e.g. "/images/organizers/name.webp")
 * to the R2 URL for a specific event.
 */
export function organizerImageUrl(
  eventSlug: string,
  imagePath: string,
): string {
  const filename = imagePath.split("/").pop() || imagePath;
  return `${R2_BASE}/${eventSlug}/${filename.startsWith("organizers") ? "" : "organizers/"}${filename}`;
}
