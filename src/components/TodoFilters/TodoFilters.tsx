import React, { useState, useRef, useEffect } from 'react';
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

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const handleStatusClick = (status: FilterStatus) => {
    const event = {
      target: { value: status }
    } as React.ChangeEvent<HTMLSelectElement>;
    handleStatusChange(event);
  };

  const handleSortClick = (sortBy: SortOption) => {
    const event = {
      target: { value: sortBy }
    } as React.ChangeEvent<HTMLSelectElement>;
    handleSortChange(event);
    setIsSortOpen(false);
  };

  const getSortLabel = (sortBy: SortOption) => {
    switch (sortBy) {
      case SortOption.DATE_ADDED:
        return 'Oldest First';
      case SortOption.DATE_ADDED_DESC:
        return 'Newest First';
      case SortOption.DUE_DATE:
        return 'Due Soon';
      case SortOption.DUE_DATE_DESC:
        return 'Due Later';
      case SortOption.PRIORITY:
        return 'Priority';
      case SortOption.ALPHABETICAL:
        return 'A-Z';
      default:
        return sortBy;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    if (isSortOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSortOpen]);

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
        {/* Status Filter - Pill Buttons */}
        <div className={styles.statusGroup} role="group" aria-label="Filter by status">
          <button
            onClick={() => handleStatusClick(FilterStatus.ALL)}
            className={`${styles.statusPill} ${filters.status === FilterStatus.ALL ? styles.active : ''}`}
            type="button"
            aria-pressed={filters.status === FilterStatus.ALL}
          >
            All
          </button>
          <button
            onClick={() => handleStatusClick(FilterStatus.ACTIVE)}
            className={`${styles.statusPill} ${filters.status === FilterStatus.ACTIVE ? styles.active : ''}`}
            type="button"
            aria-pressed={filters.status === FilterStatus.ACTIVE}
          >
            Active
          </button>
          <button
            onClick={() => handleStatusClick(FilterStatus.COMPLETED)}
            className={`${styles.statusPill} ${filters.status === FilterStatus.COMPLETED ? styles.active : ''}`}
            type="button"
            aria-pressed={filters.status === FilterStatus.COMPLETED}
          >
            Completed
          </button>
        </div>

        {/* Sort Dropdown - Custom */}
        <div className={styles.sortContainer} ref={sortRef}>
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className={styles.sortButton}
            aria-label="Sort options"
            aria-expanded={isSortOpen}
            type="button"
          >
            <span className={styles.sortIcon}>⇅</span>
            {getSortLabel(filters.sortBy)}
          </button>

          {isSortOpen && (
            <div className={styles.sortDropdown}>
              <button
                onClick={() => handleSortClick(SortOption.DATE_ADDED_DESC)}
                className={`${styles.sortOption} ${filters.sortBy === SortOption.DATE_ADDED_DESC ? styles.active : ''}`}
                type="button"
              >
                Newest First
              </button>
              <button
                onClick={() => handleSortClick(SortOption.DATE_ADDED)}
                className={`${styles.sortOption} ${filters.sortBy === SortOption.DATE_ADDED ? styles.active : ''}`}
                type="button"
              >
                Oldest First
              </button>
              <button
                onClick={() => handleSortClick(SortOption.DUE_DATE)}
                className={`${styles.sortOption} ${filters.sortBy === SortOption.DUE_DATE ? styles.active : ''}`}
                type="button"
              >
                Due Soon
              </button>
              <button
                onClick={() => handleSortClick(SortOption.DUE_DATE_DESC)}
                className={`${styles.sortOption} ${filters.sortBy === SortOption.DUE_DATE_DESC ? styles.active : ''}`}
                type="button"
              >
                Due Later
              </button>
              <button
                onClick={() => handleSortClick(SortOption.PRIORITY)}
                className={`${styles.sortOption} ${filters.sortBy === SortOption.PRIORITY ? styles.active : ''}`}
                type="button"
              >
                Priority
              </button>
              <button
                onClick={() => handleSortClick(SortOption.ALPHABETICAL)}
                className={`${styles.sortOption} ${filters.sortBy === SortOption.ALPHABETICAL ? styles.active : ''}`}
                type="button"
              >
                A-Z
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
