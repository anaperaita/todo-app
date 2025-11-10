/**
 * Date utility functions for consistent date formatting across the application.
 */

import { Todo } from '../types';

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

/**
 * Extracts unique categories from a list of todos.
 * Returns a sorted array of category names, filtering out empty strings.
 * @param todos - Array of todo items
 * @returns Sorted array of unique category names
 */
export const getUniqueCategories = (todos: Todo[]): string[] => {
  const categories = new Set<string>();

  todos.forEach((todo) => {
    if (todo.category && todo.category.trim()) {
      categories.add(todo.category.trim());
    }
  });

  return Array.from(categories).sort((a, b) => a.localeCompare(b));
};
