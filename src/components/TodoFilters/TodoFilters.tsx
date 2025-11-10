import React, { useState, useRef, useEffect } from 'react';
import { TodoFilters as TodoFiltersType, SortOption, KanbanStatus, Todo } from '../../types';
import { useTodoFiltersViewModel } from './useTodoFiltersViewModel';
import { getUniqueCategories } from '../../utils';
import styles from './TodoFilters.module.css';

export interface TodoFiltersProps {
  filters: TodoFiltersType;
  onFilterChange: (filters: TodoFiltersType) => void;
  todos: Todo[];  // Needed to extract unique categories
}

/**
 * Filter and sort controls for the TODO list.
 */
export const TodoFilters: React.FC<TodoFiltersProps> = ({ filters, onFilterChange, todos }) => {
  const { handleSearchChange, handleStatusToggle, handleCategoryToggle, handleSortChange } = useTodoFiltersViewModel({
    filters,
    onFilterChange,
  });

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const uniqueCategories = getUniqueCategories(todos);

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
        {/* Status Filter - Multi-Select Pill Buttons */}
        <div className={styles.statusGroup} role="group" aria-label="Filter by status">
          <button
            onClick={() => handleStatusToggle(KanbanStatus.TODO)}
            className={`${styles.statusPill} ${filters.statuses.includes(KanbanStatus.TODO) ? styles.active : ''}`}
            type="button"
            aria-pressed={filters.statuses.includes(KanbanStatus.TODO)}
          >
            To Do
          </button>
          <button
            onClick={() => handleStatusToggle(KanbanStatus.IN_PROGRESS)}
            className={`${styles.statusPill} ${filters.statuses.includes(KanbanStatus.IN_PROGRESS) ? styles.active : ''}`}
            type="button"
            aria-pressed={filters.statuses.includes(KanbanStatus.IN_PROGRESS)}
          >
            In Progress
          </button>
          <button
            onClick={() => handleStatusToggle(KanbanStatus.DONE)}
            className={`${styles.statusPill} ${filters.statuses.includes(KanbanStatus.DONE) ? styles.active : ''}`}
            type="button"
            aria-pressed={filters.statuses.includes(KanbanStatus.DONE)}
          >
            Done
          </button>
        </div>

        {/* Category Filter - Multi-Select Pill Buttons */}
        {uniqueCategories.length > 0 && (
          <div className={styles.categoryGroup} role="group" aria-label="Filter by category">
            {uniqueCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`${styles.categoryPill} ${filters.categories.includes(category) ? styles.active : ''}`}
                type="button"
                aria-pressed={filters.categories.includes(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}

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
