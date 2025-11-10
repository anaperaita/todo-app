/**
 * Date utility functions for consistent date formatting across the application.
 */

/**
 * Formats a date string into a localized short date format.
 * @param dateString - ISO 8601 date string or null
 * @returns Formatted date string (e.g., "Dec 31, 2025") or empty string if invalid
 */
export const formatDueDate = (dateString: string | null): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};
