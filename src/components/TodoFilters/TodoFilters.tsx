import React from 'react';
import { TodoFilters as TodoFiltersType, FilterStatus, SortOption } from '../../types';
import { useTodoFiltersViewModel } from './useTodoFiltersViewModel';
import styles from './TodoFilters.module.css';

export interface TodoFiltersProps {
  filters: TodoFiltersType;
  onFilterChange: (filters: TodoFiltersType) => void;
}

/**
 * Filter and sort controls for the TODO list.
 */
export const TodoFilters: React.FC<TodoFiltersProps> = ({ filters, onFilterChange }) => {
  const { handleSearchChange, handleStatusChange, handleSortChange } = useTodoFiltersViewModel({
    filters,
    onFilterChange,
  });

  return (
    <div className={styles.filters}>
      <div className={styles.searchContainer}>
        <label htmlFor="search-tasks" className={styles.visuallyHidden}>
          Search tasks
        </label>
        <input
          id="search-tasks"
          type="text"
          value={filters.searchText}
          onChange={handleSearchChange}
          placeholder="Search tasks..."
          className={styles.searchInput}
          aria-label="Search tasks"
        />
      </div>

      <div className={styles.controlsRow}>
        <div className={styles.formGroup}>
          <label htmlFor="filter-status" className={styles.label}>
            Filter by Status
          </label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={handleStatusChange}
            className={styles.select}
            aria-label="Filter by status"
          >
            <option value={FilterStatus.ALL}>All</option>
            <option value={FilterStatus.ACTIVE}>Active</option>
            <option value={FilterStatus.COMPLETED}>Completed</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="sort-by" className={styles.label}>
            Sort By
          </label>
          <select
            id="sort-by"
            value={filters.sortBy}
            onChange={handleSortChange}
            className={styles.select}
            aria-label="Sort by"
          >
            <option value={SortOption.DATE_ADDED}>Date Added (Oldest)</option>
            <option value={SortOption.DATE_ADDED_DESC}>Date Added (Newest)</option>
            <option value={SortOption.DUE_DATE}>Due Date (Earliest)</option>
            <option value={SortOption.DUE_DATE_DESC}>Due Date (Latest)</option>
            <option value={SortOption.PRIORITY}>Priority</option>
            <option value={SortOption.ALPHABETICAL}>Alphabetical</option>
          </select>
        </div>
      </div>
    </div>
  );
};
