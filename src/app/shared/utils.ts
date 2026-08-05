/**
 * Generates a random UUID (v4) for use as an `x-idempotency-key` header on
 * side-effecting, double-submit-prone POST calls (e.g. repo-health analyze).
 * Prefers the native `crypto.randomUUID()` (available in all modern browsers
 * and Node 19+ for SSR); falls back to a Math.random-based generator for
 * older/non-secure contexts where `crypto.randomUUID` is unavailable.
 */
export function generateIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Fallback: RFC4122-ish v4 UUID without relying on crypto.randomUUID.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function dateToRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return 'Today';
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  const weeks = Math.floor(diffDays / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;

  const months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());

  // Handle "same-month but >28 days" edge case
  if (months < 1) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}
