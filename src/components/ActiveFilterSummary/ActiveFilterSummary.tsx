import React from 'react';
import { TodoFilters, Priority } from '../../types';
import styles from './ActiveFilterSummary.module.css';

export interface ActiveFilterSummaryProps {
  filters: TodoFilters;
  onRemoveStatus: (statusId: string) => void;
  onRemoveCategory: (category: string) => void;
  onRemovePriority: (priority: Priority) => void;
  onClearSearch: () => void;
  statusLabels: Map<string, string>; // Map of status ID to label
}

/**
 * Displays active filters as removable chips above the todo list
 */
export const ActiveFilterSummary: React.FC<ActiveFilterSummaryProps> = ({
  filters,
  onRemoveStatus,
  onRemoveCategory,
  onRemovePriority,
  onClearSearch,
  statusLabels,
}) => {
  const hasActiveFilters =
    filters.statuses.length > 0 ||
    filters.categories.length > 0 ||
    filters.priorities.length > 0 ||
    filters.searchText !== '';

  if (!hasActiveFilters) {
    return null;
  }

  const getPriorityLabel = (priority: Priority): string => {
    switch (priority) {
      case Priority.HIGH:
        return 'High';
      case Priority.MEDIUM:
        return 'Medium';
      case Priority.LOW:
        return 'Low';
      default:
        return priority;
    }
  };

  return (
    <div className={styles.summary} role="region" aria-label="Active filters">
      <span className={styles.label}>Active Filters:</span>
      <div className={styles.chips}>
        {/* Status filters */}
        {filters.statuses.length > 0 && (
          <div className={styles.chip}>
            <span className={styles.chipLabel}>
              Status: {filters.statuses.map(id => statusLabels.get(id) || id).join(', ')}
            </span>
            <button
              className={styles.chipRemove}
              onClick={() => filters.statuses.forEach(id => onRemoveStatus(id))}
              aria-label="Remove status filters"
            >
              ×
            </button>
          </div>
        )}

        {/* Category filters */}
        {filters.categories.length > 0 && (
          <div className={styles.chip}>
            <span className={styles.chipLabel}>
              Category: {filters.categories.join(', ')}
            </span>
            <button
              className={styles.chipRemove}
              onClick={() => filters.categories.forEach(cat => onRemoveCategory(cat))}
              aria-label="Remove category filters"
            >
              ×
            </button>
          </div>
        )}

        {/* Priority filters */}
        {filters.priorities.length > 0 && (
          <div className={styles.chip}>
            <span className={styles.chipLabel}>
              Priority: {filters.priorities.map(p => getPriorityLabel(p)).join(', ')}
            </span>
            <button
              className={styles.chipRemove}
              onClick={() => filters.priorities.forEach(p => onRemovePriority(p))}
              aria-label="Remove priority filters"
            >
              ×
            </button>
          </div>
        )}

        {/* Search filter */}
        {filters.searchText && (
          <div className={styles.chip}>
            <span className={styles.chipLabel}>Search: "{filters.searchText}"</span>
            <button
              className={styles.chipRemove}
              onClick={onClearSearch}
              aria-label="Clear search"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
